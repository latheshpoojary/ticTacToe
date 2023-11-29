import { Input, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MultigameComponent } from './multigame/multigame.component';
import { HomeComponent } from './home/home.component';
import { InputComponent } from './input/input.component';
import { PlayGameComponent } from './play-game/play-game.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component:HomeComponent
  },
  {
    path: 'multi',
    component:MultigameComponent
  },
  {
    path: 'input/:id/:userID',
    component:InputComponent
  },
  {
    path: 'game-set/:room-id/:userID',
    component:PlayGameComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
