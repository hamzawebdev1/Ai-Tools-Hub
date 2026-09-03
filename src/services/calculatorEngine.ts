// Calculator Engine for Math, Finance, Health, and Date/Time Calculators

export interface CalculationResult {
  title: string;
  formattedResult: string;
  formula: string;
  explanation: string;
  steps: string[];
  breakdown: { label: string; value: string }[];
}

// ----------------------------------------------------
// 1. MATH & BASIC CALCULATORS
// ----------------------------------------------------

export function calculatePercentage(num: number, percent: number): CalculationResult {
  if (isNaN(num) || isNaN(percent)) throw new Error("Invalid number input");
  const result = (num * percent) / 100;
  const increase = num + result;
  const decrease = num - result;

  return {
    title: `${percent}% of ${num}`,
    formattedResult: `${result.toLocaleString(undefined, { maximumFractionDigits: 4 })}`,
    formula: `Result = (Number × Percentage) / 100`,
    explanation: `Calculated ${percent}% of ${num}.`,
    steps: [
      `Step 1: Multiply ${num} by ${percent} = ${num * percent}`,
      `Step 2: Divide by 100 = ${result}`,
      `Value after ${percent}% Increase: ${increase}`,
      `Value after ${percent}% Decrease: ${decrease}`,
    ],
    breakdown: [
      { label: "Original Value", value: `${num}` },
      { label: "Percentage Rate", value: `${percent}%` },
      { label: "Calculated Portion", value: `${result}` },
      { label: "Value After Addition (+)", value: `${increase}` },
      { label: "Value After Subtraction (-)", value: `${decrease}` },
    ],
  };
}

export function calculatePercentageChange(original: number, newValue: number): CalculationResult {
  if (isNaN(original) || isNaN(newValue)) throw new Error("Invalid number input");
  if (original === 0) throw new Error("Original value cannot be zero when computing percentage change.");

  const diff = newValue - original;
  const percentChange = (diff / Math.abs(original)) * 100;
  const isIncrease = diff >= 0;

  return {
    title: `Percentage ${isIncrease ? "Increase" : "Decrease"}`,
    formattedResult: `${Math.abs(percentChange).toFixed(2)}% ${isIncrease ? "Increase" : "Decrease"}`,
    formula: `Percentage Change = ((New - Original) / |Original|) × 100`,
    explanation: `Difference between ${original} and ${newValue} is ${diff}.`,
    steps: [
      `Step 1: Calculate Difference = ${newValue} - ${original} = ${diff}`,
      `Step 2: Divide Difference by |Original| (${Math.abs(original)}) = ${diff / Math.abs(original)}`,
      `Step 3: Multiply by 100 = ${percentChange.toFixed(4)}%`,
    ],
    breakdown: [
      { label: "Original Value", value: `${original}` },
      { label: "New Value", value: `${newValue}` },
      { label: "Absolute Difference", value: `${diff}` },
      { label: "Percentage Change", value: `${percentChange.toFixed(2)}%` },
    ],
  };
}

export function calculateFraction(num1: number, den1: number, num2: number, den2: number, op: "+" | "-" | "*" | "/"): CalculationResult {
  if (den1 === 0 || den2 === 0) throw new Error("Denominator cannot be zero.");

  let resNum = 0;
  let resDen = 1;

  if (op === "+") {
    resNum = num1 * den2 + num2 * den1;
    resDen = den1 * den2;
  } else if (op === "-") {
    resNum = num1 * den2 - num2 * den1;
    resDen = den1 * den2;
  } else if (op === "*") {
    resNum = num1 * num2;
    resDen = den1 * den2;
  } else if (op === "/") {
    if (num2 === 0) throw new Error("Cannot divide by a fraction with numerator 0.");
    resNum = num1 * den2;
    resDen = den1 * num2;
  }

  const commonGcd = gcd(Math.abs(resNum), Math.abs(resDen));
  const simplifiedNum = resNum / commonGcd;
  const simplifiedDen = resDen / commonGcd;
  const decimalVal = resNum / resDen;

  return {
    title: `Fraction Arithmetic (${num1}/${den1} ${op} ${num2}/${den2})`,
    formattedResult: `${simplifiedNum}/${simplifiedDen} (${decimalVal.toFixed(4)})`,
    formula: `Simplified Fraction = ${simplifiedNum}/${simplifiedDen}`,
    explanation: `Performed ${op} operation and reduced to lowest terms using GCD = ${commonGcd}.`,
    steps: [
      `Step 1: Calculate raw result = ${resNum}/${resDen}`,
      `Step 2: Find Greatest Common Divisor = ${commonGcd}`,
      `Step 3: Simplify fraction = ${simplifiedNum}/${simplifiedDen}`,
      `Step 4: Decimal equivalent = ${decimalVal}`,
    ],
    breakdown: [
      { label: "Fraction 1", value: `${num1}/${den1}` },
      { label: "Fraction 2", value: `${num2}/${den2}` },
      { label: "Simplified Result", value: `${simplifiedNum}/${simplifiedDen}` },
      { label: "Decimal Value", value: `${decimalVal}` },
    ],
  };
}

export function calculateStatistics(numbers: number[]): CalculationResult {
  if (!numbers || numbers.length === 0) throw new Error("Input numbers array cannot be empty.");

  const sorted = [...numbers].sort((a, b) => a - b);
  const count = sorted.length;
  const sum = sorted.reduce((acc, curr) => acc + curr, 0);
  const mean = sum / count;

  // Median
  const mid = Math.floor(count / 2);
  const median = count % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  // Mode
  const frequency: Record<number, number> = {};
  let maxFreq = 0;
  sorted.forEach((n) => {
    frequency[n] = (frequency[n] || 0) + 1;
    if (frequency[n] > maxFreq) maxFreq = frequency[n];
  });
  const modes = Object.keys(frequency)
    .filter((k) => frequency[Number(k)] === maxFreq && maxFreq > 1)
    .map(Number);
  const modeStr = modes.length > 0 ? modes.join(", ") : "No repeated mode";

  // Range, Variance & Std Dev
  const range = sorted[count - 1] - sorted[0];
  const variance = sorted.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) / (count > 1 ? count - 1 : 1);
  const stdDev = Math.sqrt(variance);

  return {
    title: "Mean, Median, Mode & Standard Deviation",
    formattedResult: `Mean: ${mean.toFixed(2)} | Median: ${median} | Std Dev: ${stdDev.toFixed(2)}`,
    formula: `Mean = Sum / Count | Std Dev = √(Variance)`,
    explanation: `Analyzed ${count} numerical data points.`,
    steps: [
      `Sorted Data: [${sorted.join(", ")}]`,
      `Sum: ${sum}`,
      `Mean (Average): ${mean.toFixed(4)}`,
      `Median: ${median}`,
      `Mode: ${modeStr}`,
      `Range: ${range}`,
      `Sample Variance: ${variance.toFixed(4)}`,
      `Standard Deviation: ${stdDev.toFixed(4)}`,
    ],
    breakdown: [
      { label: "Total Count (N)", value: `${count}` },
      { label: "Sum Total", value: `${sum}` },
      { label: "Mean (Average)", value: `${mean.toFixed(2)}` },
      { label: "Median", value: `${median}` },
      { label: "Mode", value: modeStr },
      { label: "Min / Max Range", value: `${sorted[0]} to ${sorted[count - 1]} (Range: ${range})` },
      { label: "Sample Variance", value: `${variance.toFixed(2)}` },
      { label: "Standard Deviation", value: `${stdDev.toFixed(2)}` },
    ],
  };
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

export function isPrimeNumber(num: number): { isPrime: boolean; factors: number[] } {
  const n = Math.floor(Math.abs(num));
  const factors: number[] = [];
  if (n <= 1) return { isPrime: false, factors: [n] };

  for (let i = 1; i <= n; i++) {
    if (n % i === 0) factors.push(i);
  }

  return { isPrime: factors.length === 2, factors };
}

// ----------------------------------------------------
// 2. FINANCIAL CALCULATORS
// ----------------------------------------------------

export function calculateEMI(principal: number, annualInterestRate: number, tenureYears: number): CalculationResult {
  if (principal <= 0 || annualInterestRate < 0 || tenureYears <= 0) {
    throw new Error("Principal, rate, and tenure must be positive numbers.");
  }

  const r = annualInterestRate / 12 / 100;
  const n = tenureYears * 12;

  let emi = 0;
  if (r === 0) {
    emi = principal / n;
  } else {
    emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;

  return {
    title: "Monthly Repayment (EMI / Loan)",
    formattedResult: `$${emi.toFixed(2)} / month`,
    formula: `EMI = [P × r × (1+r)^n] / [(1+r)^n - 1]`,
    explanation: `Monthly installment for a loan of $${principal.toLocaleString()} at ${annualInterestRate}% interest over ${tenureYears} years.`,
    steps: [
      `Monthly Interest Rate (r): ${r.toFixed(6)}`,
      `Total Tenure Months (n): ${n} months`,
      `Monthly EMI: $${emi.toFixed(2)}`,
      `Total Interest Payable: $${totalInterest.toFixed(2)}`,
      `Total Loan Repayment: $${totalPayment.toFixed(2)}`,
    ],
    breakdown: [
      { label: "Principal Loan Amount", value: `$${principal.toLocaleString()}` },
      { label: "Annual Interest Rate", value: `${annualInterestRate}%` },
      { label: "Tenure", value: `${tenureYears} Years (${n} Months)` },
      { label: "Monthly EMI", value: `$${emi.toFixed(2)}` },
      { label: "Total Interest Payable", value: `$${totalInterest.toFixed(2)}` },
      { label: "Total Amount Payable", value: `$${totalPayment.toFixed(2)}` },
    ],
  };
}

export function calculateCompoundInterest(principal: number, rate: number, years: number, frequencyPerYear = 12): CalculationResult {
  if (principal < 0 || rate < 0 || years < 0) throw new Error("Inputs must be non-negative.");

  const n = frequencyPerYear;
  const r = rate / 100;
  const amount = principal * Math.pow(1 + r / n, n * years);
  const interestEarned = amount - principal;

  return {
    title: "Compound Interest Growth",
    formattedResult: `$${amount.toFixed(2)}`,
    formula: `A = P × (1 + r/n)^(n × t)`,
    explanation: `Investment of $${principal.toLocaleString()} compounded ${n} times per year over ${years} years.`,
    steps: [
      `Principal (P): $${principal}`,
      `Annual Rate (r): ${rate}%`,
      `Compounding Frequency (n): ${n} times/yr`,
      `Interest Earned: $${interestEarned.toFixed(2)}`,
      `Final Balance: $${amount.toFixed(2)}`,
    ],
    breakdown: [
      { label: "Initial Deposit", value: `$${principal.toFixed(2)}` },
      { label: "Compound Interest Earned", value: `$${interestEarned.toFixed(2)}` },
      { label: "Total Balance", value: `$${amount.toFixed(2)}` },
    ],
  };
}

export function calculateProfitAndMargin(cost: number, revenue: number): CalculationResult {
  if (isNaN(cost) || isNaN(revenue)) throw new Error("Invalid cost or revenue.");

  const profit = revenue - cost;
  const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const markup = cost > 0 ? (profit / cost) * 100 : 0;
  const roi = cost > 0 ? (profit / cost) * 100 : 0;

  return {
    title: "Profit, Margin & Markup",
    formattedResult: `Profit: $${profit.toFixed(2)} (${profitMargin.toFixed(2)}% Margin)`,
    formula: `Profit = Revenue - Cost | Margin % = (Profit / Revenue) × 100`,
    explanation: `Financial return based on cost of $${cost} and gross revenue of $${revenue}.`,
    steps: [
      `Gross Profit: $${revenue} - $${cost} = $${profit.toFixed(2)}`,
      `Profit Margin: ($${profit.toFixed(2)} / $${revenue}) × 100 = ${profitMargin.toFixed(2)}%`,
      `Cost Markup: ($${profit.toFixed(2)} / $${cost}) × 100 = ${markup.toFixed(2)}%`,
    ],
    breakdown: [
      { label: "Total Cost / Expense", value: `$${cost.toFixed(2)}` },
      { label: "Total Revenue / Sales", value: `$${revenue.toFixed(2)}` },
      { label: "Net Profit / Loss", value: `$${profit.toFixed(2)}` },
      { label: "Profit Margin", value: `${profitMargin.toFixed(2)}%` },
      { label: "Markup Percentage", value: `${markup.toFixed(2)}%` },
      { label: "ROI (Return on Investment)", value: `${roi.toFixed(2)}%` },
    ],
  };
}

export function calculateTipAndSplit(billTotal: number, tipPercent: number, peopleCount = 1): CalculationResult {
  if (billTotal <= 0 || peopleCount <= 0) throw new Error("Bill total and number of people must be greater than zero.");

  const tipAmount = (billTotal * tipPercent) / 100;
  const grandTotal = billTotal + tipAmount;
  const perPerson = grandTotal / peopleCount;
  const tipPerPerson = tipAmount / peopleCount;

  return {
    title: "Tip & Bill Split",
    formattedResult: `$${perPerson.toFixed(2)} per person`,
    formula: `Total = Bill + (Bill × Tip%) | Per Person = Total / People`,
    explanation: `Total bill of $${billTotal.toFixed(2)} with ${tipPercent}% tip split between ${peopleCount} people.`,
    steps: [
      `Tip Amount: $${billTotal} × ${tipPercent}% = $${tipAmount.toFixed(2)}`,
      `Grand Total: $${billTotal} + $${tipAmount.toFixed(2)} = $${grandTotal.toFixed(2)}`,
      `Share Per Person (${peopleCount} people): $${grandTotal.toFixed(2)} / ${peopleCount} = $${perPerson.toFixed(2)}`,
    ],
    breakdown: [
      { label: "Base Bill Amount", value: `$${billTotal.toFixed(2)}` },
      { label: "Tip Percentage", value: `${tipPercent}%` },
      { label: "Total Tip Amount", value: `$${tipAmount.toFixed(2)}` },
      { label: "Grand Total Bill", value: `$${grandTotal.toFixed(2)}` },
      { label: "Tip Per Person", value: `$${tipPerPerson.toFixed(2)}` },
      { label: "Total Per Person", value: `$${perPerson.toFixed(2)}` },
    ],
  };
}

// ----------------------------------------------------
// 3. HEALTH & BODY CALCULATORS
// ----------------------------------------------------

export function calculateBMI(heightCm: number, weightKg: number): CalculationResult {
  if (heightCm <= 0 || weightKg <= 0) throw new Error("Height and weight must be positive numbers.");

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  let category = "Normal weight";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi >= 25 && bmi < 29.9) category = "Overweight";
  else if (bmi >= 30) category = "Obesity";

  const minNormalWeight = 18.5 * heightM * heightM;
  const maxNormalWeight = 24.9 * heightM * heightM;

  return {
    title: "Body Mass Index (BMI)",
    formattedResult: `${bmi.toFixed(1)} kg/m² (${category})`,
    formula: `BMI = Weight (kg) / [Height (m)]²`,
    explanation: `Informational estimate of body mass composition based on World Health Organization standards.`,
    steps: [
      `Height in Meters: ${heightCm} cm = ${heightM} m`,
      `Height Squared: ${heightM} × ${heightM} = ${(heightM * heightM).toFixed(4)}`,
      `BMI Score: ${weightKg} / ${(heightM * heightM).toFixed(4)} = ${bmi.toFixed(2)}`,
      `Category Classification: ${category}`,
    ],
    breakdown: [
      { label: "Height", value: `${heightCm} cm` },
      { label: "Weight", value: `${weightKg} kg` },
      { label: "Calculated BMI Score", value: `${bmi.toFixed(1)} kg/m²` },
      { label: "Weight Status Category", value: category },
      { label: "Healthy Weight Range", value: `${minNormalWeight.toFixed(1)} kg - ${maxNormalWeight.toFixed(1)} kg` },
    ],
  };
}

export function calculateBMRAndTDEE(age: number, gender: "male" | "female", heightCm: number, weightKg: number): CalculationResult {
  if (age <= 0 || heightCm <= 0 || weightKg <= 0) throw new Error("Age, height, and weight must be positive numbers.");

  // Mifflin-St Jeor Equation
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr += gender === "male" ? 5 : -161;

  const tdeeSedentary = bmr * 1.2;
  const tdeeLight = bmr * 1.375;
  const tdeeModerate = bmr * 1.55;
  const tdeeHeavy = bmr * 1.725;

  return {
    title: "Basal Metabolic Rate (BMR) & Daily Calories",
    formattedResult: `${Math.round(bmr)} Calories / day (BMR)`,
    formula: `Mifflin-St Jeor: BMR = 10W + 6.25H - 5A + s (Male: +5, Female: -161)`,
    explanation: `BMR represents baseline energy expenditure at complete rest.`,
    steps: [
      `Base BMR Calculation: ${Math.round(bmr)} kcal/day`,
      `Sedentary Daily Maintenance: ${Math.round(tdeeSedentary)} kcal`,
      `Light Activity Maintenance: ${Math.round(tdeeLight)} kcal`,
      `Moderate Activity Maintenance: ${Math.round(tdeeModerate)} kcal`,
      `Heavy Activity Maintenance: ${Math.round(tdeeHeavy)} kcal`,
    ],
    breakdown: [
      { label: "Basal Metabolic Rate (BMR)", value: `${Math.round(bmr)} kcal/day` },
      { label: "Sedentary (Little/No Exercise)", value: `${Math.round(tdeeSedentary)} kcal/day` },
      { label: "Lightly Active (1-3 days/wk)", value: `${Math.round(tdeeLight)} kcal/day` },
      { label: "Moderately Active (3-5 days/wk)", value: `${Math.round(tdeeModerate)} kcal/day` },
      { label: "Very Active (6-7 days/wk)", value: `${Math.round(tdeeHeavy)} kcal/day` },
    ],
  };
}

// ----------------------------------------------------
// 4. DATE & TIME CALCULATORS
// ----------------------------------------------------

export function calculateDateDifference(startDateStr: string, endDateStr: string): CalculationResult {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date input.");
  }

  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonthLastDay = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    title: "Exact Date Difference",
    formattedResult: `${years} Years, ${months} Months, ${days} Days`,
    formula: `Difference = Target Date - Start Date`,
    explanation: `Duration elapsed between ${start.toISOString().split("T")[0]} and ${end.toISOString().split("T")[0]}.`,
    steps: [
      `Total Days Elapsed: ${diffDays.toLocaleString()} days`,
      `Total Weeks Elapsed: ${diffWeeks.toLocaleString()} weeks`,
      `Total Hours Elapsed: ${diffHours.toLocaleString()} hours`,
    ],
    breakdown: [
      { label: "Start Date", value: start.toDateString() },
      { label: "End Date", value: end.toDateString() },
      { label: "Formatted Duration", value: `${years} yrs, ${months} mos, ${days} days` },
      { label: "Total Days", value: `${diffDays.toLocaleString()} Days` },
      { label: "Total Weeks", value: `${diffWeeks.toLocaleString()} Weeks` },
      { label: "Total Hours", value: `${diffHours.toLocaleString()} Hours` },
    ],
  };
}

export function isLeapYear(year: number): { isLeap: boolean; explanation: string } {
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const explanation = isLeap
    ? `${year} is a leap year (366 days) because it is divisible by 4 and not 100, or divisible by 400.`
    : `${year} is a standard year (365 days).`;
  return { isLeap, explanation };
}

export function calculateRegionalTax(
  amount: number,
  taxRatePercent: number,
  taxType: "us_sales" | "ca_gst" | "eu_vat" | "mx_iva" = "us_sales"
): CalculationResult {
  const taxAmount = (amount * taxRatePercent) / 100;
  const totalAmount = amount + taxAmount;

  let label = "Sales Tax (USA)";
  if (taxType === "ca_gst") label = "GST / HST / PST (Canada)";
  else if (taxType === "eu_vat") label = "VAT (Value Added Tax - Europe & UK)";
  else if (taxType === "mx_iva") label = "IVA (Impuesto al Valor Agregado - México 16%)";

  return {
    title: `${label} Calculation`,
    formattedResult: `$${totalAmount.toFixed(2)} Total ($${taxAmount.toFixed(2)} Tax)`,
    formula: `Tax = Amount × (Rate / 100) | Total = Amount + Tax`,
    explanation: `Calculated ${taxRatePercent}% tax on $${amount.toFixed(2)} under ${label} standards.`,
    steps: [
      `Base Price: $${amount.toFixed(2)}`,
      `Tax Rate: ${taxRatePercent}% (${label})`,
      `Calculated Tax Amount: $${taxAmount.toFixed(2)}`,
      `Total Final Price: $${totalAmount.toFixed(2)}`,
    ],
    breakdown: [
      { label: "Base Pre-Tax Price", value: `$${amount.toFixed(2)}` },
      { label: "Applied Tax Rate", value: `${taxRatePercent}%` },
      { label: "Tax Category", value: label },
      { label: "Calculated Tax Amount", value: `$${taxAmount.toFixed(2)}` },
      { label: "Total Final Price", value: `$${totalAmount.toFixed(2)}` },
    ],
  };
}
