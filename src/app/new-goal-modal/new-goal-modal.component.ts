import { Component, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImgCropModalComponent } from 'app/new-goal-modal/img-crop-modal/img-crop-modal.component';

@Component({
  selector: 'new-goal-modal',
  templateUrl: 'new-goal-modal.html',
  styleUrls: ['new-goal-modal.css']
})

export class NewGoalModalComponent {
  private newGoalObject : any;
  private goalObject_id : string;
  private goalImageFile : File = undefined;
  private fileToLoad : File = undefined;
  private modalTitle : string = 'Add new goal';
  private newGoalForm = new FormGroup({
    goalTitle : new FormControl(null, Validators.required),
    goalDescription : new FormControl(null),
    goalPrice : new FormControl(null, [ Validators.required, Validators.pattern(/^(\d+|\d+\.\d*)$/) ]),
    percentToSave : new FormControl(null, Validators.pattern(/^(\d{1,2}|100|\d{1,2}\.\d{0,2})$/))
  });
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
  onSubmitGoalForm() {
    console.log(this.newGoalForm.value);
    this.newGoalObject = Object.assign({}, this.newGoalForm.value);
    this.newGoalObject.goalImageFile = this.goalImageFile;
    if (!this.newGoalObject.percentToSave) {
    	this.newGoalObject.percentToSave = "100";
    }
    if (this.goalObject_id) {
      this.newGoalObject._id = this.goalObject_id;
    }    
    this.dialogRef.close(this.newGoalObject);
  }  

/* ========================= Returns filename of image preview ========================= */    
  getPreviewFilename() {
    return (this.goalImageFile) ? this.goalImageFile : 'assets/img/goal_template_image.png';
  }

/* ========================= Sets values if we edit existing goal ========================= */    
  loadGoalObject(goalObject : any) {
    this.modalTitle = 'Edit goal';
    this.newGoalForm.setValue({
      goalTitle : goalObject.goalTitle,
      goalDescription : goalObject.goalDescription,
      goalPrice : goalObject.goalPrice,
      percentToSave : goalObject.percentToSave,
    });    

    this.goalImageFile = goalObject.goalImageFile;
    this.goalObject_id = goalObject._id;
    console.log("_id == ", this.goalObject_id);

  }

/* ========================= Returns text for submit form button ========================= */    
  getButtonTitle() {
    return (this.modalTitle == 'Add new goal') ? 'Add new goal' : 'Save changes';
  }
}


