import { Component, OnInit } from "@angular/core";
import { SpaarksService } from "src/app/spaarks.service";
import { AllpurposeserviceService } from "src/app/allpurposeservice.service";
import { Router } from "@angular/router";
import { ChatService } from "src/app/chat.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.scss"],
})
export class NotificationComponent implements OnInit {
  notificationData;
  showAllClear = false;
  isAuthed = this.spaarksService.authData.isAuthenticated;
  showRecentChats = false;
  listtoShowAno = [];
  listtoshowChatFinal = [];
  listtoShowNorm = [];
  showSparkAnonymus = false;
  fullViewChats = false;
  initValChats = 4;
  refrListSubs: Subscription;
  isMobileVersion;
  loader:boolean=true;
  constructor(
    private spaarksService: SpaarksService,
    private allpurposeService: AllpurposeserviceService,
    private router: Router,
    private chatServ: ChatService
  ) {
    this.isMobileVersion = this.spaarksService.isMobileVersion;
  }

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

  firstTimeclick = true;
  showLogin = false;

  ngOnChanges() {
    if (this.notificationData.length != 0) {
      this.showAllClear = true;
    //  this.loader=true;

    } else {
      this.showAllClear = false;
    //  this.loader=false;

    }
  }

  ngOnInit(): void {
    // if(localStorage.getItem('askname'))
    // {
    //   var noName=localStorage.getItem('askname');
    //   if(noName!='true')
    //   {
    //     this.allpurposeService.triggerModal.next({
    //       type: "openName",
    //       modal: true,

    //     });

    //   }

    // }
    // if(this.allpurposeService.isOpenNameModal){
    //   this.allpurposeService.triggerModal.next({
    //     type: "openName",
    //     modal: true,
    //   });
    // }

    if (this.isAuthed) {
     this.loader=true;
      this.spaarksService.getBellNotificatrion().subscribe((succ) => {
        console.log(succ);
        this.notificationData = succ;
        // this.loader=false;

        if (this.notificationData.length > 0) {
          this.showAllClear = true;
       
          
          
        }
        
        this.loader=false;
      });
      
          }
          // this.loader=false;

    this.spaarksService.showLoginScreen.subscribe((bool) => {
      this.showLogin = bool;
    });

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

  clickedLogin() {
    this.showLogin = true;
    this.spaarksService.showLoginScreen.next(true);
  }

  openNotification() {
    if (this.spaarksService.authData.isAuthenticated) {
      //  this.bellIcon = !this.bellIcon;

      if (this.firstTimeclick) {
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
            showComments : true,
          });
        },
        (err) => {
          this.spaarksService.somethingWentWrong(err.error.message);
          console.log(err.error);
        }
      );
    } else if (data.relation == "greet") {
      this.router.navigateByUrl("/home/requests");
    } else if (data.relation == "ticket") {
      if (data.featureName == "help")
        this.router.navigateByUrl("/settings/ticket/" + data.ticketId);
      else this.router.navigateByUrl("/settings/business" + data.ticketId);
    }else if(data.relation == "Reward"){
      this.router.navigateByUrl("/settings/rewards");
    }
  }

  DeleteAllNotification() {
    //  this.bellIcon = !this.bellIcon;
    // return;
    this.spaarksService.deleteAllnotification().subscribe((succ) => {
      console.log(succ);
      this.showAllClear = false;
     this.loader=true;
      
      //this.notificationData=[];
    });
    this.notificationData = [];
    this.loader=false;

    // this.bellIcon=false;
  }
}
