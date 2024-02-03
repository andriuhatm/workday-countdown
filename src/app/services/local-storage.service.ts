import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  LOCAL_STORAGE_KEY = 'workday-countdown_';

  constructor() {
  }

  setData(data: any) {
    // localStorage.setItem(this.LOCAL_STORAGE_KEY, jsonData);
    window.localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(data));
  }

  getData() {
    let data = window.localStorage.getItem(this.LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  removeData() {
    localStorage.removeItem(this.LOCAL_STORAGE_KEY);
  }
}
