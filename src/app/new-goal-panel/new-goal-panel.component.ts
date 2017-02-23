import { Component } from '@angular/core';

@Component({
  selector: 'new-goal-panel',
  templateUrl: 'new-goal-panel.html',
  styleUrls: ['new-goal-panel.css']
})

export class NewGoalPanelComponent {
	private filesToUpload : Array<File> = [];

/* ========================= Analyze the file information before upload ========================= */		
  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>> fileInput.target.files;
    console.log(this.filesToUpload[0]);
  }
}