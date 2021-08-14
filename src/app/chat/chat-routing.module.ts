import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatContainerComponent } from './chat-container/chat-container.component';


const routes:Routes = [{
    path:'',pathMatch:'full',component:ChatContainerComponent
},
{path:'**',redirectTo:'chat'}
]

@NgModule({
imports:[RouterModule.forChild(routes)],
exports:[RouterModule]
})

export class ChatRouting{}