import { AllpurposeserviceService } from "../../allpurposeservice.service";
import { SpaarksService } from "../../spaarks.service";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-work-status",
  templateUrl: "./work-status.component.html",
  styleUrls: ["./work-status.component.scss"],
})
export class WorkStatusComponent implements OnInit {
  constructor(
    private spaarksService: SpaarksService,
    private allPurposeService: AllpurposeserviceService
  ) {}

  @Input("status") workStatus;
  @Input("isRating") isRating = false;
  @Input("isWorkStatus") isWorkStatus = false;
  @Input("data") data;
  @Input("ratingData") ratingData = [];
  @Input("currentIndex") currentIndex = 0;
  ngOnInit(): void {}

  pendingWorkStatus(id, userId, status) {
    this.isWorkStatus = false;
    // console.log(id);
    // console.log(userId);
    this.spaarksService.statusCardSub.next(this.currentIndex);
    // return
    if (status == "completed") {
      let sendOpt = "CMPT";
      this.spaarksService.sendWorkStatus(id, userId, sendOpt);
    } else if (status == "pending") {
      let sendOpt = "STG";
      this.spaarksService.sendWorkStatus(id, userId, sendOpt);
    } else if (status == "ignored") {
      let sendOpt = "IGN";
      this.spaarksService.sendWorkStatus(id, userId, sendOpt);
    }
  }

  openRatingModal() {
    this.allPurposeService.triggerModal.next({
      type: "showRatingsModal",
      data: this.ratingData,
      modal: true,
    });
  }
}
