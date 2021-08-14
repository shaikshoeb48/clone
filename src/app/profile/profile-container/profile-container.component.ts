import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SpaarksService } from "../../spaarks.service";

@Component({
  selector: "app-profile-container",
  templateUrl: "./profile-container.component.html",
  styleUrls: ["./profile-container.component.scss"],
})
export class ProfileContainerComponent implements OnInit {
  constructor(
    private router: Router,
    private spaark: SpaarksService,
    private activatedRoute: ActivatedRoute
  ) {
    this.isMobileVersion = this.spaark.isMobileVersion;
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  diffUserId;
  isMobileVersion;
  userId;
  isProfileSection = false;
  profile = "normal";

  ngOnInit(): void {
    //this.diffUserId=this.activatedRoute.snapshot.paramMap.get('id');

    if (this.router.url.includes("profile") && window.innerWidth < 951) {
      this.isProfileSection = true;
    }
    this.activatedRoute.params.subscribe((succ) => {
      // console.log(succ.id);
      this.userId = succ.id;
      console.log(succ.id);
      console.log(this.userId);

      // if(!succ.id){
      //   this.userId =  this.diffUserId;
      // }
    });

    if (this.userId == undefined || this.userId == "" || this.userId == null) {
      this.userId = localStorage.getItem("id");
    }
  }

  changeProfile(event) {
    // console.log(event);
    if (event) {
      if (event.changeTo) {
        if (event.changeTo == "seller") {
          this.profile = "sellerprofile";
        } else if (event.changeTo == "normal") {
          this.profile = "normal";
        }
      }
    }
  }

  checkTabIndex(event) {
    // console.log(event);

    this.spaark.currentFeatureSubj.next(event);
    this.spaark.featName = event;
    this.router.navigateByUrl("home/feed");
  }
}
