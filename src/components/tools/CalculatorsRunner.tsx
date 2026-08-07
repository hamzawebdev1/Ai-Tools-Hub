import React, { useState, useEffect } from "react";
import {
  Calculator,
  DollarSign,
  HeartPulse,
  Percent,
  Calendar,
  Zap,
  Copy,
  Download,
  Check,
  RefreshCw,
  Scale,
  Sparkles,
  HelpCircle,
  Share2,
  Bookmark,
  AlertCircle,
  Palette,
  Clock,
  Binary,
  Maximize2,
  Info,
} from "lucide-react";
import { saveHistoryItem } from "../../services/storageService";
import { useAuth } from "../../context/AuthContext";
import { canGuestExecute, incrementGuestUsage } from "../../services/guestUsageService";
import { GuestLimitModal } from "../auth/GuestLimitModal";
import * as CalcEngine from "../../services/calculatorEngine";
import * as ConvEngine from "../../services/converterEngine";

interface CalculatorsRunnerProps {
  toolId: string;
  toolName: string;
  toolSlug: string;
}

export const CalculatorsRunner: React.FC<CalculatorsRunnerProps> = ({
  toolId,
  toolName,
  toolSlug,
}) => {
  const { currentUser } = useAuth();
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);

  // Form State
  const [val1, setVal1] = useState<number | string>(100);
  const [val2, setVal2] = useState<number | string>(15);
  const [val3, setVal3] = useState<number | string>(5);
  const [val4, setVal4] = useState<number | string>(12);
  const [textInput, setTextInput] = useState("1, 2, 3, 4, 5, 10, 15, 20");
  const [unitCategory, setUnitCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("foot");
  const [hexColor1, setHexColor1] = useState("#4F46E5");
  const [hexColor2, setHexColor2] = useState("#F8FAFC");
  const [precision, setPrecision] = useState(2);

  // Result State
  const [resultTitle, setResultTitle] = useState("Calculation Output");
  const [formattedResult, setFormattedResult] = useState("");
  const [formulaText, setFormulaText] = useState("");
  const [explanationText, setExplanationText] = useState("");
  const [stepsList, setStepsList] = useState<string[]>([]);
  const [breakdownList, setBreakdownList] = useState<{ label: string; value: string }[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Default value initializations based on toolId
  useEffect(() => {
    initDefaultValues();
  }, [toolId]);

  const initDefaultValues = () => {
    setErrorMessage(null);
    if (toolId.includes("age") || toolId.includes("date-difference") || toolId.includes("date")) {
      setVal1("1995-06-15");
      setVal2("2026-08-07");
    } else if (toolId.includes("bmi") || toolId.includes("body-fat")) {
      setVal1(175); // cm
      setVal2(70);  // kg
      setVal3(30);  // age
    } else if (toolId.includes("loan") || toolId.includes("emi") || toolId.includes("mortgage") || toolId.includes("interest")) {
      setVal1(250000); // principal
      setVal2(6.5);    // rate %
      setVal3(30);     // years
    } else if (toolId.includes("color") || toolId.includes("gradient") || toolId.includes("hex") || toolId.includes("rgb")) {
      setHexColor1("#4F46E5");
      setHexColor2("#06B6D4");
    } else if (toolId.includes("converter") || toolId.includes("bits") || toolId.includes("bytes")) {
      setVal1(100);
      setupConverterCategory();
    } else {
      setVal1(100);
      setVal2(15);
    }
  };

  const setupConverterCategory = () => {
    if (toolId.includes("length") || toolId.includes("distance")) {
      setUnitCategory("length"); setFromUnit("kilometer"); setToUnit("mile");
    } else if (toolId.includes("weight") || toolId.includes("mass")) {
      setUnitCategory("weight"); setFromUnit("kilogram"); setToUnit("pound");
    } else if (toolId.includes("area")) {
      setUnitCategory("area"); setFromUnit("square_meter"); setToUnit("square_foot");
    } else if (toolId.includes("volume") || toolId.includes("cooking")) {
      setUnitCategory("volume"); setFromUnit("liter"); setToUnit("gallon_us");
    } else if (toolId.includes("temperature")) {
      setUnitCategory("temperature"); setFromUnit("celsius"); setToUnit("fahrenheit");
    } else if (toolId.includes("speed")) {
      setUnitCategory("speed"); setFromUnit("kph"); setToUnit("mph");
    } else if (toolId.includes("time")) {
      setUnitCategory("time"); setFromUnit("hour"); setToUnit("minute");
    } else if (toolId.includes("pressure")) {
      setUnitCategory("pressure"); setFromUnit("bar"); setToUnit("psi");
    } else if (toolId.includes("energy")) {
      setUnitCategory("energy"); setFromUnit("kilojoule"); setToUnit("kilocalorie");
    } else if (toolId.includes("data-storage") || toolId.includes("bits") || toolId.includes("bytes")) {
      setUnitCategory("data_storage"); setFromUnit("gigabyte"); setToUnit("megabyte");
    } else if (toolId.includes("digital-bandwidth")) {
      setUnitCategory("digital_bandwidth"); setFromUnit("mbps"); setToUnit("mbytes_sec");
    }
  };

  useEffect(() => {
    executeCalculation();
  }, [val1, val2, val3, val4, textInput, unitCategory, fromUnit, toUnit, hexColor1, hexColor2, precision, toolId]);

  const executeCalculation = () => {
    setErrorMessage(null);
    try {
      // 1. MATH & BASIC CALCULATORS
      if (toolId.includes("percentage-increase") || toolId.includes("percentage-decrease")) {
        const res = CalcEngine.calculatePercentageChange(Number(val1), Number(val2));
        applyResult(res);
      } else if (toolId.includes("percentage")) {
        const res = CalcEngine.calculatePercentage(Number(val1), Number(val2));
        applyResult(res);
      } else if (toolId.includes("fraction-calculator")) {
        const res = CalcEngine.calculateFraction(Number(val1), Number(val2), Number(val3), Number(val4), "+");
        applyResult(res);
      } else if (toolId.includes("decimal-to-fraction")) {
        const dec = Number(val1);
        const den = 10000;
        const num = Math.round(dec * den);
        const res = CalcEngine.calculateFraction(num, den, 0, 1, "+");
        applyResult(res);
      } else if (toolId.includes("average") || toolId.includes("mean") || toolId.includes("standard-deviation") || toolId.includes("variance") || toolId.includes("range")) {
        const nums = textInput.split(/[,; \n]+/).map(Number).filter((n) => !isNaN(n));
        const res = CalcEngine.calculateStatistics(nums);
        applyResult(res);
      } else if (toolId.includes("prime-number")) {
        const n = Math.abs(Number(val1));
        const primeRes = CalcEngine.isPrimeNumber(n);
        applyRawResult(
          `Prime Number Test`,
          `${n} is ${primeRes.isPrime ? "PRIME ✅" : "COMPOSITE ❌"}`,
          `Factors: ${primeRes.factors.join(", ")}`,
          `Tested divisibility for ${n}.`,
          [`Tested integer divisors up to ${Math.floor(Math.sqrt(n))}`],
          [
            { label: "Target Integer", value: `${n}` },
            { label: "Is Prime", value: primeRes.isPrime ? "Yes" : "No" },
            { label: "Total Divisors", value: `${primeRes.factors.length}` },
          ]
        );
      } else if (toolId.includes("gcd") || toolId.includes("lcm")) {
        const a = Number(val1);
        const b = Number(val2);
        const gcdVal = CalcEngine.gcd(a, b);
        const lcmVal = CalcEngine.lcm(a, b);
        applyRawResult(
          `GCD & LCM Analysis`,
          `GCD: ${gcdVal} | LCM: ${lcmVal}`,
          `GCD(a, b) × LCM(a, b) = a × b`,
          `Calculated greatest common divisor and least common multiple for ${a} and ${b}.`,
          [`Step 1: Euclidean algorithm GCD(${a}, ${b}) = ${gcdVal}`, `Step 2: LCM = (|${a} × ${b}|) / ${gcdVal} = ${lcmVal}`],
          [
            { label: "Number A", value: `${a}` },
            { label: "Number B", value: `${b}` },
            { label: "GCD / HCF", value: `${gcdVal}` },
            { label: "LCM", value: `${lcmVal}` },
          ]
        );
      } else if (toolId.includes("factorial")) {
        let n = Math.min(100, Math.max(0, Math.floor(Number(val1))));
        let fact = 1n;
        for (let i = 2; i <= n; i++) fact *= BigInt(i);
        applyRawResult(
          `Factorial Calculation (${n}!)`,
          `${fact.toString().length > 15 ? fact.toString().slice(0, 10) + "..." : fact.toString()}`,
          `n! = 1 × 2 × ... × n`,
          `Exact BigInt factorial computation.`,
          [`Computed integer product up to ${n}`],
          [
            { label: "Number (n)", value: `${n}` },
            { label: "Total Digits", value: `${fact.toString().length}` },
            { label: "Exact Factorial", value: fact.toString() },
          ]
        );
      }

      // 2. FINANCIAL CALCULATORS
      else if (toolId.includes("emi") || toolId.includes("loan") || toolId.includes("mortgage") || toolId.includes("auto-loan")) {
        const res = CalcEngine.calculateEMI(Number(val1), Number(val2), Number(val3));
        applyResult(res);
      } else if (toolId.includes("compound-interest") || toolId.includes("savings") || toolId.includes("investment")) {
        const res = CalcEngine.calculateCompoundInterest(Number(val1), Number(val2), Number(val3));
        applyResult(res);
      } else if (toolId.includes("simple-interest")) {
        const p = Number(val1);
        const r = Number(val2);
        const t = Number(val3);
        const interest = (p * r * t) / 100;
        applyRawResult(
          `Simple Interest`,
          `Interest: $${interest.toFixed(2)} | Total: $${(p + interest).toFixed(2)}`,
          `I = (P × R × T) / 100`,
          `Simple interest accumulation without compounding.`,
          [`Multiply ${p} × ${r}% × ${t} years = $${interest.toFixed(2)}`],
          [
            { label: "Principal", value: `$${p}` },
            { label: "Interest Earned", value: `$${interest.toFixed(2)}` },
            { label: "Total Maturity Value", value: `$${(p + interest).toFixed(2)}` },
          ]
        );
      } else if (toolId.includes("profit") || toolId.includes("markup") || toolId.includes("roi") || toolId.includes("break-even")) {
        const res = CalcEngine.calculateProfitAndMargin(Number(val1), Number(val2));
        applyResult(res);
      } else if (toolId.includes("tip") || toolId.includes("split-bill")) {
        const res = CalcEngine.calculateTipAndSplit(Number(val1), Number(val2), Number(val3) || 1);
        applyResult(res);
      } else if (toolId.includes("currency")) {
        const amount = Number(val1);
        const rate = Number(val2) || 1.1;
        const converted = amount * rate;
        applyRawResult(
          `Currency Conversion Helper`,
          `Converted Amount: $${converted.toFixed(2)}`,
          `Target = Amount × Custom Exchange Rate`,
          `Offline currency calculation using user-provided rate of ${rate}. Rates are manual and non-live.`,
          [`Multiply ${amount} × ${rate} = $${converted.toFixed(2)}`],
          [
            { label: "Base Amount", value: `${amount}` },
            { label: "Manual Exchange Rate", value: `${rate}` },
            { label: "Converted Total", value: `${converted.toFixed(2)}` },
          ]
        );
      }

      // 3. HEALTH CALCULATORS
      else if (toolId.includes("bmi")) {
        const res = CalcEngine.calculateBMI(Number(val1), Number(val2));
        applyResult(res);
      } else if (toolId.includes("bmr") || toolId.includes("calorie")) {
        const res = CalcEngine.calculateBMRAndTDEE(Number(val3), "male", Number(val1), Number(val2));
        applyResult(res);
      }

      // 4. DATE & TIME TOOLS
      else if (toolId.includes("date-difference") || toolId.includes("age")) {
        const res = CalcEngine.calculateDateDifference(String(val1), String(val2));
        applyResult(res);
      } else if (toolId.includes("leap-year")) {
        const year = Number(val1) || 2026;
        const leapRes = CalcEngine.isLeapYear(year);
        applyRawResult(
          `Leap Year Checker`,
          `${year} is ${leapRes.isLeap ? "a LEAP YEAR (366 days)" : "a Standard Year (365 days)"}`,
          `Rule: Divisible by 4 AND (Not 100 OR Divisible by 400)`,
          leapRes.explanation,
          [leapRes.explanation],
          [
            { label: "Target Year", value: `${year}` },
            { label: "Leap Status", value: leapRes.isLeap ? "Yes" : "No" },
            { label: "Total Days", value: leapRes.isLeap ? "366" : "365" },
          ]
        );
      } else if (toolId.includes("unix-timestamp")) {
        const timestamp = Math.floor(Date.now() / 1000);
        applyRawResult(
          `Unix Epoch Timestamp`,
          `${timestamp} seconds`,
          `Epoch Seconds = Math.floor(Date.now() / 1000)`,
          `Current UTC epoch timestamp seconds.`,
          [`Milliseconds: ${Date.now()}`, `UTC String: ${new Date().toUTCString()}`],
          [
            { label: "Unix Epoch (Seconds)", value: `${timestamp}` },
            { label: "Unix Epoch (Milliseconds)", value: `${Date.now()}` },
            { label: "UTC Time", value: new Date().toUTCString() },
          ]
        );
      }

      // 5. UNIT CONVERTERS
      else if (toolId.includes("converter") || toolId.includes("bits") || toolId.includes("bytes") || toolId.includes("kb") || toolId.includes("mb") || toolId.includes("gb")) {
        const res = ConvEngine.convertUnit(unitCategory, fromUnit, toUnit, Number(val1), precision);
        applyRawResult(
          `Unit Conversion (${fromUnit} -> ${toUnit})`,
          `${res.result}`,
          res.formula,
          res.explanation,
          [res.explanation],
          [
            { label: "Input Value", value: `${val1}` },
            { label: "Converted Value", value: `${res.result}` },
            { label: "Scale Formula", value: res.formula },
          ]
        );
      }

      // 6. DIGITAL & DATA CONVERTERS
      else if (toolId.includes("binary") || toolId.includes("hex") || toolId.includes("octal") || toolId.includes("roman")) {
        if (toolId.includes("roman")) {
          const romanRes = ConvEngine.romanNumeralConverter(val1);
          applyRawResult(
            `Roman Numeral Conversion`,
            romanRes.result,
            romanRes.formula,
            `Converted value ${val1}`,
            [romanRes.formula],
            [
              { label: "Input", value: `${val1}` },
              { label: "Result", value: romanRes.result },
            ]
          );
        } else {
          const num = Number(val1) || 255;
          applyRawResult(
            `Number Base Conversion`,
            `DEC: ${num} | BIN: ${num.toString(2)} | HEX: ${num.toString(16).toUpperCase()} | OCT: ${num.toString(8)}`,
            `Base Conversions: Binary (base 2), Octal (base 8), Decimal (base 10), Hexadecimal (base 16)`,
            `Bitwise representation of ${num}.`,
            [`Binary: ${num.toString(2)}`, `Hex: ${num.toString(16).toUpperCase()}`, `Octal: ${num.toString(8)}`],
            [
              { label: "Decimal (Base 10)", value: `${num}` },
              { label: "Binary (Base 2)", value: num.toString(2) },
              { label: "Hexadecimal (Base 16)", value: num.toString(16).toUpperCase() },
              { label: "Octal (Base 8)", value: num.toString(8) },
            ]
          );
        }
      }

      // 7. COLOR & DESIGN UTILITIES
      else if (toolId.includes("color") || toolId.includes("rgb") || toolId.includes("hsl") || toolId.includes("contrast") || toolId.includes("gradient")) {
        const rgb = ConvEngine.hexToRgb(hexColor1) || { r: 79, g: 70, b: 229 };
        const hsl = ConvEngine.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const contrast = ConvEngine.calculateColorContrast(hexColor1, hexColor2);

        applyRawResult(
          `Color & Design Palette Analysis`,
          `RGB(${rgb.r}, ${rgb.g}, ${rgb.b}) | Contrast: ${contrast.ratio}:1`,
          `Contrast Ratio = (L1 + 0.05) / (L2 + 0.05)`,
          `Color conversion and WCAG 2.1 accessibility compliance.`,
          [
            `HEX: ${hexColor1}`,
            `RGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
            `HSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
            `Contrast Ratio: ${contrast.ratio}:1 (WCAG AA: ${contrast.wcagAA ? "PASS ✅" : "FAIL ❌"})`,
          ],
          [
            { label: "Primary HEX Code", value: hexColor1 },
            { label: "RGB Channels", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
            { label: "HSL Channels", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
            { label: "WCAG Contrast Ratio", value: `${contrast.ratio}:1` },
            { label: "WCAG AA Compliant", value: contrast.wcagAA ? "Yes (Pass)" : "No (Fail)" },
          ]
        );
      }

      // Default Fallback
      else {
        const num1 = Number(val1) || 0;
        const num2 = Number(val2) || 0;
        const sum = num1 + num2;
        applyRawResult(
          `General Arithmetic`,
          `Sum: ${sum}`,
          `Result = A + B`,
          `Computed basic sum.`,
          [`${num1} + ${num2} = ${sum}`],
          [
            { label: "Input A", value: `${num1}` },
            { label: "Input B", value: `${num2}` },
            { label: "Sum Total", value: `${sum}` },
          ]
        );
      }

      incrementGuestUsage(toolId, !!currentUser);
    } catch (err: any) {
      setErrorMessage(err.message || "Calculation error. Please check your inputs.");
    }
  };

  const applyResult = (res: CalcEngine.CalculationResult) => {
    setResultTitle(res.title);
    setFormattedResult(res.formattedResult);
    setFormulaText(res.formula);
    setExplanationText(res.explanation);
    setStepsList(res.steps);
    setBreakdownList(res.breakdown);
  };

  const applyRawResult = (
    title: string,
    result: string,
    formula: string,
    explanation: string,
    steps: string[],
    breakdown: { label: string; value: string }[]
  ) => {
    setResultTitle(title);
    setFormattedResult(result);
    setFormulaText(formula);
    setExplanationText(explanation);
    setStepsList(steps);
    setBreakdownList(breakdown);
  };

  const handleCopy = () => {
    const text = `${resultTitle}\nResult: ${formattedResult}\nFormula: ${formulaText}\n` + breakdownList.map((b) => `${b.label}: ${b.value}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    initDefaultValues();
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner for Health or Currency tools */}
      {toolId.includes("bmi") || toolId.includes("bmr") || toolId.includes("calorie") || toolId.includes("ideal-weight") ? (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
          <Info className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Informational Health Disclaimer</span>
            This calculator provides general statistical estimates based on standard health formulas (BMI, Mifflin-St Jeor). It does not constitute medical advice, diagnosis, or treatment plans.
          </div>
        </div>
      ) : toolId.includes("currency") ? (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-2xl text-xs text-blue-800 dark:text-blue-300 flex items-start gap-3">
          <Info className="w-5 h-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Manual Exchange Rate Notice</span>
            Currency conversions use user-provided manual rates. Live financial market API rates are not automatically fetched.
          </div>
        </div>
      ) : null}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-500" />
              {toolName} Workspace
            </span>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Fields</span>
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Dynamic Inputs Based on Tool Category */}
          {toolId.includes("color") || toolId.includes("gradient") ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                  Primary Color (HEX)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={hexColor1}
                    onChange={(e) => setHexColor1(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={hexColor1}
                    onChange={(e) => setHexColor1(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                  Secondary Color (HEX)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={hexColor2}
                    onChange={(e) => setHexColor2(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={hexColor2}
                    onChange={(e) => setHexColor2(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          ) : toolId.includes("converter") || toolId.includes("bits") || toolId.includes("bytes") ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                  Value to Convert
                </label>
                <input
                  type="number"
                  value={val1 as number}
                  onChange={(e) => setVal1(Number(e.target.value))}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                    From Unit
                  </label>
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold"
                  >
                    {Object.values(ConvEngine.UNIT_CATEGORIES[unitCategory]?.units || {}).map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                    To Unit
                  </label>
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold"
                  >
                    {Object.values(ConvEngine.UNIT_CATEGORIES[unitCategory]?.units || {}).map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : toolId.includes("average") || toolId.includes("mean") || toolId.includes("standard-deviation") || toolId.includes("variance") ? (
            <div>
              <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                Data Set Numbers (Comma separated)
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={4}
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-mono"
              />
            </div>
          ) : toolId.includes("date") || toolId.includes("age") ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                  Start / Birth Date
                </label>
                <input
                  type="date"
                  value={val1 as string}
                  onChange={(e) => setVal1(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                  End / Reference Date
                </label>
                <input
                  type="date"
                  value={val2 as string}
                  onChange={(e) => setVal2(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                  {toolId.includes("loan") || toolId.includes("emi") ? "Principal ($)" : toolId.includes("bmi") ? "Height (cm)" : "Primary Value (A)"}
                </label>
                <input
                  type="number"
                  value={val1 as number}
                  onChange={(e) => setVal1(Number(e.target.value))}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                  {toolId.includes("loan") || toolId.includes("emi") ? "Annual Interest (%)" : toolId.includes("bmi") ? "Weight (kg)" : "Secondary Value (B)"}
                </label>
                <input
                  type="number"
                  value={val2 as number}
                  onChange={(e) => setVal2(Number(e.target.value))}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium"
                />
              </div>
              {(toolId.includes("loan") || toolId.includes("emi") || toolId.includes("compound") || toolId.includes("tip")) && (
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                    {toolId.includes("tip") ? "Split Group People Count" : "Tenure (Years)"}
                  </label>
                  <input
                    type="number"
                    value={val3 as number}
                    onChange={(e) => setVal3(Number(e.target.value))}
                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
                {resultTitle}
              </span>
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-indigo-100 tracking-tight leading-tight">
              {formattedResult}
            </div>

            {formulaText && (
              <div className="p-3 bg-indigo-950/60 rounded-xl border border-indigo-800/40 text-xs font-mono text-indigo-300">
                <span className="text-[10px] font-bold uppercase text-indigo-400 block mb-0.5">Formula Derivative</span>
                {formulaText}
              </div>
            )}

            <div className="space-y-2 pt-3 border-t border-indigo-800/60">
              {breakdownList.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-indigo-200">{item.label}:</span>
                  <span className="font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-indigo-300/80 bg-indigo-950/50 p-3 rounded-xl border border-indigo-800/40">
            ⚡ Precision math engine computed dynamically client-side.
          </div>
        </div>
      </div>

      <GuestLimitModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        toolName={toolName}
      />
    </div>
  );
};
