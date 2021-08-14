import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SpaarksService } from "../../spaarks.service";
import { ChatService } from "../../chat.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Location } from "@angular/common";
import { AllpurposeserviceService } from "src/app/allpurposeservice.service";
import { ReplaySubject, Subject } from 'rxjs';

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  constructor(
    private location: Location,
    private allpurpose: AllpurposeserviceService,
    private router: Router,
    private spaarksService: SpaarksService,
    private chatSErvice: ChatService,
    private _zone: MatSnackBar
  ) {
    this.isMobileVersion = this.spaarksService.isMobileVersion;
  }

  isAuthed = this.spaarksService.authData.isAuthenticated;
ph;
  ngOnInit(): void {

    // if(localStorage.getItem('askname'))
    // { 
    //   var noName=localStorage.getItem('askname');
    //   if(noName!='true')
    //   {
    //     this.allpurpose.triggerModal.next({
    //       type: "openName",
    //       modal: true,
         
    //     });

    //   }

    // }

    // if(this.allpurpose.isOpenNameModal){
    //   this.allpurpose.triggerModal.next({
    //     type: "openName",
    //     modal: true,
       
    //   });
    // }

    if(this.isAuthed){
      if (this.spaarksService.authData.isAuthenticated) {
        try {
          this.name = localStorage.getItem('name');
          this.image = localStorage.getItem('propic');
  
          this.phone = localStorage.getItem('phone');
          console.log(this.phone)
           this.phone=this.spaarksService.decryptData(this.phone);
           if(this.phone.length>10)
            this.phone =  this.phone.replace("^.|.$", "")
        } catch{ }
      }
      this.spaarksService.checkforLocation();
    }
    

    this.spaarksService.showLoginScreen.subscribe((bool) => {
      this.showLogin = bool;
    });

  }

  isMobileVersion;
  name = "";
  image = "";
  phone = "";
  goToLang() {
    this.router.navigateByUrl("home/language");
  }

  clickedLogin() {
    this.showLogin = true;
    this.spaarksService.showLoginScreen.next(true);
  }

  showLogin = false;
  showBlockedUsers() {
    this.showStep = "blocked";

    this.spaarksService.getBlockedUsers().subscribe((succe: any) => {
      console.log(succe);
      this.blockedUsersList = succe;
    });
  }

  moveBack() {
    this.showStep = "settings";
  }
  unBlock(name, id, ind, blocked) {
    this.spaarksService.unBlockUsers(id).subscribe((succ: any) => {
      console.log(id);
      console.log(succ);
      console.log(blocked);
      this.spaarksService.somethingWentWrong(succ.message);

      if (blocked.featureName == "chat") {
        console.log(blocked);
        if (blocked.blockId) {
          console.log(blocked);
          this.chatSErvice.unblockUser(blocked.blockId);
        }
        // this.activeUsersService.refrehPosts.next({ refresh: true, original: false });
      } else {
        // this.activeUsersService.refrehPosts.next({ refresh: true, original: false });
        if (blocked.name == "Anonymous") {
          this.chatSErvice.unblockUser(blocked.jid_anonymous);
        } else {
          this.chatSErvice.unblockUser(blocked.jid_main);
        }
      }
      //need to change jai

      // this._zone.open(succ.message, "ok", {
      //   duration: 2000,

      // });
      
    });

    this.blockedUsersList.splice(ind, 1);
  }

  blockedUsersList = [];

  showStep = "settings";
  canlogOut = false;

  logOut() {
    this.allpurpose.triggerModal.next({
      type: "confirmModal",
      modal: true,
      modalMsg: "Are you sure?",
      fromWhere: "logout",
    });
    let canDelete = false;

    this.spaarksService.confirmResponse.subscribe((x: any) => {
      if (x.fromWhere == "logout") {
    this.spaarksService.confirmResponse=new ReplaySubject(1);

        canDelete = x.status;
        if (canDelete == false) return;
        this.spaarksService.isloggedOut = true;
        this.spaarksService.somethingWentWrong("Logged out Successfully");
        this.spaarksService.logOut();
      } 
      else 
      {
        this.spaarksService.confirmResponse = new ReplaySubject(1);
        return;

      }
    });
  }

  showBigPic(Pic) {
    this.spaarksService.sendSinglePhoto(Pic);
  }
}
