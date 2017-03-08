import { Component, Input, OnChanges } from '@angular/core';
import { DragulaService } from '../../../node_modules/ng2-dragula';

@Component({
  selector: 'all-goals-panel',
  templateUrl: 'all-goals-panel.html',
  styleUrls: ['all-goals-panel.css']

})

export class AllGoalsPanelComponent {
	@Input() goalObject : any;
	private goals = [
		{ "goalTitle" : "My first goal",
		  "goalDescription" : "Lorem ipsum dolor sit amet. Ratione nesciunt vero, quaerat debitis nam asperiores pariatur eum.",
		  "goalPrice": "60",
		  "percentToSave" : "25",
		  "percentComplete" : "81"
		},			
		{ "goalTitle" : "Second goal",
		  "goalDescription" : "Molestiae ipsum non voluptatibus nulla fugiat sapiente similique! Alias sunt nobis nostrum aut, ratione nesciunt vero, quaerat debitis nam asperiores pariatur eum.",
		  "goalPrice": "25",
		  "percentToSave" : "35",
		  "percentComplete" : "33"
		},
		{ "goalTitle" : "And another goal",
		  "goalDescription" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
		  "goalPrice": "118",
		  "percentToSave" : "20",
		  "percentComplete" : "48"
		},		
	];
	constructor (private dragulaService : DragulaService) {
		dragulaService.drop.subscribe((value) => {
      		console.log(this.goals);
		});
		console.log("from AllGoalsPanelComponent constructor | this.goalObject == ", this.goalObject);
	}

	ngOnChanges() {
		if (this.goalObject) {
			this.goals.push(this.goalObject)
			this.goalObject = undefined;
		}
		console.log("from AllGoalsPanelComponent  ngOnChanges | this.goalObject == ", this.goalObject);
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
	}
}