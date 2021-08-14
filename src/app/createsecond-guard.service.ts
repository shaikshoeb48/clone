import { CanActivate, Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { SpaarksService } from './spaarks.service';



@Injectable({providedIn:'root'})
export class CreateSecondGuardService implements CanActivate {
    constructor(private router:Router, private spaarksService:SpaarksService, private route:ActivatedRoute){}

    canActivate(){
        if(this.spaarksService.selectedCreate.featureSelected==''||this.spaarksService.selectedCreate.selectedQuestion==''){
            this.router.navigateByUrl('/newspaark');
            return false;
        }
            return true;
        
    }


}