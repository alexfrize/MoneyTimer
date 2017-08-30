import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { NewGoalModalComponent } from 'app/new-goal-modal/new-goal-modal.component';

@Component({
	selector: 'settings-panel',
	templateUrl: 'settings-panel.html',
	styleUrls: ['settings-panel.css']
})

export class SettingsPanelComponent implements OnInit {
  private editMode = false;
  private hourlySalary : number;// = 25; //30$ per hour
  private editSalaryButton_title = 'Edit';
  private salaryValidationIsCorrect : boolean = true;
  private newGoalObject: any; // for dialog modal

  @Input() editExistingGoalObject : any;
  @Output() salaryUpdated : EventEmitter<number> = new EventEmitter<number>();
  @Output() newGoalAdded : EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    this.hourlySalary = 40;
    this.salaryUpdated.emit(this.hourlySalary);  
  }

  validateHourlySalary() {
	this.salaryValidationIsCorrect = /^\d{1,4}$/.test(this.hourlySalary+'');
  }

/* ========================= Init modal dialog window ========================= */	
  constructor(public dialog: MdDialog) {

  }
  
/* ========================= Changes the button title and checks if hourlySalary value is valid ========================= */	
  editSalaryToggle() {
	this.validateHourlySalary(); // validate again to avoid any errors
	if (this.salaryValidationIsCorrect) {
		this.editMode = !this.editMode;
		if (this.editMode) this.editSalaryButton_title = 'Save';
		else {
			console.log("hourlySalary is OK");
			this.salaryUpdated.emit(this.hourlySalary);
			this.editSalaryButton_title = 'Edit';
		}

	}
	else console.log('Invalid value: hourlySalary');
  }

/* ========================= Opens new goal modal window ========================= */	  
  openNewGoalModal() {
  	console.log("openNewGoalModal()");
  	let dialogRef = this.dialog.open(NewGoalModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.newGoalObject = result;
      if (this.newGoalObject) this.newGoalAdded.emit(this.newGoalObject);
    });
  }
}