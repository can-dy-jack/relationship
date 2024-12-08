/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import ExcelJS from 'exceljs';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export async function exportExcel(data: any) {
  const workbook = new ExcelJS.Workbook();
  workbook.modified = new Date();
  workbook.creator = 'Relationship App';

  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(data)) {
    const worksheet = workbook.addWorksheet(key);

    if (data[key].length > 0) {
      const headers = Object.keys(data[key][0]);
      worksheet.addRow(headers);
    }

    data[key].forEach((item: any) => {
      const values = Object.values(item);
      worksheet.addRow(values);
    });
  }

  const res = await workbook.xlsx.writeBuffer();
  return res;
}
