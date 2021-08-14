import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "app-chat-person-options",
  templateUrl: "./chat-person-options.component.html",
  styleUrls: ["./chat-person-options.component.scss"],
})
export class ChatPersonOptionsComponent implements OnInit {
  constructor() {}

  @Input("chatpersondata") chatpersondata;
  @Output("alloptions") alloptions = new EventEmitter();
  showNickName = false;
  ngOnInit(): void {
    if (this.chatpersondata) {
      if (
        this.chatpersondata.name == "Anonymous" ||
        this.chatpersondata.name == "anonymous" ||
        this.chatpersondata.isOtherAnonymous
      ) {
        this.showNickName = true;
      }
    }

    console.log(this.chatpersondata);
    for (let x in this.chatpersondata.connection) {
      if (x[0].includes("Market")) {
        // console.log("yes market includes");
      } else {
        // console.log("no");
      }
    }
  }
  bgColorMarket;
  bgColorAnnounce;
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes) {
      if (changes.chatpersondata.currentValue) {
        let c = 0;
        changes.chatpersondata.currentValue.connection = changes.chatpersondata.currentValue.connection.filter(
          (el) => el != "market"
        );

        changes.chatpersondata.currentValue.connection.forEach((val, i) => {
          if (val != "market") {
            c++;
            if (val == "Market") {
              this.bgColorMarket = "rgba(36, 178, 115, 1)";
            } else if (val == "Announce") {
              this.bgColorAnnounce = "rgba(100, 42, 182, 1)";
            } else if (val == "Friends") {
              this.bgColorAnnounce = "#Fa6E5A";
            } else {
              this.bgColorAnnounce = "rgba(100, 42, 182, 1)";
            }
          }
          if (c == 3) return;
        });
      }
    }
  }

  bgColor;
  clikedOption(opt) {
    // console.log(this.chatpersondata);

    if (opt == "block") {
      // alert("Blocked");
      this.alloptions.emit({ opt: "block", person: this.chatpersondata });
    } else if (opt == "clear") {
      //alert("Cleared");
      this.alloptions.emit({ opt: "clear", person: this.chatpersondata });
    } else if (opt == "exit") {
      //alert("Exit");
      this.alloptions.emit({ opt: "exit", person: this.chatpersondata });
    }
    //it will open the modal
    else if (opt == "alias") {
      this.alloptions.emit({ opt: "alias", person: this.chatpersondata });
    }
  }
}
