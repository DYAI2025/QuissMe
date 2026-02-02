export const STEM_NAMES = ["Jia", "Yi", "Bing", "Ding", "Wu", "Ji", "Geng", "Xin", "Ren", "Gui"];
export const STEM_CHINESE = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
export const BRANCH_NAMES = ["Zi", "Chou", "Yin", "Mao", "Chen", "Si", "Wu", "Wei", "Shen", "You", "Xu", "Hai"];
export const BRANCH_CHINESE = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

export const MONTH_BOUNDARY_LONGITUDES = [315, 345, 15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315];
export const LICHUN_LONGITUDE = 315.0;
export const DAY_OFFSET = 49;
export const YEAR_EPOCH = 1984;

export type TimeStandard = "CIVIL" | "LMT";
export type DayBoundary = "midnight" | "zi";

export interface DateTimeParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export interface BaziInput {
  birth_local: string;
  timezone: string;
  longitude_deg: number;
  latitude_deg: number;
  time_standard: TimeStandard;
  day_boundary: DayBoundary;
  accuracy_seconds?: number;
}

export interface Pillar {
  stem_index: number;
  branch_index: number;
  stem_name: string;
  branch_name: string;
  chinese: string;
  label: string;
}

export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
  chinese: string;
  label: string;
}

export interface BaziResult {
  input: BaziInput;
  pillars: FourPillars;
  birth_local_dt: DateTimeParts;
  birth_utc_dt: DateTimeParts;
  chart_local_dt: DateTimeParts;
  jd_ut: number;
  jd_tt: number;
  delta_t_seconds: number;
  lichun_jd: number;
  lichun_local_dt: DateTimeParts;
  month_boundaries_jd: number[];
  month_index: number;
}

const DEG_TO_RAD = Math.PI / 180;

export const CITY_COORDINATES = {
  Berlin: { lat: 52.52, lon: 13.405, tz: "Europe/Berlin" },
  Munich: { lat: 48.1351, lon: 11.582, tz: "Europe/Berlin" },
  Vienna: { lat: 48.2082, lon: 16.3738, tz: "Europe/Vienna" },
  Zurich: { lat: 47.3769, lon: 8.5417, tz: "Europe/Zurich" },
  Paris: { lat: 48.8566, lon: 2.3522, tz: "Europe/Paris" },
  London: { lat: 51.5074, lon: -0.1278, tz: "Europe/London" },
  Madrid: { lat: 40.4168, lon: -3.7038, tz: "Europe/Madrid" },
  Rome: { lat: 41.9028, lon: 12.4964, tz: "Europe/Rome" },
  Amsterdam: { lat: 52.3676, lon: 4.9041, tz: "Europe/Amsterdam" },
  Beijing: { lat: 39.9042, lon: 116.4074, tz: "Asia/Shanghai" },
  Shanghai: { lat: 31.2304, lon: 121.4737, tz: "Asia/Shanghai" },
  Hong_Kong: { lat: 22.3193, lon: 114.1694, tz: "Asia/Hong_Kong" },
  Taipei: { lat: 25.033, lon: 121.5654, tz: "Asia/Taipei" },
  Tokyo: { lat: 35.6762, lon: 139.6503, tz: "Asia/Tokyo" },
  Singapore: { lat: 1.3521, lon: 103.8198, tz: "Asia/Singapore" },
  New_York: { lat: 40.7128, lon: -74.006, tz: "America/New_York" },
  Los_Angeles: { lat: 34.0522, lon: -118.2437, tz: "America/Los_Angeles" },
  San_Francisco: { lat: 37.7749, lon: -122.4194, tz: "America/Los_Angeles" },
  Sydney: { lat: -33.8688, lon: 151.2093, tz: "Australia/Sydney" },
} as const;

export const GOLDEN_VECTORS: Array<{ name: string; input: BaziInput; expected_string: string; expected_chinese: string }> = [
  {
    name: "Berlin_2024-02-10_Standard",
    input: {
      birth_local: "2024-02-10T14:30:00",
      timezone: "Europe/Berlin",
      longitude_deg: 13.405,
      latitude_deg: 52.52,
      time_standard: "CIVIL",
      day_boundary: "midnight",
    },
    expected_string: "JiaChen-BingYin-JiaChen-XinWei",
    expected_chinese: "甲辰 丙寅 甲辰 辛未",
  },
  {
    name: "Berlin_2024-02-04_just_before_LiChun",
    input: {
      birth_local: "2024-02-04T09:26:00",
      timezone: "Europe/Berlin",
      longitude_deg: 13.405,
      latitude_deg: 52.52,
      time_standard: "CIVIL",
      day_boundary: "midnight",
    },
    expected_string: "GuiMao-YiChou-WuXu-DingSi",
    expected_chinese: "癸卯 乙丑 戊戌 丁巳",
  },
  {
    name: "Berlin_2024-02-04_just_after_LiChun",
    input: {
      birth_local: "2024-02-04T09:28:00",
      timezone: "Europe/Berlin",
      longitude_deg: 13.405,
      latitude_deg: 52.52,
      time_standard: "CIVIL",
      day_boundary: "midnight",
    },
    expected_string: "JiaChen-BingYin-WuXu-DingSi",
    expected_chinese: "甲辰 丙寅 戊戌 丁巳",
  },
  {
    name: "Madrid_2024-02-04_LMT_Zi_boundary",
    input: {
      birth_local: "2024-02-04T23:30:00",
      timezone: "Europe/Madrid",
      longitude_deg: -3.7038,
      latitude_deg: 40.4168,
      time_standard: "LMT",
      day_boundary: "zi",
    },
    expected_string: "JiaChen-BingYin-WuXu-GuiHai",
    expected_chinese: "甲辰 丙寅 戊戌 癸亥",
  },
  {
    name: "Reference_1949-10-01_Beijing",
    input: {
      birth_local: "1949-10-01T12:00:00",
      timezone: "Asia/Shanghai",
      longitude_deg: 116.4074,
      latitude_deg: 39.9042,
      time_standard: "CIVIL",
      day_boundary: "midnight",
    },
    expected_string: "JiChou-GuiYou-JiaZi-GengWu",
    expected_chinese: "己丑 癸酉 甲子 庚午",
  },
  {
    name: "Reference_1912-02-18",
    input: {
      birth_local: "1912-02-18T12:00:00",
      timezone: "Asia/Shanghai",
      longitude_deg: 116.4074,
      latitude_deg: 39.9042,
      time_standard: "CIVIL",
      day_boundary: "midnight",
    },
    expected_string: "JiaZi",
    expected_chinese: "甲子",
  },
];

export const GOLDEN_VECTORS_BY_NAME = GOLDEN_VECTORS.reduce(
  (acc, vector) => ({ ...acc, [vector.name]: vector }),
  {} as Record<string, (typeof GOLDEN_VECTORS)[number]>
);

export const pad2 = (value: number) => value.toString().padStart(2, "0");

export const formatDateTime = (dt: DateTimeParts) =>
  `${dt.year}-${pad2(dt.month)}-${pad2(dt.day)} ${pad2(dt.hour)}:${pad2(dt.minute)}:${pad2(Math.floor(dt.second))}`;

export const parseIsoToParts = (iso: string): DateTimeParts => {
  const [datePart, timePart = "00:00:00"] = iso.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second = "0"] = timePart.split(":");
  return {
    year,
    month,
    day,
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second),
  };
};

const getTimeZoneOffset = (date: Date, timeZone: string) => {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(date);
  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const asUTC = Date.UTC(
    Number(lookup.year),
    Number(lookup.month) - 1,
    Number(lookup.day),
    Number(lookup.hour),
    Number(lookup.minute),
    Number(lookup.second)
  );
  return (asUTC - date.getTime()) / 60000;
};

const fromDateUTC = (date: Date): DateTimeParts => ({
  year: date.getUTCFullYear(),
  month: date.getUTCMonth() + 1,
  day: date.getUTCDate(),
  hour: date.getUTCHours(),
  minute: date.getUTCMinutes(),
  second: date.getUTCSeconds() + date.getUTCMilliseconds() / 1000,
});

export const toUTC = (local: DateTimeParts, timeZone: string): DateTimeParts => {
  const utcGuess = new Date(Date.UTC(local.year, local.month - 1, local.day, local.hour, local.minute, local.second));
  const offsetMinutes = getTimeZoneOffset(utcGuess, timeZone);
  const corrected = new Date(utcGuess.getTime() - offsetMinutes * 60000);
  return fromDateUTC(corrected);
};

export const toLmt = (utc: DateTimeParts, longitude: number): DateTimeParts => {
  const utcDate = new Date(Date.UTC(utc.year, utc.month - 1, utc.day, utc.hour, utc.minute, utc.second));
  const offsetMs = (longitude / 15) * 3600 * 1000;
  return fromDateUTC(new Date(utcDate.getTime() + offsetMs));
};

export const addDays = (dt: DateTimeParts, days: number): DateTimeParts => {
  const date = new Date(Date.UTC(dt.year, dt.month - 1, dt.day, dt.hour, dt.minute, dt.second));
  date.setUTCDate(date.getUTCDate() + days);
  return fromDateUTC(date);
};

export const jdnFromGregorian = (year: number, month: number, day: number) => {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
};

export const julianDay = (year: number, month: number, day: number, hour: number) => {
  const jdn = jdnFromGregorian(year, month, day);
  return jdn - 0.5 + hour / 24;
};

export const datetimeToJd = (dt: DateTimeParts) => {
  const decimalHour = dt.hour + dt.minute / 60 + dt.second / 3600;
  return julianDay(dt.year, dt.month, dt.day, decimalHour);
};

export const jdToDatetime = (jd: number): DateTimeParts => {
  const jdAdjusted = jd + 0.5;
  const Z = Math.floor(jdAdjusted);
  const F = jdAdjusted - Z;

  let A = Z;
  if (Z >= 2299161) {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);
  const day = B - D - Math.floor(30.6001 * E);
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  const totalHours = F * 24;
  const hour = Math.floor(totalHours);
  const remaining = (totalHours - hour) * 60;
  const minute = Math.floor(remaining);
  const second = (remaining - minute) * 60;

  return { year, month, day, hour, minute, second };
};

export const deltaTSeconds = (year: number) => {
  if (year < 1620) {
    const t = (year - 1600) / 100;
    return 120 - 0.9808 * t - 0.01532 * t * t + (t * t * t) / 7129;
  }
  if (year < 1700) {
    const t = year - 1600;
    return 120 - 0.9808 * t - 0.01532 * t * t + (t * t * t) / 7129;
  }
  if (year < 1800) {
    const t = year - 1700;
    return 8.83 + 0.1603 * t - 0.0059285 * t * t + 0.00013336 * t * t * t - (t * t * t * t) / 1174000;
  }
  if (year < 1860) {
    const t = year - 1800;
    return (
      13.72 - 0.332447 * t + 0.0068612 * t * t + 0.0041116 * t * t * t - 0.00037436 * t * t * t * t +
      0.0000121272 * Math.pow(t, 5) - 0.0000001699 * Math.pow(t, 6) + 0.000000000875 * Math.pow(t, 7)
    );
  }
  if (year < 1900) {
    const t = year - 1860;
    return 7.62 + 0.5737 * t - 0.251754 * t * t + 0.01680668 * t * t * t - 0.0004473624 * t * t * t * t + Math.pow(t, 5) / 233174;
  }
  if (year < 1920) {
    const t = year - 1900;
    return -2.79 + 1.494119 * t - 0.0598939 * t * t + 0.0061966 * t * t * t - 0.000197 * t * t * t * t;
  }
  if (year < 1941) {
    const t = year - 1920;
    return 21.2 + 0.84493 * t - 0.0761 * t * t + 0.0020936 * t * t * t;
  }
  if (year < 1961) {
    const t = year - 1950;
    return 29.07 + 0.407 * t - (t * t) / 233 + (t * t * t) / 2547;
  }
  if (year < 1986) {
    const t = year - 1975;
    return 45.45 + 1.067 * t - (t * t) / 260 - (t * t * t) / 718;
  }
  if (year < 2005) {
    const t = year - 2000;
    return 63.86 + 0.3345 * t - 0.060374 * t * t + 0.0017275 * t * t * t + 0.000651814 * t * t * t * t + 0.00002373599 * Math.pow(t, 5);
  }
  if (year < 2050) {
    const t = year - 2000;
    return 62.92 + 0.32217 * t + 0.005589 * t * t;
  }
  if (year < 2150) {
    const t = (year - 1820) / 100;
    return -20 + 32 * t * t - 0.5628 * (2150 - year);
  }
  const t = (year - 1820) / 100;
  return -20 + 32 * t * t;
};

export const sunLongitudeSimplified = (jd: number) => {
  const T = (jd - 2451545.0) / 36525.0;
  let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  L0 = ((L0 % 360) + 360) % 360;
  let M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  M = ((M % 360) + 360) % 360;
  const Mrad = M * DEG_TO_RAD;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);
  return ((L0 + C) % 360 + 360) % 360;
};

const angleDiff = (a: number, b: number) => {
  let d = (a - b) % 360;
  if (d > 180) d -= 360;
  return d;
};

export const findSolarCrossingBisection = (
  targetLongitude: number,
  jdStart: number,
  sunLongitudeFunc: (jd: number) => number,
  accuracySeconds = 1,
  maxDays = 40
) => {
  const accuracyDays = accuracySeconds / 86400;
  let jdLow = jdStart;
  let jdHigh = jdStart + maxDays;
  let lonStart = sunLongitudeFunc(jdLow);

  while (jdHigh - jdLow > accuracyDays) {
    const jdMid = (jdLow + jdHigh) / 2;
    const lonMid = sunLongitudeFunc(jdMid);
    const diffLow = angleDiff(targetLongitude, lonStart);
    const diffMid = angleDiff(targetLongitude, lonMid);
    if (diffLow * diffMid <= 0) {
      jdHigh = jdMid;
    } else {
      jdLow = jdMid;
      lonStart = lonMid;
    }
  }

  return (jdLow + jdHigh) / 2;
};

export const computeYearPillar = (chart: DateTimeParts, lichunJd: number) => {
  const chartJd = datetimeToJd(chart);
  const solarYear = chartJd >= lichunJd ? chart.year : chart.year - 1;
  let yearIdx60 = (solarYear - YEAR_EPOCH) % 60;
  if (yearIdx60 < 0) yearIdx60 += 60;
  return { stem: yearIdx60 % 10, branch: yearIdx60 % 12 };
};

export const computeMonthBoundaries = (lichunJd: number, accuracySeconds = 1) => {
  const boundaries: number[] = [];
  for (let i = 0; i < MONTH_BOUNDARY_LONGITUDES.length; i += 1) {
    if (i === 0) {
      boundaries.push(lichunJd);
    } else {
      const startJd = boundaries[i - 1] + 25;
      const crossing = findSolarCrossingBisection(MONTH_BOUNDARY_LONGITUDES[i], startJd - 5, sunLongitudeSimplified, accuracySeconds);
      boundaries.push(crossing);
    }
  }
  return boundaries;
};

export const computeMonthPillar = (chartJd: number, boundaries: number[], yearStem: number) => {
  let monthIndex = 0;
  for (let i = 0; i < 12; i += 1) {
    if (boundaries[i] <= chartJd && chartJd < boundaries[i + 1]) {
      monthIndex = i;
      break;
    }
  }
  const monthBranch = (2 + monthIndex) % 12;
  const monthStem = (yearStem * 2 + 2 + monthIndex) % 10;
  return { stem: monthStem, branch: monthBranch, monthIndex };
};

export const computeDayPillar = (chart: DateTimeParts, dayBoundary: DayBoundary) => {
  let { year, month, day } = chart;
  if (dayBoundary === "zi" && chart.hour >= 23) {
    const nextDay = addDays(chart, 1);
    year = nextDay.year;
    month = nextDay.month;
    day = nextDay.day;
  }
  const jdn = jdnFromGregorian(year, month, day);
  const dayIdx60 = (jdn + DAY_OFFSET) % 60;
  return { stem: dayIdx60 % 10, branch: dayIdx60 % 12 };
};

export const computeHourPillar = (chart: DateTimeParts, dayStem: number) => {
  const hourBranch = Math.floor((chart.hour + 1) / 2) % 12;
  const hourStem = (dayStem * 2 + hourBranch) % 10;
  return { stem: hourStem, branch: hourBranch };
};

export const buildPillar = (stem: number, branch: number): Pillar => {
  const stemName = STEM_NAMES[stem];
  const branchName = BRANCH_NAMES[branch];
  const chinese = `${STEM_CHINESE[stem]}${BRANCH_CHINESE[branch]}`;
  return {
    stem_index: stem,
    branch_index: branch,
    stem_name: stemName,
    branch_name: branchName,
    chinese,
    label: `${stemName}${branchName}`,
  };
};

export const computeBazi = (input: BaziInput): BaziResult => {
  const birthLocal = parseIsoToParts(input.birth_local);
  const birthUtc = toUTC(birthLocal, input.timezone);
  const chartLocal = input.time_standard === "LMT" ? toLmt(birthUtc, input.longitude_deg) : { ...birthLocal };

  const jdUt = datetimeToJd(birthUtc);
  const deltaT = deltaTSeconds(birthUtc.year + birthUtc.month / 12);
  const jdTt = jdUt + deltaT / 86400;

  const jan1 = { year: chartLocal.year, month: 1, day: 1, hour: 0, minute: 0, second: 0 };
  const jan1Jd = datetimeToJd(jan1);
  const lichunJd = findSolarCrossingBisection(LICHUN_LONGITUDE, jan1Jd, sunLongitudeSimplified, input.accuracy_seconds ?? 1);

  const yearPillar = computeYearPillar(chartLocal, lichunJd);
  const monthBoundaries = computeMonthBoundaries(lichunJd, input.accuracy_seconds ?? 1);
  const chartJd = datetimeToJd(chartLocal);
  const monthPillar = computeMonthPillar(chartJd, monthBoundaries, yearPillar.stem);
  const dayPillar = computeDayPillar(chartLocal, input.day_boundary);
  const hourPillar = computeHourPillar(chartLocal, dayPillar.stem);

  const pillars: FourPillars = {
    year: buildPillar(yearPillar.stem, yearPillar.branch),
    month: buildPillar(monthPillar.stem, monthPillar.branch),
    day: buildPillar(dayPillar.stem, dayPillar.branch),
    hour: buildPillar(hourPillar.stem, hourPillar.branch),
    chinese: "",
    label: "",
  };
  pillars.chinese = `${pillars.year.chinese} ${pillars.month.chinese} ${pillars.day.chinese} ${pillars.hour.chinese}`;
  pillars.label = `${pillars.year.label}-${pillars.month.label}-${pillars.day.label}-${pillars.hour.label}`;

  const lichunLocal = jdToDatetime(lichunJd);

  return {
    input,
    pillars,
    birth_local_dt: birthLocal,
    birth_utc_dt: birthUtc,
    chart_local_dt: chartLocal,
    jd_ut: jdUt,
    jd_tt: jdTt,
    delta_t_seconds: deltaT,
    lichun_jd: lichunJd,
    lichun_local_dt: lichunLocal,
    month_boundaries_jd: monthBoundaries,
    month_index: monthPillar.monthIndex,
  };
};

export const runGoldenVectorTests = () => {
  return GOLDEN_VECTORS.map((vector) => {
    const result = computeBazi(vector.input);
    const expected = vector.expected_string;
    const isDayOnly = expected === "JiaZi";
    const actual = isDayOnly ? result.pillars.day.label : result.pillars.label;
    return {
      name: vector.name,
      expected,
      expectedChinese: vector.expected_chinese,
      actual,
      actualChinese: isDayOnly ? result.pillars.day.chinese : result.pillars.chinese,
      pass: actual === expected,
    };
  });
};
