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

@NgModule({
  declarations: [
    AppComponent,
    MainPanelComponent,
    SettingsPanelComponent,
    NewGoalModalComponent,
    AllGoalsPanelComponent
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
