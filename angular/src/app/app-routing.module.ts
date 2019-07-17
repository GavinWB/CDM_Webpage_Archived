import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { NotauthGuard } from './guards/notauth.guard';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ExamComponent } from './components/exam/exam.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [NotauthGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [NotauthGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'exam', component: ExamComponent, canActivate: [AuthGuard]},
  {path: "**", redirectTo: "login"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
