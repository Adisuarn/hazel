import { Debugger, ExcelDataSource } from "@lib";
import Excel from 'exceljs';
import path from 'path';

async function fetchDataFromExcel(fileName : string) {
    const filePath = path.resolve('resource/collection/', fileName);
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filePath);
    return workbook;
}

async function createStudentRespondObject() {
    await fetchDataFromExcel("studentDataRespond.xlsx").then((workbook) => {
        const worksheet: any = workbook.getWorksheet(1); // Assuming data is in the first sheet
        const data: any[] = [];
        worksheet.eachRow((row: any, rowNumber: any) => {
        if (rowNumber === 1) return; // Skip header row
        const rowData: any = {};
        row.eachCell((cell: any, colNumber: any) => {
            if (colNumber > 8) return; // Skip Answer
            if (colNumber === 1) return; // Skip Time Stamp
            const header = worksheet.getRow(1).getCell(colNumber).value;
            rowData[header] = cell.value;
        });
        data.push(rowData);
    });
    return data;
});
}

async function groupingData(){ //Get Student Object and Group by Club
    await createStudentRespondObject().then((data : any) => {
        const groupedData = data.reduce((acc : any, curr : any) => {
            const club = curr['ชมรม'];
            if (!acc[club]) {
                acc[club] = [];
            }
            const { 'ชมรม': _, ...rest } = curr; // Exclude clubs from properties
            acc[club].push(rest);
            return acc;
        }, {});
        return groupedData;
    });
}

async function fetchDataFromNameSheet(){
    
}
