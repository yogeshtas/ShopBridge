import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {

  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet',worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'query_list': worksheet }, SheetNames: ['query_list'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

}



// import { Injectable } from '@angular/core';
// import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';

// const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
// const EXCEL_EXTENSION = '.xlsx';
// // declare var XLSX: any;
// @Injectable()
// export class ExcelService {
// constructor() { }
//     public exportAsExcelFile(json: any[], excelFileName: string): void {
//     const worksheet: XLSX.IWorkSheet = XLSX.utils.aoa_to_sheet(json);
//     // const worksheet: XLSX.IWorkSheet = XLSX.utils.sheet_to_json(json);
//     const workbook: XLSX.IWorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'], Props:{ Author:'XYZ'} };
//     const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
//     this.saveAsExcelFile(excelBuffer, excelFileName);
//     }
//     private saveAsExcelFile(buffer: any, fileName: string): void {
//     const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
//     FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
//     }
// }