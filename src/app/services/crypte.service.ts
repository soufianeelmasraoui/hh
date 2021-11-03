import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CrypteService {

  Key:any;

  constructor() {
    this.Key = '';
  }

  encryptUsingAES256(data:any) {
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), this.Key.toString());
    return ciphertext;
  }

  decryptUsingAES256(data: any) {
    var bytes = CryptoJS.AES.decrypt(data.toString(), this.Key);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }
}
