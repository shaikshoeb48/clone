import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { SpaarksService } from "src/app/spaarks.service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { AllpurposeserviceService } from "src/app/allpurposeservice.service";
import { MatMenuTrigger } from "@angular/material/menu";
import QrCodeWithLogo from "node_modules/qrcode-with-logos/dist/qrcode-with-logos.es5.js";

@Component({
  selector: "app-topbarmobile",
  templateUrl: "./topbarmobile.component.html",
  styleUrls: ["./topbarmobile.component.scss"],
})
export class TopbarmobileComponent implements OnInit {
  constructor(
    private router: Router,
    private spaarksService: SpaarksService,
    private modalService: NgbModal,
    private _bottomSheet: MatBottomSheet,
    private allpurposeService: AllpurposeserviceService
  ) {}

  @Output("selectedindexchange") selectedindexchange = new EventEmitter<any>();

  allOptions = [
    { name: "Bookmarks", src: "../../../assets/settingsBookmark.svg" },
    { name: "Update interests", src: "../../../assets/preference.svg" },
    { name: "FAQ", src: "../../../assets/faqs.svg" },
    { name: "Rewards & Partnership", src: "../../../assets/rewards-icon.svg" },
    { name: "Help", src: "../../../assets/help.svg" },
    { name: "Business enquiries", src: "../../../assets/Enq.svg" },
    { name: "Connect with us", src: "../../../assets/connect.svg" },
    { name: "Terms & Policies", src: "../../../assets/terms.svg" },
    { name: "Settings", src: "../../../assets/settings.svg" },
  ];

  showAllTabs = false;
  showSpaarks = true;
  showOptionMenu = true;

  showQR = false;
  filteredOptions = [];
  isExploreSection = false;
  listtorender = ["block", "report", "share", "list 1", "list 1", "list 1"];

  featureName;
  selectedIndex = 0;
  isSmall = false;

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
  notificationData;
  firstTimeclick = true;

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  posts;
  postsBeyond;
  account;
  closeResult = "";
  userId = "";
  userName = "";
  userPic = "";

  checkLocation;
  isAuthed = false;
  showAllClear = false;

  lists = ["All", "Market", "Events", "Make Friends"];

  ngOnChanges() {
    if (this.notificationData.length != 0) {
      this.showAllClear = true;
    } else {
      this.showAllClear = false;
    }
  }

  ngOnInit(): void {
    this.showSpaarks = true;

    if (this.spaarksService.authData.isAuthenticated) {
      this.isAuthed = this.spaarksService.authData.isAuthenticated;
    }

    if (this.isAuthed) {
      this.showQR = true;
    }

    if (!this.isAuthed) {
      this.allOptions.forEach((val, ind) => {
        if (
          val.name == "Settings" ||
          val.name == "Help" ||
          val.name == "Business Enquiries"
        ) {
        } else this.filteredOptions.push(val);
      });
    }
    
    if (this.isAuthed) {
      this.filteredOptions = [...this.allOptions];
    }

    try {
      if (this.isAuthed) {
        this.spaarksService.getBellNotificatrion().subscribe((succ) => {
          console.log(succ);
          this.notificationData = succ;
          if (this.notificationData.length > 0) {
            this.showAllClear = true;
          }
        });
      }
    } catch {}
    this.account = this.spaarksService.showTabIndex;
    let locUrll = document.URL;
    if (this.router.url.includes("feed") == false) {
      this.account = 0;
    }

    if (locUrll.includes("feed") || locUrll.includes("explore")) {
      console.log("showAllTabs");
      this.showAllTabs = true;
      //this.showOptionMenu = false;
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
        if (this.spaarksService.selectedTabName != "") {
          console.log("showwww", this.spaarksService.selectedTabName);
          this.account = this.spaarksService.selectedTab;
        } else {
          this.spaarksService.selectedTab = 1;
          this.account = 1;
        }

        console.log(this.spaarksService.fName);
        this.isExploreSection = true;
      }
    }
    if (locUrll.includes("chat") || locUrll.includes("newspaark")) {
      // console.log('dont Show Anything');
      this.isSmall = false;
      // this.showAllTabs = true;

      //this.showOptionMenu = false;
      // this.showSpaarks = false;
    }
    if (locUrll.includes("profile")) {
      // console.log('show 3 Tabs');
      // this.showAllTabs = true;
      this.isSmall = true;

      // this.noTabs=true;
      // this.showOptionMenu = true;
    }
    if (locUrll.includes("seller")) {
      // this.showAllTabs = false;
      // this.showOptionMenu = true;
    }
    if (locUrll.includes("nearby")) {
      // this.showAllTabs = true;
      this.account = 2;
    }
    //var checkFeed=locUrll.includes('feed');
    this.spaarksService.fName = this.featureName;
    // console.log(this.spaarksService.fName);

    // if(checkFeed==false){
    //   this.showAllTabs=true;
    // }
    if (locUrll.includes("bookmark")) {
      // console.log('show 3 Tabs');
      // this.showAllTabs = true;
      this.isSmall = true;

      // this.noTabs=true;
      // this.showOptionMenu = true;
    }
  }

  // checkTabIndex start

  //**** returns the tab index ****n//

  checkTabIndex(tabName) {
    // this.router.navigateByUrl('home/feed');
    // alert('hhhhhhhhhhh')
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

        this.router.navigate(["/home/feed"]);
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
  // checkTabIndex end

  openNotification() {
    if (this.spaarksService.authData.isAuthenticated) {
      this.bellIcon = !this.bellIcon;

      if (this.firstTimeclick && this.isAuthed) {
        try {
          this.spaarksService.getBellNotificatrion().subscribe((succ) => {
            console.log(succ);
            this.firstTimeclick = false;
            this.notificationData = succ;
            console.log(this.notificationData);
          });
        } catch {}
      }
      console.log(this.testArr);
    } else {
      this.spaarksService.triggerLogin();
    }
  }

  removeNotifcation(id) {
    console.log(id);
    this.spaarksService.removeNotification(id).subscribe((succe) => {
      this.notificationData.forEach((val, ind) => {
        if (val._id == id) {
          this.notificationData.splice(ind, 1);
        }
      });
      console.log(succe);
    });
  }

  openPost(data) {
    // opens the post in modal

    console.log(data);

    if (data.post) {
      console.log(data.post);

      this.spaarksService.getNotifPost(data.post, data.featureName).subscribe(
        (succ: any) => {
          console.log(succ);
          this.allpurposeService.triggerModal.next({
            type: "spaarkinmodal",
            post: succ,
            modal: true,
            source: data,
          });
        },
        (err) => {
          this.spaarksService.somethingWentWrong(err.error.message);
          // console.log(err.error.message);
        }
      );
    } else if (data.relation == "greet") {
      this.router.navigateByUrl("/home/requests");
    }
  }

  DeleteAllNotification() {
    this.bellIcon = !this.bellIcon;
    // return;
    this.spaarksService.deleteAllnotification().subscribe((succ) => {
      console.log(succ);
      this.showAllClear = false;
      //this.notificationData=[];
    });
    this.notificationData = [];

    // this.bellIcon=false;
  }

  closeNotice(ind) {
    this.testArr.splice(ind, 1);
  }

  optionMenu() {
    this.trigger.openMenu();
  }

  navigateByOption(eve) {
    if (eve == "Settings") {
      this.router.navigateByUrl("settings");
    }
    if (eve == "Terms & Policies") {
      this.router.navigateByUrl("/settings/terms");
    }
    if (eve == "FAQ") {
      this.router.navigateByUrl("/settings/faqs");
    }
    if (eve == "Connect with us") {
      this.router.navigateByUrl("/settings/connectwithus");
    }
    if (eve == "Help") {
      this.router.navigateByUrl("/settings/help");
    }
    if (eve == "Business enquiries") {
      this.router.navigateByUrl("/settings/bussinessEnq");
    }
    if (eve == "Update interests") {
      this.spaarksService.updatePreferencesStatus = "clicked";
      this.router.navigateByUrl("/home/preferences");
    }
    if (eve == "Bookmarks") {
      this.router.navigateByUrl("/profile/bookmarks");
    }
    if (eve == "Rewards & Partnership") {
      this.router.navigateByUrl("/settings/rewards");
    }
  }

  clickedTab(dat) {
    this.spaarksService.selectedTab = dat;
    if (dat) {
      if (dat == this.account) {
        return;
      } else {
        this.account = dat;
      }
    }
  }

  open(content) {
    this.userId = localStorage.getItem("id");
    this.userName = localStorage.getItem("name");
    this.userPic = localStorage.getItem("propic");
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );

    setTimeout(() => {
      let qrcode = new QrCodeWithLogo({
        canvas: document.getElementById("qr_id"),
        content: this.userId,
        width: 300,

        //   download: true,
        image: document.getElementById("image"),
        logo: {
          src: "assets/default.svg",
        },
      });
      qrcode.toCanvas().then(() => {});
    }, 500);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
