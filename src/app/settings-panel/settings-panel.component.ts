import { Component, Output, EventEmitter, OnInit } from '@angular/core';

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
  
  @Output() salaryUpdated : EventEmitter<number> = new EventEmitter<number>();

  ngOnInit() {
  	this.hourlySalary = 30;
  	this.salaryUpdated.emit(this.hourlySalary);
  }

  validateHourlySalary() {
	this.salaryValidationIsCorrect = /^\d{1,4}$/.test(this.hourlySalary+'');
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

}