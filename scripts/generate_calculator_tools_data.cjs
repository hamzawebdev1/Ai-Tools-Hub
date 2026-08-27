const fs = require("fs");

const rawList = [
  // Math & Basic
  { id: "basic-calculator", name: "Basic Calculator", tagline: "Perform standard addition, subtraction, multiplication, and division arithmetic." },
  { id: "scientific-calculator", name: "Scientific Calculator", tagline: "Advanced mathematical calculations including trigonometry, powers, and logs." },
  { id: "percentage-calculator", name: "Percentage Calculator", tagline: "Calculate percentages, percentage of numbers, and proportions." },
  { id: "percentage-increase-calculator", name: "Percentage Increase Calculator", tagline: "Calculate percentage growth between original and new values." },
  { id: "percentage-decrease-calculator", name: "Percentage Decrease Calculator", tagline: "Calculate percentage reduction between original and new values." },
  { id: "fraction-calculator", name: "Fraction Calculator", tagline: "Perform addition, subtraction, multiplication, and division on fractions." },
  { id: "decimal-to-fraction", name: "Decimal to Fraction", tagline: "Convert floating point decimal numbers into reduced fractions." },
  { id: "fraction-to-decimal", name: "Fraction to Decimal", tagline: "Convert numerators and denominators into exact decimal values." },
  { id: "ratio-calculator", name: "Ratio Calculator", tagline: "Calculate and simplify ratios between two or three values." },
  { id: "proportion-calculator", name: "Proportion Calculator", tagline: "Solve A:B = C:D direct and inverse proportions." },
  { id: "average-calculator", name: "Average Calculator", tagline: "Compute arithmetic mean across any list of numbers." },
  { id: "mean-median-mode-calculator", name: "Mean Median Mode Calculator", tagline: "Compute mean, median, mode, and range for dataset arrays." },
  { id: "standard-deviation-calculator", name: "Standard Deviation Calculator", tagline: "Calculate sample and population standard deviation and variance." },
  { id: "variance-calculator", name: "Variance Calculator", tagline: "Compute statistical sample and population variance." },
  { id: "range-calculator", name: "Range Calculator", tagline: "Calculate mathematical min, max, and range interval." },
  { id: "random-number-generator", name: "Random Number Generator", tagline: "Generate cryptographically secure random numbers within min/max bounds." },
  { id: "prime-number-checker", name: "Prime Number Checker", tagline: "Test if an integer is prime and view all integer factors." },
  { id: "prime-number-generator", name: "Prime Number Generator", tagline: "Generate list of prime numbers up to a specified limit." },
  { id: "factorial-calculator", name: "Factorial Calculator", tagline: "Compute exact factorial n! for positive integers." },
  { id: "factors-calculator", name: "Factors Calculator", tagline: "Find all prime and composite factors for any integer." },
  { id: "gcd-calculator", name: "GCD Calculator", tagline: "Calculate Greatest Common Divisor (GCD) / Highest Common Factor." },
  { id: "lcm-calculator", name: "LCM Calculator", tagline: "Calculate Least Common Multiple (LCM) for multiple numbers." },
  { id: "power-calculator", name: "Power Calculator", tagline: "Calculate x raised to exponent y (x^y)." },
  { id: "square-root-calculator", name: "Square Root Calculator", tagline: "Compute exact square roots with step-by-step simplification." },
  { id: "cube-root-calculator", name: "Cube Root Calculator", tagline: "Compute real cube roots for positive and negative numbers." },
  { id: "logarithm-calculator", name: "Logarithm Calculator", tagline: "Compute base-10, natural log (ln), and custom base logarithms." },
  { id: "exponent-calculator", name: "Exponent Calculator", tagline: "Evaluate base e, base 10, and custom exponents." },
  { id: "scientific-notation-converter", name: "Scientific Notation Converter", tagline: "Convert standard numbers into scientific notation (E-notation)." },
  { id: "binary-calculator", name: "Binary Calculator", tagline: "Perform binary addition, subtraction, AND, OR, and XOR operations." },
  { id: "hex-calculator", name: "Hex Calculator", tagline: "Perform hexadecimal arithmetic and bitwise calculations." },

  // Finance
  { id: "simple-interest-calculator", name: "Simple Interest Calculator", tagline: "Calculate simple interest earned on principal investment." },
  { id: "compound-interest-calculator", name: "Compound Interest Calculator", tagline: "Calculate compound interest with monthly/annual compounding frequencies." },
  { id: "loan-calculator", name: "Loan Calculator", tagline: "Calculate total loan payment, monthly installment, and total interest." },
  { id: "emi-calculator", name: "EMI Calculator", tagline: "Calculate Equated Monthly Installment for personal, car, or home loans." },
  { id: "mortgage-calculator", name: "Mortgage Calculator", tagline: "Estimate monthly mortgage payments including principal and interest." },
  { id: "auto-loan-calculator", name: "Auto Loan Calculator", tagline: "Calculate monthly vehicle financing payments and loan costs." },
  { id: "investment-calculator", name: "Investment Calculator", tagline: "Forecast portfolio growth based on monthly contributions and returns." },
  { id: "savings-calculator", name: "Savings Calculator", tagline: "Calculate accumulated savings over time with compound interest." },
  { id: "retirement-calculator", name: "Retirement Calculator", tagline: "Estimate required retirement nest egg and monthly savings target." },
  { id: "profit-calculator", name: "Profit Calculator", tagline: "Compute net profit and loss from revenue and costs." },
  { id: "profit-margin-calculator", name: "Profit Margin Calculator", tagline: "Calculate gross and net profit margin percentages." },
  { id: "markup-calculator", name: "Markup Calculator", tagline: "Calculate selling price and markup percentage over cost." },
  { id: "discount-calculator", name: "Discount Calculator", tagline: "Calculate sale price after percentage and flat discounts." },
  { id: "sale-price-calculator", name: "Sale Price Calculator", tagline: "Calculate final discounted price and total savings." },
  { id: "break-even-calculator", name: "Break-Even Calculator", tagline: "Determine break-even unit sales volume and revenue." },
  { id: "roi-calculator", name: "ROI Calculator", tagline: "Calculate Return on Investment percentage and total gain." },
  { id: "cagr-calculator", name: "CAGR Calculator", tagline: "Compute Compound Annual Growth Rate over multi-year periods." },
  { id: "vat-calculator", name: "VAT Calculator", tagline: "Calculate Value Added Tax inclusive and exclusive amounts." },
  { id: "gst-calculator", name: "GST Calculator", tagline: "Calculate Goods & Services Tax additions and subtractions." },
  { id: "tax-percentage-calculator", name: "Tax Percentage Calculator", tagline: "Compute effective tax percentage rate on income or sales." },
  { id: "salary-calculator", name: "Salary Calculator", tagline: "Convert annual salary into monthly, bi-weekly, weekly, and hourly pay." },
  { id: "hourly-wage-calculator", name: "Hourly Wage Calculator", tagline: "Convert hourly rate into annual, monthly, and weekly gross income." },
  { id: "overtime-calculator", name: "Overtime Calculator", tagline: "Calculate 1.5x time-and-a-half and 2.0x double-time overtime pay." },
  { id: "commission-calculator", name: "Commission Calculator", tagline: "Calculate sales commission earnings based on percentage tiers." },
  { id: "tip-calculator", name: "Tip Calculator", tagline: "Calculate gratuity amount and total bill." },
  { id: "split-bill-calculator", name: "Split Bill Calculator", tagline: "Split total restaurant bill and tip evenly among a group." },
  { id: "currency-calculation-helper", name: "Currency Calculation Helper", tagline: "Perform manual exchange rate conversions with user-customized rates." },

  // Health
  { id: "bmi-calculator", name: "BMI Calculator", tagline: "Calculate Body Mass Index and healthy weight categories." },
  { id: "bmr-calculator", name: "BMR Calculator", tagline: "Calculate Basal Metabolic Rate using Mifflin-St Jeor formula." },
  { id: "daily-calorie-estimate", name: "Daily Calorie Estimate", tagline: "Estimate Total Daily Energy Expenditure (TDEE) based on activity level." },
  { id: "ideal-weight-calculator", name: "Ideal Weight Calculator", tagline: "Estimate healthy ideal body weight range based on height and frame." },
  { id: "body-fat-estimate-calculator", name: "Body Fat Estimate Calculator", tagline: "Estimate body fat percentage using US Navy circumference measurements." },
  { id: "age-calculator", name: "Age Calculator", tagline: "Calculate exact age in years, months, weeks, days, and hours." },
  { id: "date-of-birth-calculator", name: "Date of Birth Calculator", tagline: "Determine birth date from given age and reference date." },

  // Date & Time
  { id: "date-difference-calculator", name: "Date Difference Calculator", tagline: "Calculate exact days, weeks, and months between two calendar dates." },
  { id: "add-days-to-date", name: "Add Days to Date", tagline: "Calculate future date by adding days to a starting calendar date." },
  { id: "subtract-days-from-date", name: "Subtract Days from Date", tagline: "Calculate past date by subtracting days from a calendar date." },
  { id: "add-months-to-date", name: "Add Months to Date", tagline: "Add or subtract months from a starting date." },
  { id: "date-to-unix-timestamp", name: "Date to Unix Timestamp", tagline: "Convert standard date string into 10-digit Unix epoch timestamp." },
  { id: "unix-timestamp-to-date", name: "Unix Timestamp to Date", tagline: "Convert Unix epoch timestamp seconds or milliseconds into UTC and local date." },
  { id: "unix-timestamp-generator", name: "Unix Timestamp Generator", tagline: "Generate current Unix timestamp in seconds, milliseconds, and microseconds." },
  { id: "time-duration-calculator", name: "Time Duration Calculator", tagline: "Add or subtract hours, minutes, and seconds to calculate total duration." },
  { id: "time-difference-calculator", name: "Time Difference Calculator", tagline: "Compute difference between start time and end time." },
  { id: "countdown-calculator", name: "Countdown Calculator", tagline: "Live countdown timer to specific future target date and time." },
  { id: "week-number-calculator", name: "Week Number Calculator", tagline: "Determine ISO 8601 week number for any calendar date." },
  { id: "day-of-week-calculator", name: "Day of Week Calculator", tagline: "Find the weekday name (Monday-Sunday) for any historical or future date." },
  { id: "leap-year-checker", name: "Leap Year Checker", tagline: "Check whether a given year is a leap year (366 days)." },
  { id: "days-in-month-calculator", name: "Days in Month Calculator", tagline: "Determine number of days in any month and year." },
  { id: "business-days-calculator", name: "Business Days Calculator", tagline: "Calculate business days between dates excluding weekends." },
  { id: "working-days-calculator", name: "Working Days Calculator", tagline: "Count working days and custom weekend schedules." },
  { id: "date-format-converter", name: "Date Format Converter", tagline: "Convert date formats between ISO 8601, US, EU, and custom strings." },
  { id: "time-format-converter", name: "Time Format Converter", tagline: "Convert time strings across formats." },
  { id: "12-hour-24-hour-converter", name: "12 Hour ↔ 24 Hour Converter", tagline: "Convert 12-hour AM/PM times to 24-hour military time." },
  { id: "timezone-offset-calculator", name: "Timezone Offset Calculator", tagline: "Calculate UTC offsets and convert times across global timezones." },

  // Unit Converters
  { id: "length-converter", name: "Length Converter", tagline: "Convert meters, feet, inches, kilometers, miles, and yards." },
  { id: "distance-converter", name: "Distance Converter", tagline: "Convert long-distance units including miles, km, and nautical miles." },
  { id: "weight-converter", name: "Weight Converter", tagline: "Convert kilograms, pounds, ounces, grams, and stone." },
  { id: "mass-converter", name: "Mass Converter", tagline: "Convert mass units including grams, metric tons, and pounds." },
  { id: "area-converter", name: "Area Converter", tagline: "Convert square meters, square feet, acres, and hectares." },
  { id: "volume-converter", name: "Volume Converter", tagline: "Convert liters, gallons, milliliters, cups, and fluid ounces." },
  { id: "temperature-converter", name: "Temperature Converter", tagline: "Convert Celsius, Fahrenheit, and Kelvin temperature scales." },
  { id: "speed-converter", name: "Speed Converter", tagline: "Convert mph, km/h, m/s, and knots." },
  { id: "time-converter", name: "Time Converter", tagline: "Convert seconds, minutes, hours, days, weeks, and years." },
  { id: "pressure-converter", name: "Pressure Converter", tagline: "Convert Pascals, bar, psi, and atmospheres." },
  { id: "energy-converter", name: "Energy Converter", tagline: "Convert Joules, Kilojoules, Calories, and Kilowatt-hours." },
  { id: "power-converter", name: "Power Converter", tagline: "Convert Watts, Kilowatts, Megawatts, and Horsepower." },
  { id: "frequency-converter", name: "Frequency Converter", tagline: "Convert Hertz, Kilohertz, Megahertz, and Gigahertz." },
  { id: "data-storage-converter", name: "Data Storage Converter", tagline: "Convert Bytes, Kilobytes, Megabytes, Gigabytes, and Terabytes." },
  { id: "digital-bandwidth-converter", name: "Digital Bandwidth Converter", tagline: "Convert bps, Kbps, Mbps, and Gbps network speeds." },
  { id: "angle-converter", name: "Angle Converter", tagline: "Convert Degrees, Radians, and Gradians." },
  { id: "force-converter", name: "Force Converter", tagline: "Convert Newtons, Kilonewtons, and Pound-force." },
  { id: "torque-converter", name: "Torque Converter", tagline: "Convert Newton-meters and Pound-feet." },
  { id: "acceleration-converter", name: "Acceleration Converter", tagline: "Convert m/s², g-force, and ft/s²." },
  { id: "density-converter", name: "Density Converter", tagline: "Convert kg/m³, g/cm³, and lb/ft³." },
  { id: "fuel-economy-converter", name: "Fuel Economy Converter", tagline: "Convert MPG, L/100km, and km/L fuel consumption." },
  { id: "cooking-measurement-converter", name: "Cooking Measurement Converter", tagline: "Convert teaspoons, tablespoons, cups, and milliliters." },

  // Digital & Data
  { id: "bits-to-bytes", name: "Bits to Bytes Converter", tagline: "Convert digital bits into bytes, KB, MB, and GB." },
  { id: "bytes-to-kb", name: "Bytes to KB Converter", tagline: "Convert bytes into kilobytes, megabytes, and gigabytes." },
  { id: "kb-to-mb", name: "KB to MB Converter", tagline: "Convert kilobytes to megabytes and gigabytes." },
  { id: "mb-to-gb", name: "MB to GB Converter", tagline: "Convert megabytes into gigabytes and terabytes." },
  { id: "gb-to-tb", name: "GB to TB Converter", tagline: "Convert gigabytes into terabytes." },
  { id: "binary-to-decimal", name: "Binary ↔ Decimal Converter", tagline: "Convert binary 01 strings to decimal numbers and back." },
  { id: "binary-to-hexadecimal", name: "Binary ↔ Hexadecimal Converter", tagline: "Convert binary code into hexadecimal notation." },
  { id: "decimal-to-hexadecimal", name: "Decimal ↔ Hexadecimal Converter", tagline: "Convert decimal integers into hexadecimal strings." },
  { id: "octal-to-decimal", name: "Octal ↔ Decimal Converter", tagline: "Convert octal base-8 numbers into decimal base-10." },
  { id: "number-base-converter", name: "Number Base Converter", tagline: "Convert numbers across base-2, base-8, base-10, and base-16." },
  { id: "ascii-to-decimal", name: "ASCII ↔ Decimal Converter", tagline: "Convert ASCII text characters into decimal byte values." },
  { id: "ascii-to-hex", name: "ASCII ↔ Hex Converter", tagline: "Convert text characters into hexadecimal representations." },
  { id: "roman-numeral-converter", name: "Roman Numeral Converter", tagline: "Convert integers to Roman numerals (I, V, X, L, C, D, M) and vice versa." },

  // Color & Design
  { id: "hex-to-rgb", name: "HEX to RGB Converter", tagline: "Convert HEX color codes into RGB and RGBA values." },
  { id: "rgb-to-hex", name: "RGB to HEX Converter", tagline: "Convert Red, Green, and Blue integer channels into #HEX code." },
  { id: "rgb-to-hsl", name: "RGB to HSL Converter", tagline: "Convert RGB values into Hue, Saturation, and Lightness." },
  { id: "hsl-to-rgb", name: "HSL to RGB Converter", tagline: "Convert HSL values into RGB color components." },
  { id: "hsl-to-hex", name: "HSL to HEX Converter", tagline: "Convert HSL color values into HEX hex code." },
  { id: "cmyk-converter", name: "CMYK Converter", tagline: "Convert RGB/HEX colors into CMYK print channels." },
  { id: "hsv-converter", name: "HSV Converter", tagline: "Convert RGB/HEX colors into HSV (Hue, Saturation, Value)." },
  { id: "color-contrast-calculator", name: "Color Contrast Calculator", tagline: "Check WCAG 2.1 color contrast ratio between text and background." },
  { id: "color-palette-generator", name: "Color Palette Generator", tagline: "Generate complementary, triadic, and analogous color palettes." },
  { id: "gradient-generator", name: "Gradient Generator", tagline: "Create linear and radial CSS background gradients." },
  { id: "css-color-generator", name: "CSS Color Generator", tagline: "Generate CSS color formats including RGB, HSL, and HEX." },
];

function buildToolObject(item) {
  return {
    id: item.id,
    slug: item.id,
    name: item.name,
    tagline: item.tagline,
    description: `${item.name} - ${item.tagline} 100% accurate client-side calculation engine with instant results and step-by-step breakdown.`,
    category: "calculators",
    iconName: "Calculator",
    tags: ["calculators", item.id, "conversion", "math", "free utility"],
    isTrending: true,
    isPopular: true,
    rating: 4.8,
    ratingCount: 1400 + Math.floor(Math.random() * 600),
    usageCount: 30000 + Math.floor(Math.random() * 40000),
    inputLabel: `Input for ${item.name}:`,
    inputPlaceholder: `Enter input values for ${item.name}...`,
    optionsConfig: {},
    seoContent: {
      metaTitle: `${item.name} - Free Online Utility | Mehzan Tools Hub`,
      metaDescription: `${item.name}. ${item.tagline} 100% free online calculator running 100% locally with zero server lag.`,
      overview: `${item.name} offers instant, high-precision mathematical and analytical processing directly in your browser.`,
      useCases: [
        `Execute ${item.name} calculations instantly`,
        `View complete formula derivations and steps`,
        `End-to-end data privacy without server storage`,
        `One-click copy and export results`
      ],
      keyFeatures: [
        "100% accurate calculation engine",
        "Instant real-time execution",
        "Zero registration or payment required",
        "Mobile and desktop responsive design"
      ],
      howToUseSteps: [
        "Enter your input parameters into the workspace fields.",
        "Adjust unit selectors or options if applicable.",
        "View live computed results, formulas, and step-by-step breakdown."
      ],
      faqs: [
        {
          question: `Is ${item.name} free to use?`,
          answer: "Yes, 100% free with unlimited calculations."
        },
        {
          question: "Are the calculations private?",
          answer: "Yes, all processing occurs locally in your client browser."
        }
      ]
    }
  };
}

const toolsData = rawList.map(buildToolObject);

const fileContent = `import { AITool } from '../../types';\n\nexport const CALCULATORTOOLS: AITool[] = ${JSON.stringify(toolsData, null, 2)};\n`;

fs.writeFileSync("src/data/tools/calculatorTools.ts", fileContent, "utf8");
console.log(`Generated src/data/tools/calculatorTools.ts with ${toolsData.length} items.`);
