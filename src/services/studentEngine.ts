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

export function convertGpaToPercentage(gpa: number, scale = 4.0): StudentCalcResult {
  if (gpa < 0 || gpa > scale) {
    throw new Error(`GPA must be between 0 and ${scale}.`);
  }

  let percentage = 0;
  let gradeClass = "";

  if (scale === 4.0) {
    // US & Canadian Standard 4.0 GPA Scale
    percentage = (gpa / 4.0) * 100;
    if (gpa >= 3.7) gradeClass = "First Class Honors / Grade A (US & Canada)";
    else if (gpa >= 3.3) gradeClass = "Upper Second Class (2:1) / Grade B+";
    else if (gpa >= 2.7) gradeClass = "Lower Second Class (2:2) / Grade B";
    else if (gpa >= 2.0) gradeClass = "Third Class / Grade C";
    else gradeClass = "Pass / Below Academic Standing";
  } else if (scale === 9.0) {
    // Canadian York / OMSAS 9.0 GPA Scale
    percentage = (gpa / 9.0) * 100;
    if (gpa >= 8.0) gradeClass = "Exceptional A+ (Canada 9.0 Scale)";
    else if (gpa >= 7.0) gradeClass = "Excellent A";
    else if (gpa >= 6.0) gradeClass = "Very Good B+";
    else if (gpa >= 5.0) gradeClass = "Good B";
    else gradeClass = "Satisfactory C+ / Pass";
  } else if (scale === 10.0) {
    // European, Indian (CGPA) & Mexican 10-Point Scale
    percentage = gpa * 9.5;
    if (gpa >= 9.0) gradeClass = "Excelente / First Class with Distinction (Europe / Mexico / Asia)";
    else if (gpa >= 8.0) gradeClass = "Muy Bueno / First Division";
    else if (gpa >= 6.5) gradeClass = "Bueno / Second Division";
    else if (gpa >= 6.0) gradeClass = "Suficiente / Pass";
    else gradeClass = "Reprobado / Fail";
  } else if (scale === 5.0) {
    percentage = (gpa / 5.0) * 100;
    if (gpa >= 4.5) gradeClass = "First Class Honors (5.0 Scale)";
    else if (gpa >= 3.5) gradeClass = "Second Class Upper (2:1)";
    else if (gpa >= 2.4) gradeClass = "Second Class Lower (2:2)";
    else gradeClass = "Third Class";
  } else {
    percentage = (gpa / scale) * 100;
    gradeClass = "Standard Scaled Equivalent";
  }

  return {
    title: "GPA to Percentage & International Grade Conversion",
    formattedResult: `${percentage.toFixed(1)}% Equivalent (${gradeClass})`,
    formula: scale === 10.0 ? `Percentage = CGPA × 9.5 (or GPA / 10 × 100)` : `Percentage = (GPA / ${scale}) × 100`,
    explanation: `Converted ${gpa} on a ${scale} scale to an estimated percentage of ${percentage.toFixed(1)}% under regional academic standards.`,
    steps: [
      `Selected Regional GPA Scale: ${scale} Maximum`,
      `Input GPA Score: ${gpa}`,
      `Equivalent Percentage: ${percentage.toFixed(2)}%`,
      `Regional Grade Standing: ${gradeClass}`,
    ],
    breakdown: [
      { label: "Entered GPA", value: `${gpa} / ${scale}` },
      { label: "Percentage Equivalent", value: `${percentage.toFixed(1)}%` },
      { label: "International Grade Standing", value: gradeClass },
      { label: "Regional Compatibility", value: "USA (4.0), Canada (4.0/9.0), Europe/UK (10.0/ECTS), Mexico (10.0 Scale)" },
    ],
  };
}

export interface AssignmentCategory {
  name: string;
  weightPercent: number;
  scoreEarned: number;
  maxScore: number;
}

export function calculateCourseWeightedGrade(categories: AssignmentCategory[]): StudentCalcResult {
  if (!categories || categories.length === 0) {
    throw new Error("Please add at least one assignment or exam category.");
  }

  let totalWeight = 0;
  let totalWeightedScore = 0;
  const breakdownList: { label: string; value: string }[] = [];

  for (const cat of categories) {
    if (cat.maxScore <= 0) continue;
    const catPercent = (cat.scoreEarned / cat.maxScore) * 100;
    const weightedContribution = catPercent * (cat.weightPercent / 100);

    totalWeight += cat.weightPercent;
    totalWeightedScore += weightedContribution;

    breakdownList.push({
      label: `${cat.name || 'Category'} (${cat.weightPercent}% weight)`,
      value: `Score: ${cat.scoreEarned}/${cat.maxScore} (${catPercent.toFixed(1)}%) → Contributes ${weightedContribution.toFixed(2)}%`,
    });
  }

  if (totalWeight === 0) throw new Error("Total category weight percentages must be greater than 0%.");

  // Normalized overall grade if total weight entered so far is less than 100%
  const normalizedGrade = (totalWeightedScore / (totalWeight / 100));

  let letterGrade = "F";
  if (normalizedGrade >= 93) letterGrade = "A (4.0)";
  else if (normalizedGrade >= 90) letterGrade = "A- (3.7)";
  else if (normalizedGrade >= 87) letterGrade = "B+ (3.3)";
  else if (normalizedGrade >= 83) letterGrade = "B (3.0)";
  else if (normalizedGrade >= 80) letterGrade = "B- (2.7)";
  else if (normalizedGrade >= 77) letterGrade = "C+ (2.3)";
  else if (normalizedGrade >= 73) letterGrade = "C (2.0)";
  else if (normalizedGrade >= 70) letterGrade = "C- (1.7)";
  else if (normalizedGrade >= 60) letterGrade = "D (1.0)";

  return {
    title: "Weighted Course Grade Calculation",
    formattedResult: `${normalizedGrade.toFixed(2)}% (${letterGrade})`,
    formula: `Weighted Grade % = Sum((Score Earned / Max Score) × Category Weight %)`,
    explanation: `Calculated current course average across ${categories.length} weighted assignment categories totaling ${totalWeight}% of class grade.`,
    steps: [
      `Total Weight Completed: ${totalWeight}%`,
      `Total Points Earned: ${totalWeightedScore.toFixed(2)}%`,
      `Normalized Overall Grade: ${normalizedGrade.toFixed(2)}%`,
      `Letter Grade Equivalent: ${letterGrade}`,
    ],
    breakdown: [
      { label: "Overall Weighted Grade", value: `${normalizedGrade.toFixed(2)}%` },
      { label: "Letter Grade", value: letterGrade },
      { label: "Total Evaluated Weight", value: `${totalWeight}%` },
      ...breakdownList,
    ],
  };
}

export function analyzeAssignmentWordCount(text: string, targetWords = 2500): StudentCalcResult {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length || 1 : 0;
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(Boolean).length : 0;

  const percentageComplete = targetWords > 0 ? Math.min(100, (words / targetWords) * 100) : 100;
  const wordsRemaining = Math.max(0, targetWords - words);
  const estReadingMinutes = Math.ceil(words / 225);
  const estSpeakingMinutes = Math.ceil(words / 130);

  return {
    title: "Assignment Essay Word Count Analysis",
    formattedResult: `${words.toLocaleString()} / ${targetWords.toLocaleString()} Words (${percentageComplete.toFixed(1)}% Complete)`,
    formula: `Progress % = (Current Words / Target Word Count) × 100`,
    explanation: words >= targetWords
      ? `Target reached! You are ${words - targetWords} words over the ${targetWords.toLocaleString()} word requirement.`
      : `You need ${wordsRemaining.toLocaleString()} more words to reach your ${targetWords.toLocaleString()} word assignment goal.`,
    steps: [
      `Current Word Count: ${words.toLocaleString()} words`,
      `Target Word Count Goal: ${targetWords.toLocaleString()} words`,
      `Words Remaining: ${wordsRemaining.toLocaleString()} words`,
      `Estimated Reading Time: ~${estReadingMinutes} min`,
    ],
    breakdown: [
      { label: "Word Count Progress", value: `${words.toLocaleString()} / ${targetWords.toLocaleString()} (${percentageComplete.toFixed(1)}%)` },
      { label: "Words Remaining", value: `${wordsRemaining.toLocaleString()} words` },
      { label: "Total Characters", value: `${characters.toLocaleString()}` },
      { label: "Paragraph Count", value: `${paragraphs}` },
      { label: "Sentence Count", value: `${sentences}` },
      { label: "Estimated Silent Reading Time", value: `~${estReadingMinutes} minutes` },
      { label: "Estimated Presentation Speaking Time", value: `~${estSpeakingMinutes} minutes` },
    ],
  };
}

export function calculateSpacedRepetitionIntervals(examDateStr: string): StudentCalcResult {
  const targetDate = new Date(examDateStr);
  const now = new Date();

  if (isNaN(targetDate.getTime())) {
    throw new Error("Please enter a valid exam date.");
  }

  const diffMs = targetDate.getTime() - now.getTime();
  const daysUntilExam = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysUntilExam < 0) {
    throw new Error("Exam date must be today or in the future.");
  }

  const reviewSchedule: { label: string; value: string }[] = [];

  const intervalPercents = [0, 0.1, 0.25, 0.5, 0.8]; // Spaced progression
  intervalPercents.forEach((p, idx) => {
    const reviewDate = new Date(now.getTime() + p * diffMs);
    reviewSchedule.push({
      label: `Revision Session ${idx + 1} (${p === 0 ? 'Today' : `~${Math.round(p * daysUntilExam)} days before exam`})`,
      value: reviewDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
    });
  });

  return {
    title: "Spaced Repetition Exam Revision Schedule",
    formattedResult: `${daysUntilExam} Days Remaining Until Exam`,
    formula: `Revision Dates = Spaced Repetition Curves (Day 1, Day 3, 1-Week, 2-Weeks, Final Polish)`,
    explanation: `Optimized spaced memory retention schedule leading up to your exam on ${targetDate.toLocaleDateString()}.`,
    steps: [
      `Total Preparation Window: ${daysUntilExam} days`,
      `Generated 5 spaced repetition review milestones to boost active recall memory retention.`,
    ],
    breakdown: [
      { label: "Target Exam Date", value: targetDate.toLocaleDateString() },
      { label: "Days Until Exam", value: `${daysUntilExam} Days` },
      ...reviewSchedule,
    ],
  };
}

export function calculateStudentBudget(
  income: { grants: number; jobs: number; family: number; savings: number },
  expenses: { tuition: number; rent: number; food: number; books: number; transport: number; leisure: number }
): StudentCalcResult {
  const totalIncome = (income.grants || 0) + (income.jobs || 0) + (income.family || 0) + (income.savings || 0);
  const totalExpenses = (expenses.tuition || 0) + (expenses.rent || 0) + (expenses.food || 0) + (expenses.books || 0) + (expenses.transport || 0) + (expenses.leisure || 0);
  const netSurplus = totalIncome - totalExpenses;

  return {
    title: "Monthly Student Cashflow & Budget",
    formattedResult: netSurplus >= 0 ? `+$${netSurplus.toFixed(2)} Monthly Surplus` : `-$${Math.abs(netSurplus).toFixed(2)} Monthly Deficit`,
    formula: "Monthly Net = Total Income & Grants - Total Monthly Living Expenses",
    explanation: netSurplus >= 0
      ? `Great job! Your monthly funding covers all housing, food, and academic expenses with a $${netSurplus.toFixed(2)} buffer.`
      : `Alert: Your expenses exceed income by $${Math.abs(netSurplus).toFixed(2)} monthly. Consider reducing discretionary costs or exploring work-study opportunities.`,
    steps: [
      `Total Monthly Income: $${totalIncome.toFixed(2)}`,
      `Total Monthly Expenses: $${totalExpenses.toFixed(2)}`,
      `Net Cashflow: $${netSurplus.toFixed(2)}`,
    ],
    breakdown: [
      { label: "Total Monthly Income", value: `$${totalIncome.toFixed(2)}` },
      { label: "Total Monthly Expenses", value: `$${totalExpenses.toFixed(2)}` },
      { label: "Net Monthly Balance", value: `$${netSurplus.toFixed(2)}` },
      { label: "Housing & Utilities", value: `$${(expenses.rent || 0).toFixed(2)}` },
      { label: "Food & Groceries", value: `$${(expenses.food || 0).toFixed(2)}` },
      { label: "Tuition & Books", value: `$${((expenses.tuition || 0) + (expenses.books || 0)).toFixed(2)}` },
    ],
  };
}


