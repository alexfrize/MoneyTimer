import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { SettingsService } from '../connect-to-server/settings.service';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';

@Component ({
  selector: 'main-panel',
  templateUrl: 'main-panel.html',
  styleUrls: ['main-panel.css'],
  providers: [SettingsService]
})
export class MainPanelComponent implements OnInit, OnChanges {

  private startingTime;
  private endingTime;
  private previous_timeWorkedOutToday_milliseconds : number = 0; 
  private timeWorkedOutToday_milliseconds : number = 0;
  private timeWorkedOutToday_string : string = '00:00:00';  // change string -> number
  private income : number = 0;
  private totalEarnings : number = 0;
  private previous_totalEarnings : number = 0; // later it loads from DB
  private ticks = 0;
  private workedOutToday_buttonTitle : string = 'Start';
  private workedOutToday_buttonColor : string  = 'warn';
  private ifTimerIsWorking_counter : number = 0;
  private infoDialogIsShowing : boolean = false;
  private day : number = 1;
  private timer;

  @Input() hourlySalary : number;
  private previous_hourlySalary : number;
  @Output() updateTimeWorkedOutToday_event : EventEmitter<number> = new EventEmitter<number>();
  @Output() updateProgressBars_event : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() saveAllProgress_event : EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor (public infoModal : MdDialog, private settingsService : SettingsService) {
  	let now = moment().format("HH:mm:ss");
  	console.log(now);
    this.loadTotalEarningsAndDayFromDB();
  }
  
  ngOnInit(){
    this.timer = Observable.interval(1000);
    this.timer.subscribe(t => {
    	this.updateWorkingHours();
    	this.updateMoneyTimer();
      this.updateTimeWorkedOutToday_event.emit(this.timeWorkedOutToday_milliseconds);
      this.updateProgressBars_event.emit(true);
      this.checkIfTimerIsWorking();
    	this.ticks = t;
    });
    const SAVE_STATE_EVERY_MS = 60000; // saves current state every 1 minute (60000 ms)
    let saveState_timer = Observable.interval(SAVE_STATE_EVERY_MS);
    saveState_timer.subscribe(t => this.saveStateToDB());
  }
  
  ngOnChanges() {
    console.log("ngOnChanges(): this.hourlySalary==", this.hourlySalary);
  }

  /* Checks, if Money timer is working or not. Shows modal if not */
  checkIfTimerIsWorking() {
    
    let SHOW_MODAL_AFTER_N_SECONDS = 10;

    if (this.workedOutToday_buttonTitle === "Start" || this.workedOutToday_buttonTitle === "Continue") {
      this.ifTimerIsWorking_counter++;
      if (this.ifTimerIsWorking_counter > SHOW_MODAL_AFTER_N_SECONDS && !this.infoDialogIsShowing) {
        let infoModalRef = this.infoModal.open(InfoModalComponent);
        this.infoDialogIsShowing = true;
        infoModalRef.afterClosed().subscribe(result => {
          this.infoDialogIsShowing = false;
        });
        this.ifTimerIsWorking_counter = 0;
      }
    }
    else {
        this.ifTimerIsWorking_counter = 0;
    }
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
  }

/* ========================= Updates money timer ========================= */
  updateMoneyTimer() {
  	this.income = Math.floor(this.timeWorkedOutToday_milliseconds*this.hourlySalary/3600000);
  	this.totalEarnings = this.income;
  }

/* ========================= Updates DB, saves current state ========================= */
  saveStateToDB() {
    console.log("saveStateToDB(): saving state...");
    let settingsObject = {
      hourlySalary : this.hourlySalary,
      totalEarnings : this.totalEarnings,
      day : this.day,
      timeWorkedOutToday_milliseconds : this.timeWorkedOutToday_milliseconds
    }
    console.warn("settingsObject === ", settingsObject);
    //this.previous_timeWorkedOutToday_milliseconds
    
    this.settingsService.saveSettings(settingsObject)
      .subscribe(
        result => console.log("==> saveStateToDB()::result === ", result),
        error => console.error(error)
      );
    this.saveAllProgress_event.emit(true);
  }

/* ========================= Load state from DB and assings previous_totalEarnings to the value loaded from DB ========================= */
  loadTotalEarningsAndDayFromDB() {
    console.log("loadStateFromDB(): loading state...");
    let settingsObject = {};
    this.settingsService.loadSettings().subscribe(
      settings => {
        this.day = +settings.day;
        this.previous_totalEarnings = +settings.totalEarnings;
        this.totalEarnings = +settings.totalEarnings;
        this.previous_timeWorkedOutToday_milliseconds = +settings.timeWorkedOutToday_milliseconds;
        this.timeWorkedOutToday_milliseconds = +settings.timeWorkedOutToday_milliseconds;
        this.timeWorkedOutToday_string = moment.utc(this.previous_timeWorkedOutToday_milliseconds).format('HH:mm:ss');
        console.warn(settings);
    });
  }

  /* ========================= Finishes working day, unsubscribes from all observables ========================= */
  finishWorkingDay() {
    this.day++;
    this.timeWorkedOutToday_milliseconds = 0;
    this.previous_timeWorkedOutToday_milliseconds = 0;
    this.previous_timeWorkedOutToday_milliseconds = this.timeWorkedOutToday_milliseconds;
    this.saveStateToDB();
    if (this.workedOutToday_buttonTitle == "Pause") this.startOrPauseTimer();
  }
}

