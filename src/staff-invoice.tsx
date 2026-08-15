import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

// ── T&Cs ──────────────────────────────────────────────────────────────────
const TERMS = `SHIFT NOTIFICATION
• Notify the agency at least 48 hours in advance if you cannot work a shift.
• SMS, voicemail and messages via friends are NOT acceptable notice.
• Failure to arrive results in immediate blacklisting and forfeiture of payment.
• Fines equal to the monetary value of the missed assignment apply.

PUNCTUALITY
• Arrive 30 minutes before the promotion starts for setup and agency notification.
• Late arrival incurs a 1-hour pay fine.
• A second late arrival leads to blacklisting and forfeiture of owed payments.

COMMUNICATION
• No direct communication with clients or potential clients during promotions.
• All work-related matters must be referred back to the agency.
• Violation may result in booking fee claims and immediate blacklisting.

PROFESSIONAL CONDUCT
• Maintain professionalism as a brand representative at all times.
• Adhere to proper dress code; failure results in a R50 penalty.
• Full liability for any damaged or missing promotional items.

REPORTING & FEEDBACK
• Provide photos as proof of completed promotions.
• Late feedback incurs a R50 penalty per day.

WORK ENVIRONMENT
• Creating a negative work environment results in a R200 fine.
• No smoking, drinking, gum-chewing or phone use during promotions (R100 fine).
• Discussing company matters or bad-mouthing the agency: R300 fine and dismissal.
• Discussing payment with clients or fellow promoters: R200 fine.

BY AGREEING, I CONFIRM:
• My monthly income does not exceed the maximum allowed by SARS for tax deductions.
• I will adhere to all promotion rules and regulations, with penalties at the agency's discretion.`;

// ── Types ─────────────────────────────────────────────────────────────────
interface FormData {
  agreedToTerms: boolean;
  firstName: string; lastName: string; email: string; whatsapp: string;
  bankName: string; accountHolder: string; accountNumber: string;
  branchCode: string; accountType: string;
  whatsappGroup: string;
  jobType: "" | "daily" | "hourly" | "fixed" | "setup";
  dailyRate: string; daysWorked: string; daysOtherValue: string;
  dayHours: string[]; dayRates: string[];
  fixedRate: string; setupRate: string;
  storeList: string; labourTotal: string;
  boughtAnything: "" | "yes" | "no";
  purchaseDetails: string; purchaseAmount: string;
  fuelContribution: "" | "yes" | "no"; fuelAmount: string;
  prepay: "" | "yes" | "no"; prepayAmount: string;
  totalOwed: string;
}

const EMPTY: FormData = {
  agreedToTerms: false,
  firstName: "", lastName: "", email: "", whatsapp: "",
  bankName: "", accountHolder: "", accountNumber: "",
  branchCode: "", accountType: "",
  whatsappGroup: "", jobType: "",
  dailyRate: "", daysWorked: "", daysOtherValue: "",
  dayHours: [], dayRates: [],
  fixedRate: "", setupRate: "",
  storeList: "", labourTotal: "",
  boughtAnything: "", purchaseDetails: "", purchaseAmount: "",
  fuelContribution: "", fuelAmount: "",
  prepay: "", prepayAmount: "",
  totalOwed: "",
};

function parseDayCount(data: FormData): number {
  if (data.daysWorked === "Other") return parseInt(data.daysOtherValue) || 0;
  return parseInt(data.daysWorked) || 0;
}

function calcLabour(data: FormData): string {
  if (data.jobType === "daily") {
    const rate = parseFloat(data.dailyRate);
    const days = parseDayCount(data);
    if (!isNaN(rate) && days > 0) return (rate * days).toFixed(2);
  }
  if (data.jobType === "hourly") {
    let total = 0;
    for (let i = 0; i < parseDayCount(data); i++) {
      const h = parseFloat(data.dayHours[i] || "0");
      const r = parseFloat(data.dayRates[i] || "0");
      if (!isNaN(h) && !isNaN(r)) total += h * r;
    }
    if (total > 0) return total.toFixed(2);
  }
  if (data.jobType === "fixed") {
    const r = parseFloat(data.fixedRate);
    if (!isNaN(r)) return r.toFixed(2);
  }
  if (data.jobType === "setup") {
    const r = parseFloat(data.setupRate);
    if (!isNaN(r)) return r.toFixed(2);
  }
  return "";
}

// ── UI atoms ──────────────────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[var(--color-gold)] text-[10px] uppercase tracking-[0.3em] font-bold mb-6 pb-2 border-b border-white/10">
      {children}
    </h2>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <label className="block text-[11px] uppercase tracking-[0.2em] text-white font-bold mb-2">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-white/40 mt-2 leading-relaxed">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full bg-transparent border-b border-white/20 py-2 text-white text-sm focus:outline-none focus:border-[var(--color-gold)] placeholder:text-white/30 transition-colors";
const selectCls = "w-full bg-black border-b border-white/20 py-2 text-white text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors appearance-none";

function RadioGrid({ options, value, onChange, cols = 3 }: {
  options: string[]; value: string; onChange: (v: string) => void; cols?: number;
}) {
  return (
    <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {options.map(opt => (
        <button
          key={opt} type="button" onClick={() => onChange(opt)}
          className={`border px-3 py-3 text-xs font-bold uppercase tracking-wide transition-all ${
            value === opt
              ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-black"
              : "border-white/20 text-white/70 hover:border-white/50"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function YesNo({ value, onChange }: {
  value: "" | "yes" | "no"; onChange: (v: "yes" | "no") => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {(["yes", "no"] as const).map(opt => (
        <button
          key={opt} type="button" onClick={() => onChange(opt)}
          className={`border py-3 text-xs font-black uppercase tracking-widest transition-all ${
            value === opt
              ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-black"
              : "border-white/20 text-white/70 hover:border-white/50"
          }`}
        >
          {opt.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function StaffInvoicePage() {
  const [data, setData] = useState<FormData>(EMPTY);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function upd(partial: Partial<FormData>) {
    setData(prev => ({ ...prev, ...partial }));
  }
  function updDay(field: "dayHours" | "dayRates", idx: number, val: string) {
    setData(prev => {
      const arr = [...prev[field]];
      arr[idx] = val;
      return { ...prev, [field]: arr };
    });
  }

  const dayCount = parseDayCount(data);

  // Auto-calculate labour + total whenever inputs change
  useEffect(() => {
    const labour = calcLabour(data);
    const labourNum = parseFloat(labour || "0");
    const purchases = data.boughtAnything === "yes" ? parseFloat(data.purchaseAmount || "0") : 0;
    const fuel = data.fuelContribution === "yes" ? parseFloat(data.fuelAmount || "0") : 0;
    const prepaid = data.prepay === "yes" ? parseFloat(data.prepayAmount || "0") : 0;
    const total = labourNum + purchases + fuel - prepaid;
    setData(prev => ({
      ...prev,
      labourTotal: labour,
      totalOwed: labourNum > 0 || purchases > 0 || fuel > 0 ? total.toFixed(2) : "",
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data.jobType, data.dailyRate, data.daysWorked, data.daysOtherValue,
    data.dayHours.join(","), data.dayRates.join(","),
    data.fixedRate, data.setupRate,
    data.boughtAnything, data.purchaseAmount,
    data.fuelContribution, data.fuelAmount,
    data.prepay, data.prepayAmount,
  ]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitStatus("loading");
    const dayBreakdown: Record<string, string> = {};
    for (let i = 0; i < dayCount; i++) {
      dayBreakdown[`Day ${i + 1} Hours`] = data.dayHours[i] || "";
      dayBreakdown[`Day ${i + 1} Rate (ZAR)`] = data.dayRates[i] || "";
    }
    const fields: Record<string, unknown> = {
      "First Name": data.firstName, "Last Name": data.lastName,
      "Email": data.email, "WhatsApp Number": data.whatsapp,
      "Bank Name": data.bankName, "Account Holder": data.accountHolder,
      "Account Number": data.accountNumber, "Branch Code": data.branchCode,
      "Account Type": data.accountType,
      "WhatsApp Group": data.whatsappGroup,
      "Job Type": data.jobType,
      "Daily Rate (ZAR)": data.dailyRate || "",
      "Days Worked": data.daysWorked === "Other" ? data.daysOtherValue : data.daysWorked,
      "Fixed Rate (ZAR)": data.fixedRate || "",
      "Setup Rate (ZAR)": data.setupRate || "",
      ...dayBreakdown,
      "Stores Worked": data.storeList,
      "Labour Total (ZAR)": data.labourTotal,
      "Bought Items": data.boughtAnything,
      "Purchase Details": data.purchaseDetails || "",
      "Purchase Amount (ZAR)": data.purchaseAmount || "",
      "Fuel Contribution": data.fuelContribution,
      "Fuel Amount (ZAR)": data.fuelAmount || "",
      "Pre-Pay Received": data.prepay,
      "Pre-Pay Amount (ZAR)": data.prepayAmount || "",
      "Total Owed (ZAR)": data.totalOwed,
      "Agreed to T&Cs": data.agreedToTerms,
      "Submission Date": new Date().toISOString().split("T")[0],
    };
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Submission failed");
      setSubmitStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitStatus("error");
    }
  }

  // ── Success ───────────────────────────────────────────────────────────
  if (submitStatus === "success") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <CheckCircle className="w-14 h-14 text-[var(--color-gold)] mx-auto mb-6" />
          <h1 className="text-2xl font-black uppercase tracking-widest text-white mb-4">Invoice Submitted</h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Your invoice has been received. Payments are processed every{" "}
            <strong className="text-white">Wednesday</strong> — late submissions carry over to the following week.
          </p>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-8">
            <img src="/logoonly.png" alt="OnCue" className="w-5 h-5 object-contain" style={{ filter: "brightness(0) invert(1)" }} />
            <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xs tracking-widest">
              OnCue <strong>MARKETING</strong>
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Invoice Submission</h1>
          <p className="text-white/50 text-sm">
            Payments are made every <span className="text-white font-bold">Wednesday</span>. Submit as soon as the job is complete.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">

          {/* ── Terms & Conditions ── */}
          <div>
            <SectionHeading>Terms &amp; Conditions</SectionHeading>
            <div className="border border-white/10 h-52 overflow-y-auto p-4 text-xs text-white leading-relaxed whitespace-pre-line font-mono mb-4">
              {TERMS}
            </div>
            <button
              type="button" onClick={() => upd({ agreedToTerms: !data.agreedToTerms })}
              className="flex items-center gap-3 text-left group"
            >
              <div className={`w-5 h-5 flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                data.agreedToTerms ? "border-[var(--color-gold)] bg-[var(--color-gold)]" : "border-white/30"
              }`}>
                {data.agreedToTerms && <span className="text-black text-xs font-black leading-none">✓</span>}
              </div>
              <span className="text-sm text-white">I have read and agree to the Terms &amp; Conditions.</span>
            </button>
          </div>

          {/* ── Personal Details ── */}
          <div>
            <SectionHeading>Personal Details</SectionHeading>
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name">
                <input className={inputCls} value={data.firstName} onChange={e => upd({ firstName: e.target.value })} placeholder="Jane" required />
              </Field>
              <Field label="Last Name">
                <input className={inputCls} value={data.lastName} onChange={e => upd({ lastName: e.target.value })} placeholder="Doe" required />
              </Field>
            </div>
            <Field label="Email Address">
              <input className={inputCls} type="email" value={data.email} onChange={e => upd({ email: e.target.value })} placeholder="you@example.com" required />
            </Field>
            <Field label="WhatsApp Number" hint="Include country code if outside South Africa — e.g. +27821234567">
              <input className={inputCls} value={data.whatsapp} onChange={e => upd({ whatsapp: e.target.value })} placeholder="0821234567" required />
            </Field>
          </div>

          {/* ── Banking Details ── */}
          <div>
            <SectionHeading>Banking Details</SectionHeading>
            <Field label="Bank Name">
              <select className={selectCls} value={data.bankName} onChange={e => upd({ bankName: e.target.value })} required>
                <option value="">Select bank…</option>
                {["FNB","Standard Bank","ABSA","Nedbank","Capitec","TymeBank","Discovery Bank","African Bank","Other"].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </Field>
            <Field label="Account Holder Name" hint="Name exactly as it appears on your bank account">
              <input className={inputCls} value={data.accountHolder} onChange={e => upd({ accountHolder: e.target.value })} placeholder="Full name on account" required />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Account Number">
                <input className={inputCls} value={data.accountNumber} onChange={e => upd({ accountNumber: e.target.value })} placeholder="Account number" required />
              </Field>
              <Field label="Branch Code">
                <input className={inputCls} value={data.branchCode} onChange={e => upd({ branchCode: e.target.value })} placeholder="e.g. 250655" required />
              </Field>
            </div>
            <Field label="Account Type">
              <RadioGrid options={["Cheque / Current", "Savings"]} value={data.accountType} onChange={v => upd({ accountType: v })} cols={2} />
            </Field>
          </div>

          {/* ── Job Details ── */}
          <div>
            <SectionHeading>Job Details</SectionHeading>
            <Field label="WhatsApp Group Name" hint="Insert the WhatsApp group name for this job. If there was no group, write the brand and role — e.g. 'Merc Backup Promoter'">
              <input className={inputCls} value={data.whatsappGroup} onChange={e => upd({ whatsappGroup: e.target.value })} placeholder="e.g. Merc Brand Ambassador Dec" required />
            </Field>
            <Field label="Job Type">
              <RadioGrid
                options={["Daily Rate", "Hourly", "Fixed Rate", "Setup / Breakdown / Delivery"]}
                value={
                  data.jobType === "daily" ? "Daily Rate"
                  : data.jobType === "hourly" ? "Hourly"
                  : data.jobType === "fixed" ? "Fixed Rate"
                  : data.jobType === "setup" ? "Setup / Breakdown / Delivery"
                  : ""
                }
                onChange={v => upd({
                  jobType: v === "Daily Rate" ? "daily" : v === "Hourly" ? "hourly" : v === "Fixed Rate" ? "fixed" : "setup",
                  daysWorked: "", daysOtherValue: "", dayHours: [], dayRates: [],
                })}
                cols={2}
              />
            </Field>

            {/* Daily rate fields */}
            {data.jobType === "daily" && (
              <>
                <Field label="Daily Rate (ZAR)" hint="Numbers only — do not add the Rand symbol">
                  <input className={inputCls} type="number" min="0" step="0.01" value={data.dailyRate} onChange={e => upd({ dailyRate: e.target.value })} placeholder="e.g. 800" />
                </Field>
                <Field label="Total Days Worked">
                  <RadioGrid options={["1 Day","2 Days","3 Days","4 Days","5 Days","6 Days","7 Days","Other"]} value={data.daysWorked} onChange={v => upd({ daysWorked: v, daysOtherValue: "" })} cols={4} />
                  {data.daysWorked === "Other" && (
                    <div className="mt-3">
                      <input className={inputCls} type="number" min="1" value={data.daysOtherValue} onChange={e => upd({ daysOtherValue: e.target.value })} placeholder="Enter number of days" />
                    </div>
                  )}
                </Field>
              </>
            )}

            {/* Hourly fields */}
            {data.jobType === "hourly" && (
              <>
                <Field label="Total Days Worked">
                  <RadioGrid options={["1 Day","2 Days","3 Days","4 Days","5 Days","6 Days","7 Days","Other"]} value={data.daysWorked} onChange={v => upd({ daysWorked: v, daysOtherValue: "", dayHours: [], dayRates: [] })} cols={4} />
                  {data.daysWorked === "Other" && (
                    <div className="mt-3">
                      <input className={inputCls} type="number" min="1" value={data.daysOtherValue} onChange={e => upd({ daysOtherValue: e.target.value })} placeholder="Enter number of days" />
                    </div>
                  )}
                </Field>
                {Array.from({ length: dayCount }, (_, i) => (
                  <div key={i} className="border border-white/10 p-4 mb-4">
                    <p className="text-[var(--color-gold)] text-[10px] uppercase tracking-widest font-bold mb-4">Day {i + 1}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Hours Worked" hint="Use a full stop for part hours — e.g. 4.5">
                        <input className={inputCls} type="number" min="0" step="0.5" value={data.dayHours[i] ?? ""} onChange={e => updDay("dayHours", i, e.target.value)} placeholder="e.g. 8" />
                      </Field>
                      <Field label="Rate Per Hour (ZAR)" hint="Numbers only">
                        <input className={inputCls} type="number" min="0" step="0.01" value={data.dayRates[i] ?? ""} onChange={e => updDay("dayRates", i, e.target.value)} placeholder="e.g. 120" />
                      </Field>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Fixed rate */}
            {data.jobType === "fixed" && (
              <Field label="Fixed Rate for the Job (ZAR)" hint="Numbers only — do not add the Rand symbol">
                <input className={inputCls} type="number" min="0" step="0.01" value={data.fixedRate} onChange={e => upd({ fixedRate: e.target.value })} placeholder="e.g. 1500" />
              </Field>
            )}

            {/* Setup rate */}
            {data.jobType === "setup" && (
              <Field label="Rate Per Setup / Breakdown / Delivery (ZAR)" hint="Insert the rate given per store as per the WhatsApp group (e.g. R300 for 1 store). Numbers only.">
                <input className={inputCls} type="number" min="0" step="0.01" value={data.setupRate} onChange={e => upd({ setupRate: e.target.value })} placeholder="e.g. 300" />
              </Field>
            )}

            {/* Stores worked — shown once job type is selected */}
            {data.jobType && (
              <Field label="Stores / Venues Worked" hint="Brand name and mall — e.g. 'Vodacom Fourways Mall'. Add (return) if you revisited a store.">
                <textarea
                  className={`${inputCls} resize-none`} rows={4}
                  value={data.storeList} onChange={e => upd({ storeList: e.target.value })}
                  placeholder={"e.g.\nVodacom Fourways Mall\nSamsung Sandton City (return)"}
                />
              </Field>
            )}
          </div>

          {/* ── Expenses ── */}
          {data.jobType && (
            <div>
              <SectionHeading>Expenses &amp; Deductions</SectionHeading>

              <Field label="Did You Have to Buy Anything for This Job?" hint="e.g. bubblewrap, tape, flowers, food (lunch drop)">
                <YesNo value={data.boughtAnything} onChange={v => upd({ boughtAnything: v })} />
              </Field>
              {data.boughtAnything === "yes" && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="What Did You Buy?">
                    <input className={inputCls} value={data.purchaseDetails} onChange={e => upd({ purchaseDetails: e.target.value })} placeholder="Describe the items" />
                  </Field>
                  <Field label="Total Spent (ZAR)" hint="Numbers only">
                    <input className={inputCls} type="number" min="0" step="0.01" value={data.purchaseAmount} onChange={e => upd({ purchaseAmount: e.target.value })} placeholder="e.g. 85" />
                  </Field>
                </div>
              )}

              <Field label="Did This Job Include a Fuel Contribution?" hint="Did the brief mention being paid per km?">
                <YesNo value={data.fuelContribution} onChange={v => upd({ fuelContribution: v })} />
              </Field>
              {data.fuelContribution === "yes" && (
                <Field label="Fuel / Km Amount (ZAR)" hint="Numbers only">
                  <input className={inputCls} type="number" min="0" step="0.01" value={data.fuelAmount} onChange={e => upd({ fuelAmount: e.target.value })} placeholder="e.g. 150" />
                </Field>
              )}

              <Field label="Did the Agency Pre-Pay You Any Money?" hint="Any money received upfront to purchase items for this job">
                <YesNo value={data.prepay} onChange={v => upd({ prepay: v })} />
              </Field>
              {data.prepay === "yes" && (
                <Field label="Pre-Pay Amount (ZAR)" hint="This will be deducted from your total. Numbers only.">
                  <input className={inputCls} type="number" min="0" step="0.01" value={data.prepayAmount} onChange={e => upd({ prepayAmount: e.target.value })} placeholder="e.g. 200" />
                </Field>
              )}
            </div>
          )}

          {/* ── Totals (auto-calculated, read-only) ── */}
          {data.jobType && (
            <div>
              <SectionHeading>Invoice Summary</SectionHeading>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Labour Total (ZAR)" hint="Auto-calculated — edit if needed">
                  <input className={inputCls} type="number" min="0" step="0.01" value={data.labourTotal} onChange={e => upd({ labourTotal: e.target.value })} placeholder="0.00" />
                </Field>
                <Field label="Total Owed (ZAR)" hint="Auto-calculated — edit if needed">
                  <input className={`${inputCls} font-bold text-[var(--color-gold)]`} type="number" min="0" step="0.01" value={data.totalOwed} onChange={e => upd({ totalOwed: e.target.value })} placeholder="0.00" />
                </Field>
              </div>
            </div>
          )}

          {/* ── Submit ── */}
          {submitStatus === "error" && (
            <p className="text-red-400 text-sm">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={!data.agreedToTerms || submitStatus === "loading"}
            className="w-full bg-[var(--color-gold)] text-black py-4 font-black uppercase tracking-widest text-sm hover:bg-white transition disabled:opacity-40 flex items-center justify-center gap-3"
          >
            {submitStatus === "loading" && (
              <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
            )}
            Submit Invoice
          </button>
          {!data.agreedToTerms && (
            <p className="text-white/30 text-xs text-center -mt-4">You must agree to the Terms &amp; Conditions before submitting.</p>
          )}

        </form>
      </div>
    </div>
  );
}
