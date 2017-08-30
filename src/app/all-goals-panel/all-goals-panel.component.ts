import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { DragulaService } from '../../../node_modules/ng2-dragula';

import { GoalsService } from '../connect-to-server/goals.service';

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

	private goals = [];

	constructor (public dialog: MdDialog, private dragulaService : DragulaService, private goalsService : GoalsService) {
		dragulaService.drop.subscribe((value) => {
      		console.log(this.goals);
		});
		console.log("from AllGoalsPanelComponent constructor | this.goalObject == ", this.goalObject);
	}

	ngOnInit() {
		
		this.goalsService.loadAllGoals()
		.subscribe(
    		goals => this.goals = goals,
    		error => console.error(error),
    		() => console.warn("this.goals === ",this.goals)
    );

	}

	ngOnChanges() {
		console.log("from AllGoalsPanelComponent  ngOnChanges | this.goalObject == ", this.goalObject);		
		if (this.goalObject) {
			
			var goalObjectToSave = Object.assign({
				_id : '_tmp_id_' + Math.round(Math.random()*1000000), /* === !IMPORTANT: SETTING TEMPORARY _id. REMOVE IT LATER === */
				percentComplete : 0
			}, this.goalObject);
			if (goalObjectToSave.goalImageFile === undefined) delete goalObjectToSave.goalImageFile;
			this.goals.push(goalObjectToSave);
			/* === !IMPORTANT: SAVE NEW GOAL, GET AN _id FOR IT === */
			console.log('Adding new goal object!', this.goalObject._id);
			console.log('=== !IMPORTANT: SAVE NEW GOAL, GET AN _id FOR IT ===');
			console.log("\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\ngoalObjectToSave ==", goalObjectToSave);
			this.goalObject = undefined;
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
		console.log(goalObject);
		let dialogRef = this.dialog.open(NewGoalModalComponent);
		dialogRef.componentInstance.loadGoalObject(goalObject);
	    dialogRef.afterClosed().subscribe(result => {
	      console.log('========= res:', result);
	      if (result) this.saveChanges(result);
	    });		
	}
}