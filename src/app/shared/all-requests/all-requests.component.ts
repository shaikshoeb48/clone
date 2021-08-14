import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { SpaarksService } from "../../spaarks.service";
import { Subscription } from "rxjs";
import { ChatService } from "src/app/chat.service";
import { AllpurposeserviceService } from "src/app/allpurposeservice.service";

@Component({
  selector: "app-all-requests",
  templateUrl: "./all-requests.component.html",
  styleUrls: ["./all-requests.component.scss"],
})
export class AllRequestsComponent implements OnInit {
  constructor(
    private spaarksService: SpaarksService,
    private chatServ: ChatService,
    private route: Router,
    private allPurpose: AllpurposeserviceService
  ) {
    this.isMobileVersion = this.spaarksService.isMobileVersion;

    if (this.spaarksService.authData.isAuthenticated == true) {
      this.isAuthed = true;
    }
  }
  isMobileVersion;
  isAuthed = false;
  pendingRequests = [];
  allSentRequests = [];
  currentposts = null;
  screen = "full";
  requestsArrayFiltered = [];
  sentrequestsFinal = [];
  isMine = null;
  listofreqs = [];
  showRecentChats = false;
  listtoShowAno = [];
  listtoshowChatFinal = [];
  listtoShowNorm = [];
  showSparkAnonymus = false;
  fullViewChats = false;
  initValChats = 4;
  refrListSubs: Subscription;
  filteredRequests = [];
  loader: boolean = true;

  fullView = false;
  initviewall = 1;
  showLogin = false;
  allgreetReq = 0;
  initsent = 1;
  fullViewsent = false;
  fullViewRequest = false;
  intiRequest = 1;
  fullViewSentRequest = false;
  intiSent = 1;

  ngOnInit(): void {
    // if(this.allPurpose.isOpenNameModal){
    //   this.allPurpose.triggerModal.next({
    //     type: "openName",
    //     modal: true,

    //   });
    // }

    // if(localStorage.getItem('askname'))
    // {
    //   var noName=localStorage.getItem('askname');
    //   if(noName!='true')
    //   {
    //     this.allPurpose.triggerModal.next({
    //       type: "openName",
    //       modal: true,

    //     });

    //   }

    // }
    console.log("all-requests");

    if (this.isAuthed) {
      this.getGreetRequests();

      this.spaarksService.allPurposeSubject.subscribe((success: any) => {
        console.log(success);
        if (success.type == "refreshrequests") {
          this.getGreetRequests();
          this.filteredRequests = [];
          this.requestsArrayFiltered = [];
        }
      });

      this.spaarksService.getPendingRequests().subscribe((succe: any) => {
        console.log("backend req");
        console.log(succe);
        this.pendingRequests = succe;
      });
      this.spaarksService.getRequestsSub.subscribe((res) => {
        console.log("Refreshed Requests");
        this.pendingRequests = res;
        console.log(this.pendingRequests);
      });
      this.openRequests();
    }

    this.spaarksService.showLoginScreen.subscribe((bool) => {
      this.showLogin = bool;
    });

    console.log(this.pendingRequests);

    ChatService.jidEmitter.next([]);

    if (
      this.chatServ.chatLoadedArr.loadedArr.includes("ano") &&
      this.chatServ.chatLoadedArr.loadedArr.includes("norm")
    ) {
      try {
        this.listtoShowNorm = [];
        this.listtoShowNorm.push(...ChatService.myChats);
        this.listtoShowNorm.forEach((val, ind) => {
          val.account = "1";
        });
        console.log(this.listtoShowNorm);

        this.listtoShowAno.push(...ChatService.myAnoChats);
        this.listtoShowAno.forEach((val, ind) => {
          val.account = "2";
        });
        // console.log(this.listtoShowNorm);

        let finaArr = this.listtoShowAno.concat(this.listtoShowNorm);
        // console.log(finaArr);

        this.listtoshowChatFinal = ChatService.mergeSort(finaArr);

        // console.log(this.listtoshowChatFinal);
        // if(this.listtoshowChatFinal.length>5){

        //     this.listtoshowChatFinal = this.listtoshowChatFinal.slice(0,3);

        // }
        if (this.listtoshowChatFinal.length > 0) {
          this.showRecentChats = true;
          console.log(this.showRecentChats);
        }
        if (!this.showRecentChats) {
          this.showSparkAnonymus = true;
        }
      } catch (exc) {
        console.log(exc);
      }
    }

    this.refrListSubs = ChatService.refreshList.subscribe(
      (succ) => {
        if (succ.refresh) {
          try {
            if (succ.refresh == "jai") {
              this.listtoShowNorm = [];
              this.listtoShowNorm.push(...ChatService.myChats);
              this.listtoShowNorm.forEach((val, ind) => {
                val.account = "1";
              });
              // console.log(this.listtoShowNorm);
            } else if (succ.refresh == "jaiano") {
              this.listtoShowAno.push(...ChatService.myAnoChats);
              this.listtoShowAno.forEach((val, ind) => {
                val.account = "2";
              });
              // console.log(this.listtoShowNorm);
            }

            let finaArr = this.listtoShowAno.concat(this.listtoShowNorm);
            // console.log(finaArr);

            this.listtoshowChatFinal = ChatService.mergeSort(finaArr);
            // console.log(this.listtoshowChatFinal);
            // if(this.listtoshowChatFinal.length>5){

            //     this.listtoshowChatFinal = this.listtoshowChatFinal.slice(0,5);
            // }

            if (this.listtoshowChatFinal.length > 0) {
              this.showRecentChats = true;

              console.log(this.showRecentChats);
            }
            if (!this.showRecentChats) {
              this.showSparkAnonymus = true;
            }
          } catch (exc) {
            console.log(exc);
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  viewAllChats() {
    this.fullViewChats = !this.fullViewChats;
    if (this.fullViewChats == true) {
      this.initValChats = this.listtoshowChatFinal.length;
      // console.log('Inside IF')
    } else {
      this.initValChats = 10;
      // console.log('Inside else')
    }
  }

  getGreetRequests() {
    this.screen = "full";
    this.currentposts = null;
    //For requests received for our post
    if (!this.isAuthed) {
      return;
    }
    this.loader = true;
    this.spaarksService.getRequestsbyPost().subscribe((succe: any) => {
      console.log(succe); // succe has my own posts

      succe.forEach((ele) => {
        console.log(ele);

        this.loader = true;
        var counter = 0;
        ele.greetRequest.forEach((ele2) => {
          console.log(ele);
          // counter = 0;

          if (ele2.status == "Pending") {
            //show this array for received
            if (counter < 1) {
              console.log("if" + counter);

              this.requestsArrayFiltered.push(ele);
              ++counter;
            } else {
              console.log("else");
            }
          }
        });
      });

      console.log(this.requestsArrayFiltered);
      //   finrequests = succe.filter((vall) => {
      //     // console.log(vall);

      //     // if (vall.greetRequest.length > 0) {
      //     //   vall.greetRequest.forEach((element) => {
      //     //     if (element.status != "Rejected") {
      //     //       ++this.allgreetReq;
      //     //     }
      //     //   });
      //     //   console.log(this.allgreetReq);

      //     //   if (
      //     //     this.allgreetReq > 0 &&
      //     //     this.allgreetReq != vall.greetRequest.length
      //     //   ) {
      //     //     console.log(vall)
      //          return vall;
      //     //   }
      //     // }
      //   });

      console.log(this.requestsArrayFiltered);
    });

    this.spaarksService.getSentRequestByPost().subscribe((succe: any) => {
      console.log(succe);
      this.sentrequestsFinal = succe.data;
      this.loader = false;
    });
  }

  clickedSpecificPost(req, isMine, reqs?) {
    console.log(req);
    console.log(isMine);
    console.log(reqs);
    this.filteredRequests = [];
    req.greetRequest.forEach((ele2) => {
      console.log(ele2);

      if (ele2.status == "Pending") {
        this.filteredRequests.push(ele2);
      }
    });
    console.log(this.filteredRequests);

    this.isMine = isMine;
    if (reqs) {
      this.listofreqs = reqs;
    }
    this.currentposts = req;
    this.screen = "specific";
    console.log(req);
    console.log(this.listofreqs);
  }

  clickedBackfromSpecific() {
    if (this.spaarksService.fromChat) {
      this.spaarksService.fromChat = false;
      this.route.navigate(["/chat"]);
      return;
    }
    if (this.screen == "full") {
      this.route.navigate(["/home/feed"]);
    } else {
      this.screen = "full";
    }
  }

  clickedLogin() {
    this.showLogin = true;
    this.spaarksService.showLoginScreen.next(true);
  }

  clickedPosts() {
    console.log("clicked posts");
    console.log(this.currentposts);
    this.screen = "specific";
  }

  openRequests() {
    this.spaarksService.getMyRequests().subscribe((succ: any) => {
      console.log(succ);
      this.allSentRequests = succ.message;
      // console.log(this.allSentRequests);
    });
  }

  checkSentRequests(eve) {
    console.log(eve);
    this.allSentRequests = eve.dat;
  }

  //allSentRequests = [];
  // isAuthed = this.spaarks.isJai;

  viewAllRequests() {
    this.fullViewRequest = !this.fullViewRequest;
    if (this.fullViewRequest == true) {
      this.intiRequest = this.requestsArrayFiltered.length;
      // console.log('Inside IF')
    } else {
      this.intiRequest = 1;
      // console.log('Inside else')
    }
  }

  viewAllSentRequests() {
    this.fullViewSentRequest = !this.fullViewSentRequest;
    if (this.fullViewSentRequest == true) {
      this.intiSent = this.sentrequestsFinal.length;
      // console.log('Inside IF')
    } else {
      this.intiSent = 1;
      // console.log('Inside else')
    }
  }

  viewAll() {
    this.fullView = !this.fullView;
    if (this.fullView == true) {
      this.initviewall = this.filteredRequests.length;
      // console.log('Inside IF')
    } else {
      this.initviewall = 1;
      // console.log('Inside else')
    }
  }

  viewAllSent() {
    this.fullViewsent = !this.fullViewsent;
    if (this.fullViewsent == true) {
      this.initsent = this.listofreqs.length;
      // console.log('Inside IF')
    } else {
      this.initsent = 1;
      // console.log('Inside else')
    }
  }
}
