import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { SpaarksService } from "../../../spaarks.service";

@Component({
  selector: "app-chat-person-item",
  templateUrl: "./chat-person-item.component.html",
  styleUrls: ["./chat-person-item.component.scss"],
})
export class ChatPersonItemComponent implements OnInit, OnChanges {
  constructor(private spaarkService: SpaarksService) {}

  @Input("chatlistitem") user = undefined;
  @Input("activejid") activejid = "";
  fineArray = ["image", "video", "file", "audio", "text"];
  bgColor;
  isChat = false;

  ngOnInit(): void {
    this.isChat = document.URL.includes("chat");
    // console.log(this.user);
    this.user.connection = this.user.connection.filter((ele) => {
      return ele == "Market" || ele == "Announce" || ele == "Friends";
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
    // console.log("activejid " + this.activejid);
    // console.log("userjid " + this.user.jid);
  }
}
