import { IGoal } from './goals.interface';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class GoalsService {
  private _url="api/getallgoals";
  private goals : IGoal[];

  constructor (private _http: Http) {

  }

  loadAllGoals() : Observable<IGoal[]> {
    return this._http.get(this._url)
    .map((response:Response) => <IGoal[]>response.json())
    .do(data => JSON.stringify(data));
  }
  
  handleError(error : Response) : void {
    console.error("ERROR: ", error);
  }  
}