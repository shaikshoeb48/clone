import { SpaarksService } from "../../spaarks.service";
import { Component, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { AllpurposeserviceService } from "src/app/allpurposeservice.service";

@Component({
  selector: "app-language",
  templateUrl: "language.component.html",
  styleUrls: ["language.component.scss"],
})
export class Languagee {
  constructor(
    private spaarks: SpaarksService,
    private router: Router,
    private allPurposeService: AllpurposeserviceService
  ) {
    if (localStorage.getItem("lang")) {
      this.selectedLang = localStorage.getItem("lang");
      this.showNext = true;
    } else {
      this.spaarks.checkforLocation();
      // this.router.navigateByUrl('home/language');
    }

    this.isAuthed = this.spaarks.authData.isAuthenticated;
    if (this.symboldisplay == "") {
      this.showNext = false;
    }
  }

  selectedLang;
  symboldisplay = "";
  showNext = false;
  btnName = "Continue";

  langSelect(val) {
    this.showNext = true;
    this.symboldisplay = val;
    this.selectedLang = val;
    if (val == "en") {
      localStorage.setItem("lang", "en");
      this.btnName = "Continue";
    }
    if (val == "hi") {
      localStorage.setItem("lang", "hi");
      this.btnName = "आगे";
    }
    if (val == "te") {
      localStorage.setItem("lang", "te");
      this.btnName = "కొనసాగించు";
    }
  }
  isAuthed;
  onContinue() {
    this.spaarks.selectedLang = this.selectedLang;
    // this.router.navigateByUrl('home/preferences');

    if (!localStorage.getItem("weblocation")) {
      this.allPurposeService.triggerModal.next({
        type: "locationModal",
        step: "default",
        modal: true,
      });
    }
     else {
    
      if (this.isAuthed) {
        //this route called when ever user changing language after login
        this.spaarks.updateLanguage(this.selectedLang).subscribe((x)=>{
       
          console.log(x);
        })
      }
        this.router.navigateByUrl("/settings");
      }
      if (!this.isAuthed && localStorage.getItem("weblocation")) {
        
        this.router.navigateByUrl("/home/feed");
      }
    }
  }

