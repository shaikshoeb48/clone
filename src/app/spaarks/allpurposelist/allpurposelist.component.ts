import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { SpaarksService } from "../../spaarks.service";
import { AllpurposeserviceService } from "../../allpurposeservice.service";
import { Router } from "@angular/router";

import {
  MatBottomSheet,
  MatBottomSheetRef,
} from "@angular/material/bottom-sheet";
@Component({
  selector: "app-allpurposelist",
  templateUrl: "./allpurposelist.component.html",
  styleUrls: ["./allpurposelist.component.scss"],
})
export class AllpurposelistComponent implements OnInit, OnChanges {
  constructor(
    private spaarksService: SpaarksService,
    private router: Router,
    private allpurposeService: AllpurposeserviceService,
    private _bottomSheetRef: MatBottomSheetRef
  ) {}

  listtorender = this.spaarksService.arraytoOpenBottomsheet;
  options = [
    {
      name: "Report",
      img: "../../../../assets/report.svg",
      text: "Your identity will not be revealed when you report",
    },
    {
      name: "Block",
      img: "../../../../assets/block.svg",
      text: "Your identity will not be revealed when you block",
    },
    // { name: 'Subscribe', img: '../../../../assets/subscribe.svg', text: 'You can subscribe to a seller, to let you notified' }
  ];

  showOptions = this.spaarksService.showOptions.spaarkscardOptions;
  showSettings = this.spaarksService.showOptions.showSettings;

  settingsArray = [
    { name: "FAQs", img: "../../../../assets/faqs.svg" },
    { name: "Help", img: "../../../../assets/help.svg" },
    { name: "Connect with us", img: "../../../../assets/connect.svg" },
    { name: "Terms & Policies", img: "../../../../assets/terms.svg" },
    { name: "Settings", img: "../../../../assets/settings.svg" },
  ];

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  ngOnInit() {}

  triggerLogin() {
    this.allpurposeService.triggerModal.next({ type: "login", modal: true });
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  goToLink(eve) {
    if (eve == "Settings") {
      this.router.navigateByUrl("/settings");
    }
    if (eve == "Terms & Policies") {
      this.router.navigateByUrl("/home/terms");
    }
    if (eve == "FAQ") {
      this.router.navigateByUrl("/home/faqs");
    }
    if (eve == "Connect with us") {
      this.router.navigateByUrl("/home/connectwithus");
    }
    if (eve == "Help") {
      this.router.navigateByUrl("/home/help");
    }

    //closing bottomsheet
    this._bottomSheetRef.dismiss();
  }
}
