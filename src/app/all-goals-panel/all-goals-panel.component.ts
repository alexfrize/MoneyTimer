import { Component } from '@angular/core';

@Component({
  selector: 'all-goals-panel',
  templateUrl: 'all-goals-panel.html',
  styleUrls: ['all-goals-panel.css']

})

export class AllGoalsPanelComponent {
	private goals = [
		{ "goalTitle" : "My first goal",
		  "goalDescription" : "Lorem ipsum dolor sit amet. Ratione nesciunt vero, quaerat debitis nam asperiores pariatur eum.",
		  "percentToSave" : "100",
		  "percentComplete" : "81",
		},			
		{ "goalTitle" : "Second goal",
		  "goalDescription" : "Molestiae ipsum non voluptatibus nulla fugiat sapiente similique! Alias sunt nobis nostrum aut, ratione nesciunt vero, quaerat debitis nam asperiores pariatur eum.",
		  "percentToSave" : "100",
		  "percentComplete" : "33",
		},
		{ "goalTitle" : "And another goal",
		  "goalDescription" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
		  "percentToSave" : "100",
		  "percentComplete" : "48",
		},		
	];
}