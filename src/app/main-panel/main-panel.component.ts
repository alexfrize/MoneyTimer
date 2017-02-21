import { Component } from '@angular/core';
@Component ({
  selector: 'main-panel',
  templateUrl: 'main-panel.html',
  styleUrls: ['main-panel.css']
})
export class MainPanelComponent {
  private timeWorkedOutToday : string = '00:34:27'; // change string -> number
  private income : number = 342.73;
  private totalEarnings : number = 1205.95;
}