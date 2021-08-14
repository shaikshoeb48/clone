import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { SpaarksService } from "../../spaarks.service";

@Component({
  selector: "app-msg-item",
  templateUrl: "./msg-item.component.html",
  styleUrls: ["./msg-item.component.scss"],
})
export class MsgItemComponent implements OnInit, OnChanges {
  constructor(private spaarks: SpaarksService) {}

  @Input("msg") msg;
  @Input("isChat") isChat = true;
  @Input("pull") pullTo;
  @Input("multiinput") multiinput = false;

  @Output("allpurposeoutput") allpurposeoutput = new EventEmitter();

  pauseaudio(src) {}
  showDeleteforBoth = true;
  clearrTimeout;
  
  ngOnInit(): void {
    this.calculateShowDeleteForBoth();
    // console.log(this.msg);
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
    if (changes) {
      if (changes.multiinput) {
        if (changes.multiinput.currentValue) {
          this.multiinput = changes.multiinput.currentValue;
          // console.log(this.multiinput);
        }
      }
    }
  }

  calculateShowDeleteForBoth() {
    if (this.msg) {
      if (this.msg.UID) {
        var now = new Date(Number(this.msg.UID) / 1000); //current time
        now.setMinutes(now.getMinutes() + 18); // added 15 mins to current time
        // console.log("now is" + now); //will return current time+15mins
        now = new Date(now); // Date object
        // console.log(now.getTime()); //getTime() returns the number of milliseconds since 1970/01/01:
        let addedExtraTime = new Date(now).getTime() * 1000;
        let currentTime = new Date().getTime() * 1000;
        // console.log("currentTime" + currentTime);
        // console.log("addedExtraTime" + addedExtraTime);
        if (currentTime < addedExtraTime) {
          this.showDeleteforBoth = true;
          let currentTimeObj = new Date(currentTime / 1000);
          let addedExtraTimeObj = new Date(addedExtraTime / 1000);

          var diff = Math.abs(<any>currentTimeObj - <any>addedExtraTimeObj);
          let minsLeft = Math.floor(diff / 1000 / 60);
          // console.log(diff);
          // console.log(minsLeft);

          //diff is in miliseconds
          if (diff > 0) {
            //set timeout can take max upto 2147483647 miliseconds
            // anything greater than that will not make function work , so diff is reinitialized.
            if (diff > 2147483647) {
              diff = 2147483647;
            }

            //When delay is larger than 2147483647 or less than 1, the delay will be set to 1.

            this.clearrTimeout = setTimeout(() => {
              currentTime = new Date().getTime() * 1000;
              this.showDeleteforBoth = false;
            }, diff);
          }
        } else {
          this.showDeleteforBoth = false;
        }
      }
    }
  }

  deleteForMe(m, bool) {
    // console.log(m);
    // console.log(bool);
    this.allpurposeoutput.emit({
      type: "deleteforme",
      payload: { m: m, bool: bool },
    });
  }

  forwardMsg(m) {
    // console.log("forward in msgitem");
    this.allpurposeoutput.emit({ type: "forwardmsg", payload: { m: m } });
  }

  copyText(txt) {
    this.allpurposeoutput.emit({ type: "copytext", payload: { text: txt } });
  }

  viewFullScreen(msgImg) {
    this.spaarks.sendSinglePhoto(msgImg);
  }
}
