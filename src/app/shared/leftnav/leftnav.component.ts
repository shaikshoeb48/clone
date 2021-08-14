import { SpaarksService } from "../../spaarks.service";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  Router,
  ActivatedRouteSnapshot,
  ActivatedRoute,
} from "@angular/router";

@Component({
  selector: "app-leftnav",
  templateUrl: "leftnav.component.html",
  styleUrls: ["leftnav.component.scss"],
})
export class Leftnav implements OnInit {
  constructor(
    private router: Router,
    private spaarks: SpaarksService,
    private activeSnapshot: ActivatedRoute
  ) {
    this.userId = localStorage.getItem("id");
  }
  timer;
  userId;
  @ViewChild("rla", { static: true }) ActiveStatus: ElementRef;
  @ViewChild("profile") prof: ElementRef;
  currentLink = "";
  isActive = false;
  sub;
  ngOnInit(): void {
    try {
      // console.log(this.activeSnapshot.snapshot.url[0].path)
      this.currentLink = document.URL;
      console.log(this.currentLink);
      this.currentLink = this.activeSnapshot.snapshot.url[0].path;
      // this.activeSnapshot.params.subscribe((suc) => {
      //    console.log(this.currentLink)
      // });
    } catch {}
    console.log(this.currentLink);
    //this.homeD="../../../assets/Tab Bar/Home.svg_1";

    this.spaarks.SkeletonTimer.subscribe((succ) => {
      this.timer = succ;
      //alert(succ);
    });

    try {
      if (localStorage.getItem("propic")) {
        this.profilePic = localStorage.getItem("propic");
      }
    } catch (error) {
      // this.spaarks.detailsNotFound("profilePic(LeftNavComp)");
      this.profilePic = "../../../assets/UserProfile.png";
    }

    this.spaarks.proPicSubj.subscribe((succ: any) => {
      // console.log(succ);
      localStorage.setItem("propic", succ.profilePic);
      try {
        this.profilePic = localStorage.getItem("propic");
      } catch (error) {
        // this.spaarks.detailsNotFound("profilePic(LeftNavComp)");
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
      exploreD: "../../../assets//Tab Bar/newExplore.svg",
      exploreA: "../../../assets/Tab Bar/newExplore_1.svg",
    },
    {
      notificaitonD: "../../../assets/Tab Bar/notification.svg",
      notificationA: "../../../assets/Tab Bar/notification_1.svg",
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
  notificaitonD = this.IconChange[4].notificaitonD;
  requestD = this.IconChange[5].requestD;
  profilePic = "../../../assets/UserProfile.png";

  mouseOver(link) {
    console.log(this.currentLink, link);

    if (link == "feed") {
      if (this.currentLink.includes(link)) {
        this.homeD = this.IconChange[0].homeA;
      } else this.homeD = this.IconChange[0].homeA;
    } else if (link == "chat") {
      if (this.currentLink.includes(link)) {
        this.chaticonD = this.IconChange[1].chaticonA;
      } else this.chaticonD = this.IconChange[1].chaticonA;
    } else if (link == "newspaark") {
      if (this.currentLink.includes(link)) {
        this.plusCirlceD = this.IconChange[2].plusCirleA;
      } else this.plusCirlceD = this.IconChange[2].plusCirleA;
    } else if (link == "explore") {
      if (this.currentLink.includes(link)) {
        this.exploreD = this.IconChange[3].exploreA;
      } else this.exploreD = this.IconChange[3].exploreA;
    } else if (link == "notification") {
      if (this.currentLink.includes(link)) {
        this.notificaitonD = this.IconChange[4].notificationA;
      } else this.notificaitonD = this.IconChange[4].notificationA;
    } else if (link == "requests") {
      if (this.currentLink.includes(link)) {
        this.requestD = this.IconChange[5].requestA;
      } else this.requestD = this.IconChange[5].requestA;
    }
  }

  mouseOut(link) {
    if (link == "feed") {
      if (this.currentLink.includes(link)) {
        this.homeD = this.IconChange[0].homeA;
        return;
      } else this.homeD = this.IconChange[0].homeD;
    } else if (link == "chat") {
      if (this.currentLink.includes(link)) {
        this.chaticonD = this.IconChange[1].chaticonA;
        return;
      }
      this.chaticonD = this.IconChange[1].chaticonD;
    } else if (link == "newspaark") {
      if (this.currentLink.includes(link)) {
        this.plusCirlceD = this.IconChange[2].plusCirleA;

        return;
      } else this.plusCirlceD = this.IconChange[2].plusCirlceD;
    } else if (link == "explore") {
      if (this.currentLink.includes(link)) {
        this.exploreD = this.IconChange[3].exploreA;

        return;
      } else this.exploreD = this.IconChange[3].exploreD;
    } else if (link == "notification") {
      if (this.currentLink.includes(link)) {
        this.notificaitonD = this.IconChange[4].notificationA;
        return;
      } else this.notificaitonD = this.IconChange[4].notificaitonD;
    } else if (link == "requests") {
      if (this.currentLink.includes(link)) {
        this.requestD = this.IconChange[5].requestA;
        return;
      } else this.requestD = this.IconChange[5].requestD;
    }
  }

  toProfile() {
    this.userId = localStorage.getItem("id");

    //this.router.navigateByUrl("/profile/"+this.userId);
  }
}
