import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { ChatService } from "../../../chat.service";
import * as _ from "lodash";
import { AllpurposeserviceService } from "../../../allpurposeservice.service";
import { SpaarksService } from "../../../spaarks.service";
import { ReplaySubject, Subject } from "rxjs";

@Component({
  selector: "app-chat-specific-container",
  templateUrl: "./chat-specific-container.component.html",
  styleUrls: ["./chat-specific-container.component.scss"],
})
export class ChatSpecificContainerComponent implements OnInit, OnChanges {
  constructor(
    private chatservice: ChatService,
    private multiservice: AllpurposeserviceService,
    private spaarkService: SpaarksService
  ) {}

  ngOnInit(): void {
    // console.log("yueguysf", this.chatpersondata);
    this.multiservice.multiPurposeSubj.subscribe((succe: any) => {
      if (succe) {
        if (succe.type) {
          if (succe.type == "updatedchangename") {
            if (succe.newName && succe.jid) {
              if (this.chatpersondata.jid == succe.jid) {
                this.chatpersondata.name = succe.newName;
              }
            }
          }
        }
      }
    });
  }
  isBlocked = false;
  showAlias = false;

  isAno(event) {
    //console.log(event);
    if (event == "true") {
      this.showAlias = true;
    } else {
      this.showAlias = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
    if (changes.chatpersondata) {
      if (changes.chatpersondata.currentValue) {
        //on any change, we refresh the values to the latest
        // console.log(changes.chatpersondata.currentValue);
        this.isBlocked = changes.chatpersondata.currentValue.blocked;
        this.activeJid = changes.chatpersondata.currentValue.jid;
        // if(this.account==1){
        //   ChatService.myChats.forEach((val,ind)=>{
        //     if(val){
        //       if(val.jid){
        //         if(val.jid==this.activeJid){
        //           val.unread = 0;
        //         }
        //       }
        //     }
        //   })
        // }else if(this.account==2){
        //   ChatService.myAnoChats.forEach((val,ind)=>{
        //     if(val){
        //       if(val.jid){
        //         if(val.jid==this.activeJid){
        //           val.unread = 0;
        //         }
        //       }
        //     }
        //   })
        // }
      }
    }
    if (changes.account) {
      if (changes.account.currentValue) {
        this.account = changes.account.currentValue;
      }
    }
  }

  @Input("account") account = 1;
  @Input("multiinput") multiinputspec = undefined;

  activeJid = "";

  @Output("multioutput") multioutput = new EventEmitter();
  @Input("chatpersondata") chatpersondata = undefined;

  forwardfrommobile = "";

  multioutputListener(eve) {
    // console.log(eve);
    if (eve) {
      if (eve.type) {
        //emitting actions to parent
        if (eve.type == "gotolist") {
          this.multioutput.emit({ type: "gotolist" });
        } else if (eve.type == "deletefromparentmsg") {
          this.multioutput.emit(eve);
        } else if (eve.type == "forwardmessage") {
          this.multioutput.emit(eve);
        } else if (eve.type == "forwardMob") {
          this.multioutput.emit(eve);
        } else if (eve.type == "forwardMoblist") {
          this.multioutput.emit(eve);
        }
      }
      if (eve.opt) {
        this.alloptionsHandle(eve);
      }

      if (eve.forwardclicked) {
        this.forwardfrommobile = "forwardfrommobile";
      }
    }
  }

  alloptionsHandle(eve) {
    //all the options from the child components are being transferred to parent
    console.log(eve);
    this.multiservice.triggerModal.next({
      type: "confirmModal",
      modal: true,
      modalMsg: "Are you sure?",
      fromWhere: "chatRequest",
    });
    let canDelete = false;

    this.spaarkService.confirmResponse.subscribe((x: any) => {
      if (x.fromWhere == "chatRequest" && x.status == true) {
        //alert("hey")

        console.log(x);
        canDelete = x.status;

        this.spaarkService.confirmResponse = new ReplaySubject(1);

        if (eve.opt == "exit") {
          if (canDelete) {
            this.exitChat(eve.person.jid, eve.person.aid);
          }
        } else if (eve.opt == "clear") {
          this.clearChat(eve.person.jid, eve.person.aid);
        } else if (eve.opt == "block") {
          this.blockUser(eve.person.userId, eve.person.jid);
        } else if (eve.opt == "alias") {
          if (canDelete) {
            this.multiservice.triggerModal.next({
              modal: true,
              changeNamePayload: this.chatpersondata,
              type: "changeName",
              account: this.account,
            });
          }
        } else return;
      } else {
        this.spaarkService.confirmResponse = new ReplaySubject(1);

        return;
      }
    });
  }

  blockUser(userId, jid) {
    this.audioRecordbol = true;
    // console.log(userId, jid);
    // let blockuser = confirm('Are you sure, you want to block this user?');
    // let blockuser = this.spaarkService.doConfirm('Are you sure?');
    // if (blockuser == false){

    //   return;
    // }

    this.isBlocked = true;
    // ChatService.myChats.forEach((val,ind)=>{
    //   if(val.jid==jid){
    //     ChatService.myChats[ind].blocked = true;
    //     if(this.account==1){
    //       this.Users = ChatService.myChats;
    //     }
    //   }
    // })

    //normla
    // var normaluser = _.map(ChatService.myChats , (user) =>{
    //   if(user.jid == jid){
    //     user.blocked = true;
    //     if(this.account==1){
    //       this.Users = ChatService.myChats;
    //     }else if(this.account==2){
    //       this.Users = ChatService.myAnoChats;
    //     }
    //     return user;
    //   }
    // });
    // normaluser = _.without(normaluser, undefined);

    // //anno
    // var anouser = _.map(ChatService.myAnoChats , (user) =>{
    //   if(user.jid == jid){
    //     user.blocked = true;
    //     if(this.account==1){
    //       this.Users = ChatService.myChats;
    //     }else if(this.account==2){
    //       this.Users = ChatService.myAnoChats;
    //     }
    //     return user;
    //   }
    // });
    // anouser = _.without(anouser, undefined);

    // ChatService.myAnoChats.forEach((val,ind)=>{
    //   if(val.jid==jid){
    //     ChatService.myAnoChats[ind].blocked = true;
    //     if(this.account!=1){
    //       this.Users = ChatService.myAnoChats;
    //     }
    //   }
    // })

    this.chatservice.blockUser(userId, this.account, jid);
  }

  exitChat(jid, aid) {
    this.audioRecordbol = true;
    this.chatservice.exitChat(jid, this.account, aid);
  }

  clearChat(jid, aid) {
    this.audioRecordbol = true;
    //let clearchatt = this.spaarkService.doConfirm('Are you sure?');
    //let clearchatt = confirm('Are you sure, you want to clearchat?');
    //if(clearchatt==false){return;}
    this.clearChatChild = true;
    this.chatservice.clearChat(jid, this.account);
    // this.goBack();
  }

  clearChatChild = false;

  audioRecordbol = false;

  endaudioRecord(ev) {
    this.audioRecordbol = false;
  }
}
