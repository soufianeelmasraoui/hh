import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  API_URL = 'http://193.70.46.61:4320/api/'
  constructor() { }
}
