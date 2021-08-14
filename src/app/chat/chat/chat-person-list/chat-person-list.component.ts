import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { ChatService } from "../../../chat.service";
import { SpaarksService } from "src/app/spaarks.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-chat-person-list",
  templateUrl: "./chat-person-list.component.html",
  styleUrls: ["./chat-person-list.component.scss"],
})
export class ChatPersonListComponent implements OnInit, OnChanges {
  constructor(
    private chatService: ChatService,
    private spaarkService: SpaarksService,
    private router: Router
  ) {}

  @Output("listclicked") listclicked = new EventEmitter();
  @Output("multioutput") multioutput = new EventEmitter();
  @Input("chatnorm") chatnorm = [];
  @Input("chatanon") chatanon = [];
  @Input("chatlist") chatlist = [];
  @Input("isforward") isforward = { bool: true, forwardarray: [] };
  @Input("activejid") activejid = "";
  @Input("account") account = 1;

  forwardNumber = 0;
  chatToDisplay = [];
  loading = true;

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes) {
      if (changes.account) {
        if (changes.account.currentValue && changes.account.previousValue) {
          if (changes.account.currentValue == changes.account.previousValue) {
          } else {
            this.account = changes.account.currentValue;
            if (this.account == 1) {
              this.chatToDisplay = this.chatnorm;
            } else {
              this.chatToDisplay = this.chatanon;
            }
          }
        } else if (changes.account.currentValue) {
          this.account = changes.account.currentValue;
          if (this.account == 1) {
            this.chatToDisplay = this.chatnorm;
          } else {
            this.chatToDisplay = this.chatanon;
          }
        }
      }

      if (changes.chatlist) {
        console.log(this.spaarkService.alreadyLoaded);

        if (!this.spaarkService.alreadyLoaded) {
          setTimeout(() => {
            this.spaarkService.alreadyLoaded = true;
            if (changes.chatlist.currentValue.length > 0) {
              this.loading = false;
              console.log(changes.chatlist.currentValue.length);
            } else if (changes.chatlist.currentValue.length == 0) {
              console.log(changes.chatlist.currentValue.length);
              this.loading = false;
            }
          }, 4000);
        } else {
          // setTimeout(() => {
          this.spaarkService.alreadyLoaded = true;
          if (changes.chatlist.currentValue.length > 0) {
            this.loading = false;
            console.log(changes.chatlist.currentValue.length);
          } else if (changes.chatlist.currentValue.length == 0) {
            console.log(changes.chatlist.currentValue.length);
            this.loading = false;
          }
          // }, 4000);
        }
      }

      if (changes.isforward) {
        if (changes.isforward) {
          this.isforward = changes.isforward.currentValue;
        }
      }
    }
  }

  
  ngOnInit(): void {
    // console.log(this.chatService.chatToOpen.account);
    // console.log(Number(this.chatService.chatToOpen.account) == this.account);
    // console.log(this.chatlist);

    if (Number(this.chatService.chatToOpen.account) == this.account) {
      this.chatlist.forEach((val) => {
        if (val) {
          // console.log(val);
          // console.log(this.chatService.chatToOpen);
          // console.log(this.chatlist);
          if (val.jid && this.chatService.chatToOpen.jid) {
            if (val.jid == this.chatService.chatToOpen.jid) {
              this.clickedChatListItem(val);
            }
          }
        }
      });
    }
    // console.log("forwarded chat", this.chatlist);
    // console.log(this.chatnorm);
  }

  identifyFor(index, item) {
    return item.jid;
  }

  changedTick(chatperson, eve) {
    // console.log(chatperson);
    // console.log(eve);

    if (chatperson.isTicked == true && eve.checked == true) {
      console.log(chatperson);
      this.forwardNumber = this.forwardNumber + 1;
      this.multioutput.emit({
        forward: true,
        isForwardAdd: true,
        chatperson: chatperson,
      });
    } else {
      this.forwardNumber = this.forwardNumber - 1;
      this.multioutput.emit({
        forward: true,
        isForwardAdd: false,
        chatperson: chatperson,
      });
    }
  }

  clickForward() {
    this.multioutput.emit({ forwardclicked: true });
    this.forwardNumber = 0;
  }

  /** function called when any of chat list is clicked */
  clickedChatListItem(chatitem) {
    // console.log("chatitem", chatitem);
    this.chatService.activeJid = chatitem.jid;

    //this chatitem is emitted to chatcontainer component to show person details
    this.listclicked.emit({ chatitem: chatitem });

    // for regular accounts
    if (this.account == 1) {
      ChatService.myChats.forEach((val, ind) => {
        if (val) {
          if (val.jid) {
            if (val.jid == chatitem.jid) {
              val.unread = 0;
            }
          }
        }
      });
    }
    //for anonymous accounts
    else if (this.account == 2) {
      ChatService.myAnoChats.forEach((val, ind) => {
        if (val) {
          if (val.jid) {
            if (val.jid == chatitem.jid) {
              val.unread = 0;
            }
          }
        }
      });
    }
  }
}
