// Shared loader for all data files
import fs from 'node:fs';

export function loadData(filePath = 'data.json') {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function saveData(data, filePath = 'data.json') {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}