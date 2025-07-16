const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Convertisseur de coordonnées DMS vers décimal : ex. 461036N → 46.176666
function dmsToDecimal(dms) {
  if (!dms || typeof dms !== 'string') return null;

  const match = dms.match(/(\d{2})(\d{2})(\d{2})([NSEW])/i);
  if (!match) return null;

  const [, deg, min, sec, dir] = match;
  let decimal = parseInt(deg) + parseInt(min) / 60 + parseInt(sec) / 3600;
  if (dir.toUpperCase() === 'S' || dir.toUpperCase() === 'W') decimal *= -1;

  return decimal;
}

// 1. Charger le fichier Excel
const workbook = XLSX.readFile('assets/data/Aeroports.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

// 2. Charger les charts existants pour garder les liens
const existing = require('../data/charts.js');
const existingMap = new Map(
  existing.airports.map((a) => [a.icao, a.chart])
);

// 3. Transformer les données
const result = data.map(row => ({
  icao: row.ICAO || row.Code || '',
  name: row.Name || row.AERODROME || '',
  latitude: dmsToDecimal(row.LAT),
  longitude: dmsToDecimal(row.LON),
  frequency: row.FREQ || row.FREQUENCY || null,
  chart: existingMap.get(row.ICAO || row.Code || '') || undefined
}));

// 4. Exporter en format JS
const output = `export const airports = ${JSON.stringify(result, null, 2)};\n`;

fs.writeFileSync(path.resolve(__dirname, '../data/charts.js'), output);
console.log('✅ Fichier charts.js généré avec succès dans /data');
