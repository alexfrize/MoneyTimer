import { IGoal } from './goals.interface';
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class GoalsService {
  private goals : IGoal[];

  constructor (private _http: Http) {

  }

  loadAllGoals() : Observable<IGoal[]> {
    var _url="/api/getallgoals";
    return this._http.get(_url)
    .map((response:Response) => <IGoal[]>response.json())
    .do(data => JSON.stringify(data));
  }
  
  saveGoalToDB(goalObject : IGoal) : Observable<Response> {
        var _url = "/api/savegoal";
        var headers = new Headers({
          'Content-Type': 'application/json'
        });
        return this._http.post(
          _url,
          JSON.stringify(goalObject),
          { headers }
        )
      
  }

  handleError(error : Response) : void {
    console.error("ERROR: ", error);
  }  
}