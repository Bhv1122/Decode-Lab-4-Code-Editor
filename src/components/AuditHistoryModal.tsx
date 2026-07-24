import React from "react";
import { AuditHistoryEntry } from "../types";
import { History, X, Trash2, ArrowRight, ShieldCheck } from "lucide-react";

interface AuditHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: AuditHistoryEntry[];
  onSelectEntry: (entry: AuditHistoryEntry) => void;
  onClearHistory: () => void;
}

export const AuditHistoryModal: React.FC<AuditHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectEntry,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        {/* Modal Header */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">AUDIT_SESSION_LOGS</h3>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
              {history.length} records
            </span>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline mr-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <ShieldCheck className="w-12 h-12 text-slate-700 mx-auto mb-2" />
              <p className="text-sm font-semibold">No audit session logs found.</p>
              <p className="text-xs text-slate-600 mt-1">
                Execute audits to populate historical reports.
              </p>
            </div>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                onClick={() => {
                  onSelectEntry(entry);
                  onClose();
                }}
                className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:bg-slate-800/50 hover:border-slate-700 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400 text-xs">
                      {entry.filename || "code_payload"}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded uppercase">
                      {entry.language}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">{entry.timestamp}</span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 font-mono bg-slate-900 p-2 rounded border border-slate-800/60">
                  {entry.result.bugReport.length} issues identified • Refactored to {entry.result.refactoredCode.split("\n").length} lines
                </p>

                <div className="flex items-center justify-end gap-1 mt-2 text-[11px] text-cyan-400 group-hover:underline">
                  <span>Load Record</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
