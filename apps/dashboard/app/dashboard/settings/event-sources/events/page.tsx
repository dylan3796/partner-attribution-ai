"use client";
import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/toast";
import {
  ArrowLeft,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  ExternalLink,
  User,
  Briefcase,
} from "lucide-react";
import {
  INBOUND_EVENT_STATUS_LABELS,
  EVENT_SOURCE_TYPE_LABELS,
  type InboundEvent,
  type EventSource,
  type InboundEventStatus,
} from "@/lib/types";

export default function InboundEventsPage() {
  const eventSources = useQuery(api.eventSources.list);
  const [selectedSource, setSelectedSource] = useState<string | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<InboundEventStatus | "all">("all");

  const inboundEvents = useQuery(api.eventSources.listInboundEvents, {
    sourceId: selectedSource !== "all" ? (selectedSource as Id<"eventSources">) : undefined,
    limit: 100,
  });

  const updateEventStatus = useMutation(api.eventSources.updateEventStatus);

  const sources = (eventSources ?? []) as unknown as EventSource[];
  const events = (inboundEvents ?? []) as unknown as InboundEvent[];
  const isLoading = inboundEvents === undefined;

  const { toast } = useToast();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter by status client-side
  const filteredEvents =
    selectedStatus === "all"
      ? events
      : events.filter((e) => e.status === selectedStatus);

  function formatDate(ts: number) {
    return new Date(ts).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  function formatJson(json: string): string {
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch {
      return json;
    }
  }

  async function handleMarkIgnored(event: InboundEvent) {
    try {
      await updateEventStatus({
        eventId: event._id as Id<"inboundEvents">,
        status: "ignored",
      });
      toast("Event marked as ignored");
    } catch {
      toast("Failed to update event", "error");
    }
  }

  const statusIcons: Record<InboundEventStatus, typeof CheckCircle> = {
    pending: Clock,
    matched: CheckCircle,
    ignored: XCircle,
    error: AlertCircle,
  };

  const statusColors: Record<InboundEventStatus, string> = {
    pending: "var(--warning)",
    matched: "var(--success)",
    ignored: "var(--muted)",
    error: "var(--danger)",
  };

  return (
    <div className="dash-main">
      <header className="dash-header">
        <div>
          <Link
            href="/dashboard/settings/event-sources"
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
              color: "var(--muted)",
              fontSize: ".875rem",
              marginBottom: ".5rem",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={14} />
            Back to Event Sources
          </Link>
          <h1>Inbound Events</h1>
          <p className="dash-subtitle">
            View and manage incoming webhook events from all sources
          </p>
        </div>
      </header>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          <Filter size={16} style={{ color: "var(--muted)" }} />
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            style={{ minWidth: 180 }}
          >
            <option value="all">All Sources</option>
            {sources.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as InboundEventStatus | "all")}
          style={{ minWidth: 140 }}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="matched">Matched</option>
          <option value="ignored">Ignored</option>
          <option value="error">Error</option>
        </select>

        <div style={{ marginLeft: "auto", color: "var(--muted)", fontSize: ".875rem" }}>
          Showing {filteredEvents.length} events
        </div>
      </div>

      {/* Events Table */}
      <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
        {isLoading ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <RefreshCw size={24} style={{ color: "var(--muted)", animation: "spin 1s linear infinite" }} />
            <p style={{ color: "var(--muted)", marginTop: ".5rem" }}>Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <p style={{ color: "var(--muted)" }}>
              {events.length === 0
                ? "No events received yet. Configure a webhook source and send a test event."
                : "No events match the selected filters."}
            </p>
          </div>
        ) : (
          <table className="data-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ width: 50 }}></th>
                <th>Time</th>
                <th>Source</th>
                <th>Event Type</th>
                <th>Status</th>
                <th>Partner</th>
                <th>Deal</th>
                <th style={{ width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => {
                const isExpanded = expandedId === event._id;
                const StatusIcon = statusIcons[event.status];
                let mappedFields: Record<string, unknown> = {};
                try {
                  mappedFields = JSON.parse(event.mappedFields || "{}");
                } catch {
                  // ignore
                }

                return (
                  <>
                    <tr
                      key={event._id}
                      style={{
                        cursor: "pointer",
                        background: isExpanded ? "var(--surface-raised)" : undefined,
                      }}
                      onClick={() => setExpandedId(isExpanded ? null : event._id)}
                    >
                      <td>
                        {isExpanded ? (
                          <ChevronUp size={16} style={{ color: "var(--muted)" }} />
                        ) : (
                          <ChevronDown size={16} style={{ color: "var(--muted)" }} />
                        )}
                      </td>
                      <td>
                        <span style={{ fontSize: ".85rem" }}>{formatDate(event.receivedAt)}</span>
                      </td>
                      <td>
                        {event.source ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: ".35rem",
                              fontSize: ".85rem",
                            }}
                          >
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background:
                                  event.source.status === "active"
                                    ? "var(--success)"
                                    : "var(--muted)",
                              }}
                            />
                            {event.source.name}
                          </span>
                        ) : (
                          <span style={{ color: "var(--muted)" }}>Unknown</span>
                        )}
                      </td>
                      <td>
                        <code
                          style={{
                            fontSize: ".8rem",
                            background: "var(--surface-raised)",
                            padding: "2px 6px",
                            borderRadius: 4,
                          }}
                        >
                          {event.eventType}
                        </code>
                      </td>
                      <td>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: ".35rem",
                            color: statusColors[event.status],
                            fontSize: ".85rem",
                          }}
                        >
                          <StatusIcon size={14} />
                          {INBOUND_EVENT_STATUS_LABELS[event.status]}
                        </span>
                      </td>
                      <td>
                        {event.partner ? (
                          <Link
                            href={`/dashboard/partners/${event.partnerMatch}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: ".35rem",
                              color: "var(--accent)",
                              fontSize: ".85rem",
                              textDecoration: "none",
                            }}
                          >
                            <User size={14} />
                            {event.partner.name}
                          </Link>
                        ) : (
                          <span style={{ color: "var(--muted)", fontSize: ".85rem" }}>—</span>
                        )}
                      </td>
                      <td>
                        {event.deal ? (
                          <Link
                            href={`/dashboard/deals/${event.dealCreated}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: ".35rem",
                              color: "var(--accent)",
                              fontSize: ".85rem",
                              textDecoration: "none",
                            }}
                          >
                            <Briefcase size={14} />
                            {event.deal.name}
                          </Link>
                        ) : (
                          <span style={{ color: "var(--muted)", fontSize: ".85rem" }}>—</span>
                        )}
                      </td>
                      <td>
                        {event.status === "pending" && (
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkIgnored(event);
                            }}
                            title="Mark as ignored"
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                      </td>
                    </tr>

                    {/* Expanded Row */}
                    {isExpanded && (
                      <tr key={`${event._id}-expanded`}>
                        <td colSpan={8} style={{ padding: 0 }}>
                          <div
                            style={{
                              background: "var(--surface)",
                              borderTop: "1px solid var(--border)",
                              padding: "1.25rem",
                            }}
                          >
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "1.5rem",
                              }}
                            >
                              {/* Mapped Fields */}
                              <div>
                                <h4
                                  style={{
                                    margin: "0 0 .75rem",
                                    fontSize: ".85rem",
                                    textTransform: "uppercase",
                                    letterSpacing: ".05em",
                                    color: "var(--muted)",
                                  }}
                                >
                                  Mapped Fields
                                </h4>
                                <div
                                  style={{
                                    background: "var(--surface-raised)",
                                    borderRadius: 8,
                                    padding: "1rem",
                                  }}
                                >
                                  {Object.keys(mappedFields).length === 0 ? (
                                    <p style={{ color: "var(--muted)", margin: 0, fontSize: ".875rem" }}>
                                      No fields extracted
                                    </p>
                                  ) : (
                                    <div style={{ display: "grid", gap: ".5rem" }}>
                                      {Object.entries(mappedFields).map(([key, value]) => (
                                        <div
                                          key={key}
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            fontSize: ".875rem",
                                          }}
                                        >
                                          <span style={{ color: "var(--muted)" }}>{key}</span>
                                          <span style={{ fontWeight: 500 }}>
                                            {typeof value === "object"
                                              ? JSON.stringify(value)
                                              : String(value)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {event.errorMessage && (
                                  <div
                                    style={{
                                      marginTop: "1rem",
                                      padding: ".75rem 1rem",
                                      background: "var(--danger-soft)",
                                      borderRadius: 8,
                                      color: "var(--danger)",
                                      fontSize: ".85rem",
                                    }}
                                  >
                                    <strong>Error:</strong> {event.errorMessage}
                                  </div>
                                )}
                              </div>

                              {/* Raw Payload */}
                              <div>
                                <h4
                                  style={{
                                    margin: "0 0 .75rem",
                                    fontSize: ".85rem",
                                    textTransform: "uppercase",
                                    letterSpacing: ".05em",
                                    color: "var(--muted)",
                                  }}
                                >
                                  Raw Payload
                                </h4>
                                <pre
                                  style={{
                                    background: "var(--surface-raised)",
                                    borderRadius: 8,
                                    padding: "1rem",
                                    margin: 0,
                                    fontSize: ".75rem",
                                    overflow: "auto",
                                    maxHeight: 250,
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {formatJson(event.rawPayload)}
                                </pre>
                              </div>
                            </div>

                            {/* Timestamps */}
                            <div
                              style={{
                                marginTop: "1rem",
                                paddingTop: "1rem",
                                borderTop: "1px solid var(--border)",
                                display: "flex",
                                gap: "2rem",
                                fontSize: ".8rem",
                                color: "var(--muted)",
                              }}
                            >
                              <span>
                                <strong>Received:</strong> {formatDate(event.receivedAt)}
                              </span>
                              {event.processedAt && (
                                <span>
                                  <strong>Processed:</strong> {formatDate(event.processedAt)}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
