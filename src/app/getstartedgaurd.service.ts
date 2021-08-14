import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { SpaarksService } from "./spaarks.service";

@Injectable({
  providedIn: "root",
})
export class GetstartedgaurdService implements CanActivate {
  constructor(private spaarksService: SpaarksService, private router: Router) {
    // alert("in gaurd");
  }

  canActivate() {
    if (localStorage.getItem("alreadyvisited")) {
      if (localStorage.getItem("lang")) {
        if (localStorage.getItem("weblocation")) {
          this.router.navigateByUrl("home/feed");
        } 
        // else {
        //   this.router.navigateByUrl("/home/preferences");
        // }
      } else {
        console.log("i came")
        this.router.navigateByUrl("/home/language");
      }
      return false;
    } else {
      return true;
    }
  }
}
