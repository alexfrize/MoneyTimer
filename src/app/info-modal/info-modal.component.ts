import { Component, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'info-modal',
  templateUrl: 'info-modal.html',
  styleUrls: ['info-modal.css']
})

export class InfoModalComponent {
  constructor(private dialogRef: MdDialogRef<InfoModalComponent>) {
  }
}




