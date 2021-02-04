import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  public apiUrl = `http://aap.trackhind.com/WebService.asmx`;


  constructor( private _http: HttpClient) {
    console.log('Api Url',this.apiUrl);
  }

  public message = new Subject<any>();

  setMessage(value: any) {
    this.message.next(value); //it is publishing this value to all the subscribers that have already subscribed to this message
  }

  get(url: string, queryParams:any): Observable<any> {
    console.log('queryParams', queryParams);
    var urlStr = this.apiUrl + url;
    return this._http.get(urlStr, queryParams);
  }

  post(url: string, body): Observable<any> {
    var urlStr = this.apiUrl + url;
    return this._http.post(urlStr, body);
  }

  put(url: string, body): Observable<any> {
     var urlStr = this.apiUrl + url;
     return this._http.put(urlStr, body);
  }

  delete(url: string): Observable<any> {
    var urlStr = this.apiUrl + url;
    return this._http.delete(urlStr);
  }
  sendMsg(urlStr): Observable<any> {
    return this._http.get(urlStr);
  }
}
