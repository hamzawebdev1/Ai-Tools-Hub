// Student Tools Engine - 100% Client-Side Calculations for Students & Academics

export interface StudentCalcResult {
  title: string;
  formattedResult: string;
  formula: string;
  explanation: string;
  steps: string[];
  breakdown: { label: string; value: string }[];
}

// Grade point mapping on standard 4.0 scale
export const GRADE_POINT_MAP: Record<string, number> = {
  "A+": 4.0,
  "A": 4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B": 3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C": 2.0,
  "C-": 1.7,
  "D+": 1.3,
  "D": 1.0,
  "F": 0.0,
};

export interface CourseInput {
  name: string;
  grade: string; // e.g. "A", "3.7" or letter
  credits: number;
}

export function calculateGPA(courses: CourseInput[]): StudentCalcResult {
  if (!courses || courses.length === 0) {
    throw new Error("Please add at least one course with valid grade and credit hours.");
  }

  let totalQualityPoints = 0;
  let totalCredits = 0;
  const courseBreakdown: { label: string; value: string }[] = [];

  for (const c of courses) {
    const gradeNum = parseFloat(c.grade);
    const point = !isNaN(gradeNum) ? gradeNum : (GRADE_POINT_MAP[c.grade.toUpperCase()] ?? 0.0);
    const qp = point * c.credits;

    totalQualityPoints += qp;
    totalCredits += c.credits;

    courseBreakdown.push({
      label: `${c.name || 'Course'} (${c.credits} cr)`,
      value: `Grade: ${c.grade} (${point.toFixed(2)} pts) = ${qp.toFixed(2)} QP`,
    });
  }

  if (totalCredits === 0) {
    throw new Error("Total credits cannot be 0.");
  }

  const gpa = totalQualityPoints / totalCredits;

  let honorClassification = "Regular Academic Standing";
  if (gpa >= 3.9) honorClassification = "Summa Cum Laude / High Distinction";
  else if (gpa >= 3.7) honorClassification = "Magna Cum Laude / Distinction";
  else if (gpa >= 3.5) honorClassification = "Cum Laude / Dean's List";
  else if (gpa < 2.0) honorClassification = "Academic Warning / Below Good Standing";

  return {
    title: "Semester Grade Point Average (GPA)",
    formattedResult: `${gpa.toFixed(2)} / 4.00`,
    formula: `GPA = Total Quality Points / Total Credits = ${totalQualityPoints.toFixed(2)} / ${totalCredits}`,
    explanation: `Calculated weighted GPA across ${courses.length} courses totaling ${totalCredits} credit hours.`,
    steps: [
      `Step 1: Multiply course grade points by credit hours to get Quality Points (QP).`,
      `Step 2: Sum all Quality Points = ${totalQualityPoints.toFixed(2)}`,
      `Step 3: Sum all Credit Hours = ${totalCredits}`,
      `Step 4: Divide Total QP by Total Credits = ${gpa.toFixed(4)}`,
    ],
    breakdown: [
      { label: "Calculated GPA", value: `${gpa.toFixed(2)} / 4.00` },
      { label: "Total Credit Hours", value: `${totalCredits}` },
      { label: "Total Quality Points", value: `${totalQualityPoints.toFixed(2)}` },
      { label: "Academic Standing", value: honorClassification },
      ...courseBreakdown,
    ],
  };
}

export interface SemesterInput {
  name: string;
  gpa: number;
  credits: number;
}

export function calculateCGPA(semesters: SemesterInput[]): StudentCalcResult {
  if (!semesters || semesters.length === 0) {
    throw new Error("Please add at least one semester record.");
  }

  let totalQualityPoints = 0;
  let totalCredits = 0;

  for (const s of semesters) {
    totalQualityPoints += s.gpa * s.credits;
    totalCredits += s.credits;
  }

  if (totalCredits === 0) throw new Error("Total credits across semesters cannot be 0.");

  const cgpa = totalQualityPoints / totalCredits;

  return {
    title: "Cumulative Grade Point Average (CGPA)",
    formattedResult: `${cgpa.toFixed(2)} / 4.00`,
    formula: `CGPA = Sum(Semester GPA × Semester Credits) / Sum(Semester Credits)`,
    explanation: `Cumulative weighted GPA across ${semesters.length} academic terms totaling ${totalCredits} credits.`,
    steps: [
      `Total Cumulative Quality Points: ${totalQualityPoints.toFixed(2)}`,
      `Total Cumulative Credit Hours: ${totalCredits}`,
      `Overall CGPA: ${totalQualityPoints.toFixed(2)} / ${totalCredits} = ${cgpa.toFixed(4)}`,
    ],
    breakdown: [
      { label: "Cumulative CGPA", value: `${cgpa.toFixed(2)} / 4.00` },
      { label: "Total Semesters", value: `${semesters.length}` },
      { label: "Total Completed Credits", value: `${totalCredits}` },
      { label: "Total Quality Points", value: `${totalQualityPoints.toFixed(2)}` },
    ],
  };
}

export function calculateFinalGradeNeeded(currentGrade: number, targetGrade: number, finalExamWeight: number): StudentCalcResult {
  if (finalExamWeight <= 0 || finalExamWeight >= 100) {
    throw new Error("Final exam weight must be between 1% and 99%.");
  }

  const w = finalExamWeight / 100;
  const currentContribution = currentGrade * (1 - w);
  const neededScore = (targetGrade - currentContribution) / w;

  let feasibility = "Achievable";
  if (neededScore > 100) feasibility = "Requires extra credit (Score > 100%)";
  else if (neededScore < 0) feasibility = "Target already secured! (Score < 0%)";

  return {
    title: "Required Final Exam Score",
    formattedResult: `${neededScore.toFixed(1)}% Required`,
    formula: `Required Final Score = [Target Grade - (Current Grade × (1 - Weight))] / Weight`,
    explanation: `Score needed on the final exam (${finalExamWeight}% of course grade) to achieve an overall grade of ${targetGrade}%.`,
    steps: [
      `Current grade contribution (${(100 - finalExamWeight)}%): ${currentGrade}% × ${(1 - w).toFixed(2)} = ${currentContribution.toFixed(2)}%`,
      `Grade points remaining needed for target (${targetGrade}%): ${targetGrade}% - ${currentContribution.toFixed(2)}% = ${(targetGrade - currentContribution).toFixed(2)}%`,
      `Required final exam grade: ${(targetGrade - currentContribution).toFixed(2)}% / ${w} = ${neededScore.toFixed(2)}%`,
    ],
    breakdown: [
      { label: "Current Class Grade", value: `${currentGrade}%` },
      { label: "Target Final Grade", value: `${targetGrade}%` },
      { label: "Final Exam Weight", value: `${finalExamWeight}%` },
      { label: "Required Final Exam Score", value: `${neededScore.toFixed(1)}%` },
      { label: "Feasibility Assessment", value: feasibility },
    ],
  };
}

export function calculateAttendance(totalClasses: number, attendedClasses: number, targetPercent = 75): StudentCalcResult {
  if (totalClasses <= 0) throw new Error("Total classes held must be greater than 0.");
  if (attendedClasses < 0 || attendedClasses > totalClasses) throw new Error("Attended classes cannot exceed total classes.");

  const currentPercent = (attendedClasses / totalClasses) * 100;
  const targetFraction = targetPercent / 100;

  let statusMessage = "";
  let classesAction = "";

  if (currentPercent >= targetPercent) {
    // Calculate how many future classes can be skipped safely
    const maxAbsences = Math.floor((attendedClasses - targetFraction * totalClasses) / targetFraction);
    statusMessage = `Safe! Current attendance is ${currentPercent.toFixed(1)}% (above ${targetPercent}% requirement).`;
    classesAction = `You can skip up to ${Math.max(0, maxAbsences)} upcoming classes without falling below ${targetPercent}%.`;
  } else {
    // Calculate how many consecutive classes must be attended
    const neededClasses = Math.ceil((targetFraction * totalClasses - attendedClasses) / (1 - targetFraction));
    statusMessage = `Shortfall! Current attendance is ${currentPercent.toFixed(1)}% (below ${targetPercent}% threshold).`;
    classesAction = `You must attend the next ${neededClasses} consecutive classes to reach ${targetPercent}%.`;
  }

  return {
    title: "Attendance & Skip Day Calculator",
    formattedResult: `${currentPercent.toFixed(1)}% Attendance`,
    formula: `Attendance % = (Attended Classes / Total Classes) × 100`,
    explanation: statusMessage,
    steps: [
      `Attended ${attendedClasses} out of ${totalClasses} conducted sessions.`,
      `Current Attendance Rate: ${currentPercent.toFixed(2)}%`,
      classesAction,
    ],
    breakdown: [
      { label: "Total Conducted Classes", value: `${totalClasses}` },
      { label: "Attended Classes", value: `${attendedClasses}` },
      { label: "Missed / Absent Classes", value: `${totalClasses - attendedClasses}` },
      { label: "Current Attendance %", value: `${currentPercent.toFixed(1)}%` },
      { label: "Target Requirement", value: `${targetPercent}%` },
      { label: "Action Plan", value: classesAction },
    ],
  };
}

export function calculateStudyTime(credits: number, intensity: "light" | "moderate" | "demanding" | "intense" = "moderate"): StudentCalcResult {
  if (credits <= 0) throw new Error("Credit hours must be greater than 0.");

  let multiplier = 2; // default 2 hrs per credit outside class
  if (intensity === "light") multiplier = 1.5;
  if (intensity === "demanding") multiplier = 3;
  if (intensity === "intense") multiplier = 4;

  const weeklyStudyHours = credits * multiplier;
  const weeklyClassHours = credits;
  const totalAcademicHours = weeklyClassHours + weeklyStudyHours;
  const dailyStudyHours = (weeklyStudyHours / 7).toFixed(1);

  return {
    title: "Weekly Study Time Requirement",
    formattedResult: `${weeklyStudyHours} Hours / Week`,
    formula: `Study Hours = Course Credits × Intensity Multiplier (${multiplier}x)`,
    explanation: `Recommended out-of-class study allocation for ${credits} credit hours at ${intensity} rigor level.`,
    steps: [
      `In-Class Lecture Hours: ${weeklyClassHours} hrs/week`,
      `Independent Study Hours: ${credits} credits × ${multiplier} hrs = ${weeklyStudyHours} hrs/week`,
      `Average Daily Study Target: ${dailyStudyHours} hrs/day (7 days/week)`,
      `Total Academic Commitment: ${totalAcademicHours} hrs/week`,
    ],
    breakdown: [
      { label: "Enrolled Course Credits", value: `${credits} Credits` },
      { label: "Subject Rigor Level", value: intensity.toUpperCase() },
      { label: "Lecture / Lab Hours", value: `${weeklyClassHours} hrs/week` },
      { label: "Recommended Study Hours", value: `${weeklyStudyHours} hrs/week` },
      { label: "Daily Target", value: `${dailyStudyHours} hrs/day` },
      { label: "Total Weekly Workload", value: `${totalAcademicHours} hrs/week` },
    ],
  };
}

export function formatAcademicCitation(
  style: "APA" | "MLA" | "Chicago" | "Harvard",
  type: "book" | "journal" | "website",
  data: { authors?: string; title?: string; year?: string; publisherOrJournal?: string; url?: string; volume?: string }
): StudentCalcResult {
  const authors = data.authors?.trim() || "Author, A.";
  const title = data.title?.trim() || "Title of Work";
  const year = data.year?.trim() || "2025";
  const pub = data.publisherOrJournal?.trim() || "Publisher / Journal";
  const url = data.url?.trim() || "";

  let citation = "";
  if (style === "APA") {
    if (type === "book") citation = `${authors} (${year}). *${title}*. ${pub}.`;
    else if (type === "journal") citation = `${authors} (${year}). ${title}. *${pub}*${data.volume ? `, ${data.volume}` : ""}. ${url}`;
    else citation = `${authors} (${year}). *${title}*. ${pub}. ${url}`;
  } else if (style === "MLA") {
    if (type === "book") citation = `${authors}. *${title}*. ${pub}, ${year}.`;
    else if (type === "journal") citation = `${authors}. "${title}." *${pub}*, vol. ${data.volume || "1"}, ${year}.`;
    else citation = `${authors}. "${title}." *${pub}*, ${year}, ${url}.`;
  } else if (style === "Chicago") {
    citation = `${authors}. *${title}*. ${pub}, ${year}. ${url}`;
  } else {
    // Harvard
    citation = `${authors} (${year}) *${title}*. ${pub}. Available at: ${url || "N/A"}.`;
  }

  return {
    title: `${style} ${type.toUpperCase()} Citation`,
    formattedResult: citation,
    formula: `Style: ${style} 7th/9th Edition Standard Format`,
    explanation: `Accurately formatted academic citation ready to copy into your reference list.`,
    steps: [
      `Author: ${authors}`,
      `Title: ${title}`,
      `Year/Date: ${year}`,
      `Source/Publisher: ${pub}`,
    ],
    breakdown: [
      { label: "Citation Style", value: style },
      { label: "Source Type", value: type.toUpperCase() },
      { label: "Formatted Entry", value: citation },
    ],
  };
}

export function calculateStudentBudget(
  incomes: { grants: number; jobs: number; family: number; savings: number },
  expenses: { tuition: number; rent: number; food: number; books: number; transport: number; leisure: number }
): StudentCalcResult {
  const totalIncome = incomes.grants + incomes.jobs + incomes.family + incomes.savings;
  const totalExpenses = expenses.tuition + expenses.rent + expenses.food + expenses.books + expenses.transport + expenses.leisure;
  const netBalance = totalIncome - totalExpenses;

  const isSurplus = netBalance >= 0;

  return {
    title: "Monthly Student Financial Budget",
    formattedResult: `${isSurplus ? "+" : "-"}$${Math.abs(netBalance).toFixed(2)} / Month (${isSurplus ? "Surplus" : "Deficit"})`,
    formula: `Net Balance = Total Monthly Income - Total Monthly Expenses`,
    explanation: isSurplus
      ? `You have a monthly savings buffer of $${netBalance.toFixed(2)}.`
      : `You are currently exceeding monthly income by $${Math.abs(netBalance).toFixed(2)}. Consider cutting discretionary leisure or book expenses.`,
    steps: [
      `Total Monthly Income: $${totalIncome.toFixed(2)}`,
      `Total Monthly Expenses: $${totalExpenses.toFixed(2)}`,
      `Net Monthly Cashflow: $${netBalance.toFixed(2)}`,
    ],
    breakdown: [
      { label: "Total Monthly Income", value: `$${totalIncome.toFixed(2)}` },
      { label: "Total Monthly Expenses", value: `$${totalExpenses.toFixed(2)}` },
      { label: "Net Cashflow Balance", value: `$${netBalance.toFixed(2)}` },
      { label: "Tuition & Fees", value: `$${expenses.tuition.toFixed(2)}` },
      { label: "Housing & Rent", value: `$${expenses.rent.toFixed(2)}` },
      { label: "Food & Groceries", value: `$${expenses.food.toFixed(2)}` },
      { label: "Textbooks & Supplies", value: `$${expenses.books.toFixed(2)}` },
    ],
  };
}
