import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddLeaveComponent } from './add-leave/add-leave.component';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { CreatePasswordComponent } from './create-password/create-password.component';

import { CreateUserComponent } from './create-user/create-user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from './employee/employee.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {path:'login',component:LoginComponent},
  {
    path:'create-user',
    component:CreateUserComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'create-password/:id',
    component:CreatePasswordComponent
  },
  {
    path:'dashboard',
    component:DashboardComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'employee',
    component:EmployeeComponent,
    canActivate:[AuthGuard]

  },
  {
    path:'**',
    component:PageNotFoundComponent
  },
  {
    path:'addleave',
    component:AddLeaveComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
