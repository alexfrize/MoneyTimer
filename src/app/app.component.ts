import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private newHourlySalary : number;
/* ========================= When hourlySalary is updated ========================= */
  onSalaryUpdated(newHourlySalary : number) {
  	this.newHourlySalary = newHourlySalary;
    console.log("newHourlySalary : ", newHourlySalary);
  }
}
