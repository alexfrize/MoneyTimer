import { Component, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { ImgCropModalComponent } from 'app/new-goal-modal/img-crop-modal/img-crop-modal.component';

@Component({
  selector: 'new-goal-modal',
  templateUrl: 'new-goal-modal.html',
  styleUrls: ['new-goal-modal.css']
})


export class NewGoalModalComponent {
  private newGoalObject : any;
  private goalImageFile : File = undefined;
  private fileToLoad : File = undefined;
	constructor(private dialogRef: MdDialogRef<NewGoalModalComponent>, public cropmodal: MdDialog) {

	}

/* ========================= Analyze the file information before upload ========================= */		
  fileChangeEvent($event){
    console.log("fileChangeEvent($event)");
    this.fileToLoad = <File> $event.target.files[0];
    console.log(this.fileToLoad);
    if (this.fileToLoad) {
      let resizeModal = this.cropmodal.open(ImgCropModalComponent);
      resizeModal.componentInstance.fileToLoad = this.fileToLoad;
      resizeModal.afterClosed().subscribe(result => {
        this.goalImageFile = result;
      });
    }
    
  }

/* ========================= Event handler on form submit ========================= */    
  onSubmitNewGoalForm(formValue:any) {
    this.newGoalObject = Object.assign({}, formValue);
    this.newGoalObject.goalImageFile = this.goalImageFile;
    console.log(this.newGoalObject);    
    this.dialogRef.close(this.newGoalObject);
  }  

/* ========================= Returns filename of image preview ========================= */    
  getPreviewFilename() {
    return (this.goalImageFile) ? this.goalImageFile : 'assets/img/goal_template_image.png';
  }
}


