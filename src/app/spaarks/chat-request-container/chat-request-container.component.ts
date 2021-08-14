import { SpaarksService } from "../../spaarks.service";
import { Component, OnInit } from "@angular/core";
import { AllpurposeserviceService } from "../../allpurposeservice.service";

@Component({
  selector: "app-chat-request-container",
  templateUrl: "./chat-request-container.component.html",
  styleUrls: ["./chat-request-container.component.scss"],
})
export class ChatRequestContainerComponent implements OnInit {
  constructor(
    private spaarks: SpaarksService,
    private multipurp: AllpurposeserviceService
  ) {
    this.isAuthed = this.spaarks.authData.isAuthenticated;
  }

  timer = "false";
  pendingRequests;
  allSentRequests = [];
  dummyReqst = [1, 2, 3, 4];
  initVal = 2;
  fullView = false;
  isAuthed = this.spaarks.isJai;

  ngOnInit(): void {
    this.spaarks.SkeletonTimer.subscribe((succ: any) => {
      console.log(succ);
      this.timer = succ;
      //alert(succ);
    });

    if (this.isAuthed) {
      this.getRequests();
    }

    this.spaarks.getMyRequests().subscribe((succ: any) => {
      console.log(succ);
      this.allSentRequests = succ.message;
      console.log(this.allSentRequests);
      if (this.allSentRequests == undefined) {
        this.allSentRequests = [];
      }
    });

    // this.multipurp.multiPurposeSubj.subscribe((succe:any)=>{
    //   if(succe){
    //     if(succe.type){
    //       if(succe.type=="confirmrefresh"){
    //         //this.getRequests();
    //       }
    //     }
    //   }

    // })
  }

  getRequests() {
    this.spaarks.getPendingRequests().subscribe((res: any) => {
      console.log("Refreshed Requests");
      this.pendingRequests = res;
      console.log(this.pendingRequests);
    });
  }

  changedRequests(eve) {
    console.log(eve);
    if (eve) {
      if (eve.type) {
        if (eve.type == "deleterequest") {
          this.allSentRequests = eve.dat;
        }
      }
    }
  }

  viewAll() {
    this.fullView = !this.fullView;
    if (this.fullView == true) {
      this.initVal = this.dummyReqst.length;
      console.log("Inside IF");
    } else {
      this.initVal = 2;
      console.log("Inside else");
    }
  }
}
