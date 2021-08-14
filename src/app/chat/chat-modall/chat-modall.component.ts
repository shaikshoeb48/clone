import { ChatService } from "./../../chat.service";
import { SpaarksService } from "./../../spaarks.service";
import { AllpurposeserviceService } from "./../../allpurposeservice.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-chat-modall",
  templateUrl: "./chat-modall.component.html",
  styleUrls: ["./chat-modall.component.scss"],
})
export class ChatModallComponent implements OnInit {
  constructor(
    private multipurposeService: AllpurposeserviceService,
    private spaarksService: SpaarksService,
    private chat: ChatService
  ) {}

  showChangeName = false;
  changeNameAccount = 1;
  changeNamePayload = null;
  newName = "";
  the_placeholder = "";
  wrongtext = false;

  ngOnInit(): void {
    this.multipurposeService.triggerModal.subscribe((succe: any) => {
      console.log(succe);
      this.spaarksService.modalType = succe.type;

      if (succe.type == "changeName") {
        this.multipurposeService.modalStatus = succe.modal;
        this.showChangeName = succe.modal;
        this.changeNameAccount = succe.account;
        this.changeNamePayload = succe.changeNamePayload;
      }
    });
  }

  nameConfirm(jid: string) {
    console.log(jid);

    if (this.newName.length < 3) {
      this.the_placeholder = "minimum length is 3";
      this.newName = "";
      this.wrongtext = true;
      return;
    }

    // this.newName = this.removeSpaces(this.newName)
    this.newName = this.newName.trim();
    if (this.newName.trim() === "") {
      // alert("Name cannot be empty");
      this.the_placeholder = "Name cannot be empty";
      return;
    }

    this.chat
      .sendAlias(jid, this.newName, this.changeNameAccount)
      .subscribe((succ) => {
        console.log(succ);
        this.multipurposeService.multiPurposeSubj.next({
          type: "updatedchangename",
          newName: this.newName,
          jid: jid,
          account: this.changeNameAccount,
        });
        this.newName = "";
        // this.showTicks = false;
        // this.activeUser.name = this.newName;
        // emit an observable to let origin know that name is changed
        this.the_placeholder = "Enter alias name";
        this.wrongtext = false;
        this.clickedOutside("nickname");
      });
  }

  updateName(eve) {
    console.log(eve);
    this.newName = eve.target.value;
  }

  clickOnProfile(event) {
    event.stopPropagation();
  }

  clickedOutside(eve) {
    if (eve) {
      if (eve == "nickname") {
        this.showChangeName = false;
        this.multipurposeService.modalStatus = false;
      }
    }
  }
}
