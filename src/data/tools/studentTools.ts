import { AITool } from "../../types";

export const STUDENT_TOOLS: AITool[] = [
  {
    id: "gpa-calculator",
    name: "Free GPA Calculator",
    slug: "gpa-calculator",
    tagline: "Calculate semester and cumulative Grade Point Average on a 4.0 scale.",
    description: "Calculate your semester and cumulative Grade Point Average (GPA) on standard 4.0 scale with weighted credit hours.",
    category: "student",
    iconName: "GraduationCap",
    route: "/en/gpa-calculator",
    isPopular: true,
    rating: 4.9,
    ratingCount: 2840,
    usageCount: 85400,
    inputLabel: "Course & Grade Entry:",
    inputPlaceholder: "Enter courses, letter grades, and credit hours...",
    optionsConfig: {},
    tags: ["gpa calculator", "college gpa", "high school gpa", "4.0 scale gpa", "student calculator", "grade point average"],
    searchKeywords: [
      "gpa calculator",
      "college gpa calculator",
      "high school gpa calculator",
      "how to calculate gpa",
      "4.0 gpa scale calculator",
      "cumulative gpa calculator",
      "semester gpa calculator",
      "grade point average calculator"
    ],
    seoContent: {
      metaTitle: "Free GPA Calculator Online — Calculate High School & College GPA (4.0 Scale)",
      metaDescription: "Free online GPA calculator for college and high school students. Compute semester GPA, weighted credits, and letter grade quality points instantly on a 4.0 scale.",
      overview: "Our free online GPA calculator allows college, university, and high school students to calculate their exact Grade Point Average (GPA) instantly. Simply input your course names, letter grades, and credit hours to compute your weighted semester GPA and academic standing.",
      keyFeatures: [
        "Standard 4.0 GPA scale calculation",
        "Weighted credit hour quality points",
        "Supports letter grades (A+, A, A-, B+, B, C, D, F)",
        "100% private in-browser local calculation"
      ],
      useCases: [
        "Calculate college semester GPA before final transcripts",
        "Plan high school cumulative GPA for college admissions",
        "Track academic scholarship eligibility"
      ],
      howToUseSteps: [
        "Add your course title or subject name.",
        "Select your letter grade (A+, A, A-, B+, B, C, D, F).",
        "Enter the credit hours assigned to each course.",
        "View your computed GPA and quality points instantly."
      ],
      faqs: [
        {
          question: "How is GPA calculated mathematically?",
          answer: "GPA is calculated by multiplying each course's grade points by its credit hours to determine Quality Points (QP). The total Quality Points across all courses are then divided by total credit hours."
        },
        {
          question: "Can I calculate GPA for multiple semesters?",
          answer: "Yes! Use our companion CGPA Calculator to combine GPAs across multiple semesters with cumulative credit weightings."
        }
      ]
    }
  },
  {
    id: "cgpa-calculator",
    name: "Free CGPA Calculator",
    slug: "cgpa-calculator",
    tagline: "Calculate Cumulative GPA across multiple semesters and degree terms.",
    description: "Calculate Cumulative Grade Point Average (CGPA) across multiple semesters and academic terms with custom credit weightings.",
    category: "student",
    iconName: "Award",
    route: "/en/cgpa-calculator",
    isPopular: true,
    rating: 4.8,
    ratingCount: 1950,
    usageCount: 62000,
    inputLabel: "Semester GPA & Credit Entry:",
    inputPlaceholder: "Enter semester GPAs and credit totals...",
    optionsConfig: {},
    tags: ["cgpa calculator", "cumulative gpa", "overall gpa", "university cgpa", "degree gpa calculator"],
    searchKeywords: [
      "cgpa calculator",
      "cumulative grade point average",
      "how to calculate cgpa",
      "university cgpa calculator",
      "overall gpa calculator",
      "cgpa to percentage converter"
    ],
    seoContent: {
      metaTitle: "Free CGPA Calculator Online — Calculate Cumulative GPA Across Semesters",
      metaDescription: "Calculate overall Cumulative Grade Point Average (CGPA) across multiple academic semesters. Supports weighted credit hours for university and college degrees.",
      overview: "Easily compute your overall Cumulative Grade Point Average (CGPA) for university degrees and multi-year academic programs. Input your individual semester GPAs and credit totals to get your exact cumulative academic standing.",
      keyFeatures: [
        "Multi-semester cumulative tracking",
        "Weighted term credit hours",
        "Instant academic standing classification",
        "Supports 4.0 scale degree programs"
      ],
      useCases: [
        "Calculate final graduation CGPA for resume applications",
        "Track progress toward honors distinction (Cum Laude, Dean's List)",
        "Convert semester transcripts into cumulative GPA"
      ],
      howToUseSteps: [
        "Click Add Term to add semesters.",
        "Enter your semester GPA (e.g., 3.8).",
        "Enter total credit hours completed for that term.",
        "Read your cumulative CGPA instantly."
      ],
      faqs: [
        {
          question: "What is the difference between GPA and CGPA?",
          answer: "GPA usually refers to performance in a single term or semester, while CGPA measures your overall cumulative average across all completed terms."
        }
      ]
    }
  },
  {
    id: "final-grade-calculator",
    name: "Free Final Grade Calculator",
    slug: "final-grade-calculator",
    tagline: "Determine the exact final exam score needed to reach your target grade.",
    description: "Find out what score you need on your final exam to get your desired overall target grade in a class.",
    category: "student",
    iconName: "Target",
    route: "/en/final-grade-calculator",
    isPopular: true,
    rating: 4.9,
    ratingCount: 3100,
    usageCount: 94000,
    inputLabel: "Grade Target Inputs:",
    inputPlaceholder: "Enter current grade, target grade, and final weight...",
    optionsConfig: {},
    tags: ["final grade calculator", "final exam score calculator", "what score do i need on final", "target class grade"],
    searchKeywords: [
      "final grade calculator",
      "what do i need on my final exam",
      "final exam calculator",
      "calculate grade needed on final",
      "course grade target calculator"
    ],
    seoContent: {
      metaTitle: "Free Final Grade Calculator — Calculate Required Final Exam Score",
      metaDescription: "Calculate what grade you need on your final exam to achieve your target course grade. Supports weighted final exam percentages for college and high school classes.",
      overview: "Stop guessing before finals week! Our free Final Grade Calculator shows you the exact score required on your final exam to reach your target letter grade or percentage in any course.",
      keyFeatures: [
        "Calculates exact target score needed on final exam",
        "Supports weighted final exam percentages",
        "Feasibility warnings for scores above 100%",
        "Instant client-side feedback"
      ],
      useCases: [
        "Determine study intensity needed for upcoming finals",
        "Check if getting an A in a difficult course is mathematically possible",
        "Plan final exam score minimums to maintain passing grades"
      ],
      howToUseSteps: [
        "Enter your current overall percentage grade in the class.",
        "Enter your desired target grade for the course.",
        "Enter the weight percentage of the final exam (e.g., 30%).",
        "Read your required final exam score instantly."
      ],
      faqs: [
        {
          question: "What if the required final exam score is over 100%?",
          answer: "If the calculator outputs a required score above 100%, reaching your target grade would require extra credit points from your instructor."
        }
      ]
    }
  },
  {
    id: "attendance-calculator",
    name: "Free Attendance Calculator",
    slug: "attendance-calculator",
    tagline: "Calculate class attendance percentage and safe skip allowance.",
    description: "Calculate your attendance percentage and determine how many classes you can safely skip or need to attend.",
    category: "student",
    iconName: "Calendar",
    route: "/en/attendance-calculator",
    isPopular: true,
    rating: 4.8,
    ratingCount: 2200,
    usageCount: 71000,
    inputLabel: "Attendance Class Metrics:",
    inputPlaceholder: "Enter conducted classes and attended classes...",
    optionsConfig: {},
    tags: ["attendance calculator", "safe skip calculator", "bunk calculator", "college attendance percentage", "class attendance requirement"],
    searchKeywords: [
      "attendance calculator",
      "class attendance percentage",
      "bunk calculator",
      "how many classes can i skip",
      "75 percent attendance calculator",
      "college attendance calculator"
    ],
    seoContent: {
      metaTitle: "Free Attendance & Skip Day Calculator — College & School Attendance",
      metaDescription: "Calculate class attendance percentage and find out how many future classes you can safely skip or must attend to meet your 75% or custom attendance criteria.",
      overview: "Ensure you meet your institution's mandatory attendance policy without missing out on study balance. Enter your total conducted classes and attended sessions to check your percentage and safe skip allowance.",
      keyFeatures: [
        "Calculates current attendance percentage instantly",
        "Shows safe skip allowance without dropping below 75%",
        "Shows consecutive classes needed if currently below target",
        "Customizable attendance target threshold (50% to 100%)"
      ],
      useCases: [
        "Check if you can miss a lecture for exam prep or medical leave",
        "Track college mandatory 75% attendance compliance",
        "Calculate recovery plan for missed lab sessions"
      ],
      howToUseSteps: [
        "Enter total conducted classes.",
        "Enter total classes attended.",
        "Set your target attendance threshold percentage (default 75%).",
        "View current percentage and safe skip recommendation."
      ],
      faqs: [
        {
          question: "How does the safe skip calculation work?",
          answer: "It calculates the maximum number of additional classes you can miss such that (Attended Classes) / (Total Classes + Missed Classes) remains greater than or equal to your target percentage."
        }
      ]
    }
  },
  {
    id: "study-time-calculator",
    name: "Free Study Time Calculator",
    slug: "study-time-calculator",
    tagline: "Calculate recommended weekly study hours per enrolled credit.",
    description: "Determine recommended weekly study hours based on your credit load and subject difficulty level.",
    category: "student",
    iconName: "Clock",
    route: "/en/study-time-calculator",
    isPopular: false,
    rating: 4.7,
    ratingCount: 1400,
    usageCount: 42000,
    inputLabel: "Enrolled Credit Load:",
    inputPlaceholder: "Enter credit hours and select course difficulty...",
    optionsConfig: {},
    tags: ["study time calculator", "weekly study hours", "college credit study ratio", "study schedule planner", "academic workload"],
    searchKeywords: [
      "study time calculator",
      "how many hours to study per credit",
      "weekly study hours calculator",
      "college study time planner",
      "academic study ratio"
    ],
    seoContent: {
      metaTitle: "Free Study Time Calculator — Recommended Weekly Hours per Credit",
      metaDescription: "Calculate recommended weekly out-of-class study hours based on course credit units and subject difficulty. Plan your college study schedule effectively.",
      overview: "The standard academic rule of thumb suggests spending 2 to 3 hours studying out of class for every 1 credit hour enrolled. Use our calculator to determine your optimal weekly study time for peak academic performance.",
      keyFeatures: [
        "Calculates weekly & daily study hour targets",
        "Adjusts for course difficulty (Light, Moderate, Demanding, STEM)",
        "Includes lecture vs independent study breakdowns",
        "Prevents student study burnout"
      ],
      useCases: [
        "Plan weekly study schedule for 12 to 18 credit semesters",
        "Balance part-time jobs with college coursework",
        "Organize exam revision timelines"
      ],
      howToUseSteps: [
        "Enter total enrolled course credits.",
        "Select course difficulty rigor.",
        "View recommended weekly and daily study targets."
      ],
      faqs: [
        {
          question: "How many hours should I study for 15 credits?",
          answer: "For a standard 15-credit load, expect 15 hours in lecture and 30 to 45 hours of independent weekly study, totaling 45–60 academic hours."
        }
      ]
    }
  },
  {
    id: "pomodoro-timer",
    name: "Free Online Pomodoro Timer",
    slug: "pomodoro-timer",
    tagline: "Boost focus with 25-minute study sprints and break intervals.",
    description: "Boost study focus and productivity with an interactive 25-minute Pomodoro timer with automated short and long break intervals.",
    category: "student",
    iconName: "Clock",
    route: "/en/pomodoro-timer",
    isPopular: true,
    rating: 4.9,
    ratingCount: 4200,
    usageCount: 125000,
    inputLabel: "Timer Mode & Sprints:",
    inputPlaceholder: "Start 25-minute focus session...",
    optionsConfig: {},
    tags: ["pomodoro timer", "online study timer", "25 minute focus timer", "pomodoro technique", "study productivity timer"],
    searchKeywords: [
      "pomodoro timer",
      "online study timer",
      "25 minute timer",
      "pomodoro focus timer",
      "study timer with breaks",
      "free pomodoro online"
    ],
    seoContent: {
      metaTitle: "Free Online Pomodoro Timer — 25-Minute Study & Focus Timer",
      metaDescription: "Free online Pomodoro timer for studying and deep focus. Features customizable 25-minute focus sessions, 5-minute short breaks, and session completion counter.",
      overview: "The Pomodoro Technique breaks study sessions into structured 25-minute sprints separated by 5-minute rest intervals. Use our distraction-free online timer to stay focused during exam preparation and essay writing.",
      keyFeatures: [
        "25-minute focus work timer",
        "Automated 5-minute short & 15-minute long breaks",
        "Completed session counter",
        "Distraction-free responsive interface"
      ],
      useCases: [
        "Deep focus study sessions for exams",
        "Writing essays and research papers without procrastination",
        "Programming and coding problem solving"
      ],
      howToUseSteps: [
        "Select Focus mode (25 minutes).",
        "Click Start Session.",
        "Study continuously until the timer alerts.",
        "Enjoy a 5-minute break before starting the next cycle."
      ],
      faqs: [
        {
          question: "Why is the Pomodoro technique effective for studying?",
          answer: "It prevents mental burnout and keeps focus high by training your brain to work in intense, manageable intervals."
        }
      ]
    }
  },
  {
    id: "citation-helper",
    name: "Free Academic Citation Helper",
    slug: "citation-helper",
    tagline: "Format citations in APA 7, MLA 9, Chicago, and Harvard styles.",
    description: "Generate accurate academic citations for books, journals, and websites in APA 7th, MLA 9th, Chicago, and Harvard formats.",
    category: "student",
    iconName: "FileText",
    route: "/en/citation-helper",
    isPopular: true,
    rating: 4.8,
    ratingCount: 3400,
    usageCount: 98000,
    inputLabel: "Source & Author Metadata:",
    inputPlaceholder: "Enter author, title, year, journal, DOI...",
    optionsConfig: {},
    tags: ["citation generator", "apa citation helper", "mla citation generator", "chicago style citation", "academic reference formatter"],
    searchKeywords: [
      "citation generator",
      "free apa citation generator",
      "mla 9 citation maker",
      "chicago citation generator",
      "harvard reference generator",
      "academic citation helper"
    ],
    seoContent: {
      metaTitle: "Free Citation Generator Online — APA 7, MLA 9, Chicago & Harvard",
      metaDescription: "Generate accurate APA 7th edition, MLA 9th edition, Chicago, and Harvard academic citations instantly for books, journal articles, and websites.",
      overview: "Format your research paper bibliography in seconds! Our free citation builder automatically structures citations in APA 7th edition, MLA 9th edition, Chicago, and Harvard styles.",
      keyFeatures: [
        "Supports APA 7th, MLA 9th, Chicago, & Harvard styles",
        "Formats Journal Articles, Books, and Websites",
        "One-click copy to clipboard",
        "100% free with no account required"
      ],
      useCases: [
        "Generate reference entries for college research papers",
        "Build Works Cited lists for high school essays",
        "Format DOI links and academic journal citations"
      ],
      howToUseSteps: [
        "Select your required citation style (APA, MLA, Chicago, Harvard).",
        "Select source medium (Journal, Book, Website).",
        "Enter authors, title, year, publisher, and DOI/URL.",
        "Copy formatted citation directly into your paper."
      ],
      faqs: [
        {
          question: "Is this citation generator free to use?",
          answer: "Yes! 100% free with no subscription or account registration required."
        }
      ]
    }
  },
  {
    id: "student-budget-calculator",
    name: "Free Student Budget Calculator",
    slug: "student-budget-calculator",
    tagline: "Track tuition, grants, rent, food, and monthly student cashflow.",
    description: "Manage monthly student finances, track grants, part-time jobs, rent, tuition, books, and living expenses.",
    category: "student",
    iconName: "DollarSign",
    route: "/en/student-budget-calculator",
    isPopular: false,
    rating: 4.7,
    ratingCount: 1650,
    usageCount: 38000,
    inputLabel: "Monthly Income & Living Expenses:",
    inputPlaceholder: "Enter monthly grants, job income, rent, food, books...",
    optionsConfig: {},
    tags: ["student budget calculator", "college financial planner", "tuition and living expense tracker", "student money planner"],
    searchKeywords: [
      "student budget calculator",
      "college budget planner",
      "university expense calculator",
      "student monthly budget",
      "how to budget as a student"
    ],
    seoContent: {
      metaTitle: "Free Student Budget Calculator — Plan College & University Expenses",
      metaDescription: "Plan your monthly student finances with our free budget calculator. Balance tuition, grants, part-time income, rent, food, and textbooks effortlessly.",
      overview: "Take control of your college finances. Calculate your monthly net cashflow by balancing scholarship grants, part-time job income, tuition fees, rent, textbooks, and groceries.",
      keyFeatures: [
        "Tracks student income (grants, jobs, family allowance)",
        "Tracks living & academic expenses (rent, tuition, food, books)",
        "Calculates monthly net surplus or deficit",
        "Provides actionable financial advice"
      ],
      useCases: [
        "Plan monthly budget for campus living",
        "Avoid accumulating credit debt during college",
        "Allocate textbook & food allowances wisely"
      ],
      howToUseSteps: [
        "Enter monthly income and financial aid sources.",
        "Enter monthly expenses (tuition, housing, food, books).",
        "Review your net cashflow balance."
      ],
      faqs: [
        {
          question: "Why is student budgeting important?",
          answer: "Creating a monthly budget prevents student loan debt accumulation and ensures essential living expenses are covered throughout the semester."
        }
      ]
    }
  },
  {
    id: "gpa-to-percentage-converter",
    name: "Free GPA to Percentage Converter",
    slug: "gpa-to-percentage-converter",
    tagline: "Convert GPA scores on 4.0, 5.0, or 10.0 scales to percentage equivalents.",
    description: "Convert Grade Point Average (GPA or CGPA) scores on 4.0, 5.0, or 10.0 scale into equivalent percentage marks and international honors classifications.",
    category: "student",
    iconName: "Percent",
    route: "/en/gpa-to-percentage-converter",
    isPopular: true,
    rating: 4.9,
    ratingCount: 3820,
    usageCount: 112000,
    inputLabel: "GPA Score & Scale Selection:",
    inputPlaceholder: "Enter GPA score and select maximum scale...",
    optionsConfig: {},
    tags: ["gpa to percentage converter", "cgpa to percentage", "4.0 gpa to percentage", "10.0 cgpa conversion", "international grade converter"],
    searchKeywords: [
      "gpa to percentage converter",
      "cgpa to percentage calculator",
      "how to convert 4.0 gpa to percentage",
      "10 point cgpa to percentage",
      "gpa percentage formula",
      "convert gpa to percent"
    ],
    seoContent: {
      metaTitle: "Free GPA to Percentage Converter — Convert 4.0, 5.0 & 10.0 Scale GPA",
      metaDescription: "Convert GPA and CGPA scores on 4.0, 5.0, and 10.0 scales into percentage equivalents and international degree classifications (First Class, Distinction, 2:1) instantly.",
      overview: "Convert your Grade Point Average (GPA or CGPA) directly into a percentage score! Works for US, Canadian, European, Pakistani, Indian, and global grading scales. Perfect for job applications, scholarship forms, and graduate school admissions.",
      keyFeatures: [
        "Supports 4.0 scale (US/Canada), 10.0 scale (India/Europe), & 5.0 scale",
        "Calculates exact percentage equivalents instantly",
        "Displays international degree honors classification",
        "100% free and client-side private"
      ],
      useCases: [
        "Convert GPA for job application minimum grade forms",
        "Translate transcript scores for overseas university applications",
        "Calculate scholarship percentage eligibility"
      ],
      howToUseSteps: [
        "Select your institution's GPA scale (4.0, 5.0, or 10.0).",
        "Enter your cumulative GPA or CGPA score.",
        "Read your percentage equivalent and honors classification."
      ],
      faqs: [
        {
          question: "How is 4.0 GPA converted to percentage?",
          answer: "On a standard 4.0 scale, Percentage = (GPA / 4.0) × 100. For example, a 3.6 GPA equates to 90%."
        },
        {
          question: "How is 10.0 CGPA converted to percentage?",
          answer: "Under CBSE and European conventions, Percentage = CGPA × 9.5. For example, an 8.0 CGPA equates to 76%."
        }
      ]
    }
  },
  {
    id: "assignment-grade-calculator",
    name: "Free Course & Assignment Grade Calculator",
    slug: "assignment-grade-calculator",
    tagline: "Calculate weighted course grades across homework, quizzes, and exams.",
    description: "Calculate your current weighted course grade and letter grade average across quizzes, homework assignments, midterms, and final exams.",
    category: "student",
    iconName: "BookOpen",
    route: "/en/assignment-grade-calculator",
    isPopular: true,
    rating: 4.8,
    ratingCount: 2900,
    usageCount: 88000,
    inputLabel: "Assignment Category Entries:",
    inputPlaceholder: "Add categories, weights %, and scores earned...",
    optionsConfig: {},
    tags: ["assignment grade calculator", "weighted grade calculator", "course grade calculator", "class average calculator", "weighted percentage grade"],
    searchKeywords: [
      "assignment grade calculator",
      "weighted grade calculator",
      "course grade calculator",
      "calculate class average",
      "weighted percentage calculator",
      "how to calculate course grade"
    ],
    seoContent: {
      metaTitle: "Free Weighted Grade Calculator — Calculate Course Grade & Class Average",
      metaDescription: "Calculate your overall class average and letter grade using weighted assignment categories. Input scores for homework, quizzes, midterms, and final exams.",
      overview: "Determine your exact overall class grade in any course! Input assignment categories with their percentage weights (e.g., Homework 20%, Midterm 30%, Final 50%) and your earned scores to see your weighted course grade.",
      keyFeatures: [
        "Supports unlimited weighted assignment categories",
        "Calculates exact weighted percentage and letter grade (A, B, C, D, F)",
        "Handles partial semester category progress seamlessly",
        "Shows breakdown contribution per category"
      ],
      useCases: [
        "Track overall course grade mid-semester",
        "Calculate quiz and assignment score impact on final GPA",
        "Plan target scores for remaining assignments"
      ],
      howToUseSteps: [
        "Add an assignment category (e.g., Homework, Midterm Exam).",
        "Enter category percentage weight (e.g., 25%).",
        "Enter score earned and maximum points possible.",
        "View overall weighted class grade and letter grade."
      ],
      faqs: [
        {
          question: "How does a weighted grade calculation work?",
          answer: "Each category score is converted to a percentage, multiplied by its category weight percentage, and summed together to produce the final course grade."
        }
      ]
    }
  },
  {
    id: "assignment-word-count-helper",
    name: "Free Essay & Assignment Word Count Helper",
    slug: "assignment-word-count-helper",
    tagline: "Track essay target length, remaining words, reading time, and density.",
    description: "Analyze essay and assignment word counts against target requirements. Calculate words remaining, completion percentage, reading time, and sentence metrics.",
    category: "student",
    iconName: "FileText",
    route: "/en/assignment-word-count-helper",
    isPopular: false,
    rating: 4.8,
    ratingCount: 2100,
    usageCount: 64000,
    inputLabel: "Essay Text & Target Length:",
    inputPlaceholder: "Paste your assignment draft text here...",
    optionsConfig: {},
    tags: ["assignment word count helper", "essay word counter", "assignment word goal", "reading time calculator", "essay progress tracker"],
    searchKeywords: [
      "assignment word count helper",
      "essay word counter",
      "essay progress counter",
      "how many words left in essay",
      "assignment length checker",
      "essay reading time calculator"
    ],
    seoContent: {
      metaTitle: "Free Essay & Assignment Word Count Helper — Track Progress & Reading Time",
      metaDescription: "Check your essay draft word count against assignment target requirements. Shows completion percentage, words remaining, paragraph density, and estimated reading time.",
      overview: "Writing a 1,500 or 3,000-word university essay? Use our Assignment Word Count Helper to track your writing progress in real time, monitor remaining words, analyze sentence density, and calculate speech presentation duration.",
      keyFeatures: [
        "Tracks word count progress against custom assignment target goals",
        "Calculates words remaining to reach minimum word requirements",
        "Provides paragraph, sentence, and character counts",
        "Estimates silent reading time and oral presentation speaking duration"
      ],
      useCases: [
        "Track progress when writing research papers and dissertations",
        "Check if essay meets professor's strict minimum word count criteria",
        "Time oral presentations based on essay word count"
      ],
      howToUseSteps: [
        "Enter your target word count requirement (e.g., 2,500 words).",
        "Paste or type your assignment draft in the text area.",
        "View word count progress bar, words remaining, and reading time."
      ],
      faqs: [
        {
          question: "How is estimated presentation speaking time calculated?",
          answer: "The average speech rate for academic presentations is approximately 130 words per minute."
        }
      ]
    }
  },
  {
    id: "exam-countdown-timer",
    name: "Free Exam Countdown & Study Target Timer",
    slug: "exam-countdown-timer",
    tagline: "Count down days to exam dates and calculate daily study targets.",
    description: "Track days, hours, and minutes remaining until exam dates or assignment deadlines with daily study hour allocation targets.",
    category: "student",
    iconName: "Calendar",
    route: "/en/exam-countdown-timer",
    isPopular: true,
    rating: 4.9,
    ratingCount: 2750,
    usageCount: 81000,
    inputLabel: "Exam Name & Target Date:",
    inputPlaceholder: "Select upcoming exam date...",
    optionsConfig: {},
    tags: ["exam countdown timer", "days until exam", "study deadline tracker", "exam date counter", "student countdown"],
    searchKeywords: [
      "exam countdown timer",
      "days until exam calculator",
      "exam deadline countdown",
      "study date countdown",
      "how many days until my finals",
      "exam revision countdown"
    ],
    seoContent: {
      metaTitle: "Free Exam Countdown Timer — Days Remaining Until Finals & Deadlines",
      metaDescription: "Count down exact days, hours, and minutes remaining until upcoming exams and assignment submission deadlines. Calculates daily study hour targets.",
      overview: "Stay organized ahead of finals week! Our free Exam Countdown Timer tracks exact days and hours left before your exams and calculates recommended daily study time allocations so you never cram at the last minute.",
      keyFeatures: [
        "Live countdown timer in days, hours, and minutes",
        "Calculates recommended daily study hours before exam date",
        "Supports multiple exam entries and deadlines",
        "100% free with local browser state persistence"
      ],
      useCases: [
        "Count down to midterms, finals, SATs, GREs, or university exams",
        "Allocate daily revision hours based on days remaining",
        "Prevent exam cramming with structured preparation countdowns"
      ],
      howToUseSteps: [
        "Enter subject exam title (e.g., Organic Chemistry Final).",
        "Select target exam date and time.",
        "Read remaining days countdown and daily study target."
      ],
      faqs: [
        {
          question: "How does the daily study target calculation work?",
          answer: "It divides your estimated total required study hours by the number of days remaining until your exam date."
        }
      ]
    }
  },
  {
    id: "student-timetable-planner",
    name: "Free Student Weekly Timetable Planner",
    slug: "student-timetable-planner",
    tagline: "Organize weekly class lectures, labs, and study slots into a weekly grid.",
    description: "Create, organize, and print your weekly college or school class timetable with custom course colors, lab slots, and study blocks.",
    category: "student",
    iconName: "Calendar",
    route: "/en/student-timetable-planner",
    isPopular: false,
    rating: 4.7,
    ratingCount: 1850,
    usageCount: 52000,
    inputLabel: "Weekly Class Schedule Entry:",
    inputPlaceholder: "Add class titles, days, times, and location...",
    optionsConfig: {},
    tags: ["student timetable planner", "weekly class schedule", "college timetable generator", "study schedule planner", "school timetable grid"],
    searchKeywords: [
      "student timetable planner",
      "weekly class schedule generator",
      "college timetable maker",
      "study schedule planner",
      "class schedule grid creator",
      "printable student schedule"
    ],
    seoContent: {
      metaTitle: "Free Student Timetable Planner — Generate Weekly Class & Study Schedule",
      metaDescription: "Organize your weekly college and school class schedule. Create custom lecture, lab, and study timetables with course color codes and printable grids.",
      overview: "Design a clean, color-coded weekly schedule for your lectures, labs, and study sessions! Print or save your timetable to keep track of class locations and time slots all semester.",
      keyFeatures: [
        "Interactive weekly Monday-Sunday schedule grid",
        "Color-code lectures, labs, seminars, and study blocks",
        "One-click print and copy layout option",
        "100% private in-browser schedule storage"
      ],
      useCases: [
        "Map out college course schedule at start of semester",
        "Coordinate study blocks around lectures and part-time jobs",
        "Print physical weekly timetable for campus binder"
      ],
      howToUseSteps: [
        "Add course name, room/building, day of week, and start/end time.",
        "Choose a custom color badge for each course.",
        "View and print your complete interactive weekly grid schedule."
      ],
      faqs: [
        {
          question: "Can I save my schedule across browser sessions?",
          answer: "Yes! Your timetable entries are stored securely in your browser local storage."
        }
      ]
    }
  },
  {
    id: "study-break-interval-calculator",
    name: "Free Spaced Repetition Revision Calculator",
    slug: "study-break-interval-calculator",
    tagline: "Calculate optimal spaced repetition review dates before exam day.",
    description: "Calculate scientific spaced repetition review milestones (Day 1, Day 3, 1-Week, 2-Weeks) leading up to your exam date to maximize long-term retention.",
    category: "student",
    iconName: "Clock",
    route: "/en/study-break-interval-calculator",
    isPopular: false,
    rating: 4.8,
    ratingCount: 1520,
    usageCount: 41000,
    inputLabel: "Exam Date Target:",
    inputPlaceholder: "Select target exam date...",
    optionsConfig: {},
    tags: ["spaced repetition calculator", "revision interval calculator", "forgetting curve schedule", "study review dates", "active recall planner"],
    searchKeywords: [
      "spaced repetition calculator",
      "revision interval calculator",
      "study review date generator",
      "forgetting curve study schedule",
      "active recall review intervals"
    ],
    seoContent: {
      metaTitle: "Free Spaced Repetition Calculator — Optimal Exam Revision Dates",
      metaDescription: "Calculate cognitive spaced repetition review dates leading up to your exam. Combat the Ebbinghaus forgetting curve with structured study revision dates.",
      overview: "Maximize memory retention using cognitive science! Based on the Ebbinghaus forgetting curve, our Spaced Repetition Calculator generates exact calendar review dates between today and your exam day.",
      keyFeatures: [
        "Calculates 5 cognitive revision dates based on active recall principles",
        "Fights the forgetting curve before final exams",
        "Provides calendar dates for spaced review sessions",
        "Enhances long-term memory consolidation"
      ],
      useCases: [
        "Plan flashcard and textbook review dates for difficult subjects",
        "Space out study sessions for comprehensive final exams",
        "Optimize memory retention for medical, law, or STEM courses"
      ],
      howToUseSteps: [
        "Enter your target exam date.",
        "Read generated spaced repetition review milestone dates.",
        "Add milestone dates to your calendar for active recall review."
      ],
      faqs: [
        {
          question: "What is spaced repetition in studying?",
          answer: "Spaced repetition is a learning technique that reviews study material at increasing time intervals to convert short-term knowledge into long-term memory."
        }
      ]
    }
  }
];
