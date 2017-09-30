import { IGoal } from './goals.interface';
import { IFinishedGoal } from './finishedgoals.interface';
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

  loadCurrentGoals() : Observable<IGoal[]> {
    var _url="/api/getallgoals";
    return this._http.get(_url)
    .map((response:Response) => <IGoal[]>response.json())
    .do(data => JSON.stringify(data));
  }

  /* ========================================================================================================== */  
  loadFinishedGoals() {
    var _url="/api/getfinishedgoals";
    return this._http.get(_url)
    .map((response:Response) => <IGoal[]>response.json())
    .do(data => JSON.stringify(data));
  }


  /* ========================================================================================================== */
  saveGoalToDB(goalObject : IGoal) : Observable<Response> {
        var _url = "/api/savenewgoal";
        var headers = new Headers({
          'Content-Type': 'application/json'
        });
        return this._http.post(
          _url,
          JSON.stringify(goalObject),
          { headers }
        ).map(res => res.json())
        .catch(this.handleError);;
  }

  /* ========================================================================================================== */
  saveFinishedGoalToDB(finishedGoalObject : IGoal) : Observable<Response> {
        var _url = "/api/savefinishedgoal";
        var headers = new Headers({
          'Content-Type': 'application/json'
        });
        return this._http.post(
          _url,
          JSON.stringify(finishedGoalObject),
          { headers }
        ).map(res => res.json())
        .catch(this.handleError);;
  }
  
  /* ========================================================================================================== */
  saveGoalChangesToDB(goalObject : IGoal) : Observable<Response> {
        var _url = "/api/savegoalchanges";
        var headers = new Headers({
          'Content-Type': 'application/json'
        });
        //console.warn("JSON.stringify(goalObject) ===", JSON.stringify(goalObject));
        return this._http.put(
          _url,
          JSON.stringify(goalObject),
          { headers }
        ).catch(this.handleError);
  }

  /* ========================================================================================================== */
  updateAllGoalsIndexesAndDollarsCompleteInDB(goalsIndexesAndDollarsCompleteArray : IGoal[]) : Observable<Response> {
        var _url = "/api/updateallgoalsindexes";
        var headers = new Headers({
          'Content-Type': 'application/json'
        });
        // console.warn("JSON.stringify(goalsIndexesArray) ===", JSON.stringify(goalsIndexesAndDollarsCompleteArray));
        
        return this._http.put(
          _url,
          JSON.stringify(goalsIndexesAndDollarsCompleteArray),
          { headers }
        ).catch(this.handleError);
       
  }


  deleteGoalFromDB(goalObject : IGoal) : Observable<Response> {
        var _url = "/api/deletegoal" + "?id=" + goalObject._id;

        // var headers = new Headers({
        //   'Content-Type': 'application/json'
        // });
        console.warn("DELETE: goalObject._id ===", goalObject._id);

        return this._http.delete(_url)
        .catch(this.handleError);
  }
  /* ========================================================================================================== */
  handleError(error : Response) : any {
    console.error("ERROR: ", error);
  }  
}