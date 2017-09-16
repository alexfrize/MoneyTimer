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
	private hourlySalary_lastSave : number;
	@Input() updateProgressBar_counter : number;
	@Output() showAllGoals_event : EventEmitter<boolean> = new EventEmitter<boolean>();
	private updateProgressBar_counter_prev : number;
	private timeWorkedOutToday_milliseconds_lastSave : number = 0;
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

	/* ================  Check if hourly salsry has changed. If so, saves current state to DB ================ */
	checkIfhourlySalaryChanged() {
		if (this.hourlySalary !== this.hourlySalary_lastSave) {
			this.hourlySalary_lastSave = this.hourlySalary;
			this.updateIndexes();
		}
	}

	/* ================  Updates progress bars when element in goals array moves ================ */
	updateProgress() {
		// console.log("updateProgress()");
		// console.log("ALLGOALS::timeWorkedOutToday_milliseconds ===", this.timeWorkedOutToday_milliseconds);

		for (let i=0; i<this.goals.length; i++) {
			if (!this.goals[i].dollarsComplete_lastSave) {
				this.goals[i].dollarsComplete_lastSave = this.goals[i].dollarsComplete;
			}

			this.checkIfhourlySalaryChanged();
			if (this.isActive(i) === "Active") {
				let salary_ms = this.hourlySalary/(3600*1000); // dollars per 1 ms
				if (this.goals[i].dollarsComplete_lastSave == undefined) this.goals[i].dollarsComplete_lastSave = 0;
 				this.goals[i].dollarsComplete = salary_ms*(this.timeWorkedOutToday_milliseconds - this.timeWorkedOutToday_milliseconds_lastSave) * this.goals[i].percentToSave/100 + this.goals[i].dollarsComplete_lastSave;  // * KOEFF == this.goals[i].percentToSave
				this.goals[i].percentComplete = Math.round(this.goals[i].dollarsComplete * 100/this.goals[i].goalPrice);
				if (this.goals[i].dollarsComplete >= this.goals[i].goalPrice) {
					this.finishedGoals.push(this.goals[i]);
					this.goals.splice(i,1);
					this.updateIndexes();
				}
			}
			else { // update persantage for non-active items
				this.goals[i].percentComplete = Math.round(this.goals[i].dollarsComplete * 100/this.goals[i].goalPrice);
			}
		}
		
	}

	/* ================  Updates indexes (priorities) in DB when element in goals array moves ================ */
	updateIndexes() {

		console.log("updateIndexes()");
		this.timeWorkedOutToday_milliseconds_lastSave = this.timeWorkedOutToday_milliseconds;
		console.log("this.timeWorkedOutToday_milliseconds_lastSave",this.timeWorkedOutToday_milliseconds_lastSave);
		for (let i=0; i < this.goals.length; i++) {
			// console.log("this.goals[i].priority", this.goals[i].priority);
			this.goals[i].priority = i;
			this.goals[i].dollarsComplete_lastSave = this.goals[i].dollarsComplete;
			console.log("this.goals[i].dollarsComplete_lastSave == ", this.goals[i].dollarsComplete_lastSave);
			// console.log("this.goals[i].dollarsComplete==",this.goals[i].dollarsComplete);
			// console.log("this.goals[i].priority::up", this.goals[i].priority);
		}
		this.updateAllGoalsIndexesAndDollarsCompleteInDB();
	}

	/* ================  Saves all goals to database ================ */
	updateAllGoalsIndexesAndDollarsCompleteInDB() {
		let goalsIndexesAndDollarsComplete = [];


		for (let goal of this.goals) {
			goalsIndexesAndDollarsComplete.push({
				_id : goal._id,
				priority : goal.priority,
				dollarsComplete : goal.dollarsComplete
			});
		}
		console.log("priorities goalsIndexesAndDollarsComplete[] ==" , goalsIndexesAndDollarsComplete);
		this.goalsService.updateAllGoalsIndexesAndDollarsCompleteInDB(goalsIndexesAndDollarsComplete)
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
 		// We don't edit dollarsComplete property and don't store it in goalObj, so we just save it and restore

 		let tmp_dollarsComplete = this.goals[foundAtIndex].dollarsComplete;
 		this.goals[foundAtIndex].dollarsComplete_lastSave = this.goals[foundAtIndex].dollarsComplete;
 		this.goals[foundAtIndex] = goalObj; 
 		console.warn("goalObj===",goalObj);
 		this.saveGoalChangesToDB(goalObj);
 		// this.goals[foundAtIndex].percentComplete = tmp_percentComplete;
 		this.goals[foundAtIndex].dollarsComplete = tmp_dollarsComplete;
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
		
		this.updateIndexes(); // Saves current state to DB

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