import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { DragulaService } from '../../../node_modules/ng2-dragula';

import { GoalsService } from '../connect-to-server/goals.service';
import { IGoal } from '../connect-to-server/goals.interface';

import { MdDialog, MdDialogRef } from '@angular/material';
import { NewGoalModalComponent } from 'app/new-goal-modal/new-goal-modal.component';

@Component({
  selector: 'all-goals-panel',
  templateUrl: 'all-goals-panel.html',
  styleUrls: ['all-goals-panel.css'],
  providers: [GoalsService]

})

export class AllGoalsPanelComponent {
	@Input() goalObject : any;
	@Input() timeWorkedOutToday_milliseconds : number;
	@Input() hourlySalary : number;
	@Input() updateProgressBar_counter : number;
	@Output() showAllGoals_event : EventEmitter<boolean> = new EventEmitter<boolean>();
	private updateProgressBar_counter_prev : number;
	private timeWorkedOutToday_milliseconds_lastSave : number = null;
	private goals = [];
	private finishedGoals = [];
	private showAllGoals = false;
	private showCurrentOrFinished : string = 'current';

	constructor (public dialog: MdDialog, private dragulaService : DragulaService, private goalsService : GoalsService) {
		dragulaService.drop.subscribe((value) => {
      		console.log(this.goals);
      		this.updateIndexes();
      		this.updateProgress();
		});
		console.log("from AllGoalsPanelComponent constructor | this.goalObject == ", this.goalObject);
	}

	getCSSOf__allGoalsPanel_topMenu_item(mode : string) {
		return (mode === this.showCurrentOrFinished) ?
						"allGoalsPanel_topMenu_item allGoalsPanel_topMenu_item_active" :
						"allGoalsPanel_topMenu_item allGoalsPanel_topMenu_item_not-active";
	}

	setCSSOf__allGoalsPanel_topMenu_item (mode : string) {
		this.showCurrentOrFinished = mode;
	}

	/* ================  Updates progress bars when element in goals array moves ================ */

	updateProgress() {
		// console.log("updateProgress()");
		// console.log("ALLGOALS::timeWorkedOutToday_milliseconds ===", this.timeWorkedOutToday_milliseconds);
		let delta;
		if (this.timeWorkedOutToday_milliseconds_lastSave !== this.timeWorkedOutToday_milliseconds) {
			delta = this.timeWorkedOutToday_milliseconds - this.timeWorkedOutToday_milliseconds_lastSave;
			console.log("delta==", delta);
			console.log("this.timeWorkedOutToday_milliseconds_lastSave", this.timeWorkedOutToday_milliseconds_lastSave);
			console.log("this.timeWorkedOutToday_milliseconds", this.timeWorkedOutToday_milliseconds);
			this.timeWorkedOutToday_milliseconds_lastSave = this.timeWorkedOutToday_milliseconds;

		}
			
		for (let i=0; i<this.goals.length; i++) {
			if (this.isActive(i)) {
				let t = this.goals[i].goalPrice/this.hourlySalary;
				//goal.percentComplete += delta*(+goal.percentToSave)*6000/(1000*3600);
				
				let salary_ms = this.hourlySalary/(3600*1000); // dollars per 1 ms
				let dollarsComplete = salary_ms*this.timeWorkedOutToday_milliseconds*this.goals[i].percentToSave/100; // * KOEFF (don't forget to multiple  to % of_income_koeff)
				if (dollarsComplete >= this.goals[i].goalPrice) {
					this.finishedGoals.push(this.goals[i]);
					this.goals.splice(i,1);
					this.updateIndexes();
				}
				/*
				let dollarsComplete = sdollarsComplete_lastSave + salary_ms*(this.timeWorkedOutToday_milliseconds - this.timeWorkedOutToday_milliseconds_lastSave)*goal.percentToSave/100;
				*/
				this.goals[i].percentComplete = Math.round(dollarsComplete * 100/this.goals[i].goalPrice);
				/*
				console.log("===================");
				console.log("dollarsComplete==",dollarsComplete);
				console.log(`t== ${t} goal.goalPrice == ${this.goals[i].goalPrice}`);
				console.log("goal.percentToSave", this.goals[i].percentToSave);
				console.log("goal.percentComplete", this.goals[i].percentComplete);
				*/
			}
		}
		
	}

	/* ================  Updates indexes (priorities) in DB when element in goals array moves ================ */
	updateIndexes() {
		for (let i=0; i < this.goals.length; i++) {
			console.log("this.goals[i].priority", this.goals[i].priority);
			this.goals[i].priority = i;
			console.log("this.goals[i].priority::up", this.goals[i].priority);
		}
		this.updateAllGoalsIndexesInDB();
	}

	/* ================  Saves all goals to database ================ */
	updateAllGoalsIndexesInDB() {
		let goalsIndexes = [];
		for (let goal of this.goals) {
			goalsIndexes.push({
				_id : goal._id,
				priority : goal.priority
			});
		}
		console.log("priorities goalsIndexes[] ==" , goalsIndexes);
		this.goalsService.updateAllGoalsIndexesInDB(goalsIndexes)
			.subscribe(
				result => {
					console.log("updateAllGoalsIndexesInDB::result == ", result);
				},
				error => console.error(error)
			);		
	}

	ngOnInit() {
		this.goalsService.loadAllGoals()
		.subscribe(
    		goals => this.goals = goals.sort((a, b) => {
    			return (a.priority <= b.priority) ? -1 : 1;
    		}),
    		error => console.error(error),
    		() => console.warn("this.goals === ",this.goals)
    );
	}

	showAllGoals_onclick() {
		this.showAllGoals = !this.showAllGoals;
		this.showAllGoals_event.emit(this.showAllGoals);
	}

	getButtonMoreLessGoalsText() {
		return (this.showAllGoals) ? "Back to main page >>" : "Show more goals >>"
	}
	

	/* ========================= Saves object to DB, gets _id and adds new object to goals array ========================= */
	saveGoalToDBAndAddItToGoalsArray(goalObjectToSaveToDB : IGoal) {
		this.goalsService.saveGoalToDB(goalObjectToSaveToDB)
			.subscribe(
				result => {
					let _id = result;
					var goalObjectToSaveToArray = Object.assign({ _id } , goalObjectToSaveToDB)
					console.warn("goalObjectToSaveToArray", goalObjectToSaveToArray);

					this.goals.push(goalObjectToSaveToArray);					
				},
				error => console.error(error)
			);
	}

	/* ========================= Saves changes to existing object in DB ========================= */
	saveGoalChangesToDB(goalObjectToSaveToDB : IGoal) {
			console.warn("--\r\n\r\n\r\ngoalObjectToSaveToDB",goalObjectToSaveToDB);
		this.goalsService.saveGoalChangesToDB(goalObjectToSaveToDB)
			.subscribe(
				result => {
					console.log("RESULT OF PUT: ", result);
					console.warn("goalObjectToSaveToDB",goalObjectToSaveToDB);
				},
				error => console.warn(error)
			);
	}

	ngOnChanges() {
		//console.log("from AllGoalsPanelComponent  ngOnChanges | this.goalObject == ", this.goalObject);		
		if (this.goalObject) {
			
			var goalObjectToSaveToDB = Object.assign({
				percentComplete : 0
			}, this.goalObject);
			if (goalObjectToSaveToDB.goalImageFile === undefined) delete goalObjectToSaveToDB.goalImageFile;

			this.saveGoalToDBAndAddItToGoalsArray(goalObjectToSaveToDB);

			this.goalObject = undefined;
		}

		if (this.updateProgressBar_counter !== this.updateProgressBar_counter_prev) {
			this.updateProgressBar_counter_prev = this.updateProgressBar_counter;
			this.updateProgress();
		}
	
	}

/* ========================= Saves changes to existing object ========================= */
	saveChanges(goalObj : any) {
		console.log("Saving existing object!", goalObj);
		console.log('ID!!!', goalObj._id);
		let foundAtIndex : number;
 		for (let i = 0; i < this.goals.length; i++) {
 			if (this.goals[i]._id == goalObj._id) foundAtIndex = i;
 		}
 		// We don't edit percentComplete property and don't store it in goalObj, so we just save it and restore
 		let tmp_percentComplete = this.goals[foundAtIndex].percentComplete;
 		this.goals[foundAtIndex] = goalObj; 
 		console.warn("goalObj===",goalObj);
 		this.saveGoalChangesToDB(goalObj);
 		this.goals[foundAtIndex].percentComplete = tmp_percentComplete;
 		console.log("found at ", foundAtIndex);
		this.goalObject = undefined; 		
	}
/* ========================= Returns image of goal or template image (is there is no specific image for goal) ========================= */
	getGoalImage(goalObj : any) {
		return (goalObj.goalImageFile) ? goalObj.goalImageFile : 'assets/img/goal_template_image.png';
	}

/* ========================= Returns if element os active or not (depends on sum of percentage of elements with highest priority) ========================= */
	isActive(i : number) : string {
		let sum=0;
		for (let counter = 0; counter <= i; counter++) sum += +this.goals[counter].percentToSave;
		return (sum <= 100) ? 'Active' : 'Waiting for other goals completion '+sum;
	}

/* ========================= Returns CSS class for element block ========================= */
	isActive_CSSClass(i : number) : string {
		return (this.isActive(i) == 'Active') ? 'allGoalsPanel__goalElement_active' : 'allGoalsPanel__goalElement_waiting';
	}

/* ========================= Returns percents of active using income ========================= */
	usageOfIncomeInPercents() : number {
		let sum=0;
		for (let counter = 0; counter < this.goals.length; counter++) {
			if ((sum + +this.goals[counter].percentToSave) <= 100) sum += +this.goals[counter].percentToSave;
		}
		return sum;
	}

/* ========================= Returns percents of active using income ========================= */
	editExistingGoal(goalObject : any) {
		console.log("\r\n\r\n\r\n\r\n\r\n\r\n");
		console.log("=========================");
		console.log(goalObject);
		console.log("\r\n\r\n\r\n\r\n\r\n\r\n");
		console.log("=========================");
		let dialogRef = this.dialog.open(NewGoalModalComponent);
		dialogRef.componentInstance.loadGoalObject(goalObject);
	    dialogRef.afterClosed().subscribe(result => {
	      console.log('========= res:', result);
	      if (result) this.saveChanges(result);
	    });		
	}


/* ========================= Deletes goal ========================= */
	deleteExistingGoal(goalNum : number) {
		console.log("\r\n\r\n\r\n\r\n\r\n\r\n");
		console.log("=====DELETE====================");
		console.log(this.goals[goalNum]);
		console.log("\r\n\r\n\r\n\r\n\r\n\r\n");
		console.log("=========================");
		let objectToDelete = this.goals[goalNum];
		this.goals.splice(goalNum,1);
		this.deleteGoalFromDB(objectToDelete);
	}

	deleteGoalFromDB(goalObjectToDeleteFromDB : IGoal) {

		this.goalsService.deleteGoalFromDB(goalObjectToDeleteFromDB)
			.subscribe(
				result => {
					console.log("RESULT OF DELETE: ", result);
					console.warn("goalObjectToSaveToDB",goalObjectToDeleteFromDB);
				},
				error => console.warn(error)
			);

	}
}