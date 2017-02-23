import { Component, Input, OnInit, OnChanges } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';

@Component ({
  selector: 'main-panel',
  templateUrl: 'main-panel.html',
  styleUrls: ['main-panel.css']
})
export class MainPanelComponent implements OnInit, OnChanges {

  private startingTime;
  private endingTime;
  private previous_timeWorkedOutToday_milliseconds : number = 0; 
  private timeWorkedOutToday_milliseconds : number = 0;
  private timeWorkedOutToday_string : string = '00:00:00';  // change string -> number
  private income : number = 0;
  private totalEarnings : number = 0;
  private previous_totalEarnings : number = 0; // later -> loads from DB
  private ticks = 0;
  private TMP = 30; //30$ в час - удалить и импортировать из другого класса
  private workedOutToday_buttonTitle : string = 'Start';
  private workedOutToday_buttonColor : string  = 'warn';
  
  @Input() hourlySalary : number;

  constructor () {
  	let now = moment().format("HH:mm:ss");
  	console.log(now);
  }
  
  ngOnInit(){
    let timer = Observable.interval(1000);
    timer.subscribe(t => {
    	this.updateWorkingHours();
    	this.updateMoneyTimer();
    	this.ticks = t});
    // saves current state every 1 minute (60000 ms)
    let saveState_timer = Observable.interval(60000);
    saveState_timer.subscribe(t => this.saveStateToDB());
  }
  
  ngOnChanges() {
  	this.TMP = this.hourlySalary;
    console.log("ngOnChanges(): this.hourlySalary==", this.hourlySalary);
  }

/* ========================= Starts timer of working hours ========================= */
  startOrPauseTimer() {
  	if (this.startingTime == undefined) {
  		this.startingTime = moment();
  	}
  	if ((this.workedOutToday_buttonTitle == "Start") || (this.workedOutToday_buttonTitle == "Continue")) {
  		this.workedOutToday_buttonTitle = "Pause";
  		this.workedOutToday_buttonColor = "primary";
  	}
  	else if (this.workedOutToday_buttonTitle == "Pause") {
  		this.previous_timeWorkedOutToday_milliseconds = this.timeWorkedOutToday_milliseconds;
  		this.workedOutToday_buttonTitle = "Continue";
  		this.workedOutToday_buttonColor = "warn";
  		this.startingTime = undefined;
  	}
  	this.updateWorkingHours();
  }
/* ========================= Updates working hours (timeWorkedOutToday variable) ========================= */
  updateWorkingHours() {

  	if (this.workedOutToday_buttonTitle == "Pause") {
	  	this.timeWorkedOutToday_milliseconds = moment().diff(this.startingTime) + this.previous_timeWorkedOutToday_milliseconds;
	  	this.timeWorkedOutToday_string = moment.utc(this.timeWorkedOutToday_milliseconds).format('HH:mm:ss');
  	}
  	// console.log(this.timeWorkedOutToday_string);
  	// console.log("this.ticks",this.ticks);
  }

/* ========================= Updates money timer ========================= */
  updateMoneyTimer() {
  	let incomePerSecond = this.TMP/3600;
  	this.income = Math.floor(this.timeWorkedOutToday_milliseconds*incomePerSecond/1000);
  	this.totalEarnings = this.income + this.previous_totalEarnings;
  	console.log(this.timeWorkedOutToday_string);
  	console.log("income",this.income);
  }

/* ========================= Updates DB, saves current state ========================= */
  saveStateToDB() {
    console.log("saveStateToDB(): saving state...");
  }

}

