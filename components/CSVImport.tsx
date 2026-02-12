"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Download, FileText, CheckCircle, AlertTriangle, X, Loader2, SkipForward } from "lucide-react";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import {
  type ImportDataType,
  type ImportPreview,
  type PartnerImportRow,
  type DealImportRow,
  type TouchpointImportRow,
  validateAndParsePartners,
  validateAndParseDeals,
  validateAndParseTouchpoints,
  readFileAsText,
  formatFileSize,
} from "@/lib/csv-import";

const DATA_TYPE_CONFIG: Record<ImportDataType, { label: string; icon: string; templateUrl: string; description: string }> = {
  partners: {
    label: "Partners",
    icon: "🤝",
    templateUrl: "/templates/partners-template.csv",
    description: "Import partner companies with type, tier, and contact info",
  },
  deals: {
    label: "Deals",
    icon: "💰",
    templateUrl: "/templates/deals-template.csv",
    description: "Import deals with amounts, stages, and close dates",
  },
  touchpoints: {
    label: "Touchpoints",
    icon: "📍",
    templateUrl: "/templates/touchpoints-template.csv",
    description: "Import partner touchpoints linked to deals",
  },
};

type PreviewData =
  | { type: "partners"; preview: ImportPreview<PartnerImportRow> }
  | { type: "deals"; preview: ImportPreview<DealImportRow> }
  | { type: "touchpoints"; preview: ImportPreview<TouchpointImportRow> };

export default function CSVImport() {
  const { partners, deals, addPartner, addDeal, addTouchpoint } = useStore();
  const { toast } = useToast();
  const [activeType, setActiveType] = useState<ImportDataType>("partners");
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [importing, setImporting] = useState(false);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (f: File) => {
      if (!f.name.endsWith(".csv")) {
        toast("Please upload a CSV file", "error");
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast("File too large. Maximum size is 5MB", "error");
        return;
      }

      setFile(f);
      try {
        const text = await readFileAsText(f);
        let preview: PreviewData;

        switch (activeType) {
          case "partners":
            preview = { type: "partners", preview: validateAndParsePartners(text, partners) };
            break;
          case "deals":
            preview = { type: "deals", preview: validateAndParseDeals(text, deals) };
            break;
          case "touchpoints":
            preview = {
              type: "touchpoints",
              preview: validateAndParseTouchpoints(
                text,
                deals.map((d) => d._id),
                partners.map((p) => p._id)
              ),
            };
            break;
        }
        setPreviewData(preview);
      } catch {
        toast("Failed to parse CSV file", "error");
      }
    },
    [activeType, partners, deals, toast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleImport = useCallback(async () => {
    if (!previewData) return;
    setImporting(true);

    // Simulate a slight delay for UX
    await new Promise((r) => setTimeout(r, 300));

    try {
      const { preview } = previewData;
      const errorRows = new Set(preview.errors.map((e) => e.row));
      const dupRows = new Set(preview.duplicates);
      let imported = 0;
      let skipped = 0;

      if (previewData.type === "partners") {
        (preview as ImportPreview<PartnerImportRow>).rows.forEach((row, idx) => {
          const rowNum = idx + 2;
          if (errorRows.has(rowNum)) return;
          if (skipDuplicates && dupRows.has(rowNum)) {
            skipped++;
            return;
          }
          addPartner(row);
          imported++;
        });
      } else if (previewData.type === "deals") {
        (preview as ImportPreview<DealImportRow>).rows.forEach((row, idx) => {
          const rowNum = idx + 2;
          if (errorRows.has(rowNum)) return;
          if (skipDuplicates && dupRows.has(rowNum)) {
            skipped++;
            return;
          }
          addDeal(row);
          imported++;
        });
      } else if (previewData.type === "touchpoints") {
        (preview as ImportPreview<TouchpointImportRow>).rows.forEach((row, idx) => {
          const rowNum = idx + 2;
          if (errorRows.has(rowNum)) return;
          addTouchpoint(row);
          imported++;
        });
      }

      const typeLabel = DATA_TYPE_CONFIG[previewData.type].label.toLowerCase();
      let msg = `Imported ${imported} ${typeLabel}`;
      if (skipped > 0) msg += ` (${skipped} duplicates skipped)`;
      toast(msg);

      // Reset
      setFile(null);
      setPreviewData(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast("Import failed. Please check your data and try again.", "error");
    } finally {
      setImporting(false);
    }
  }, [previewData, skipDuplicates, addPartner, addDeal, addTouchpoint, toast]);

  const resetImport = () => {
    setFile(null);
    setPreviewData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const preview = previewData?.preview;
  const hasErrors = preview && preview.errors.length > 0;
  const hasDuplicates = preview && preview.duplicates.length > 0;
  const errorRowCount = preview ? new Set(preview.errors.map((e) => e.row)).size : 0;
  const importableCount = preview ? preview.totalRows - errorRowCount - (skipDuplicates ? preview.duplicates.length : 0) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Data Type Tabs */}
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
        {(Object.keys(DATA_TYPE_CONFIG) as ImportDataType[]).map((type) => {
          const cfg = DATA_TYPE_CONFIG[type];
          const isActive = activeType === type;
          return (
            <button
              key={type}
              onClick={() => {
                setActiveType(type);
                resetImport();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".5rem",
                padding: ".55rem 1rem",
                borderRadius: 8,
                fontSize: ".85rem",
                fontWeight: 600,
                border: isActive ? "2px solid #6366f1" : "1px solid var(--border)",
                background: isActive ? "#eef2ff" : "var(--bg)",
                color: isActive ? "#4338ca" : "var(--fg)",
                cursor: "pointer",
              }}
            >
              <span>{cfg.icon}</span>
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Instructions & Template Download */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: ".75rem 1rem",
          background: "var(--subtle)",
          borderRadius: 8,
          border: "1px solid var(--border)",
          flexWrap: "wrap",
          gap: ".5rem",
        }}
      >
        <p style={{ fontSize: ".85rem", color: "var(--muted)", margin: 0 }}>
          {DATA_TYPE_CONFIG[activeType].description}
        </p>
        <a
          href={DATA_TYPE_CONFIG[activeType].templateUrl}
          download
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".4rem",
            fontSize: ".8rem",
            fontWeight: 600,
            color: "#6366f1",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          <Download size={14} />
          Download Template
        </a>
      </div>

      {/* Drop Zone */}
      {!previewData && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: ".75rem",
            padding: "2.5rem 1.5rem",
            border: `2px dashed ${dragOver ? "#6366f1" : "var(--border)"}`,
            borderRadius: 12,
            background: dragOver ? "#eef2ff" : "var(--bg)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: dragOver ? "#c7d2fe" : "var(--subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s ease",
            }}
          >
            <Upload size={22} color={dragOver ? "#4338ca" : "#9ca3af"} />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: ".9rem", fontWeight: 600 }}>
              {dragOver ? "Drop your CSV file here" : "Upload a CSV file"}
            </p>
            <p className="muted" style={{ fontSize: ".8rem", marginTop: ".25rem" }}>
              Drag and drop, or click to browse. Max 5MB.
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            style={{ display: "none" }}
          />
        </div>
      )}

      {/* File Info Bar */}
      {file && previewData && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: ".6rem 1rem",
            background: "var(--subtle)",
            borderRadius: 8,
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
            <FileText size={16} color="#6366f1" />
            <span style={{ fontSize: ".85rem", fontWeight: 500 }}>{file.name}</span>
            <span className="muted" style={{ fontSize: ".8rem" }}>
              ({formatFileSize(file.size)} · {preview?.totalRows ?? 0} rows)
            </span>
          </div>
          <button
            onClick={resetImport}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
            }}
            title="Remove file"
          >
            <X size={16} color="#9ca3af" />
          </button>
        </div>
      )}

      {/* Validation Errors */}
      {hasErrors && (
        <div
          style={{
            padding: ".75rem 1rem",
            borderRadius: 8,
            border: "1px solid #fecaca",
            background: "#fef2f2",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
            <AlertTriangle size={15} color="#dc2626" />
            <span style={{ fontSize: ".85rem", fontWeight: 600, color: "#991b1b" }}>
              {errorRowCount} row{errorRowCount !== 1 ? "s" : ""} with errors
            </span>
          </div>
          <div style={{ maxHeight: 150, overflowY: "auto", display: "flex", flexDirection: "column", gap: ".25rem" }}>
            {preview!.errors.slice(0, 20).map((err, i) => (
              <p key={i} style={{ fontSize: ".8rem", color: "#991b1b", margin: 0 }}>
                Row {err.row}, <strong>{err.field}</strong>: {err.message}
              </p>
            ))}
            {preview!.errors.length > 20 && (
              <p style={{ fontSize: ".8rem", color: "#991b1b", margin: 0, fontStyle: "italic" }}>
                ...and {preview!.errors.length - 20} more errors
              </p>
            )}
          </div>
        </div>
      )}

      {/* Duplicate Warning */}
      {hasDuplicates && (
        <div
          style={{
            padding: ".75rem 1rem",
            borderRadius: 8,
            border: "1px solid #fed7aa",
            background: "#fff7ed",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: ".5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <SkipForward size={15} color="#c2410c" />
            <span style={{ fontSize: ".85rem", color: "#9a3412" }}>
              <strong>{preview!.duplicates.length}</strong> potential duplicate{preview!.duplicates.length !== 1 ? "s" : ""} detected
              {skipDuplicates ? " (will be skipped)" : " (will be imported)"}
            </span>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".8rem", color: "#9a3412", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={skipDuplicates}
              onChange={(e) => setSkipDuplicates(e.target.checked)}
              style={{ accentColor: "#6366f1" }}
            />
            Skip duplicates
          </label>
        </div>
      )}

      {/* Preview Table */}
      {preview && preview.rows.length > 0 && (
        <div style={{ borderRadius: 8, border: "1px solid var(--border)", overflow: "hidden" }}>
          <div
            style={{
              padding: ".5rem .75rem",
              background: "var(--subtle)",
              borderBottom: "1px solid var(--border)",
              fontSize: ".8rem",
              fontWeight: 600,
              color: "var(--muted)",
            }}
          >
            Preview (first {Math.min(preview.rows.length, 10)} of {preview.totalRows} rows)
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".8rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--subtle)" }}>
                  <th style={{ padding: ".4rem .6rem", textAlign: "left", fontWeight: 600, whiteSpace: "nowrap" }}>#</th>
                  {previewData?.type === "partners" && (
                    <>
                      <th style={{ padding: ".4rem .6rem", textAlign: "left", fontWeight: 600 }}>Name</th>
                      <th style={{ padding: ".4rem .6rem", textAlign: "left", fontWeight: 600 }}>Email</th>
                      <th style={{ padding: ".4rem .6rem", textAlign: "left", fontWeight: 600 }}>Type</th>
                      <th style={{ padding: ".4rem .6rem", textAlign: "left", fontWeight: 600 }}>Tier</th>
                      <th style={{ padding: ".4rem .6rem", textAlign: "left", fontWeight: 600 }}>Status</th>
                    </>
                  )}
                  {previewData?.type === "deals" && (
                    <>
                      <th style={{ padding: ".4rem .6rem", textAlign: "left", fontWeight: 600 }}>Name</th>
                      <th style={{ padding: ".4rem .6rem", textAlign: "left", fontWeight: 600 }}>Amount</th>
                      <th style={{ padding: ".4rem .6rem", textAlign: "left", fontWeight: 600 }}>Stage</th>
                      <th style={{ padding: ".4rem .6rem", textAlign: "left", fontWeight: 600 }}>Contact</th>
                    </>
                  )}
                  {previewData?.type === "touchpoints" && (
                    <>
                      <th style={{ padding: ".4rem .6rem", textAlign: "left", fontWeight: 600 }}>Deal ID</th>
                      <th style={{ padding: ".4rem .6rem", textAlign: "left", fontWeight: 600 }}>Partner ID</th>
                      <th style={{ padding: ".4rem .6rem", textAlign: "left", fontWeight: 600 }}>Type</th>
                      <th style={{ padding: ".4rem .6rem", textAlign: "left", fontWeight: 600 }}>Notes</th>
                    </>
                  )}
                  <th style={{ padding: ".4rem .6rem", textAlign: "center", fontWeight: 600, width: 60 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {preview.rows.slice(0, 10).map((row, idx) => {
                  const rowNum = idx + 2;
                  const rowErrors = preview.errors.filter((e) => e.row === rowNum);
                  const isDup = preview.duplicates.includes(rowNum);
                  const hasRowError = rowErrors.length > 0;

                  return (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        background: hasRowError ? "#fef2f2" : isDup ? "#fff7ed" : "var(--bg)",
                      }}
                    >
                      <td style={{ padding: ".4rem .6rem", color: "var(--muted)" }}>{idx + 1}</td>
                      {previewData?.type === "partners" && (() => {
                        const r = row as PartnerImportRow;
                        return (
                          <>
                            <td style={{ padding: ".4rem .6rem", fontWeight: 500 }}>{r.name}</td>
                            <td style={{ padding: ".4rem .6rem" }}>{r.email}</td>
                            <td style={{ padding: ".4rem .6rem", textTransform: "capitalize" }}>{r.type}</td>
                            <td style={{ padding: ".4rem .6rem", textTransform: "capitalize" }}>{r.tier || "—"}</td>
                            <td style={{ padding: ".4rem .6rem", textTransform: "capitalize" }}>{r.status}</td>
                          </>
                        );
                      })()}
                      {previewData?.type === "deals" && (() => {
                        const r = row as DealImportRow;
                        return (
                          <>
                            <td style={{ padding: ".4rem .6rem", fontWeight: 500 }}>{r.name}</td>
                            <td style={{ padding: ".4rem .6rem" }}>${r.amount.toLocaleString()}</td>
                            <td style={{ padding: ".4rem .6rem", textTransform: "capitalize" }}>{r.status}</td>
                            <td style={{ padding: ".4rem .6rem" }}>{r.contactName || "—"}</td>
                          </>
                        );
                      })()}
                      {previewData?.type === "touchpoints" && (() => {
                        const r = row as TouchpointImportRow;
                        return (
                          <>
                            <td style={{ padding: ".4rem .6rem", fontFamily: "monospace", fontSize: ".75rem" }}>{r.dealId}</td>
                            <td style={{ padding: ".4rem .6rem", fontFamily: "monospace", fontSize: ".75rem" }}>{r.partnerId}</td>
                            <td style={{ padding: ".4rem .6rem", textTransform: "capitalize" }}>{r.type.replace("_", " ")}</td>
                            <td style={{ padding: ".4rem .6rem", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.notes || "—"}</td>
                          </>
                        );
                      })()}
                      <td style={{ padding: ".4rem .6rem", textAlign: "center" }}>
                        {hasRowError ? (
                          <span title={rowErrors.map((e) => e.message).join("; ")} style={{ cursor: "help" }}>
                            <AlertTriangle size={14} color="#dc2626" />
                          </span>
                        ) : isDup ? (
                          <span title="Potential duplicate" style={{ cursor: "help", fontSize: ".7rem", color: "#c2410c", fontWeight: 600 }}>DUP</span>
                        ) : (
                          <CheckCircle size={14} color="#059669" />
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

      {/* Import Actions */}
      {preview && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: ".75rem 1rem",
            background: "var(--subtle)",
            borderRadius: 8,
            border: "1px solid var(--border)",
            flexWrap: "wrap",
            gap: ".75rem",
          }}
        >
          <div style={{ fontSize: ".85rem" }}>
            <strong style={{ color: "#059669" }}>{importableCount}</strong> rows ready to import
            {errorRowCount > 0 && (
              <span style={{ color: "#dc2626", marginLeft: ".5rem" }}>
                · {errorRowCount} with errors
              </span>
            )}
            {skipDuplicates && preview.duplicates.length > 0 && (
              <span style={{ color: "#c2410c", marginLeft: ".5rem" }}>
                · {preview.duplicates.length} duplicates skipped
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: ".5rem" }}>
            <button
              className="btn-outline"
              onClick={resetImport}
              style={{ fontSize: ".85rem" }}
            >
              Cancel
            </button>
            <button
              className="btn"
              onClick={handleImport}
              disabled={importing || importableCount === 0}
              style={{
                fontSize: ".85rem",
                display: "flex",
                alignItems: "center",
                gap: ".4rem",
                opacity: importing || importableCount === 0 ? 0.6 : 1,
              }}
            >
              {importing ? (
                <>
                  <Loader2 size={14} className="spin" />
                  Importing...
                </>
              ) : (
                <>
                  <CheckCircle size={14} />
                  Import {importableCount} {DATA_TYPE_CONFIG[activeType].label}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
