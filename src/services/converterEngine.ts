// Converter Engine for Unit, Digital, Data, and Color conversions

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  factorToBase: number; // multiplier to reach base unit (or custom convert function)
  offset?: number; // e.g. for temperature
}

export interface UnitCategory {
  id: string;
  name: string;
  baseUnit: string;
  units: Record<string, UnitDefinition>;
}

export const UNIT_CATEGORIES: Record<string, UnitCategory> = {
  length: {
    id: "length",
    name: "Length & Distance",
    baseUnit: "meter",
    units: {
      meter: { id: "meter", name: "Meters", symbol: "m", factorToBase: 1 },
      kilometer: { id: "kilometer", name: "Kilometers", symbol: "km", factorToBase: 1000 },
      centimeter: { id: "centimeter", name: "Centimeters", symbol: "cm", factorToBase: 0.01 },
      millimeter: { id: "millimeter", name: "Millimeters", symbol: "mm", factorToBase: 0.001 },
      micrometer: { id: "micrometer", name: "Micrometers", symbol: "µm", factorToBase: 0.000001 },
      nanometer: { id: "nanometer", name: "Nanometers", symbol: "nm", factorToBase: 1e-9 },
      mile: { id: "mile", name: "Miles", symbol: "mi", factorToBase: 1609.344 },
      yard: { id: "yard", name: "Yards", symbol: "yd", factorToBase: 0.9144 },
      foot: { id: "foot", name: "Feet", symbol: "ft", factorToBase: 0.3048 },
      inch: { id: "inch", name: "Inches", symbol: "in", factorToBase: 0.0254 },
      nautical_mile: { id: "nautical_mile", name: "Nautical Miles", symbol: "nmi", factorToBase: 1852 },
    },
  },
  weight: {
    id: "weight",
    name: "Weight & Mass",
    baseUnit: "kilogram",
    units: {
      kilogram: { id: "kilogram", name: "Kilograms", symbol: "kg", factorToBase: 1 },
      gram: { id: "gram", name: "Grams", symbol: "g", factorToBase: 0.001 },
      milligram: { id: "milligram", name: "Milligrams", symbol: "mg", factorToBase: 0.000001 },
      metric_ton: { id: "metric_ton", name: "Metric Tons", symbol: "t", factorToBase: 1000 },
      pound: { id: "pound", name: "Pounds", symbol: "lbs", factorToBase: 0.45359237 },
      ounce: { id: "ounce", name: "Ounces", symbol: "oz", factorToBase: 0.028349523125 },
      stone: { id: "stone", name: "Stones", symbol: "st", factorToBase: 6.35029318 },
    },
  },
  area: {
    id: "area",
    name: "Area",
    baseUnit: "square_meter",
    units: {
      square_meter: { id: "square_meter", name: "Square Meters", symbol: "m²", factorToBase: 1 },
      square_kilometer: { id: "square_kilometer", name: "Square Kilometers", symbol: "km²", factorToBase: 1000000 },
      square_foot: { id: "square_foot", name: "Square Feet", symbol: "ft²", factorToBase: 0.09290304 },
      square_mile: { id: "square_mile", name: "Square Miles", symbol: "mi²", factorToBase: 2589988.110336 },
      acre: { id: "acre", name: "Acres", symbol: "ac", factorToBase: 4046.8564224 },
      hectare: { id: "hectare", name: "Hectares", symbol: "ha", factorToBase: 10000 },
    },
  },
  volume: {
    id: "volume",
    name: "Volume",
    baseUnit: "liter",
    units: {
      liter: { id: "liter", name: "Liters", symbol: "L", factorToBase: 1 },
      milliliter: { id: "milliliter", name: "Milliliters", symbol: "mL", factorToBase: 0.001 },
      cubic_meter: { id: "cubic_meter", name: "Cubic Meters", symbol: "m³", factorToBase: 1000 },
      gallon_us: { id: "gallon_us", name: "US Gallons", symbol: "gal", factorToBase: 3.785411784 },
      quart_us: { id: "quart_us", name: "US Quarts", symbol: "qt", factorToBase: 0.946352946 },
      pint_us: { id: "pint_us", name: "US Pints", symbol: "pt", factorToBase: 0.473176473 },
      cup_us: { id: "cup_us", name: "US Cups", symbol: "cup", factorToBase: 0.2365882365 },
      fluid_ounce_us: { id: "fluid_ounce_us", name: "US Fluid Ounces", symbol: "fl oz", factorToBase: 0.0295735295625 },
    },
  },
  temperature: {
    id: "temperature",
    name: "Temperature",
    baseUnit: "celsius",
    units: {
      celsius: { id: "celsius", name: "Celsius", symbol: "°C", factorToBase: 1 },
      fahrenheit: { id: "fahrenheit", name: "Fahrenheit", symbol: "°F", factorToBase: 1 },
      kelvin: { id: "kelvin", name: "Kelvin", symbol: "K", factorToBase: 1 },
    },
  },
  speed: {
    id: "speed",
    name: "Speed",
    baseUnit: "mps",
    units: {
      mps: { id: "mps", name: "Meters per second", symbol: "m/s", factorToBase: 1 },
      kph: { id: "kph", name: "Kilometers per hour", symbol: "km/h", factorToBase: 0.277777778 },
      mph: { id: "mph", name: "Miles per hour", symbol: "mph", factorToBase: 0.44704 },
      knot: { id: "knot", name: "Knots", symbol: "kt", factorToBase: 0.514444444 },
    },
  },
  time: {
    id: "time",
    name: "Time",
    baseUnit: "second",
    units: {
      second: { id: "second", name: "Seconds", symbol: "s", factorToBase: 1 },
      millisecond: { id: "millisecond", name: "Milliseconds", symbol: "ms", factorToBase: 0.001 },
      minute: { id: "minute", name: "Minutes", symbol: "min", factorToBase: 60 },
      hour: { id: "hour", name: "Hours", symbol: "h", factorToBase: 3600 },
      day: { id: "day", name: "Days", symbol: "d", factorToBase: 86400 },
      week: { id: "week", name: "Weeks", symbol: "wk", factorToBase: 604800 },
      month: { id: "month", name: "Months (30 days)", symbol: "mo", factorToBase: 2592000 },
      year: { id: "year", name: "Years (365 days)", symbol: "yr", factorToBase: 31536000 },
    },
  },
  pressure: {
    id: "pressure",
    name: "Pressure",
    baseUnit: "pascal",
    units: {
      pascal: { id: "pascal", name: "Pascals", symbol: "Pa", factorToBase: 1 },
      kilopascal: { id: "kilopascal", name: "Kilopascals", symbol: "kPa", factorToBase: 1000 },
      bar: { id: "bar", name: "Bars", symbol: "bar", factorToBase: 100000 },
      psi: { id: "psi", name: "Pounds per sq inch", symbol: "psi", factorToBase: 6894.757293168 },
      atmosphere: { id: "atmosphere", name: "Atmospheres", symbol: "atm", factorToBase: 101325 },
    },
  },
  energy: {
    id: "energy",
    name: "Energy",
    baseUnit: "joule",
    units: {
      joule: { id: "joule", name: "Joules", symbol: "J", factorToBase: 1 },
      kilojoule: { id: "kilojoule", name: "Kilojoules", symbol: "kJ", factorToBase: 1000 },
      calorie: { id: "calorie", name: "Calories", symbol: "cal", factorToBase: 4.184 },
      kilocalorie: { id: "kilocalorie", name: "Kilocalories (Food)", symbol: "kcal", factorToBase: 4184 },
      watt_hour: { id: "watt_hour", name: "Watt-hours", symbol: "Wh", factorToBase: 3600 },
      kilowatt_hour: { id: "kilowatt_hour", name: "Kilowatt-hours", symbol: "kWh", factorToBase: 3600000 },
    },
  },
  power: {
    id: "power",
    name: "Power",
    baseUnit: "watt",
    units: {
      watt: { id: "watt", name: "Watts", symbol: "W", factorToBase: 1 },
      kilowatt: { id: "kilowatt", name: "Kilowatts", symbol: "kW", factorToBase: 1000 },
      megawatt: { id: "megawatt", name: "Megawatts", symbol: "MW", factorToBase: 1000000 },
      horsepower: { id: "horsepower", name: "Horsepower (mechanical)", symbol: "hp", factorToBase: 745.699872 },
    },
  },
  frequency: {
    id: "frequency",
    name: "Frequency",
    baseUnit: "hertz",
    units: {
      hertz: { id: "hertz", name: "Hertz", symbol: "Hz", factorToBase: 1 },
      kilohertz: { id: "kilohertz", name: "Kilohertz", symbol: "kHz", factorToBase: 1000 },
      megahertz: { id: "megahertz", name: "Megahertz", symbol: "MHz", factorToBase: 1000000 },
      gigahertz: { id: "gigahertz", name: "Gigahertz", symbol: "GHz", factorToBase: 1000000000 },
    },
  },
  data_storage: {
    id: "data_storage",
    name: "Data Storage",
    baseUnit: "byte",
    units: {
      bit: { id: "bit", name: "Bits", symbol: "b", factorToBase: 0.125 },
      byte: { id: "byte", name: "Bytes", symbol: "B", factorToBase: 1 },
      kilobyte: { id: "kilobyte", name: "Kilobytes (1000B)", symbol: "KB", factorToBase: 1000 },
      kibibyte: { id: "kibibyte", name: "Kibibytes (1024B)", symbol: "KiB", factorToBase: 1024 },
      megabyte: { id: "megabyte", name: "Megabytes (1000KB)", symbol: "MB", factorToBase: 1000000 },
      mebibyte: { id: "mebibyte", name: "Mebibytes (1024KiB)", symbol: "MiB", factorToBase: 1048576 },
      gigabyte: { id: "gigabyte", name: "Gigabytes (1000MB)", symbol: "GB", factorToBase: 1000000000 },
      gibibyte: { id: "gibibyte", name: "Gibibytes (1024MiB)", symbol: "GiB", factorToBase: 1073741824 },
      terabyte: { id: "terabyte", name: "Terabytes (1000GB)", symbol: "TB", factorToBase: 1e12 },
      tebibyte: { id: "tebibyte", name: "Tebibytes (1024GiB)", symbol: "TiB", factorToBase: 1099511627776 },
    },
  },
  digital_bandwidth: {
    id: "digital_bandwidth",
    name: "Digital Bandwidth",
    baseUnit: "bps",
    units: {
      bps: { id: "bps", name: "Bits per second", symbol: "bps", factorToBase: 1 },
      kbps: { id: "kbps", name: "Kilobits per second", symbol: "Kbps", factorToBase: 1000 },
      mbps: { id: "mbps", name: "Megabits per second", symbol: "Mbps", factorToBase: 1000000 },
      gbps: { id: "gbps", name: "Gigabits per second", symbol: "Gbps", factorToBase: 1000000000 },
      bytes_sec: { id: "bytes_sec", name: "Bytes per second", symbol: "B/s", factorToBase: 8 },
      mbytes_sec: { id: "mbytes_sec", name: "Megabytes per second", symbol: "MB/s", factorToBase: 8000000 },
    },
  },
  angle: {
    id: "angle",
    name: "Angle",
    baseUnit: "degree",
    units: {
      degree: { id: "degree", name: "Degrees", symbol: "°", factorToBase: 1 },
      radian: { id: "radian", name: "Radians", symbol: "rad", factorToBase: 180 / Math.PI },
      gradian: { id: "gradian", name: "Gradians", symbol: "grad", factorToBase: 0.9 },
    },
  },
  force: {
    id: "force",
    name: "Force",
    baseUnit: "newton",
    units: {
      newton: { id: "newton", name: "Newtons", symbol: "N", factorToBase: 1 },
      kilonewton: { id: "kilonewton", name: "Kilonewtons", symbol: "kN", factorToBase: 1000 },
      pound_force: { id: "pound_force", name: "Pound-force", symbol: "lbf", factorToBase: 4.4482216152605 },
      dyne: { id: "dyne", name: "Dynes", symbol: "dyn", factorToBase: 0.00001 },
    },
  },
  torque: {
    id: "torque",
    name: "Torque",
    baseUnit: "newton_meter",
    units: {
      newton_meter: { id: "newton_meter", name: "Newton-meters", symbol: "N·m", factorToBase: 1 },
      pound_foot: { id: "pound_foot", name: "Pound-feet", symbol: "lbf·ft", factorToBase: 1.3558179483314 },
    },
  },
  acceleration: {
    id: "acceleration",
    name: "Acceleration",
    baseUnit: "m_s2",
    units: {
      m_s2: { id: "m_s2", name: "Meters per second squared", symbol: "m/s²", factorToBase: 1 },
      standard_gravity: { id: "standard_gravity", name: "Standard Gravity", symbol: "g", factorToBase: 9.80665 },
      foot_s2: { id: "foot_s2", name: "Feet per second squared", symbol: "ft/s²", factorToBase: 0.3048 },
    },
  },
  density: {
    id: "density",
    name: "Density",
    baseUnit: "kg_m3",
    units: {
      kg_m3: { id: "kg_m3", name: "Kilograms per cubic meter", symbol: "kg/m³", factorToBase: 1 },
      g_cm3: { id: "g_cm3", name: "Grams per cubic cm", symbol: "g/cm³", factorToBase: 1000 },
      lb_ft3: { id: "lb_ft3", name: "Pounds per cubic foot", symbol: "lb/ft³", factorToBase: 16.01846337 },
    },
  },
  cooking: {
    id: "cooking",
    name: "Cooking Measurements",
    baseUnit: "milliliter",
    units: {
      milliliter: { id: "milliliter", name: "Milliliters", symbol: "mL", factorToBase: 1 },
      teaspoon_us: { id: "teaspoon_us", name: "Teaspoons (US)", symbol: "tsp", factorToBase: 4.92892 },
      tablespoon_us: { id: "tablespoon_us", name: "Tablespoons (US)", symbol: "tbsp", factorToBase: 14.7868 },
      cup_us: { id: "cup_us", name: "Cups (US)", symbol: "cup", factorToBase: 236.588 },
      fluid_ounce_us: { id: "fluid_ounce_us", name: "Fluid Ounces (US)", symbol: "fl oz", factorToBase: 29.5735 },
    },
  },
};

// Generic Conversion Function
export function convertUnit(
  categoryKey: string,
  fromUnitKey: string,
  toUnitKey: string,
  value: number,
  precision = 4
): { result: number; formula: string; explanation: string } {
  if (isNaN(value)) {
    throw new Error("Invalid non-numeric input value.");
  }

  const category = UNIT_CATEGORIES[categoryKey];
  if (!category) {
    throw new Error(`Unknown conversion category '${categoryKey}'.`);
  }

  // Handle Temperature explicitly due to non-linear offsets
  if (categoryKey === "temperature") {
    let celsiusVal = value;
    if (fromUnitKey === "fahrenheit") celsiusVal = ((value - 32) * 5) / 9;
    if (fromUnitKey === "kelvin") celsiusVal = value - 273.15;

    let finalVal = celsiusVal;
    if (toUnitKey === "fahrenheit") finalVal = (celsiusVal * 9) / 5 + 32;
    if (toUnitKey === "kelvin") finalVal = celsiusVal + 273.15;

    const rounded = Number(finalVal.toFixed(precision));
    return {
      result: rounded,
      formula: `Temperature Conversion Formula from ${fromUnitKey} to ${toUnitKey}`,
      explanation: `${value} ${category.units[fromUnitKey]?.symbol || fromUnitKey} = ${rounded} ${category.units[toUnitKey]?.symbol || toUnitKey}`,
    };
  }

  const fromUnit = category.units[fromUnitKey];
  const toUnit = category.units[toUnitKey];

  if (!fromUnit || !toUnit) {
    throw new Error(`Invalid unit pair: '${fromUnitKey}' -> '${toUnitKey}'`);
  }

  // Convert to base unit first
  const baseValue = value * fromUnit.factorToBase;
  // Convert from base unit to target unit
  const targetValue = baseValue / toUnit.factorToBase;

  const rounded = Number(targetValue.toFixed(precision));
  const formula = `1 ${fromUnit.symbol} = ${(fromUnit.factorToBase / toUnit.factorToBase).toFixed(6)} ${toUnit.symbol}`;
  const explanation = `${value} ${fromUnit.name} (${fromUnit.symbol}) × ${fromUnit.factorToBase} / ${toUnit.factorToBase} = ${rounded} ${toUnit.name} (${toUnit.symbol})`;

  return { result: rounded, formula, explanation };
}

// Color Utility Conversions
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace(/^#/, "");
  if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleanHex)) return null;

  let fullHex = cleanHex;
  if (cleanHex.length === 3) {
    fullHex = cleanHex.split("").map((c) => c + c).join("");
  }

  const num = parseInt(fullHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function calculateColorContrast(hex1: string, hex2: string): { ratio: number; wcagAA: boolean; wcagAAA: boolean } {
  const rgb1 = hexToRgb(hex1) || { r: 255, g: 255, b: 255 };
  const rgb2 = hexToRgb(hex2) || { r: 0, g: 0, b: 0 };

  const getLuminance = (rgb: { r: number; g: number; b: number }) => {
    const a = [rgb.r, rgb.g, rgb.b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);

  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  const roundedRatio = Number(ratio.toFixed(2));

  return {
    ratio: roundedRatio,
    wcagAA: roundedRatio >= 4.5,
    wcagAAA: roundedRatio >= 7.0,
  };
}

export function romanNumeralConverter(val: string | number): { result: string; formula: string } {
  if (typeof val === "number" || !isNaN(Number(val))) {
    let num = Math.floor(Math.abs(Number(val)));
    if (num === 0 || num > 3999) return { result: "Out of range (1 - 3999)", formula: "Roman numerals cover 1 to 3999" };
    
    const lookup: [string, number][] = [
      ["M", 1000], ["CM", 900], ["D", 500], ["CD", 400],
      ["C", 100], ["XC", 90], ["L", 50], ["XL", 40],
      ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1]
    ];
    let str = "";
    for (const [roman, n] of lookup) {
      while (num >= n) {
        str += roman;
        num -= n;
      }
    }
    return { result: str, formula: "Decimal integer mapped to additive/subtractive Roman symbols" };
  } else {
    const str = String(val).toUpperCase().trim();
    const lookup: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let num = 0;
    for (let i = 0; i < str.length; i++) {
      const current = lookup[str[i]] || 0;
      const next = lookup[str[i + 1]] || 0;
      if (current < next) {
        num -= current;
      } else {
        num += current;
      }
    }
    return { result: String(num), formula: "Subtractive Roman numeral summation" };
  }
}
