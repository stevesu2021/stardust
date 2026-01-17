import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '../../选品池导出.xlsx');

try {
  const workbook = XLSX.readFile(filePath);

  console.log('Sheet names:', workbook.SheetNames);

  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Convert to JSON with header option
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  console.log('\nFirst 10 rows (raw):');
  console.log(JSON.stringify(data.slice(0, 10), null, 2));

  // Get headers from first row
  const headers = data[0] as string[];
  console.log('\nHeaders:', headers);

  // Convert to objects
  const objects = XLSX.utils.sheet_to_json(worksheet);
  console.log('\nFirst 3 objects:');
  console.log(JSON.stringify(objects.slice(0, 3), null, 2));

  console.log(`\nTotal rows: ${data.length}`);

} catch (error) {
  console.error('Error reading Excel file:', error);
}
