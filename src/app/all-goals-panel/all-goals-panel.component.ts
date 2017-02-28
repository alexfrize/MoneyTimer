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
		  "percentToSave" : "100",
		  "percentComplete" : "81",
		},			
		{ "goalTitle" : "Second goal",
		  "goalDescription" : "Molestiae ipsum non voluptatibus nulla fugiat sapiente similique! Alias sunt nobis nostrum aut, ratione nesciunt vero, quaerat debitis nam asperiores pariatur eum.",
		  "goalPrice": "25",
		  "percentToSave" : "100",
		  "percentComplete" : "33",
		},
		{ "goalTitle" : "And another goal",
		  "goalDescription" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
		  "goalPrice": "118",
		  "percentToSave" : "100",
		  "percentComplete" : "48",
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

	getGoalImage(goalObj : any) {
		return (goalObj.goalImageFile) ? goalObj.goalImageFile : 'assets/img/goal_template_image.png';
	}

}