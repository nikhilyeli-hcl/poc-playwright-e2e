import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Todo } from './components/todo/todo';

const routes: Routes = [{ path: '', component: Todo }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
