import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { SpaarksService } from "../../spaarks.service";

@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
  styleUrls: ["./topbar.component.scss"],
})
export class TopbarComponent implements OnInit {
  constructor(private router: Router, private spaarksService: SpaarksService) {}

  @Output("selectedindexchange") selectedindexchange = new EventEmitter<any>();

  showAllTabs = false;
  showSpaarks = true;
  // noTabs=false;

  userId = "";

  isExploreSection = false;

  featureName;
  selectedIndex = 0;
  isSmall = false;

  firstTimeclick = true;

  checkLocation;
  isAuthed = false;

  lists = ["All", "Market", "Events", "Make Friends"];

  posts;
  postsBeyond;

  bellIcon = false;
  testArr = [
    "item-1",
    "item-2",
    "item-3",
    "item-4",
    "item-5",
    "item6",
    "item-4",
    "item-5",
    "item6",
  ];

  account;

  ngOnInit(): void {
    this.showSpaarks = true;

    if (this.spaarksService.authData.isAuthenticated) {
      this.isAuthed = this.spaarksService.authData.isAuthenticated;
    }

    this.account = this.spaarksService.showTabIndex;
    let locUrll = document.URL;
    if (this.router.url.includes("feed") == false) {
      this.account = 0;
    }

    if (locUrll.includes("feed") || locUrll.includes("explore")) {
      console.log("showAllTabs");
      this.showAllTabs = true;
      if (locUrll.includes("feed")) {
        //this.isSmall = true;
        if (this.spaarksService.selectedTabName != "") {
          console.log("showwww", this.spaarksService.selectedTabName);
          // this.checkTabIndex(this.spaarksService.selectedTabName);
          this.account = this.spaarksService.selectedTab;
        } else {
          // this.checkTabIndex('All');
          this.spaarksService.selectedTab = 1;
          this.account = 1;
        }
      }

      if (locUrll.includes("explore")) {
        this.showSpaarks = true;
        this.isSmall = false;
        this.isExploreSection = true;
        if (this.spaarksService.selectedTabName != "") {
          this.account = this.spaarksService.selectedTab;
        } else {
          this.spaarksService.selectedTab = 1;
          this.account = 1;
        }
      }
    }
    if (locUrll.includes("chat") || locUrll.includes("newspaark")) {
      this.isSmall = false;
      this.showAllTabs = true;

      // this.showSpaarks = false;
    }
    if (locUrll.includes("profile")) {
      // console.log('show 3 Tabs');
      this.showAllTabs = true;
      this.isSmall = true;

      // this.noTabs=true;
    }
    if (locUrll.includes("seller")) {
      this.showAllTabs = false;
    }
    if (locUrll.includes("nearby")) {
      this.showAllTabs = true;
      this.account = 2;
    }
    //var checkFeed=locUrll.includes('feed');
    this.spaarksService.fName = this.featureName;
    // console.log(this.spaarksService.fName);

    // if(checkFeed==false){
    //   this.showAllTabs=true;
    // }
    if (locUrll.includes("bookmark")) {
      this.showAllTabs = true;
      this.isSmall = true;

      // this.noTabs=true;
    }
    this.spaarksService.mainTabTrigger.subscribe((x) => {
      if (x == "All") {
        this.clickedTab(1);
        this.checkTabIndex("All");
        return;
      }
      this.clickedTab(2);
      this.checkTabIndex("Market");
    });
  }

  noPillSelected() {
    this.spaarksService.noPillSelected = true;
  }

  //**** returns the tab index ****n//
  checkTabIndex(tabName) {
    // this.router.navigateByUrl('home/feed');
    let locUrll = document.URL;
    this.featureName = tabName;
    console.log("heyyyyyyyyyyyyy", this.featureName);
    if (this.featureName == "Market") {
      if (
        locUrll.includes("nearby") ||
        (locUrll.includes("feed") == false &&
          locUrll.includes("explore") == false)
      ) {
        this.spaarksService.showTabIndex = 2;
        this.spaarksService.featCat = this.featureName;
        this.featureName = "market";
        this.selectedIndex = 1;
        this.spaarksService.featName = this.featureName;

        // this.router.navigate(["/home/feed"]);
      }

      this.spaarksService.selectedTabName = "Market";
      this.spaarksService.selectedTab = 2;
      this.featureName = "market";
      this.selectedIndex = 1;
    } else if (this.featureName == "Events") {
      if (
        locUrll.includes("nearby") ||
        (locUrll.includes("feed") == false &&
          locUrll.includes("explore") == false)
      ) {
        this.spaarksService.showTabIndex = 3;
        this.spaarksService.featCat = this.featureName;
        this.featureName = "showtime";
        this.selectedIndex = 2;
        this.spaarksService.featName = this.featureName;

        this.router.navigate(["/home/feed"]);
      }
      this.spaarksService.selectedTabName = "Events";
      this.spaarksService.selectedTab = 3;
      this.featureName = "showtime";
      this.selectedIndex = 2;
    } else if (this.featureName == "Make Friends") {
      if (
        locUrll.includes("nearby") ||
        (locUrll.includes("feed") == false &&
          locUrll.includes("explore") == false)
      ) {
        this.spaarksService.showTabIndex = 4;
        this.spaarksService.featCat = this.featureName;
        this.featureName = "greet";
        this.selectedIndex = 3;
        this.spaarksService.featName = this.featureName;
        console.log("donnnnnnnnn", this.featureName);
        this.router.navigate(["/home/feed"]);
      }

      this.spaarksService.selectedTabName = "Make Friends";
      this.spaarksService.selectedTab = 4;
      this.featureName = "greet";
      this.selectedIndex = 3;
    }
    //need to check for all
    else if (this.featureName == "All") {
      if (
        locUrll.includes("nearby") ||
        (locUrll.includes("feed") == false &&
          locUrll.includes("explore") == false)
      ) {
        this.spaarksService.showTabIndex = 1;
        this.spaarksService.featCat = this.featureName;
        this.featureName = "user";
        this.selectedIndex = 0;
        this.spaarksService.featName = this.featureName;

        this.router.navigate(["/home/feed"]);
      }
      this.spaarksService.selectedTabName = "All";
      this.spaarksService.selectedTab = 1;
      this.featureName = "user";
      this.selectedIndex = 0;
    }
    setTimeout(() => {
      this.spaarksService.fName = this.featureName;
      // console.log(this.spaarksService.fName);
      this.spaarksService.selectedTabName = tabName;
      console.log("Feature Name", this.spaarksService.fName);
      this.selectedindexchange.emit(this.featureName);
      console.log("Feature Name", this.featureName);
    }, 100);
  }

  clickedTab(dat) {
    this.spaarksService.tabChanged.next();
    this.spaarksService.selectedTab = dat;
    if (dat) {
      if (dat == this.account) {
        return;
      } else {
        this.account = dat;
      }
    }
  }
}
