import { Component, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import { ImgCropModalComponent } from 'app/new-goal-modal/img-crop-modal/img-crop-modal.component';

@Component({
  selector: 'new-goal-modal',
  templateUrl: 'new-goal-modal.html',
  styleUrls: ['new-goal-modal.css']
})


export class NewGoalModalComponent {

  data:any;
  
  name:string;
  data1:any;
  cropperSettings1:CropperSettings;
  croppedWidth:number;
  croppedHeight:number;
  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

	private filesToUpload : Array<File> = [];
  private goalImageFile : File;
	constructor(public dialogRef: MdDialogRef<NewGoalModalComponent>) {

      this.cropperSettings1 = new CropperSettings();
      this.cropperSettings1.noFileInput = true;
      this.cropperSettings1.width = 200;
      this.cropperSettings1.height = 200;

      this.cropperSettings1.croppedWidth = 200;
      this.cropperSettings1.croppedHeight = 200;

      this.cropperSettings1.canvasWidth = 200;
      this.cropperSettings1.canvasHeight = 150;

      this.cropperSettings1.minWidth = 10;
      this.cropperSettings1.minHeight = 10;

      this.cropperSettings1.rounded = false;
      this.cropperSettings1.keepAspect = true;

      this.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
      this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;

      this.data1 = {image : "assets/img/goal_template_image.png"};
	}

cropped(bounds:Bounds) {
  console.log("crop() event");
    this.croppedHeight = bounds.bottom-bounds.top;
    this.croppedWidth = bounds.right-bounds.left;
  }


/* ========================= Analyze the file information before upload ========================= */		
  fileChangeEvent($event){
    // this.filesToUpload = <Array<File>> fileInput.target.files;
    // console.log(this.filesToUpload[0]);
    // this.goalImageFile = this.filesToUpload[0];

    var image : any = new Image();
    var file : File = $event.target.files[0];
    var myReader : FileReader = new FileReader();
    var that = this;
    console.log(file);
    myReader.onloadend = function (loadEvent:any) {
        image.src = loadEvent.target.result;
        console.log("image ==" , image);
        that.cropper.setImage(image);
     };
    
    myReader.readAsDataURL(file);
    
  }

/* ========================= Event handler on form submit ========================= */    
  onSubmitNewGoalForm(formValue:any) {
    console.log(formValue);
    console.log(this.goalImageFile);
//    this.dialogRef.close('add');

  }  

}


