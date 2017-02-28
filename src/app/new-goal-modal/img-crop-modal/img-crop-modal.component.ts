import { Component, ViewChild, OnInit } from '@angular/core';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
	selector: "img-crop-modal",
	templateUrl: "img-crop-modal.html",
	styleUrls: ["img-crop-modal.css"]
})

export class ImgCropModalComponent {
  data:any;
  
  name:string;
  data1:any;
  cropperSettings1:CropperSettings;
  croppedWidth:number;
  croppedHeight:number;
  fileToLoad: File;
  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;	

  constructor(public cropmodal: MdDialogRef<ImgCropModalComponent>) {
  	  this.cropperSettings1 = new CropperSettings();
      this.cropperSettings1.noFileInput = true;
      this.cropperSettings1.width = 200;
      this.cropperSettings1.height = 200;

      this.cropperSettings1.croppedWidth = 200;
      this.cropperSettings1.croppedHeight = 200;

      this.cropperSettings1.canvasWidth = 600;
      this.cropperSettings1.canvasHeight = 400;

      this.cropperSettings1.minWidth = 10;
      this.cropperSettings1.minHeight = 10;

      this.cropperSettings1.rounded = false;
      this.cropperSettings1.keepAspect = true;

      this.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
      this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;

      this.data1 = {image : "assets/img/goal_template_image.png"};
	  
  }

  ngOnInit() {
    this.loadImage();
  }

  cropped(bounds:Bounds) {
    this.croppedHeight = bounds.bottom-bounds.top;
    this.croppedWidth = bounds.right-bounds.left;
  }

  loadImage(){
    var image : any = new Image();
    var file : File = this.fileToLoad;
    var myReader : FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
        image.src = loadEvent.target.result;
        that.cropper.setImage(image);
     };
    myReader.readAsDataURL(file);
  }
}