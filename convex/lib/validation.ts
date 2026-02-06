/**
 * Shared validation logic
 */

import { v } from "convex/values"

/**
 * Email validator with regex check
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate email and throw if invalid
 */
export function validateEmail(email: string): void {
  if (!isValidEmail(email)) {
    throw new Error(`Invalid email format: ${email}`)
  }
}

/**
 * Common validators for reuse
 */
export const validators = {
  email: v.string(),
  percentage: v.number(), // 0-100
  currency: v.number(), // USD cents
  timestamp: v.number(),
  status: v.union(v.literal("active"), v.literal("inactive"), v.literal("pending")),
}

/**
 * Validate percentage is between 0 and 100
 */
export function validatePercentage(value: number): void {
  if (value < 0 || value > 100) {
    throw new Error(`Percentage must be between 0 and 100, got ${value}`)
  }
}

/**
 * Validate amount is positive
 */
export function validatePositiveAmount(amount: number): void {
  if (amount < 0) {
    throw new Error(`Amount must be positive, got ${amount}`)
  }
}

/**
 * Validate string is not empty
 */
export function validateNotEmpty(value: string, fieldName: string): void {
  if (!value || value.trim().length === 0) {
    throw new Error(`${fieldName} cannot be empty`)
  }
}
