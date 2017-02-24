import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'new-goal-modal',
  templateUrl: 'new-goal-modal.html',
  styleUrls: ['new-goal-modal.css']
})

export class NewGoalModalComponent {
	private filesToUpload : Array<File> = [];

	constructor(public dialogRef: MdDialogRef<NewGoalModalComponent>) {

	}

/* ========================= Analyze the file information before upload ========================= */		
  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>> fileInput.target.files;
    console.log(this.filesToUpload[0]);
  }
}