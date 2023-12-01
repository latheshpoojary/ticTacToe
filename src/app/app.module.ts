import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MultigameComponent } from './multigame/multigame.component';
import { HomeComponent } from './home/home.component';
import { InputComponent } from './input/input.component';
import {HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { PlayGameComponent } from './play-game/play-game.component';
import {MatButtonModule} from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogElementsExampleDialogComponent } from './dialog-elements-example-dialog/dialog-elements-example-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxLoadingModule } from "ngx-loading";

@NgModule({
  declarations: [
    AppComponent,
    MultigameComponent,
    HomeComponent,
    InputComponent,
    PlayGameComponent,
    DialogElementsExampleDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    NgxLoadingModule.forRoot({})
   
  
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
