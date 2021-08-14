import { Component, OnInit } from "@angular/core";
import { SpaarksService } from "src/app/spaarks.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-rewards",
  templateUrl: "./rewards.component.html",
  styleUrls: ["./rewards.component.scss"],
})
export class RewardsComponent implements OnInit {
  constructor(
    private spaark: SpaarksService,
    private loc: Location,
    private router: Router
  ) {
    this.isMobileVersion = this.spaark.isMobileVersion;
  }

  isMobileVersion;
  selectedTab: string = "rewards";

  ngOnInit(): void {}

  clickedBack() {
    this.loc.back();
  }

  checkTabIndex(event) {
    console.log(event);

    this.spaark.currentFeatureSubj.next(event);
    this.spaark.featName = event;
    this.router.navigateByUrl("home/feed");
  }
}
