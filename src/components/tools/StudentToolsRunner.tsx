import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  BookOpen,
  Award,
  Check,
  Copy,
  RefreshCw,
  Clock,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  DollarSign,
  FileText,
  Target
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { saveHistoryItem } from "../../services/storageService";
import { canGuestExecute, incrementGuestUsage } from "../../services/guestUsageService";
import { GuestLimitModal } from "../auth/GuestLimitModal";
import * as StudentEngine from "../../services/studentEngine";

interface StudentToolsRunnerProps {
  toolId: string;
  toolName: string;
  toolSlug: string;
}

export const StudentToolsRunner: React.FC<StudentToolsRunnerProps> = ({
  toolId,
  toolName,
  toolSlug,
}) => {
  const { currentUser } = useAuth();
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. GPA Calculator State
  const [courses, setCourses] = useState<StudentEngine.CourseInput[]>([
    { name: "Mathematics 101", grade: "A", credits: 3 },
    { name: "Computer Science 201", grade: "A-", credits: 4 },
    { name: "Physics & Lab", grade: "B+", credits: 4 },
    { name: "English Literature", grade: "A", credits: 3 },
  ]);

  // 2. CGPA Calculator State
  const [semesters, setSemesters] = useState<StudentEngine.SemesterInput[]>([
    { name: "Fall Semester Year 1", gpa: 3.8, credits: 15 },
    { name: "Spring Semester Year 1", gpa: 3.65, credits: 16 },
    { name: "Fall Semester Year 2", gpa: 3.9, credits: 14 },
  ]);

  // 3. Final Grade Calculator State
  const [currentGrade, setCurrentGrade] = useState(85);
  const [targetGrade, setTargetGrade] = useState(90);
  const [finalExamWeight, setFinalExamWeight] = useState(30);

  // 4. Attendance Calculator State
  const [totalClasses, setTotalClasses] = useState(40);
  const [attendedClasses, setAttendedClasses] = useState(32);
  const [targetAttendance, setTargetAttendance] = useState(75);

  // 5. Study Time Calculator State
  const [creditLoad, setCreditLoad] = useState(15);
  const [studyRigor, setStudyRigor] = useState<"light" | "moderate" | "demanding" | "intense">("moderate");

  // 6. Pomodoro Timer State
  const [pomoMinutes, setPomoMinutes] = useState(25);
  const [pomoSeconds, setPomoSeconds] = useState(0);
  const [pomoIsActive, setPomoIsActive] = useState(false);
  const [pomoMode, setPomoMode] = useState<"work" | "shortBreak" | "longBreak">("work");
  const [pomoCompletedCount, setPomoCompletedCount] = useState(0);

  // 7. Citation Generator State
  const [citStyle, setCitStyle] = useState<"APA" | "MLA" | "Chicago" | "Harvard">("APA");
  const [citType, setCitType] = useState<"book" | "journal" | "website">("journal");
  const [citAuthors, setCitAuthors] = useState("Smith, J., & Johnson, A.");
  const [citTitle, setCitTitle] = useState("Machine Learning Applications in Modern Education");
  const [citYear, setCitYear] = useState("2025");
  const [citPub, setCitPub] = useState("Journal of Digital Learning");
  const [citUrl, setCitUrl] = useState("https://doi.org/10.1016/j.compedu.2025.10499");

  // 8. Student Budget State
  const [incGrants, setIncGrants] = useState(800);
  const [incJobs, setIncJobs] = useState(600);
  const [incFamily, setIncFamily] = useState(300);
  const [incSavings, setIncSavings] = useState(200);

  const [expTuition, setExpTuition] = useState(400);
  const [expRent, setExpRent] = useState(650);
  const [expFood, setExpFood] = useState(300);
  const [expBooks, setExpBooks] = useState(100);
  const [expTransport, setExpTransport] = useState(80);
  const [expLeisure, setExpLeisure] = useState(120);

  // 9. GPA to Percentage State
  const [gpaVal, setGpaVal] = useState(3.6);
  const [gpaScale, setGpaScale] = useState(4.0);

  // 10. Course Assignment Grade State
  const [assignmentCats, setAssignmentCats] = useState<StudentEngine.AssignmentCategory[]>([
    { name: "Homework & Quizzes", weightPercent: 20, scoreEarned: 90, maxScore: 100 },
    { name: "Midterm Exam 1", weightPercent: 25, scoreEarned: 85, maxScore: 100 },
    { name: "Research Project", weightPercent: 25, scoreEarned: 92, maxScore: 100 },
    { name: "Final Examination", weightPercent: 30, scoreEarned: 88, maxScore: 100 },
  ]);

  // 11. Essay Word Count Helper State
  const [essayText, setEssayText] = useState("Academic research shows that active learning techniques significantly improve student retention in STEM disciplines. By combining structured lecture material with peer discussion and interactive problem solving, university students demonstrate higher conceptual mastery.");
  const [essayTargetWords, setEssayTargetWords] = useState(2500);

  // 12. Exam Countdown State
  const [examTitle, setExamTitle] = useState("Organic Chemistry Final Exam");
  const [examDate, setExamDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });

  // 13. Student Timetable State
  const [timetable, setTimetable] = useState([
    { course: "Math 101 Lecture", day: "Monday", time: "09:00 - 10:30 AM", room: "Hall B", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300" },
    { course: "Computer Science Lab", day: "Tuesday", time: "11:00 AM - 01:00 PM", room: "Lab 3", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
    { course: "Physics Discussion", day: "Wednesday", time: "02:00 - 03:30 PM", room: "Room 204", color: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300" },
  ]);
  const [newTtCourse, setNewTtCourse] = useState("");
  const [newTtDay, setNewTtDay] = useState("Monday");
  const [newTtTime, setNewTtTime] = useState("10:00 - 11:30 AM");
  const [newTtRoom, setNewTtRoom] = useState("Room 101");

  // Dynamic Output State
  const [calcResult, setCalcResult] = useState<StudentEngine.StudentCalcResult | null>(null);

  // Pomodoro Effect
  useEffect(() => {
    let interval: any = null;
    if (pomoIsActive) {
      interval = setInterval(() => {
        if (pomoSeconds > 0) {
          setPomoSeconds(pomoSeconds - 1);
        } else if (pomoMinutes > 0) {
          setPomoMinutes(pomoMinutes - 1);
          setPomoSeconds(59);
        } else {
          // Timer finished
          setPomoIsActive(false);
          if (pomoMode === "work") {
            setPomoCompletedCount((prev) => prev + 1);
            alert("🎉 Pomodoro Focus Session Complete! Time for a 5-minute break.");
            switchPomoMode("shortBreak");
          } else {
            alert("⏰ Break is over! Ready to dive back into your study session?");
            switchPomoMode("work");
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [pomoIsActive, pomoMinutes, pomoSeconds, pomoMode]);

  const switchPomoMode = (mode: "work" | "shortBreak" | "longBreak") => {
    setPomoMode(mode);
    setPomoIsActive(false);
    if (mode === "work") { setPomoMinutes(25); setPomoSeconds(0); }
    else if (mode === "shortBreak") { setPomoMinutes(5); setPomoSeconds(0); }
    else { setPomoMinutes(15); setPomoSeconds(0); }
  };

  useEffect(() => {
    executeCalculation();
  }, [
    toolId,
    courses,
    semesters,
    currentGrade,
    targetGrade,
    finalExamWeight,
    totalClasses,
    attendedClasses,
    targetAttendance,
    creditLoad,
    studyRigor,
    citStyle,
    citType,
    citAuthors,
    citTitle,
    citYear,
    citPub,
    citUrl,
    incGrants,
    incJobs,
    incFamily,
    incSavings,
    expTuition,
    expRent,
    expFood,
    expBooks,
    expTransport,
    expLeisure,
    gpaVal,
    gpaScale,
    assignmentCats,
    essayText,
    essayTargetWords,
    examTitle,
    examDate,
    timetable,
  ]);

  const executeCalculation = () => {
    setErrorMessage(null);
    try {
      if (toolId.includes("gpa-to-percentage")) {
        const res = StudentEngine.convertGpaToPercentage(gpaVal, gpaScale);
        setCalcResult(res);
      } else if (toolId.includes("assignment-grade-calculator")) {
        const res = StudentEngine.calculateCourseWeightedGrade(assignmentCats);
        setCalcResult(res);
      } else if (toolId.includes("assignment-word-count-helper")) {
        const res = StudentEngine.analyzeAssignmentWordCount(essayText, essayTargetWords);
        setCalcResult(res);
      } else if (toolId.includes("exam-countdown") || toolId.includes("study-break-interval")) {
        const res = StudentEngine.calculateSpacedRepetitionIntervals(examDate);
        setCalcResult(res);
      } else if (toolId.includes("gpa-calculator") && !toolId.includes("cgpa")) {
        const res = StudentEngine.calculateGPA(courses);
        setCalcResult(res);
      } else if (toolId.includes("cgpa-calculator")) {
        const res = StudentEngine.calculateCGPA(semesters);
        setCalcResult(res);
      } else if (toolId.includes("final-grade-calculator") || (toolId.includes("grade-calculator") && !toolId.includes("assignment"))) {
        const res = StudentEngine.calculateFinalGradeNeeded(currentGrade, targetGrade, finalExamWeight);
        setCalcResult(res);
      } else if (toolId.includes("attendance-calculator")) {
        const res = StudentEngine.calculateAttendance(totalClasses, attendedClasses, targetAttendance);
        setCalcResult(res);
      } else if (toolId.includes("study-time-calculator") || toolId.includes("study-schedule")) {
        const res = StudentEngine.calculateStudyTime(creditLoad, studyRigor);
        setCalcResult(res);
      } else if (toolId.includes("citation-helper")) {
        const res = StudentEngine.formatAcademicCitation(citStyle, citType, {
          authors: citAuthors,
          title: citTitle,
          year: citYear,
          publisherOrJournal: citPub,
          url: citUrl,
        });
        setCalcResult(res);
      } else if (toolId.includes("student-budget")) {
        const res = StudentEngine.calculateStudentBudget(
          { grants: incGrants, jobs: incJobs, family: incFamily, savings: incSavings },
          { tuition: expTuition, rent: expRent, food: expFood, books: expBooks, transport: expTransport, leisure: expLeisure }
        );
        setCalcResult(res);
      } else if (toolId.includes("timetable") || toolId.includes("planner")) {
        setCalcResult({
          title: "Weekly Class Schedule",
          formattedResult: `${timetable.length} Active Courses`,
          formula: "Weekly Timetable Grid",
          explanation: "Interactive weekly class timetable with custom room locations.",
          steps: ["Add weekly class lectures and labs.", "Print or copy your schedule grid."],
          breakdown: timetable.map((t) => ({ label: `${t.day} - ${t.course}`, value: `${t.time} (${t.room})` })),
        });
      } else {
        const res = StudentEngine.calculateGPA(courses);
        setCalcResult(res);
      }
      incrementGuestUsage(toolId, !!currentUser);
    } catch (err: any) {
      setErrorMessage(err.message || "Please verify your input fields.");
    }
  };

  const handleCopy = () => {
    if (!calcResult) return;
    const text = `${calcResult.title}\nResult: ${calcResult.formattedResult}\nFormula: ${calcResult.formula}\n` +
      calcResult.breakdown.map((b) => `${b.label}: ${b.value}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handlers for Course List (GPA)
  const addCourse = () => {
    setCourses([...courses, { name: `Course ${courses.length + 1}`, grade: "A", credits: 3 }]);
  };
  const updateCourse = (index: number, field: keyof StudentEngine.CourseInput, value: any) => {
    const updated = [...courses];
    updated[index] = { ...updated[index], [field]: value };
    setCourses(updated);
  };
  const removeCourse = (index: number) => {
    if (courses.length <= 1) return;
    setCourses(courses.filter((_, i) => i !== index));
  };

  // Handlers for Semester List (CGPA)
  const addSemester = () => {
    setSemesters([...semesters, { name: `Semester ${semesters.length + 1}`, gpa: 3.5, credits: 15 }]);
  };
  const updateSemester = (index: number, field: keyof StudentEngine.SemesterInput, value: any) => {
    const updated = [...semesters];
    updated[index] = { ...updated[index], [field]: value };
    setSemesters(updated);
  };
  const removeSemester = (index: number) => {
    if (semesters.length <= 1) return;
    setSemesters(semesters.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
        <GraduationCap className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">Academic Privacy Guaranteed</span>
          All academic calculations, course inputs, and budgets are calculated 100% locally in your web browser. No grades or personal study data are sent to external servers.
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Workspace Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {toolName} Workspace
            </span>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. GPA CALCULATOR INPUTS */}
          {(toolId.includes("gpa-calculator") && !toolId.includes("cgpa")) && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  Course Grade List (4.0 Scale)
                </label>
                <button
                  onClick={addCourse}
                  className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Course</span>
                </button>
              </div>

              <div className="space-y-3">
                {courses.map((course, idx) => (
                  <div key={idx} className="flex flex-wrap sm:flex-nowrap gap-2 items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <input
                      type="text"
                      placeholder="Course Title"
                      value={course.name}
                      onChange={(e) => updateCourse(idx, "name", e.target.value)}
                      className="w-full sm:w-1/2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium"
                    />
                    <select
                      value={course.grade}
                      onChange={(e) => updateCourse(idx, "grade", e.target.value)}
                      className="w-1/2 sm:w-1/4 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold"
                    >
                      {Object.keys(StudentEngine.GRADE_POINT_MAP).map((g) => (
                        <option key={g} value={g}>
                          {g} ({StudentEngine.GRADE_POINT_MAP[g].toFixed(1)})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="0"
                      max="12"
                      placeholder="Credits"
                      value={course.credits}
                      onChange={(e) => updateCourse(idx, "credits", Number(e.target.value))}
                      className="w-1/3 sm:w-1/5 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium"
                    />
                    {courses.length > 1 && (
                      <button
                        onClick={() => removeCourse(idx)}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors cursor-pointer"
                        title="Remove Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. CGPA CALCULATOR INPUTS */}
          {toolId.includes("cgpa-calculator") && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  Semester History
                </label>
                <button
                  onClick={addSemester}
                  className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Term</span>
                </button>
              </div>

              <div className="space-y-3">
                {semesters.map((sem, idx) => (
                  <div key={idx} className="flex flex-wrap sm:flex-nowrap gap-2 items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <input
                      type="text"
                      placeholder="Semester Name"
                      value={sem.name}
                      onChange={(e) => updateSemester(idx, "name", e.target.value)}
                      className="w-full sm:w-1/2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium"
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4.0"
                      placeholder="GPA"
                      value={sem.gpa}
                      onChange={(e) => updateSemester(idx, "gpa", Number(e.target.value))}
                      className="w-1/2 sm:w-1/4 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium"
                    />
                    <input
                      type="number"
                      min="0"
                      max="30"
                      placeholder="Credits"
                      value={sem.credits}
                      onChange={(e) => updateSemester(idx, "credits", Number(e.target.value))}
                      className="w-1/3 sm:w-1/5 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium"
                    />
                    {semesters.length > 1 && (
                      <button
                        onClick={() => removeSemester(idx)}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors cursor-pointer"
                        title="Remove Semester"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. FINAL GRADE CALCULATOR INPUTS */}
          {(toolId.includes("final-grade-calculator") || toolId.includes("grade-calculator") || toolId.includes("semester-grade")) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                  Current Grade (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={currentGrade}
                  onChange={(e) => setCurrentGrade(Number(e.target.value))}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                  Target Grade (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(Number(e.target.value))}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                  Final Exam Weight (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={finalExamWeight}
                  onChange={(e) => setFinalExamWeight(Number(e.target.value))}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium"
                />
              </div>
            </div>
          )}

          {/* 4. ATTENDANCE CALCULATOR INPUTS */}
          {toolId.includes("attendance-calculator") && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                  Total Conducted Classes
                </label>
                <input
                  type="number"
                  min="1"
                  value={totalClasses}
                  onChange={(e) => setTotalClasses(Number(e.target.value))}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                  Attended Classes
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalClasses}
                  value={attendedClasses}
                  onChange={(e) => setAttendedClasses(Number(e.target.value))}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                  Target Requirement (%)
                </label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={targetAttendance}
                  onChange={(e) => setTargetAttendance(Number(e.target.value))}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium"
                />
              </div>
            </div>
          )}

          {/* 5. STUDY TIME & SCHEDULE CALCULATOR INPUTS */}
          {(toolId.includes("study-time-calculator") || toolId.includes("study-schedule")) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                  Enrolled Credit Load
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={creditLoad}
                  onChange={(e) => setCreditLoad(Number(e.target.value))}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                  Course Rigor & Difficulty
                </label>
                <select
                  value={studyRigor}
                  onChange={(e) => setStudyRigor(e.target.value as any)}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold"
                >
                  <option value="light">Light Rigor (1.5 hrs per credit)</option>
                  <option value="moderate">Moderate Rigor (2 hrs per credit)</option>
                  <option value="demanding">Demanding / STEM (3 hrs per credit)</option>
                  <option value="intense">Intense Honors / Med (4 hrs per credit)</option>
                </select>
              </div>
            </div>
          )}

          {/* 6. POMODORO TIMER */}
          {toolId.includes("pomodoro-timer") && (
            <div className="space-y-6 text-center bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => switchPomoMode("work")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    pomoMode === "work"
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                  }`}
                >
                  Focus (25m)
                </button>
                <button
                  onClick={() => switchPomoMode("shortBreak")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    pomoMode === "shortBreak"
                      ? "bg-teal-600 text-white shadow-lg"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                  }`}
                >
                  Short Break (5m)
                </button>
                <button
                  onClick={() => switchPomoMode("longBreak")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    pomoMode === "longBreak"
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                  }`}
                >
                  Long Break (15m)
                </button>
              </div>

              <div className="text-6xl sm:text-7xl font-mono font-black text-slate-900 dark:text-white tracking-wider my-4">
                {String(pomoMinutes).padStart(2, "0")}:{String(pomoSeconds).padStart(2, "0")}
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setPomoIsActive(!pomoIsActive)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer text-sm"
                >
                  {pomoIsActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  <span>{pomoIsActive ? "Pause Timer" : "Start Session"}</span>
                </button>
                <button
                  onClick={() => switchPomoMode(pomoMode)}
                  className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 pt-2">
                Completed Focus Sessions Today: <span className="font-bold text-emerald-600 dark:text-emerald-400">{pomoCompletedCount}</span>
              </div>
            </div>
          )}

          {/* 7. CITATION HELPER INPUTS */}
          {toolId.includes("citation-helper") && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                    Citation Format Style
                  </label>
                  <select
                    value={citStyle}
                    onChange={(e) => setCitStyle(e.target.value as any)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                  >
                    <option value="APA">APA 7th Edition</option>
                    <option value="MLA">MLA 9th Edition</option>
                    <option value="Chicago">Chicago Manual of Style</option>
                    <option value="Harvard">Harvard Referencing</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                    Source Medium
                  </label>
                  <select
                    value={citType}
                    onChange={(e) => setCitType(e.target.value as any)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                  >
                    <option value="journal">Academic Journal Article</option>
                    <option value="book">Book / Monograph</option>
                    <option value="website">Web Page / Online Article</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Authors</label>
                  <input
                    type="text"
                    value={citAuthors}
                    onChange={(e) => setCitAuthors(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Article / Book Title</label>
                  <input
                    type="text"
                    value={citTitle}
                    onChange={(e) => setCitTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Publication Year</label>
                    <input
                      type="text"
                      value={citYear}
                      onChange={(e) => setCitYear(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Journal / Publisher</label>
                    <input
                      type="text"
                      value={citPub}
                      onChange={(e) => setCitPub(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">DOI or Web URL</label>
                  <input
                    type="text"
                    value={citUrl}
                    onChange={(e) => setCitUrl(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 8. STUDENT BUDGET INPUTS */}
          {toolId.includes("student-budget") && (
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block border-b pb-1">
                Monthly Income & Funding ($)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Scholarships/Grants</label>
                  <input
                    type="number"
                    value={incGrants}
                    onChange={(e) => setIncGrants(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Part-Time Job</label>
                  <input
                    type="number"
                    value={incJobs}
                    onChange={(e) => setIncJobs(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Family Allowance</label>
                  <input
                    type="number"
                    value={incFamily}
                    onChange={(e) => setIncFamily(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Savings Withdrawal</label>
                  <input
                    type="number"
                    value={incSavings}
                    onChange={(e) => setIncSavings(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block border-b pb-1 pt-2">
                Monthly Living & Academic Expenses ($)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Tuition & Fees</label>
                  <input
                    type="number"
                    value={expTuition}
                    onChange={(e) => setExpTuition(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Housing / Rent</label>
                  <input
                    type="number"
                    value={expRent}
                    onChange={(e) => setExpRent(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Food & Groceries</label>
                  <input
                    type="number"
                    value={expFood}
                    onChange={(e) => setExpFood(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Books & Supplies</label>
                  <input
                    type="number"
                    value={expBooks}
                    onChange={(e) => setExpBooks(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Transport / Pass</label>
                  <input
                    type="number"
                    value={expTransport}
                    onChange={(e) => setExpTransport(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Leisure / Personal</label>
                  <input
                    type="number"
                    value={expLeisure}
                    onChange={(e) => setExpLeisure(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 9. GPA TO PERCENTAGE INPUTS */}
          {toolId.includes("gpa-to-percentage") && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                    Grading Scale Standard
                  </label>
                  <select
                    value={gpaScale}
                    onChange={(e) => setGpaScale(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold"
                  >
                    <option value={4.0}>4.0 Scale (USA / Canada Standard)</option>
                    <option value={9.0}>9.0 Scale (Canada York / OMSAS)</option>
                    <option value={10.0}>10.0 Scale (Europe / Mexico / India CGPA)</option>
                    <option value={5.0}>5.0 Scale (Germany / Middle East / UK ECTS)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                    Earned GPA / CGPA Score
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={gpaScale}
                    value={gpaVal}
                    onChange={(e) => setGpaVal(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 10. ASSIGNMENT GRADE CALCULATOR INPUTS */}
          {toolId.includes("assignment-grade-calculator") && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  Weighted Course Categories
                </label>
                <button
                  onClick={() => setAssignmentCats([...assignmentCats, { name: "New Assignment", weightPercent: 10, scoreEarned: 80, maxScore: 100 }])}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Category
                </button>
              </div>
              <div className="space-y-2">
                {assignmentCats.map((cat, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => {
                        const updated = [...assignmentCats];
                        updated[idx].name = e.target.value;
                        setAssignmentCats(updated);
                      }}
                      className="col-span-4 p-2 bg-white dark:bg-slate-900 border rounded-xl text-xs"
                      placeholder="Category Title"
                    />
                    <input
                      type="number"
                      value={cat.weightPercent}
                      onChange={(e) => {
                        const updated = [...assignmentCats];
                        updated[idx].weightPercent = Number(e.target.value);
                        setAssignmentCats(updated);
                      }}
                      className="col-span-3 p-2 bg-white dark:bg-slate-900 border rounded-xl text-xs"
                      placeholder="Weight %"
                    />
                    <input
                      type="number"
                      value={cat.scoreEarned}
                      onChange={(e) => {
                        const updated = [...assignmentCats];
                        updated[idx].scoreEarned = Number(e.target.value);
                        setAssignmentCats(updated);
                      }}
                      className="col-span-2 p-2 bg-white dark:bg-slate-900 border rounded-xl text-xs"
                      placeholder="Earned"
                    />
                    <input
                      type="number"
                      value={cat.maxScore}
                      onChange={(e) => {
                        const updated = [...assignmentCats];
                        updated[idx].maxScore = Number(e.target.value);
                        setAssignmentCats(updated);
                      }}
                      className="col-span-2 p-2 bg-white dark:bg-slate-900 border rounded-xl text-xs"
                      placeholder="Max"
                    />
                    <button
                      onClick={() => setAssignmentCats(assignmentCats.filter((_, i) => i !== idx))}
                      className="col-span-1 text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. ESSAY WORD COUNT HELPER INPUTS */}
          {toolId.includes("assignment-word-count-helper") && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                  Target Essay Word Goal
                </label>
                <input
                  type="number"
                  value={essayTargetWords}
                  onChange={(e) => setEssayTargetWords(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs font-semibold mb-3"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                  Essay Draft / Assignment Text
                </label>
                <textarea
                  rows={6}
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs"
                  placeholder="Paste or write your essay text here..."
                />
              </div>
            </div>
          )}

          {/* 12. EXAM COUNTDOWN & REVISION INPUTS */}
          {(toolId.includes("exam-countdown") || toolId.includes("study-break-interval")) && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                    Subject / Exam Title
                  </label>
                  <input
                    type="text"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border rounded-2xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block mb-1">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border rounded-2xl text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 13. TIMETABLE PLANNER INPUTS */}
          {(toolId.includes("timetable") || toolId.includes("planner")) && (
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block">
                Add Class or Study Session
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Course Title"
                  value={newTtCourse}
                  onChange={(e) => setNewTtCourse(e.target.value)}
                  className="p-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs"
                />
                <select
                  value={newTtDay}
                  onChange={(e) => setNewTtDay(e.target.value)}
                  className="p-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs font-semibold"
                >
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Time Slot"
                  value={newTtTime}
                  onChange={(e) => setNewTtTime(e.target.value)}
                  className="p-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs"
                />
                <input
                  type="text"
                  placeholder="Room / Hall"
                  value={newTtRoom}
                  onChange={(e) => setNewTtRoom(e.target.value)}
                  className="p-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs"
                />
              </div>
              <button
                onClick={() => {
                  if (!newTtCourse) return;
                  setTimetable([
                    ...timetable,
                    { course: newTtCourse, day: newTtDay, time: newTtTime, room: newTtRoom, color: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" }
                  ]);
                  setNewTtCourse("");
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                + Add Class Slot to Timetable
              </button>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">Weekly Schedule Entries:</span>
                {timetable.map((item, idx) => (
                  <div key={idx} className={`p-2.5 rounded-xl text-xs flex justify-between items-center ${item.color}`}>
                    <div>
                      <span className="font-bold block">{item.day}: {item.course}</span>
                      <span className="text-[11px] opacity-80">{item.time} ({item.room})</span>
                    </div>
                    <button
                      onClick={() => setTimetable(timetable.filter((_, i) => i !== idx))}
                      className="text-rose-600 hover:text-rose-800 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Calculation Results Display */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-6">
          {calcResult ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  {calcResult.title}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Copy Results"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-emerald-100 tracking-tight leading-tight">
                {calcResult.formattedResult}
              </div>

              {calcResult.formula && (
                <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800/40 text-xs font-mono text-emerald-300">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-0.5">Formula Derivative</span>
                  {calcResult.formula}
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-emerald-800/60">
                {calcResult.breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-emerald-200/90">{item.label}:</span>
                    <span className="font-bold text-white text-right max-w-[50%]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-emerald-200 text-xs">
              Fill in your course metrics above to view instant calculation results.
            </div>
          )}

          <div className="text-[11px] text-emerald-300/80 bg-emerald-950/50 p-3 rounded-xl border border-emerald-800/40">
            🎓 Instant client-side academic calculations for GPA, grades, and study planning.
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
