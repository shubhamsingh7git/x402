export const MERCHANT_STATUS = {
  PENDING: "Pending",
  VERIFYING: "Verifying",
  VERIFIED: "Verified",
  SUSPENDED: "Suspended",
  BLOCKED: "Blocked",
  DELETED: "Deleted",
} as const;

export type MerchantStatusType = typeof MERCHANT_STATUS[keyof typeof MERCHANT_STATUS] | "PENDING" | "VERIFYING" | "VERIFIED" | "SUSPENDED" | "BLOCKED" | "DELETED";

export const STATUS_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Pending: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", dot: "bg-amber-400" },
  PENDING: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", dot: "bg-amber-400" },
  Verifying: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30", dot: "bg-cyan-400 animate-pulse" },
  VERIFYING: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30", dot: "bg-cyan-400 animate-pulse" },
  Verified: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", dot: "bg-emerald-400" },
  VERIFIED: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", dot: "bg-emerald-400" },
  Suspended: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30", dot: "bg-orange-400" },
  SUSPENDED: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30", dot: "bg-orange-400" },
  Blocked: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30", dot: "bg-rose-400" },
  BLOCKED: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30", dot: "bg-rose-400" },
  Deleted: { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/30", dot: "bg-slate-400" },
  DELETED: { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/30", dot: "bg-slate-400" },
  SETTLED: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", dot: "bg-emerald-400" },
  COMPLETED: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", dot: "bg-emerald-400" },
  APPROVED: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", dot: "bg-emerald-400" },
  PROCESSING: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", dot: "bg-blue-400 animate-spin" },
  VALIDATING: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30", dot: "bg-purple-400 animate-pulse" },
  FAILED: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30", dot: "bg-rose-400" },
  DENIED: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30", dot: "bg-rose-400" },
};
