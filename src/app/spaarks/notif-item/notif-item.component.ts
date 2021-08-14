import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { SpaarksService } from "src/app/spaarks.service";

@Component({
  selector: "app-notif-item",
  templateUrl: "./notif-item.component.html",
  styleUrls: ["./notif-item.component.scss"],
})
export class NotifItemComponent implements OnInit {
  @Input("notifData") notifData: any;
  @Input("notifIndex") notifIndex: any;
  title;
  relation;
  icon;
  content;
  date;
  textToshow = "You have a notification";
  textHeading = "New Notification";
  isDeleting = false;
  @Output() notificationOpen = new EventEmitter();
  @Output() notificationDelete = new EventEmitter<string>();
  iconsArr = [
    "assets/qrcode.svg",
    "assets/report1.svg",
    "assets/request.svg",
    "assets/comment.svg",
    "assets/payment.png",
  ];

  constructor(private spaarkService: SpaarksService) {
    // console.log("Createdddd");
  }

  ngOnInit(): void {
    console.log("hihhihii");
    console.log(this.notifData);
    this.title = this.notifData.title;
    this.relation = this.notifData.relation;
    // this.icon =this.notifData.icon;
    this.content = this.notifData.content;
    this.date = this.notifData.createdAt;
    if (this.relation == "greet") {
      this.icon = this.iconsArr[2];
      this.textHeading = "New friend request";
      this.textToshow =
        this.notifData.subtitle + " has sent you a connection request.";
    }
    else if (this.relation == "post" && this.title == "Spaark Reported") {
      this.textHeading = this.relation;
      this.content = "click to view";
      this.icon = this.notifData.icon;
    }

    else if (this.relation == "post" && this.title == "New Comment") {
      this.textHeading = "New Comment";
      this.icon = this.iconsArr[3];
      if (this.notifData.subtitle) {
        if (this.notifData.subtitle.length > 15) {
          this.textToshow =
            this.notifData.subtitle.slice(0, 10) +
            " has commented on your post.";
        } else {
          this.textToshow =
            this.notifData.subtitle + " has commented on your post.";
        }
      } else {
        this.textToshow = "Someone has commented on your post.";
      }
    } else if (this.relation == "post" && this.title != "New Comment") {
      this.textToshow = this.content;
      this.textHeading = this.title;

      this.icon = this.iconsArr[1];
    } else if (this.relation == "ticket") {
      this.textHeading = this.title;
      this.textToshow = this.content;
      this.icon = this.notifData.icon;
    } else if ((this, this.relation == "Partner")) {
      this.textHeading = this.title;
      this.textToshow = this.content;
      this.icon = this.notifData.icon;
    }
    else if (this.relation == "login") {
      this.icon = this.iconsArr[0];
      this.textToshow = "You have active web login";
      this.textHeading = "Web login";
    }
    else if (this.relation == "Comment Reported") {
      this.textHeading = this.relation;
      this.textToshow = "Your comment has been reported";
    }
    else if (this.relation == "Reward") {
      this.textHeading = this.title;
      this.textToshow = this.content;
      this.icon = this.notifData.icon;
    }
    else {
      //this data comed from backend for different notifications, for some notification
      //we are assigning them to ui
      this.textHeading = this.title;
      this.textToshow = this.content;
      this.icon = this.notifData.icon;
    }
  }

  deleteNotification(data) {
    console.log("delete Notification");
    this.isDeleting = true;
    this.notificationDelete.emit(data);
  }

  openNotification(data) {
    if (data.relation == "ticket" && data.featureName == "") {
      this.spaarkService.somethingWentWrong(
        "Redirection Enabled for newly created tickets."
      );
      return;
    } else if (data.relation == "Partner") {
      this.spaarkService.somethingWentWrong(data.content);
      return;
    } else if (this.isDeleting) this.isDeleting = false;
    else this.notificationOpen.emit(data);
  }
}
