import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SpaarksService } from "../../spaarks.service";
@Component({
  selector: "app-bottom-nav-bar",
  templateUrl: "./bottom-nav-bar.component.html",
  styleUrls: ["./bottom-nav-bar.component.scss"],
})
export class BottomNavBarComponent implements OnInit {
  constructor(
    private activeSnapshot: ActivatedRoute,
    private spaark: SpaarksService
  ) {
    this.isMobileVersion = this.spaark.isMobileVersion;
  }

  isMobileVersion;
  profilePic = "../../../assets/UserProfile.png";
  val;
  userId;

  ngOnInit(): void {
    if (localStorage.getItem("id")) {
      this.userId = localStorage.getItem("id");
    }

    try {
      this.val = document.URL;
      this.val = this.activeSnapshot.snapshot.url[0].path;
    } catch {}

    if (localStorage.getItem("propic")) {
      this.profilePic = localStorage.getItem("propic");
    } else {
      this.profilePic = "../../../assets/UserProfile.png";
    }

    // subscription used when changing profilepic
    this.spaark.proPicSubj.subscribe((succ: any) => {
      localStorage.setItem("propic", succ.profilePic);
      try {
        this.profilePic = localStorage.getItem("propic");
      } catch (error) {
        // this.spaark.detailsNotFound("profilePic(LeftNavComp)");
      }
    });
  }

  IconChange = [
    {
      homeD: "../../../assets/Tab Bar/Home.svg",
      homeA: "../../../assets/Tab Bar/Home _1.svg",
    },
    {
      chaticonD: "../../../assets/Tab Bar/ChatIcon.svg",
      chaticonA: "../../../assets/Tab Bar/ChatIcon_1.svg",
    },
    {
      plusCirlceD: "../../../assets/Tab Bar/plusCirlce.svg",
      plusCirleA: "../../../assets/Tab Bar/plusCirlce_1.svg",
    },
    {
      exploreD: "../../../assets/Tab Bar/newExplore.svg",
      exploreA: "../../../assets/Tab Bar/newExplore_1.svg",
    },
    {
      requestD: "../../../assets/friendg.svg",
      requestA: "../../../assets/friendb.svg",
    },
  ];
  homeD = this.IconChange[0].homeD;
  chaticonD = this.IconChange[1].chaticonD;
  plusCirlceD = this.IconChange[2].plusCirlceD;
  exploreD = this.IconChange[3].exploreD;
  // notificaitonD = this.IconChange[4].notificaitonD;
  requestD = this.IconChange[4].requestD;

  goToCategory(link) {
    this.val = link;
  }
}
