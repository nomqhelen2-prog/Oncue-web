import { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

// Submissions go to /api/submit (serverless function) — no keys in the browser

// ── T&Cs ──────────────────────────────────────────────────────────────────
const TERMS = `SHIFT NOTIFICATION
• Notify the agency at least 48 hours in advance if you cannot work a shift.
• SMS, voicemail, and messages via friends are NOT acceptable notice.
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
• No smoking, drinking, gum-chewing, or phone use during promotions (R100 fine).
• Discussing company matters or bad-mouthing the agency: R300 fine and dismissal.
• Discussing payment with clients or fellow promoters: R200 fine.

BY AGREEING, I CONFIRM:
• My monthly income does not exceed the maximum allowed by SARS for tax deductions.
• I will adhere to all promotion rules and regulations, with penalties at the agency's discretion.`;

// ── Types ─────────────────────────────────────────────────────────────────
interface FormData {
  agreedToTerms: boolean;
  // Personal
  firstName: string; lastName: string; email: string; whatsapp: string;
  // Banking
  bankName: string; accountHolder: string; accountNumber: string;
  branchCode: string; accountType: string;
  // Job
  whatsappGroup: string;
  jobType: "" | "daily" | "hourly" | "fixed" | "setup";
  // Daily / days
  dailyRate: string; daysWorked: string; daysOtherValue: string;
  // Hourly: per-day arrays
  dayHours: string[]; dayRates: string[];
  // Fixed
  fixedRate: string;
  // Setup
  setupRate: string;
  // Common closing
  storeList: string;
  labourTotal: string;
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

// ── Step order (computed from current data) ───────────────────────────────
function parseDayCount(data: FormData): number {
  if (data.daysWorked === "Other") return parseInt(data.daysOtherValue) || 0;
  return parseInt(data.daysWorked) || 0;
}

function computeSteps(data: FormData): string[] {
  const s = ["welcome", "terms",
    "firstName", "lastName", "email", "whatsapp",
    "bankName", "accountHolder", "accountNumbers", "accountType",
    "whatsappGroup", "jobType",
  ];

  if (data.jobType === "daily") {
    s.push("dailyRate", "daysWorked");
    if (data.daysWorked === "Other") s.push("daysOther");
  }
  if (data.jobType === "hourly") {
    s.push("daysWorked");
    if (data.daysWorked === "Other") s.push("daysOther");
    const n = parseDayCount(data);
    for (let i = 1; i <= n; i++) s.push(`day${i}Hours`, `day${i}Rate`);
  }
  if (data.jobType === "fixed") s.push("fixedRate");
  if (data.jobType === "setup") s.push("setupRate");

  if (data.jobType) {
    s.push("storeList", "labourTotal", "boughtAnything");
    if (data.boughtAnything === "yes") s.push("purchaseDetails");
    s.push("fuelContribution");
    if (data.fuelContribution === "yes") s.push("fuelDetails");
    s.push("prepay");
    if (data.prepay === "yes") s.push("prepayAmount");
    s.push("totalOwed");
  }
  return s;
}

// ── Auto-calculate labour total ───────────────────────────────────────────
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
function StepLayout({ title, subtitle, children }: {
  title: string; subtitle?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[340px] text-center px-2">
      <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-3 leading-tight max-w-lg">
        {title}
      </h2>
      {subtitle && (
        <p className="text-white/50 text-[13px] leading-relaxed mb-8 max-w-md">{subtitle}</p>
      )}
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

function LineInput({ value, onChange, placeholder, type = "text", hint }: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; hint?: string;
}) {
  return (
    <div>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-b-2 border-white/20 pb-3 text-white text-lg text-center focus:outline-none focus:border-[var(--color-gold)] placeholder:text-white/25 transition-colors"
      />
      {hint && <p className="text-[11px] text-white/35 mt-3 text-left leading-relaxed">{hint}</p>}
    </div>
  );
}

function NumberInput({ value, onChange, placeholder, hint }: {
  value: string; onChange: (v: string) => void; placeholder?: string; hint?: string;
}) {
  return (
    <div>
      <input
        type="number" value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? "e.g., 0"}
        step="0.01" min="0"
        className="w-full bg-transparent border-b-2 border-white/20 pb-3 text-white text-lg text-center focus:outline-none focus:border-[var(--color-gold)] placeholder:text-white/25 transition-colors"
      />
      {hint && <p className="text-[11px] text-white/35 mt-3 text-left leading-relaxed">{hint}</p>}
    </div>
  );
}

function RadioGrid({ options, value, onChange }: {
  options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {options.map(opt => (
        <button
          key={opt} type="button" onClick={() => onChange(opt)}
          className={`border px-4 py-4 text-sm font-bold uppercase tracking-wide transition-all flex items-center gap-3 ${
            value === opt
              ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-black"
              : "border-white/20 text-white/70 hover:border-white/50 hover:text-white"
          }`}
        >
          <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
            value === opt ? "border-black" : "border-white/40"
          }`}>
            {value === opt && <span className="w-2 h-2 rounded-full bg-black block" />}
          </span>
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
    <div className="grid grid-cols-2 gap-4">
      {(["yes", "no"] as const).map(opt => (
        <button
          key={opt} type="button" onClick={() => onChange(opt)}
          className={`border py-5 text-sm font-black uppercase tracking-widest transition-all ${
            value === opt
              ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-black"
              : "border-white/20 text-white/70 hover:border-white/50 hover:text-white"
          }`}
        >
          {opt.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function SelectInput({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <select
      value={value} onChange={e => onChange(e.target.value)}
      className="w-full bg-transparent border-b-2 border-white/20 pb-3 text-white text-sm text-center focus:outline-none focus:border-[var(--color-gold)] appearance-none transition-colors"
    >
      <option value="" className="bg-black">Select…</option>
      {options.map(o => <option key={o} value={o} className="bg-black">{o}</option>)}
    </select>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function StaffInvoicePage() {
  const [data, setData] = useState<FormData>(EMPTY);
  const [stepIndex, setStepIndex] = useState(0);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const steps = useMemo(() => computeSteps(data), [data]);
  const stepId = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const isFirst = stepIndex === 0;
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);

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

  function canAdvance(): boolean {
    switch (stepId) {
      case "welcome":      return true;
      case "terms":        return data.agreedToTerms;
      case "firstName":    return !!data.firstName.trim();
      case "lastName":     return !!data.lastName.trim();
      case "email":        return !!data.email.trim();
      case "whatsapp":     return !!data.whatsapp.trim();
      case "bankName":     return !!data.bankName;
      case "accountHolder":return !!data.accountHolder.trim();
      case "accountNumbers":return !!data.accountNumber.trim() && !!data.branchCode.trim();
      case "accountType":  return !!data.accountType;
      case "whatsappGroup":return !!data.whatsappGroup.trim();
      case "jobType":      return !!data.jobType;
      case "dailyRate":    return !!data.dailyRate;
      case "daysWorked":   return !!data.daysWorked;
      case "daysOther":    return !!data.daysOtherValue && parseInt(data.daysOtherValue) > 0;
      case "fixedRate":    return !!data.fixedRate;
      case "setupRate":    return !!data.setupRate;
      case "storeList":    return !!data.storeList.trim();
      case "labourTotal":  return !!data.labourTotal;
      case "boughtAnything": return !!data.boughtAnything;
      case "purchaseDetails": return !!data.purchaseDetails.trim() && !!data.purchaseAmount;
      case "fuelContribution": return !!data.fuelContribution;
      case "fuelDetails":  return !!data.fuelAmount;
      case "prepay":       return !!data.prepay;
      case "prepayAmount": return !!data.prepayAmount;
      case "totalOwed":    return !!data.totalOwed;
      default: {
        // Dynamic day steps
        if (/^day(\d+)Hours$/.test(stepId)) {
          const i = parseInt(stepId.match(/\d+/)![0]) - 1;
          return !!(data.dayHours[i]?.trim());
        }
        if (/^day(\d+)Rate$/.test(stepId)) {
          const i = parseInt(stepId.match(/\d+/)![0]) - 1;
          return !!(data.dayRates[i]?.trim());
        }
        return true;
      }
    }
  }

  function handleNext() {
    if (!canAdvance()) return;
    // Auto-compute labour when reaching that step
    if (steps[stepIndex + 1] === "labourTotal") {
      const calc = calcLabour(data);
      if (calc) upd({ labourTotal: calc });
    }
    // Auto-compute total owed when reaching final step
    if (steps[stepIndex + 1] === "totalOwed") {
      const labour = parseFloat(data.labourTotal || "0");
      const purchases = data.boughtAnything === "yes" ? parseFloat(data.purchaseAmount || "0") : 0;
      const fuel = data.fuelContribution === "yes" ? parseFloat(data.fuelAmount || "0") : 0;
      const prepaid = data.prepay === "yes" ? parseFloat(data.prepayAmount || "0") : 0;
      const total = labour + purchases + fuel - prepaid;
      upd({ totalOwed: total > 0 ? total.toFixed(2) : "" });
    }
    setStepIndex(i => i + 1);
  }

  function handlePrev() {
    setStepIndex(i => Math.max(0, i - 1));
  }

  async function handleSubmit() {
    setSubmitStatus("loading");
    const dayCount = parseDayCount(data);
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
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Submission failed");
      setSubmitStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitStatus("error");
    }
  }

  // ── Success screen ────────────────────────────────────────────────────
  if (submitStatus === "success") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <CheckCircle className="w-14 h-14 text-[var(--color-gold)] mx-auto mb-6" />
          <h1 className="text-2xl font-black uppercase tracking-widest text-white mb-4">Invoice Submitted</h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Your invoice has been received. Payments are processed every <strong className="text-white">Wednesday</strong> —
            late submissions will be carried over to the following week.
          </p>
        </div>
      </div>
    );
  }

  // ── Step renderer ─────────────────────────────────────────────────────
  function renderStep() {
    const dayMatch = stepId.match(/^day(\d+)(Hours|Rate)$/);
    if (dayMatch) {
      const dayNum = parseInt(dayMatch[1]);
      const idx = dayNum - 1;
      const isHours = dayMatch[2] === "Hours";
      return isHours ? (
        <StepLayout
          title={`Day ${dayNum} — Total Hours Worked`}
          subtitle={<>If you worked part hours (e.g. 4.5 hrs) please use a <strong className="text-white">full stop</strong>, not a comma.</>}
        >
          <NumberInput
            value={data.dayHours[idx] ?? ""}
            onChange={v => updDay("dayHours", idx, v)}
            placeholder="e.g., 8"
          />
        </StepLayout>
      ) : (
        <StepLayout
          title={`Day ${dayNum} — Rate Per Hour (ZAR)`}
          subtitle={<>Please <strong className="text-white">DO NOT</strong> insert the Rand symbol — numbers only.</>}
        >
          <NumberInput
            value={data.dayRates[idx] ?? ""}
            onChange={v => updDay("dayRates", idx, v)}
            placeholder="e.g., 120"
          />
        </StepLayout>
      );
    }

    switch (stepId) {
      case "welcome": return (
        <StepLayout title="Invoice Submission">
          <div className="text-left space-y-3 text-[13px] text-white/60 leading-relaxed border border-white/10 p-5">
            <p><span className="text-white font-bold">Payments are made every Wednesday.</span> Late invoices carry over to the following week — please submit as soon as the job is complete.</p>
            <p>The form asks <span className="text-white">different questions based on your job type</span> — read each screen carefully before answering.</p>
            <p>Give <span className="text-white">as much detail as possible</span> so we know exactly what your invoice is for.</p>
          </div>
        </StepLayout>
      );

      case "terms": return (
        <StepLayout title="Terms & Conditions" subtitle="Read and agree before continuing.">
          <div className="border border-white/10 h-52 overflow-y-auto p-4 text-[11px] text-white/40 leading-relaxed text-left whitespace-pre-line font-mono mb-5">
            {TERMS}
          </div>
          <button
            type="button" onClick={() => upd({ agreedToTerms: !data.agreedToTerms })}
            className="flex items-center gap-3 w-full text-left group"
          >
            <div className={`w-5 h-5 flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
              data.agreedToTerms ? "border-[var(--color-gold)] bg-[var(--color-gold)]" : "border-white/30"
            }`}>
              {data.agreedToTerms && <span className="text-black text-xs font-black leading-none">✓</span>}
            </div>
            <span className="text-sm text-white/70">I have read and agree to the Terms &amp; Conditions.</span>
          </button>
        </StepLayout>
      );

      case "firstName": return (
        <StepLayout title="First Name">
          <LineInput value={data.firstName} onChange={v => upd({ firstName: v })} placeholder="Enter your first name" />
        </StepLayout>
      );
      case "lastName": return (
        <StepLayout title="Last Name">
          <LineInput value={data.lastName} onChange={v => upd({ lastName: v })} placeholder="Enter your last name" />
        </StepLayout>
      );
      case "email": return (
        <StepLayout title="Email Address">
          <LineInput value={data.email} onChange={v => upd({ email: v })} placeholder="you@example.com" type="email" />
        </StepLayout>
      );
      case "whatsapp": return (
        <StepLayout title="WhatsApp Number">
          <LineInput value={data.whatsapp} onChange={v => upd({ whatsapp: v })} placeholder="e.g. 0821234567"
            hint="Include country code if outside South Africa (e.g. +27821234567)" />
        </StepLayout>
      );

      case "bankName": return (
        <StepLayout title="Bank Name">
          <SelectInput value={data.bankName} onChange={v => upd({ bankName: v })}
            options={["FNB","Standard Bank","ABSA","Nedbank","Capitec","TymeBank","Discovery Bank","African Bank","Other"]} />
        </StepLayout>
      );
      case "accountHolder": return (
        <StepLayout title="Account Holder Name" subtitle="Name exactly as it appears on your bank account.">
          <LineInput value={data.accountHolder} onChange={v => upd({ accountHolder: v })} placeholder="Account holder name" />
        </StepLayout>
      );
      case "accountNumbers": return (
        <StepLayout title="Account Number & Branch Code">
          <div className="space-y-6">
            <LineInput value={data.accountNumber} onChange={v => upd({ accountNumber: v })} placeholder="Account number" />
            <LineInput value={data.branchCode} onChange={v => upd({ branchCode: v })} placeholder="Branch code (e.g. 250655)" />
          </div>
        </StepLayout>
      );
      case "accountType": return (
        <StepLayout title="Account Type">
          <RadioGrid
            options={["Cheque / Current", "Savings"]}
            value={data.accountType} onChange={v => upd({ accountType: v })}
          />
        </StepLayout>
      );

      case "whatsappGroup": return (
        <StepLayout
          title="WhatsApp Group Name"
          subtitle="Insert the WhatsApp group name for this job. If you were not added to a group, specify the brand and position — e.g. 'Merc Backup Promoter'."
        >
          <LineInput value={data.whatsappGroup} onChange={v => upd({ whatsappGroup: v })}
            placeholder="e.g. Merc Brand Ambassador Dec" />
        </StepLayout>
      );

      case "jobType": return (
        <StepLayout title="What type of job was this?">
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
              jobType: v === "Daily Rate" ? "daily"
                : v === "Hourly" ? "hourly"
                : v === "Fixed Rate" ? "fixed"
                : "setup",
              daysWorked: "", daysOtherValue: "",
              dayHours: [], dayRates: [],
            })}
          />
        </StepLayout>
      );

      case "dailyRate": return (
        <StepLayout
          title="Daily Rate in ZAR"
          subtitle={<>Please <strong className="text-white">DO NOT</strong> insert the Rand symbol — numbers only.</>}
        >
          <NumberInput value={data.dailyRate} onChange={v => upd({ dailyRate: v })} placeholder="e.g., 800" />
        </StepLayout>
      );

      case "daysWorked": return (
        <StepLayout title="Total Amount of Days Worked">
          <RadioGrid
            options={["1 Day","2 Days","3 Days","4 Days","5 Days","6 Days","7 Days","Other"]}
            value={data.daysWorked} onChange={v => upd({ daysWorked: v, daysOtherValue: "" })}
          />
        </StepLayout>
      );

      case "daysOther": return (
        <StepLayout title="How many days did you work?">
          <NumberInput value={data.daysOtherValue} onChange={v => upd({ daysOtherValue: v })} placeholder="e.g., 10" />
        </StepLayout>
      );

      case "fixedRate": return (
        <StepLayout
          title="Fixed Rate for the Job (ZAR)"
          subtitle={<>Please <strong className="text-white">DO NOT</strong> insert the Rand symbol — numbers only.</>}
        >
          <NumberInput value={data.fixedRate} onChange={v => upd({ fixedRate: v })} placeholder="e.g., 1500" />
        </StepLayout>
      );

      case "setupRate": return (
        <StepLayout
          title="Rate Per Setup / Breakdown / Delivery (ZAR)"
          subtitle={<>Insert the rate given per store. <strong className="text-white">DO NOT</strong> insert the Rand symbol. This is as per the rate given in the WhatsApp group (e.g. R300 for 1 store, R250 for more than 1 store).</>}
        >
          <NumberInput value={data.setupRate} onChange={v => upd({ setupRate: v })} placeholder="e.g., 300" />
        </StepLayout>
      );

      case "storeList": return (
        <StepLayout
          title="List the Stores You Worked"
          subtitle="Brand name and mall — e.g. 'Vodacom Fourways Mall'. If you returned to a store, add (return) after the store name."
        >
          <textarea
            value={data.storeList} onChange={e => upd({ storeList: e.target.value })}
            rows={4} placeholder="e.g.&#10;Vodacom Fourways Mall&#10;Samsung Sandton City (return)"
            className="w-full bg-transparent border-b-2 border-white/20 pb-2 text-white text-sm text-left focus:outline-none focus:border-[var(--color-gold)] placeholder:text-white/25 resize-none transition-colors"
          />
        </StepLayout>
      );

      case "labourTotal": return (
        <StepLayout title="Total Labour Owed to You (ZAR)"
          subtitle="This has been calculated from your entries. Correct it if needed.">
          <NumberInput value={data.labourTotal} onChange={v => upd({ labourTotal: v })} />
        </StepLayout>
      );

      case "boughtAnything": return (
        <StepLayout
          title="Did You Have to Buy Anything for This Job?"
          subtitle="e.g. Bubblewrap, box, tape, plugs, flowers, sweets, food (lunch drop)"
        >
          <YesNo value={data.boughtAnything} onChange={v => upd({ boughtAnything: v })} />
        </StepLayout>
      );

      case "purchaseDetails": return (
        <StepLayout title="What Did You Buy & How Much?">
          <div className="space-y-6">
            <LineInput value={data.purchaseDetails} onChange={v => upd({ purchaseDetails: v })}
              placeholder="Describe what you purchased" />
            <NumberInput value={data.purchaseAmount} onChange={v => upd({ purchaseAmount: v })}
              placeholder="Total amount spent (ZAR)"
              hint="DO NOT insert the Rand symbol — numbers only." />
          </div>
        </StepLayout>
      );

      case "fuelContribution": return (
        <StepLayout
          title="Did This Job Include a Fuel Contribution?"
          subtitle="Did the brief say anything about being paid per km for this job?"
        >
          <YesNo value={data.fuelContribution} onChange={v => upd({ fuelContribution: v })} />
        </StepLayout>
      );

      case "fuelDetails": return (
        <StepLayout title="Fuel Contribution Amount (ZAR)"
          subtitle="Enter the total fuel/km amount owed to you. DO NOT insert the Rand symbol.">
          <NumberInput value={data.fuelAmount} onChange={v => upd({ fuelAmount: v })} placeholder="e.g., 150" />
        </StepLayout>
      );

      case "prepay": return (
        <StepLayout
          title="Did the Agency Pre-Pay You Any Money?"
          subtitle="Did you receive any money upfront to purchase anything for this job?"
        >
          <YesNo value={data.prepay} onChange={v => upd({ prepay: v })} />
        </StepLayout>
      );

      case "prepayAmount": return (
        <StepLayout title="How Much Were You Pre-Paid? (ZAR)"
          subtitle="This will be deducted from your total owed. DO NOT insert the Rand symbol.">
          <NumberInput value={data.prepayAmount} onChange={v => upd({ prepayAmount: v })} placeholder="e.g., 200" />
        </StepLayout>
      );

      case "totalOwed": return (
        <StepLayout title="Total Rand Value Owed to You"
          subtitle="This has been calculated from all your entries. Correct it if needed.">
          <NumberInput value={data.totalOwed} onChange={v => upd({ totalOwed: v })} />
        </StepLayout>
      );

      default: return <StepLayout title="Unknown step" />;
    }
  }

  const ok = canAdvance();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* ── Progress bar ── */}
      <div className="h-1 bg-white/10 w-full">
        <div
          className="h-1 bg-[var(--color-gold)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Step counter ── */}
      <div className="text-center pt-5 pb-1">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
          Step {stepIndex + 1} of {steps.length}
        </p>
      </div>

      {/* ── Step content ── */}
      <div className="flex-1 flex items-center justify-center px-5 py-8">
        {renderStep()}
      </div>

      {/* ── Error message ── */}
      {submitStatus === "error" && (
        <p className="text-red-400 text-sm text-center px-6 pb-4">{errorMsg}</p>
      )}

      {/* ── Navigation ── */}
      <div className="grid grid-cols-2 border-t border-white/10">
        <button
          type="button" onClick={handlePrev} disabled={isFirst}
          className="flex items-center justify-center gap-3 py-5 text-xs font-black uppercase tracking-widest text-white/60 hover:text-white disabled:opacity-20 transition border-r border-white/10"
        >
          <ArrowLeft size={16} /> Previous
        </button>

        {isLast ? (
          <button
            type="button" onClick={handleSubmit}
            disabled={!ok || submitStatus === "loading"}
            className={`flex items-center justify-center gap-3 py-5 text-xs font-black uppercase tracking-widest transition ${
              ok ? "bg-[var(--color-gold)] text-black hover:bg-white" : "text-white/30"
            }`}
          >
            {submitStatus === "loading" ? (
              <><span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" /> Submitting…</>
            ) : <>Submit <ArrowRight size={16} /></>}
          </button>
        ) : (
          <button
            type="button" onClick={handleNext} disabled={!ok}
            className={`flex items-center justify-center gap-3 py-5 text-xs font-black uppercase tracking-widest transition ${
              ok ? "text-white hover:text-[var(--color-gold)]" : "text-white/25 cursor-not-allowed"
            }`}
          >
            Next <ArrowRight size={16} />
          </button>
        )}
      </div>

    </div>
  );
}
