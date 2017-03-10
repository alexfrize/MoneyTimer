import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { DragulaService } from '../../../node_modules/ng2-dragula';

import { MdDialog, MdDialogRef } from '@angular/material';
import { NewGoalModalComponent } from 'app/new-goal-modal/new-goal-modal.component';

@Component({
  selector: 'all-goals-panel',
  templateUrl: 'all-goals-panel.html',
  styleUrls: ['all-goals-panel.css']

})

export class AllGoalsPanelComponent {
	@Input() goalObject : any;

	private goals = [
		{ 
		  "_id" : "some_id1212",
		  "goalTitle" : "My first goal",
		  "goalDescription" : "Lorem ipsum dolor sit amet. Ratione nesciunt vero, quaerat debitis nam asperiores pariatur eum.",
		  "goalPrice": "60",
		  "percentToSave" : "25",
		  "percentComplete" : "81"
		},			
		{ "_id" : "id_second_goal2094312",
		  "goalTitle" : "Second goal",
		  "goalDescription" : "Molestiae ipsum non voluptatibus nulla fugiat sapiente similique! Alias sunt nobis nostrum aut, ratione nesciunt vero, quaerat debitis nam asperiores pariatur eum.",
		  "goalPrice": "25",
		  "percentToSave" : "35",
		  "percentComplete" : "33"
		},
		{ "_id" : "s3434ANOTHER",
		  "goalTitle" : "And another goal",
		  "goalDescription" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
		  "goalPrice": "118",
		  "percentToSave" : "20",
		  "percentComplete" : "48"
		},		
	];
	constructor (public dialog: MdDialog, private dragulaService : DragulaService) {
		dragulaService.drop.subscribe((value) => {
      		console.log(this.goals);
		});
		console.log("from AllGoalsPanelComponent constructor | this.goalObject == ", this.goalObject);
	}

	ngOnChanges() {
		console.log("from AllGoalsPanelComponent  ngOnChanges | this.goalObject == ", this.goalObject);		
		if (this.goalObject) {
			/* === !IMPORTANT: SETTING TEMPORARY _id. REMOVE IT LATER === */
			this.goalObject._id = '_tmp_id_' + Math.round(Math.random()*1000000); // REMOVE IT LATER
			/* Sets 0% of complete to a new goal */
			this.goalObject.percentComplete = 0;
			this.goals.push(this.goalObject);
			/* === !IMPORTANT: SAVE NEW GOAL, GET AN _id FOR IT === */
			console.log('Adding new goal object!', this.goalObject._id);
			console.log('=== !IMPORTANT: SAVE NEW GOAL, GET AN _id FOR IT ===');
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