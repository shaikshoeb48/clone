import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExploreMapComponent } from './explore-map/explore-map.component';

const routes:Routes = [
    // {path:'explore', component:ExploreMapComponent },
    {path:'',pathMatch:'full',component:ExploreMapComponent},
    {path:'**',redirectTo:'/explore'}
]

@NgModule({
imports:[RouterModule.forChild(routes)],
exports:[RouterModule]
})

export class ExploreRouting{

}