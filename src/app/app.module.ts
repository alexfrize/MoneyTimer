import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MainPanelComponent } from 'app/main-panel/main-panel.component';
import { SettingsPanelComponent } from 'app/settings-panel/settings-panel.component';
import { NewGoalModalComponent } from 'app/new-goal-modal/new-goal-modal.component';
import { AllGoalsPanelComponent } from 'app/all-goals-panel/all-goals-panel.component'
import { DragulaService, DragulaModule } from '../../node_modules/ng2-dragula';
import { AppComponent } from './app.component';
import { MaterialModule } from '@angular/material';
import { ImageCropperComponent } from 'ng2-img-cropper';
import { ImgCropModalComponent } from 'app/new-goal-modal/img-crop-modal/img-crop-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPanelComponent,
    SettingsPanelComponent,
    NewGoalModalComponent,
    AllGoalsPanelComponent,
    ImageCropperComponent,
    ImgCropModalComponent
  ],
  entryComponents: [NewGoalModalComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DragulaModule,
    MaterialModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
