import { ISettings } from './settings.interface';
import { ISalary } from './salary.interface';
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class SettingsService {
  private settings : ISettings;

  constructor (private _http: Http) {

  }

  loadSettings() : Observable<ISettings> {
    var _url="/api/loadsettings";
    return this._http.get(_url)
    .map((response:Response) => <ISettings>response.json() )
    .do(data => JSON.stringify(data)[0])
    .catch(this.handleError__load);
  }

  /* ========================================================================================================== */
  saveSettings(settingsObject : ISettings) : Observable<Response> {
        var _url = "/api/savesettings";
        var headers = new Headers({
          'Content-Type': 'application/json'
        });
        return this._http.put(
          _url,
          JSON.stringify(settingsObject),
          { headers }
        ).catch(this.handleError__save);
  }

  /* ========================================================================================================== */
  saveSalaryToDB(salaryObject : ISalary) : Observable<Response> {
        var _url = "/api/savesalary";
        var headers = new Headers({
          'Content-Type': 'application/json'
        });
        return this._http.put(
          _url,
          JSON.stringify(salaryObject),
          { headers }
        ).catch(this.handleError__save_salary);
  }


  /* ========================================================================================================== */
  handleError__load(error : Response) : any {
    console.error("SETTINGS LOAD ERROR: ", error);
  }  

  /* ========================================================================================================== */
  handleError__save(error : Response) : any {
    console.error("SETTINGS SAVE ERROR: ", error);
  }  

  /* ========================================================================================================== */
  handleError__save_salary(error : Response) : any {
    console.error("SALARY SAVE ERROR: ", error);
  }  
}