import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private newHourlySalary : number;
  private newGoalObject: any = undefined;
  private editExistingGoalObject: any = undefined;
  private showAllGoals = false;
/* ========================= When hourlySalary is updated ========================= */
  onSalaryUpdated(newHourlySalary : number) {
  	this.newHourlySalary = newHourlySalary;
    console.log("newHourlySalary : ", newHourlySalary);
  }

/* ========================= When new goal is added ========================= */  
  onNewGoalAdded(newGoalObject : any) {
  	this.newGoalObject = newGoalObject;
  	console.log("==event== newGoalObject : any", newGoalObject);
  }

  onEditGoalEvent(editExistingGoalObject : any) {
    this.editExistingGoalObject = editExistingGoalObject;
    console.log("==event== EDIT GOAL: any", editExistingGoalObject);
  }

  onShowAllGoals_event(showGoalsEventObject : any) {
    this.showAllGoals = !this.showAllGoals;
  }

  getLeftColumnCSSClass() {
    return (!this.showAllGoals) ? "col-md-6" : "display-none";
  }

  getRightColumnCSSClass() {
    return (!this.showAllGoals) ? "col-md-6" : "col-md-12";
  }  
}


