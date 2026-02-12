"use client";

import { useState, useMemo } from "react";
import { usePortal } from "@/lib/portal-context";
import {
  getPortalCertifications,
  getPortalBadges,
  getPortalTrainingCompleted,
  getPortalInProgressCourses,
  getPortalRecommendedCourses,
  getPortalEndorsements,
  getPortalEnablementStats,
} from "@/lib/portal-enablement-data";
import type { InProgressCourse, RecommendedCourse } from "@/lib/portal-enablement-data";
import type { Certification, Badge, TrainingCompletion, SkillEndorsement } from "@/lib/types";
import { CERTIFICATION_LEVEL_LABELS, BADGE_CATEGORY_LABELS } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  Award,
  Shield,
  Star,
  BookOpen,
  Users,
  AlertTriangle,
  ExternalLink,
  Clock,
  CheckCircle,
  TrendingUp,
  Grid,
  List,
  Sparkles,
  ChevronRight,
} from "lucide-react";

// ─── Sub-components ──────────────────────────────────────────────

function LevelBadge({ level }: { level: string }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    beginner: { bg: "#dbeafe", fg: "#1e40af" },
    intermediate: { bg: "#e0e7ff", fg: "#3730a3" },
    advanced: { bg: "#fef3c7", fg: "#92400e" },
    expert: { bg: "#ecfdf5", fg: "#065f46" },
  };
  const c = colors[level] || colors.beginner;
  return (
    <span
      style={{
        display: "inline-flex",
        padding: "2px 8px",
        borderRadius: 10,
        fontSize: ".7rem",
        fontWeight: 700,
        background: c.bg,
        color: c.fg,
        textTransform: "uppercase",
        letterSpacing: ".04em",
      }}
    >
      {CERTIFICATION_LEVEL_LABELS[level as keyof typeof CERTIFICATION_LEVEL_LABELS] || level}
    </span>
  );
}

function EndorsementLevelBadge({ level }: { level: string }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    familiar: { bg: "#e0e7ff", fg: "#3730a3" },
    proficient: { bg: "#dbeafe", fg: "#1e40af" },
    expert: { bg: "#ecfdf5", fg: "#065f46" },
  };
  const c = colors[level] || colors.familiar;
  return (
    <span
      style={{
        display: "inline-flex",
        padding: "2px 8px",
        borderRadius: 10,
        fontSize: ".7rem",
        fontWeight: 700,
        background: c.bg,
        color: c.fg,
        textTransform: "uppercase",
        letterSpacing: ".04em",
      }}
    >
      {level}
    </span>
  );
}

function ProgressBar({ value, color }: { value: number; color?: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: 8,
        borderRadius: 4,
        background: "var(--border)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${Math.min(100, value)}%`,
          height: "100%",
          borderRadius: 4,
          background: color || "#6366f1",
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  bg,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  bg: string;
}) {
  return (
    <div className="card" style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={20} color={color} />
      </div>
      <div>
        <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.2rem" }}>{label}</p>
        <p style={{ fontSize: "1.5rem", fontWeight: 700 }}>{value}</p>
        {sub && (
          <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.1rem" }}>{sub}</p>
        )}
      </div>
    </div>
  );
}

// ─── Section: Certifications ─────────────────────────────────────

function CertificationsSection({
  certs,
  view,
  setView,
}: {
  certs: Certification[];
  view: "grid" | "list";
  setView: (v: "grid" | "list") => void;
}) {
  const now = Date.now();
  const sixtyDays = 60 * 86400000;

  if (certs.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
        <Shield size={32} color="var(--muted)" style={{ marginBottom: "0.75rem" }} />
        <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>No certifications yet</p>
        <p className="muted" style={{ fontSize: "0.85rem" }}>
          Complete training courses to earn your first certification.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* View toggle */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.75rem" }}>
        <div
          style={{
            display: "flex",
            gap: "0.25rem",
            background: "var(--subtle)",
            borderRadius: 8,
            padding: 3,
          }}
        >
          <button
            onClick={() => setView("grid")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: ".78rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              background: view === "grid" ? "var(--bg)" : "transparent",
              color: view === "grid" ? "var(--fg)" : "var(--muted)",
              boxShadow: view === "grid" ? "0 1px 3px rgba(0,0,0,.1)" : "none",
            }}
          >
            <Grid size={14} /> Grid
          </button>
          <button
            onClick={() => setView("list")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: ".78rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              background: view === "list" ? "var(--bg)" : "transparent",
              color: view === "list" ? "var(--fg)" : "var(--muted)",
              boxShadow: view === "list" ? "0 1px 3px rgba(0,0,0,.1)" : "none",
            }}
          >
            <List size={14} /> List
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          {certs.map((cert) => {
            const isExpired = cert.status === "expired";
            const isExpiring =
              !isExpired &&
              cert.expiryDate &&
              cert.expiryDate - now < sixtyDays;
            return (
              <div
                key={cert._id}
                className="card"
                style={{
                  position: "relative",
                  border: isExpired
                    ? "1px solid #fca5a5"
                    : isExpiring
                    ? "1px solid #fcd34d"
                    : undefined,
                }}
              >
                {/* Status indicator */}
                {(isExpired || isExpiring) && (
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: ".7rem",
                      fontWeight: 600,
                      color: isExpired ? "#dc2626" : "#d97706",
                    }}
                  >
                    <AlertTriangle size={12} />
                    {isExpired ? "Expired" : "Expiring Soon"}
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "start", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: isExpired ? "#fef2f2" : "#eef2ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Shield size={22} color={isExpired ? "#dc2626" : "#6366f1"} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.2rem" }}>
                      {cert.name}
                    </p>
                    <p className="muted" style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                      {cert.issuer}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <LevelBadge level={cert.level} />
                      <span
                        className={`badge badge-${cert.status === "active" ? "success" : "danger"}`}
                      >
                        {cert.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "0.75rem",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.8rem",
                  }}
                >
                  <div>
                    <span className="muted">Earned: </span>
                    <span style={{ fontWeight: 500 }}>{formatDate(cert.dateEarned)}</span>
                  </div>
                  {cert.expiryDate ? (
                    <div>
                      <span className="muted">Expires: </span>
                      <span
                        style={{
                          fontWeight: 500,
                          color: isExpired ? "#dc2626" : isExpiring ? "#d97706" : undefined,
                        }}
                      >
                        {formatDate(cert.expiryDate)}
                      </span>
                    </div>
                  ) : (
                    <span className="muted" style={{ fontSize: "0.78rem" }}>No expiry</span>
                  )}
                </div>

                {/* Renewal link for expired/expiring */}
                {(isExpired || isExpiring) && (
                  <button
                    className="btn-outline"
                    style={{
                      marginTop: "0.75rem",
                      width: "100%",
                      fontSize: ".8rem",
                      padding: ".45rem .75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                    }}
                    onClick={() =>
                      alert(
                        `Renewal for "${cert.name}" would redirect to certification portal in production.`
                      )
                    }
                  >
                    <ExternalLink size={14} />
                    {isExpired ? "Renew Certification" : "Renew Early"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="table-responsive">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: "var(--subtle)",
                  }}
                >
                  <th
                    style={{
                      padding: ".8rem 1.2rem",
                      textAlign: "left",
                      fontWeight: 600,
                      fontSize: ".8rem",
                      color: "var(--muted)",
                    }}
                  >
                    Certification
                  </th>
                  <th
                    style={{
                      padding: ".8rem",
                      textAlign: "left",
                      fontWeight: 600,
                      fontSize: ".8rem",
                      color: "var(--muted)",
                    }}
                  >
                    Issuer
                  </th>
                  <th
                    style={{
                      padding: ".8rem",
                      textAlign: "center",
                      fontWeight: 600,
                      fontSize: ".8rem",
                      color: "var(--muted)",
                    }}
                  >
                    Level
                  </th>
                  <th
                    style={{
                      padding: ".8rem",
                      textAlign: "left",
                      fontWeight: 600,
                      fontSize: ".8rem",
                      color: "var(--muted)",
                    }}
                  >
                    Earned
                  </th>
                  <th
                    style={{
                      padding: ".8rem",
                      textAlign: "left",
                      fontWeight: 600,
                      fontSize: ".8rem",
                      color: "var(--muted)",
                    }}
                  >
                    Expiry
                  </th>
                  <th
                    style={{
                      padding: ".8rem",
                      textAlign: "center",
                      fontWeight: 600,
                      fontSize: ".8rem",
                      color: "var(--muted)",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: ".8rem",
                      textAlign: "center",
                      fontWeight: 600,
                      fontSize: ".8rem",
                      color: "var(--muted)",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {certs.map((cert) => {
                  const isExpired = cert.status === "expired";
                  const isExpiring =
                    !isExpired &&
                    cert.expiryDate &&
                    cert.expiryDate - now < sixtyDays;
                  return (
                    <tr
                      key={cert._id}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        background: isExpired
                          ? "#fef2f233"
                          : isExpiring
                          ? "#fffbeb33"
                          : undefined,
                      }}
                    >
                      <td style={{ padding: ".8rem 1.2rem", fontWeight: 600 }}>
                        {cert.name}
                      </td>
                      <td style={{ padding: ".8rem" }} className="muted">
                        {cert.issuer}
                      </td>
                      <td style={{ padding: ".8rem", textAlign: "center" }}>
                        <LevelBadge level={cert.level} />
                      </td>
                      <td style={{ padding: ".8rem", fontSize: ".85rem" }}>
                        {formatDate(cert.dateEarned)}
                      </td>
                      <td
                        style={{
                          padding: ".8rem",
                          fontSize: ".85rem",
                          color: isExpired
                            ? "#dc2626"
                            : isExpiring
                            ? "#d97706"
                            : undefined,
                          fontWeight: isExpired || isExpiring ? 600 : undefined,
                        }}
                      >
                        {cert.expiryDate ? formatDate(cert.expiryDate) : "—"}
                        {isExpiring && (
                          <AlertTriangle
                            size={12}
                            style={{
                              display: "inline",
                              marginLeft: 4,
                              verticalAlign: "-1px",
                            }}
                          />
                        )}
                      </td>
                      <td style={{ padding: ".8rem", textAlign: "center" }}>
                        <span
                          className={`badge badge-${cert.status === "active" ? "success" : "danger"}`}
                        >
                          {cert.status}
                        </span>
                      </td>
                      <td style={{ padding: ".8rem", textAlign: "center" }}>
                        {(isExpired || isExpiring) && (
                          <button
                            className="btn-outline"
                            style={{
                              fontSize: ".75rem",
                              padding: ".3rem .6rem",
                            }}
                            onClick={() =>
                              alert(
                                `Renewal for "${cert.name}" would redirect to certification portal in production.`
                              )
                            }
                          >
                            Renew
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Section: Badges ─────────────────────────────────────────────

function BadgesSection({ badges }: { badges: Badge[] }) {
  if (badges.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
        <Star size={32} color="var(--muted)" style={{ marginBottom: "0.75rem" }} />
        <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>No badges yet</p>
        <p className="muted" style={{ fontSize: "0.85rem" }}>
          Complete milestones and achievements to earn badges.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "1rem",
      }}
    >
      {badges.map((badge) => (
        <div
          key={badge._id}
          className="card card-hover"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "1.5rem 1.25rem",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              fontSize: "2.5rem",
              lineHeight: 1,
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {badge.icon}
          </div>
          <p style={{ fontWeight: 700, fontSize: "0.95rem", marginTop: "0.25rem" }}>
            {badge.name}
          </p>
          <p className="muted" style={{ fontSize: "0.8rem", lineHeight: 1.5 }}>
            {badge.description}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "auto",
              paddingTop: "0.5rem",
            }}
          >
            <span
              className="chip"
              style={{ fontSize: ".7rem", textTransform: "capitalize" }}
            >
              {BADGE_CATEGORY_LABELS[badge.category] || badge.category}
            </span>
          </div>
          <p className="muted" style={{ fontSize: "0.72rem" }}>
            Earned {formatDate(badge.earnedAt)}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Section: Training Progress ──────────────────────────────────

function TrainingSection({
  completed,
  inProgress,
  recommended,
}: {
  completed: TrainingCompletion[];
  inProgress: InProgressCourse[];
  recommended: RecommendedCourse[];
}) {
  const categoryColors: Record<string, string> = {
    sales: "#6366f1",
    technical: "#0284c7",
    product: "#059669",
    leadership: "#d97706",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* In-Progress Courses */}
      {inProgress.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Clock size={16} color="#6366f1" />
            In Progress
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1rem",
            }}
          >
            {inProgress.map((course) => (
              <div key={course.id} className="card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "0.5rem",
                  }}
                >
                  <p style={{ fontWeight: 600, fontSize: "0.9rem", flex: 1 }}>
                    {course.courseName}
                  </p>
                  <span
                    className="chip"
                    style={{
                      fontSize: ".68rem",
                      textTransform: "capitalize",
                      flexShrink: 0,
                      marginLeft: "0.5rem",
                    }}
                  >
                    {course.category}
                  </span>
                </div>
                <ProgressBar
                  value={course.progress}
                  color={categoryColors[course.category] || "#6366f1"}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "0.5rem",
                    fontSize: "0.78rem",
                    color: "var(--muted)",
                  }}
                >
                  <span style={{ fontWeight: 600, color: "var(--fg)" }}>
                    {course.progress}% complete
                  </span>
                  <span>~{course.estimatedMinutes} min total</span>
                </div>
                <button
                  className="btn-outline"
                  style={{
                    marginTop: "0.75rem",
                    width: "100%",
                    fontSize: ".8rem",
                    padding: ".4rem .75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                  }}
                  onClick={() =>
                    alert(
                      `"${course.courseName}" would resume in the learning portal in production.`
                    )
                  }
                >
                  Continue Learning
                  <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Courses */}
      {completed.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <CheckCircle size={16} color="#059669" />
            Completed ({completed.length})
          </h3>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="table-responsive">
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: ".9rem",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid var(--border)",
                      background: "var(--subtle)",
                    }}
                  >
                    <th
                      style={{
                        padding: ".8rem 1.2rem",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: ".8rem",
                        color: "var(--muted)",
                      }}
                    >
                      Course
                    </th>
                    <th
                      style={{
                        padding: ".8rem",
                        textAlign: "center",
                        fontWeight: 600,
                        fontSize: ".8rem",
                        color: "var(--muted)",
                      }}
                    >
                      Score
                    </th>
                    <th
                      style={{
                        padding: ".8rem",
                        textAlign: "left",
                        fontWeight: 600,
                        fontSize: ".8rem",
                        color: "var(--muted)",
                      }}
                    >
                      Completed
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {completed.map((t) => (
                    <tr
                      key={t._id}
                      style={{ borderBottom: "1px solid var(--border)" }}
                    >
                      <td style={{ padding: ".8rem 1.2rem", fontWeight: 500 }}>
                        {t.courseName}
                      </td>
                      <td style={{ padding: ".8rem", textAlign: "center" }}>
                        {t.score != null && (
                          <span
                            style={{
                              fontWeight: 700,
                              color:
                                t.score >= 90
                                  ? "#059669"
                                  : t.score >= 70
                                  ? "#0284c7"
                                  : "#d97706",
                            }}
                          >
                            {t.score}%
                          </span>
                        )}
                      </td>
                      <td
                        style={{ padding: ".8rem", fontSize: ".85rem" }}
                        className="muted"
                      >
                        {formatDate(t.completedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Courses */}
      {recommended.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Sparkles size={16} color="#d97706" />
            Recommended for You
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
            }}
          >
            {recommended.map((course) => (
              <div
                key={course.id}
                className="card card-hover"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <p style={{ fontWeight: 600, fontSize: "0.9rem", flex: 1 }}>
                    {course.courseName}
                  </p>
                  <LevelBadge level={course.difficulty} />
                </div>
                <p
                  className="muted"
                  style={{ fontSize: "0.82rem", lineHeight: 1.5 }}
                >
                  {course.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginTop: "auto",
                    paddingTop: "0.5rem",
                  }}
                >
                  <span
                    className="chip"
                    style={{
                      fontSize: ".68rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {course.category}
                  </span>
                  <span className="muted" style={{ fontSize: ".75rem" }}>
                    ~{course.estimatedMinutes} min
                  </span>
                </div>
                <button
                  className="btn-outline"
                  style={{
                    marginTop: "0.5rem",
                    width: "100%",
                    fontSize: ".8rem",
                    padding: ".4rem .75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                  }}
                  onClick={() =>
                    alert(
                      `"${course.courseName}" would start in the learning portal in production.`
                    )
                  }
                >
                  Start Course
                  <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {completed.length === 0 && inProgress.length === 0 && recommended.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
          <BookOpen size={32} color="var(--muted)" style={{ marginBottom: "0.75rem" }} />
          <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>No training data</p>
          <p className="muted" style={{ fontSize: "0.85rem" }}>
            Courses and training progress will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Section: Skills & Endorsements ──────────────────────────────

function EndorsementsSection({
  endorsements,
}: {
  endorsements: SkillEndorsement[];
}) {
  // Group by skill for a visual summary
  const skillGroups = useMemo(() => {
    const map = new Map<
      string,
      { skill: string; level: string; endorsers: string[]; latestDate: number }
    >();
    endorsements.forEach((e) => {
      const existing = map.get(e.skill);
      if (existing) {
        existing.endorsers.push(e.endorsedBy);
        if (e.endorsedAt > existing.latestDate) {
          existing.latestDate = e.endorsedAt;
          existing.level = e.level;
        }
      } else {
        map.set(e.skill, {
          skill: e.skill,
          level: e.level,
          endorsers: [e.endorsedBy],
          latestDate: e.endorsedAt,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => {
      const levelOrder = { expert: 3, proficient: 2, familiar: 1 };
      return (
        (levelOrder[b.level as keyof typeof levelOrder] || 0) -
        (levelOrder[a.level as keyof typeof levelOrder] || 0)
      );
    });
  }, [endorsements]);

  if (endorsements.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
        <Users size={32} color="var(--muted)" style={{ marginBottom: "0.75rem" }} />
        <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>No endorsements yet</p>
        <p className="muted" style={{ fontSize: "0.85rem" }}>
          Skill endorsements from your vendor team will appear here.
        </p>
      </div>
    );
  }

  const levelBarWidth: Record<string, number> = {
    familiar: 33,
    proficient: 66,
    expert: 100,
  };

  const levelColors: Record<string, string> = {
    familiar: "#818cf8",
    proficient: "#3b82f6",
    expert: "#059669",
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "1rem",
      }}
    >
      {skillGroups.map((group) => (
        <div key={group.skill} className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>{group.skill}</p>
            <EndorsementLevelBadge level={group.level} />
          </div>
          <ProgressBar
            value={levelBarWidth[group.level] || 33}
            color={levelColors[group.level] || "#6366f1"}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "0.5rem",
              fontSize: "0.78rem",
              color: "var(--muted)",
            }}
          >
            <span>
              Endorsed by{" "}
              <strong style={{ color: "var(--fg)" }}>
                {group.endorsers.length}
              </strong>{" "}
              {group.endorsers.length === 1 ? "person" : "people"}
            </span>
            <span>{formatDate(group.latestDate)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────

export default function PortalEnablementPage() {
  const { partner } = usePortal();
  const [activeTab, setActiveTab] = useState<
    "certs" | "badges" | "training" | "endorsements"
  >("certs");
  const [certView, setCertView] = useState<"grid" | "list">("grid");

  if (!partner) return null;

  const stats = getPortalEnablementStats(partner);
  const certs = getPortalCertifications(partner);
  const badges = getPortalBadges(partner);
  const completed = getPortalTrainingCompleted(partner);
  const inProgress = getPortalInProgressCourses(partner);
  const recommended = getPortalRecommendedCourses(partner);
  const endorsements = getPortalEndorsements(partner);

  const tabs = [
    {
      key: "certs" as const,
      label: "Certifications",
      icon: <Shield size={15} />,
      count: stats.totalCerts,
    },
    {
      key: "badges" as const,
      label: "Badges",
      icon: <Star size={15} />,
      count: stats.totalBadges,
    },
    {
      key: "training" as const,
      label: "Training",
      icon: <BookOpen size={15} />,
      count: stats.completedCourses + stats.inProgressCourses,
    },
    {
      key: "endorsements" as const,
      label: "Skills",
      icon: <Users size={15} />,
      count: stats.totalEndorsements,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>
          <Award
            size={24}
            style={{
              display: "inline",
              verticalAlign: "-3px",
              marginRight: 8,
              color: "#6366f1",
            }}
          />
          Enablement
        </h1>
        <p className="muted" style={{ marginTop: "0.25rem" }}>
          Your certifications, badges, training progress, and skills
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
        }}
      >
        <StatCard
          label="Active Certifications"
          value={stats.activeCerts}
          sub={
            stats.expiringCerts > 0
              ? `${stats.expiringCerts} expiring soon`
              : stats.expiredCerts > 0
              ? `${stats.expiredCerts} expired`
              : undefined
          }
          icon={Shield}
          color="#059669"
          bg="#ecfdf5"
        />
        <StatCard
          label="Badges Earned"
          value={stats.totalBadges}
          icon={Star}
          color="#d97706"
          bg="#fffbeb"
        />
        <StatCard
          label="Courses"
          value={stats.completedCourses}
          sub={
            stats.inProgressCourses > 0
              ? `${stats.inProgressCourses} in progress`
              : undefined
          }
          icon={BookOpen}
          color="#0284c7"
          bg="#eff6ff"
        />
        <StatCard
          label="Endorsements"
          value={stats.totalEndorsements}
          sub={stats.avgScore > 0 ? `Avg score: ${stats.avgScore}%` : undefined}
          icon={TrendingUp}
          color="#6366f1"
          bg="#eef2ff"
        />
      </div>

      {/* Tab Bar */}
      <div
        className="card"
        style={{
          display: "flex",
          gap: "0.25rem",
          padding: "0.5rem 0.75rem",
          flexWrap: "wrap",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: ".85rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              background: activeTab === t.key ? "var(--fg)" : "transparent",
              color: activeTab === t.key ? "var(--bg)" : "var(--muted)",
              transition: "all 0.15s",
            }}
          >
            {t.icon}
            {t.label}
            <span
              style={{
                fontSize: ".72rem",
                fontWeight: 700,
                background:
                  activeTab === t.key
                    ? "rgba(255,255,255,0.2)"
                    : "var(--subtle)",
                padding: "1px 6px",
                borderRadius: 10,
              }}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "certs" && (
        <CertificationsSection
          certs={certs}
          view={certView}
          setView={setCertView}
        />
      )}
      {activeTab === "badges" && <BadgesSection badges={badges} />}
      {activeTab === "training" && (
        <TrainingSection
          completed={completed}
          inProgress={inProgress}
          recommended={recommended}
        />
      )}
      {activeTab === "endorsements" && (
        <EndorsementsSection endorsements={endorsements} />
      )}
    </div>
  );
}
