import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SpaarksService } from "../../spaarks.service";
import { AllpurposeserviceService } from 'src/app/allpurposeservice.service';

@Component({
  selector: "app-create-layout",
  templateUrl: "./create-layout.component.html",
  styleUrls: ["./create-layout.component.scss"],
})
export class CreateLayoutComponent implements OnInit {
  constructor(private router: Router, private spaark: SpaarksService,private allpurpose:AllpurposeserviceService) {
    this.isMobileVersion = this.spaark.isMobileVersion;
  }
  
  isMobileVersion;
  isNewSpaarkSection = false;

  ngOnInit(): void {
    // if(localStorage.getItem('askname'))
    // { 
    //   var noName=localStorage.getItem('askname');
    //   if(noName!='true')
    //   {
    //     this.allpurpose.triggerModal.next({
    //       type: "openName",
    //       modal: true,
         
    //     });

    //   }

    // }

    // if(this.allpurpose.isOpenNameModal){
    //   this.allpurpose.triggerModal.next({
    //     type: "openName",
    //     modal: true,
       
    //   });
    // }

    if (this.router.url.includes("/create") && window.innerWidth < 951) {
      console.log("loook");
      this.isNewSpaarkSection = true;
    }
  }

  checkTabIndex(event) {
    // console.log(event);
    this.spaark.currentFeatureSubj.next(event);
    this.spaark.featName = event;
    this.router.navigateByUrl("home/feed");
  }
}
