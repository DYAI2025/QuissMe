// Bazi Utilities - Chinesische Element-Berechnung

// Die 10 Himmelsstämme (Tiangan) mit Elementen und Yin/Yang
const TIANGAN = [
  { char: '甲', element: 'Wood', yinYang: 'Yang', name: 'Jia' },
  { char: '乙', element: 'Wood', yinYang: 'Yin', name: 'Yi' },
  { char: '丙', element: 'Fire', yinYang: 'Yang', name: 'Bing' },
  { char: '丁', element: 'Fire', yinYang: 'Yin', name: 'Ding' },
  { char: '戊', element: 'Earth', yinYang: 'Yang', name: 'Wu' },
  { char: '己', element: 'Earth', yinYang: 'Yin', name: 'Ji' },
  { char: '庚', element: 'Metal', yinYang: 'Yang', name: 'Geng' },
  { char: '辛', element: 'Metal', yinYang: 'Yin', name: 'Xin' },
  { char: '壬', element: 'Water', yinYang: 'Yang', name: 'Ren' },
  { char: '癸', element: 'Water', yinYang: 'Yin', name: 'Gui' }
]

// Die 12 Erdzweige (Dizhi) mit Tier, Element und Yin/Yang
const DIZHI = [
  { char: '子', element: 'Water', yinYang: 'Yang', name: 'Rat', hour: '23-1' },
  { char: '丑', element: 'Earth', yinYang: 'Yin', name: 'Ox', hour: '1-3' },
  { char: '寅', element: 'Wood', yinYang: 'Yang', name: 'Tiger', hour: '3-5' },
  { char: '卯', element: 'Wood', yinYang: 'Yin', name: 'Rabbit', hour: '5-7' },
  { char: '辰', element: 'Earth', yinYang: 'Yang', name: 'Dragon', hour: '7-9' },
  { char: '巳', element: 'Fire', yinYang: 'Yin', name: 'Snake', hour: '9-11' },
  { char: '午', element: 'Fire', yinYang: 'Yang', name: 'Horse', hour: '11-13' },
  { char: '未', element: 'Earth', yinYang: 'Yin', name: 'Goat', hour: '13-15' },
  { char: '申', element: 'Metal', yinYang: 'Yang', name: 'Monkey', hour: '15-17' },
  { char: '酉', element: 'Metal', yinYang: 'Yin', name: 'Rooster', hour: '17-19' },
  { char: '戌', element: 'Earth', yinYang: 'Yang', name: 'Dog', hour: '19-21' },
  { char: '亥', element: 'Water', yinYang: 'Yin', name: 'Pig', hour: '21-23' }
]

// Erde-Zyklus für Jahres-Branch
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

// Finde den Himmelsstamm für ein Jahr
function getYearGan(year) {
  // 1984 ist Jahr von Jia-Zi (erster Himmelsstamm, Yang Wood Rat)
  const baseYear = 1984
  const offset = (year - baseYear) % 10
  if (offset < 0) offset + 10
  return TIANGAN[offset]
}

// Finde den Erdzweig für ein Jahr
function getYearZhi(year) {
  const baseYear = 1984
  const offset = (year - baseYear) % 12
  if (offset < 0) offset + 12
  return DIZHI[offset]
}

// Finde den Erdzweig für einen Monat
function getMonthZhi(month) {
  // Chinesisches Neujahr ist normalerweise zwischen 21. Jan und 20. Feb
  // Vereinfacht: Monat-Erdzweige starten mit Tiger im Feb (ca.)
  const monthZhiMap = [null, '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑']
  return DIZHI.find(d => d.char === monthZhiMap[month])
}

// Finde den Erdzweig für einen Tag (vereinfacht - basierend auf Stunde)
function getDayZhi(day, hour) {
  // Tag-Branch basiert auf dem Tag + Stunde
  // Vereinfachte Berechnung
  const baseDay = 1 // Vereinfachung
  const hourIndex = Math.floor(hour / 2) % 12
  return DIZHI[hourIndex]
}

// Finde den Erdzweig für eine Stunde
function getHourZhi(hour) {
  const hourZhiMap = [
    ['子', '子'], // 23-1
    ['丑', '丑'], // 1-3
    ['寅', '寅'], // 3-5
    ['卯', '卯'], // 5-7
    ['辰', '辰'], // 7-9
    ['巳', '巳'], // 9-11
    ['午', '午'], // 11-13
    ['未', '未'], // 13-15
    ['申', '申'], // 15-17
    ['酉', '酉'], // 17-19
    ['戌', '戌'], // 19-21
    ['亥', '亥']  // 21-23
  ]
  const hourIndex = Math.floor(hour / 2) % 12
  return DIZHI[hourIndex]
}

// Hauptfunktion: Berechne vollständiges Bazi-Pattern
export function calculateBazi(year, month, day, hour) {
  const yearGan = getYearGan(year)
  const yearZhi = getYearZhi(year)
  const monthZhi = getMonthZhi(month)
  const hourZhi = getHourZhi(hour)
  const dayZhi = getDayZhi(day, hour)
  
  // Day Master ist der Himmelsstamm des Tages
  // Für vereinfachte Berechnung: Day Gan = Year Gan + Month Offset
  const dayGanIndex = (yearGan.char.charCodeAt(0) + month) % 10
  const dayGan = TIANGAN[dayGanIndex >= 0 ? dayGanIndex : dayGanIndex + 10]
  
  return {
    year: { gan: yearGan, zhi: yearZhi },
    month: { zhi: monthZhi },
    day: { gan: dayGan, zhi: dayZhi },
    hour: { zhi: hourZhi },
    
    // Abgeleitete Informationen
    dayMaster: dayGan,
    mainElement: dayGan.element,
    yinYang: dayGan.yinYang,
    
    // Alle Elemente im Bazi
    elements: calculateElements({ yearGan, monthZhi, dayGan, hourZhi }),
    
    // Stärke der Elemente (vereinfacht)
    strength: calculateStrength({ yearGan, monthZhi, dayGan, hourZhi }),
    
    // Visualisierung
    pillars: [
      { name: 'Jahr', gan: yearGan.char, zhi: yearZhi.char },
      { name: 'Monat', gan: '', zhi: monthZhi.char },
      { name: 'Tag', gan: dayGan.char, zhi: dayZhi.char },
      { name: 'Stunde', gan: '', zhi: hourZhi.char }
    ]
  }
}

// Berechne alle Elemente im Bazi
function calculateElements({ yearGan, monthZhi, dayGan, hourZhi }) {
  const elements = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 }
  
  // Gan-Elemente
  elements[yearGan.element]++
  elements[dayGan.element]++
  
  // Zhi-Elemente (jeder Erdzweig hat ein Haupt-Element)
  elements[monthZhi.element]++
  elements[hourZhi.element]++
  
  return elements
}

// Berechte Stärke des Bazi (vereinfacht)
function calculateStrength({ yearGan, monthZhi, dayGan, hourZhi }) {
  let score = 0
  
  // Day Master ist am stärksten
  score += 2
  
  // Prüfe unterstützende Elemente (generating cycle)
  const generating = {
    Wood: ['Fire'],
    Fire: ['Earth'],
    Earth: ['Metal'],
    Metal: ['Water'],
    Water: ['Wood']
  }
  
  const element = dayGan.element
  const supported = generating[element] || []
  
  // Monat ist wichtig für Stärke
  if (monthZhi.element === element || supported.includes(monthZhi.element)) {
    score += 1
  }
  
  // Stunde kann stärken oder schwächen
  if (hourZhi.element === element) {
    score += 0.5
  }
  
  return score
}

// Element-Kompatibilität
export function getElementCompatibility(element1, element2) {
  const generating = {
    Wood: ['Fire'],
    Fire: ['Earth'],
    Earth: ['Metal'],
    Metal: ['Water'],
    Water: ['Wood']
  }
  
  const controlling = {
    Wood: ['Earth'],
    Fire: ['Metal'],
    Earth: ['Water'],
    Metal: ['Wood'],
    Water: ['Fire']
  }
  
  if (element1 === element2) return { type: 'same', text: 'Gleiche Energie' }
  if (generating[element1]?.includes(element2)) return { type: 'generating', text: 'Nährt' }
  if (generating[element2]?.includes(element1)) return { type: 'nourished', text: 'Wird genährt' }
  if (controlling[element1]?.includes(element2)) return { type: 'controlling', text: 'Kontrolliert' }
  if (controlling[element2]?.includes(element1)) return { type: 'controlled', text: 'Wird kontrolliert' }
  
  return { type: 'neutral', text: 'Neutral' }
}

// Yin/Yang Balance
export function getYinYangBalance(bazi1, bazi2) {
  const yinYang = [bazi1.yinYang, bazi2.yinYang]
  const yangCount = yinYang.filter(y => y === 'Yang').length
  
  if (yangCount === 0) return { 
    balance: 'double-yin', 
    text: 'Beide Yin',
    tip: 'Kreative Energie, braucht mehr aktive Impulse'
  }
  if (yangCount === 2) return { 
    balance: 'double-yang', 
    text: 'Beide Yang',
    tip: 'Aktive Energie, braucht Ruhephasen'
  }
  return { 
    balance: 'balanced', 
    text: 'Ausgewogen',
    tip: 'Perfekte Balance zwischen Aktivität und Ruhe'
  }
}

// Kombiniere Antwort-Typen für Paar-Resultat
export function combineAnswerTypes(type1, type2, resultPairs) {
  // Sortiere alphabetisch für konsistente Key-Reihenfolge
  const key = [type1, type2].sort().join('_')
  return resultPairs[key] || {
    title_de: 'Individuell',
    description_de: 'Ihr seid einzigartig.',
    icon: '💫',
    strength_de: 'Besonder',
    tip_de: 'Entdeckt euren eigenen Weg'
  }
}
