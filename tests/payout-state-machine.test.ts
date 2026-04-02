/**
 * Payout State Machine Tests
 *
 * Tests the valid state transitions for the payout lifecycle:
 *   pending_approval → approved → processing → paid
 *                 ↓                              ↓
 *               rejected                      failed
 */

import { describe, it, expect } from "vitest";

// ============================================================================
// State machine logic extracted from convex/payouts.ts
// ============================================================================

type PayoutStatus =
  | "pending_approval"
  | "approved"
  | "rejected"
  | "processing"
  | "paid"
  | "failed";

const VALID_TRANSITIONS: Record<PayoutStatus, PayoutStatus[]> = {
  pending_approval: ["approved", "rejected"],
  approved: ["processing", "paid"], // "paid" for manual marking
  rejected: [], // Terminal state
  processing: ["paid", "failed"],
  paid: [], // Terminal state
  failed: ["approved"], // Can retry: re-approve then re-process
};

function isValidTransition(from: PayoutStatus, to: PayoutStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

function transition(
  currentStatus: PayoutStatus,
  newStatus: PayoutStatus
): PayoutStatus {
  if (!isValidTransition(currentStatus, newStatus)) {
    throw new Error(
      `Invalid payout transition: ${currentStatus} → ${newStatus}`
    );
  }
  return newStatus;
}

// ============================================================================
// Commission calculation logic
// ============================================================================

function calculateCommission(
  dealAmount: number,
  attributionPercentage: number,
  commissionRate: number
): number {
  const attributedRevenue = dealAmount * (attributionPercentage / 100);
  return attributedRevenue * (commissionRate / 100);
}

// ============================================================================
// Tests
// ============================================================================

describe("Payout State Machine", () => {
  describe("Valid transitions", () => {
    it("pending_approval → approved", () => {
      expect(transition("pending_approval", "approved")).toBe("approved");
    });

    it("pending_approval → rejected", () => {
      expect(transition("pending_approval", "rejected")).toBe("rejected");
    });

    it("approved → processing", () => {
      expect(transition("approved", "processing")).toBe("processing");
    });

    it("approved → paid (manual)", () => {
      expect(transition("approved", "paid")).toBe("paid");
    });

    it("processing → paid", () => {
      expect(transition("processing", "paid")).toBe("paid");
    });

    it("processing → failed", () => {
      expect(transition("processing", "failed")).toBe("failed");
    });

    it("failed → approved (retry)", () => {
      expect(transition("failed", "approved")).toBe("approved");
    });
  });

  describe("Invalid transitions", () => {
    it("cannot go from pending_approval directly to paid", () => {
      expect(() => transition("pending_approval", "paid")).toThrow(
        "Invalid payout transition"
      );
    });

    it("cannot go from pending_approval directly to processing", () => {
      expect(() => transition("pending_approval", "processing")).toThrow(
        "Invalid payout transition"
      );
    });

    it("cannot go from rejected to any state (terminal)", () => {
      expect(() => transition("rejected", "approved")).toThrow();
      expect(() => transition("rejected", "paid")).toThrow();
      expect(() => transition("rejected", "processing")).toThrow();
    });

    it("cannot go from paid to any state (terminal)", () => {
      expect(() => transition("paid", "approved")).toThrow();
      expect(() => transition("paid", "processing")).toThrow();
      expect(() => transition("paid", "failed")).toThrow();
    });

    it("cannot go backwards from processing to pending_approval", () => {
      expect(() => transition("processing", "pending_approval")).toThrow();
    });

    it("cannot go from approved back to pending_approval", () => {
      expect(() => transition("approved", "pending_approval")).toThrow();
    });
  });

  describe("Full lifecycle — happy path", () => {
    it("flows through pending → approved → processing → paid", () => {
      let status: PayoutStatus = "pending_approval";
      status = transition(status, "approved");
      expect(status).toBe("approved");
      status = transition(status, "processing");
      expect(status).toBe("processing");
      status = transition(status, "paid");
      expect(status).toBe("paid");
    });

    it("flows through pending → approved → paid (manual)", () => {
      let status: PayoutStatus = "pending_approval";
      status = transition(status, "approved");
      status = transition(status, "paid");
      expect(status).toBe("paid");
    });
  });

  describe("Full lifecycle — failure and retry", () => {
    it("flows through pending → approved → processing → failed → approved → processing → paid", () => {
      let status: PayoutStatus = "pending_approval";
      status = transition(status, "approved");
      status = transition(status, "processing");
      status = transition(status, "failed");
      expect(status).toBe("failed");
      // Retry
      status = transition(status, "approved");
      status = transition(status, "processing");
      status = transition(status, "paid");
      expect(status).toBe("paid");
    });
  });

  describe("Rejection flow", () => {
    it("pending → rejected is terminal", () => {
      let status: PayoutStatus = "pending_approval";
      status = transition(status, "rejected");
      expect(status).toBe("rejected");
      // Cannot go anywhere from rejected
      expect(() => transition(status, "approved")).toThrow();
    });
  });
});

describe("Commission Calculations", () => {
  describe("Basic calculations", () => {
    it("calculates commission for full attribution", () => {
      // Deal: $100,000, 100% attribution, 10% commission rate
      expect(calculateCommission(100000, 100, 10)).toBe(10000);
    });

    it("calculates commission for partial attribution", () => {
      // Deal: $100,000, 50% attribution, 10% commission rate
      expect(calculateCommission(100000, 50, 10)).toBe(5000);
    });

    it("calculates commission for small attribution", () => {
      // Deal: $100,000, 25% attribution, 20% commission rate
      expect(calculateCommission(100000, 25, 20)).toBe(5000);
    });
  });

  describe("Edge cases", () => {
    it("returns zero for zero deal amount", () => {
      expect(calculateCommission(0, 100, 10)).toBe(0);
    });

    it("returns zero for zero attribution", () => {
      expect(calculateCommission(100000, 0, 10)).toBe(0);
    });

    it("returns zero for zero commission rate", () => {
      expect(calculateCommission(100000, 100, 0)).toBe(0);
    });

    it("handles very small amounts without floating point issues", () => {
      const result = calculateCommission(1, 1, 1);
      // 1 * 0.01 * 0.01 = 0.0001
      expect(result).toBeCloseTo(0.0001, 6);
    });

    it("handles very large amounts", () => {
      const result = calculateCommission(10000000, 100, 25);
      expect(result).toBe(2500000);
    });

    it("handles 100% commission rate", () => {
      expect(calculateCommission(50000, 100, 100)).toBe(50000);
    });
  });

  describe("Multi-partner split scenarios", () => {
    it("commissions from split attribution sum correctly", () => {
      const dealAmount = 100000;
      const commissionRate = 10;

      // Partner A: 60% attribution
      const commA = calculateCommission(dealAmount, 60, commissionRate);
      // Partner B: 40% attribution
      const commB = calculateCommission(dealAmount, 40, commissionRate);

      // Total commissions should equal full commission
      expect(commA + commB).toBeCloseTo(
        calculateCommission(dealAmount, 100, commissionRate),
        2
      );
    });

    it("handles three-way split", () => {
      const dealAmount = 90000;
      const commissionRate = 15;

      const commA = calculateCommission(dealAmount, 33.33, commissionRate);
      const commB = calculateCommission(dealAmount, 33.33, commissionRate);
      const commC = calculateCommission(dealAmount, 33.34, commissionRate);

      const total = commA + commB + commC;
      const fullComm = calculateCommission(dealAmount, 100, commissionRate);

      // Should be very close (within rounding)
      expect(total).toBeCloseTo(fullComm, 0);
    });
  });
});
