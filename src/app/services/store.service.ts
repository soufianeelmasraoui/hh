import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { CrypteService } from './crypte.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class StoreService {


  constructor(private CrypteService: CrypteService,) { }

  set_DataSession(body: any) {
    body.forEach((element: { key: string; value: any; }) => {
      localStorage.setItem(
        element.key,
        this.CrypteService.encryptUsingAES256(element.value).toString()
      );
    });
  }

  get_DataSession(key: any) {

    return localStorage.getItem(key)
      ? this.CrypteService.decryptUsingAES256(localStorage.getItem(key))
      : null;
  }

  remove_DataSessionItems(kyes: any) {
    kyes.forEach((element: string) => {
      localStorage.removeItem(element);
    });
  }

  convertObjectToArray(data: any) {
    let result = Object.keys(data).map(function (key) {
      return [Number(key), data[key]];
    });

    return result;
  }


  errorSwal(message: any, duration: any = 2000, icon: any = "warning", text: any = "") {
    Swal.fire({
      icon: icon,
      title: message,
      text: text,
      showConfirmButton: false,
      timer: duration
    });
  }



  /* -------------------------------------------------------------------------- */
  /*                     Fonction de l'exportation en excel                     */
  /* -------------------------------------------------------------------------- */

  exportAsExcelFile(json: any[], excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }


}
