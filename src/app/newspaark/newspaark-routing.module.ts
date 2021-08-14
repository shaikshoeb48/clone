import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateLayoutComponent } from './createlayout/create-layout.component';
import { CreateFirstStepComponent } from './create-first-step/create-first-step.component';
import { CreateSecondStepComponent } from './create-second-step/create-second-step.component';
import { CreateSecondGuardService } from '../createsecond-guard.service';

const routes:Routes =[
 
      {
        path: '',
        component: CreateLayoutComponent,
        children: [
          { path: "", pathMatch: "full", component: CreateFirstStepComponent },
          {
            path: "create/:id",
            component: CreateSecondStepComponent,
           canActivate: [CreateSecondGuardService],
          },
        ],
      },
   
  
    // {
    //     path: "create",
    //     component: CreateLayoutComponent,children:[
    //         { path: "", pathMatch: "full", component: CreateFirstStepComponent },
    //       {
    //         path: "create/:id",
    //         component: CreateSecondStepComponent,
    //         canActivate: [CreateSecondGuardService],
    //       },
    //       { path: "**", redirectTo: "create/create" },
    //     ]      
    //   }     
]

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class NewSpaarkRouting{}
