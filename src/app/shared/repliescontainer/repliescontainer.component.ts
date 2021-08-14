import { Component, OnInit, Input } from "@angular/core";
import { SpaarksService } from "../../spaarks.service";

@Component({
  selector: "app-repliescontainer",
  templateUrl: "./repliescontainer.component.html",
  styleUrls: ["./repliescontainer.component.scss"],
})
export class RepliescontainerComponent implements OnInit {
  constructor(private SpaarksService: SpaarksService) {}

  @Input("replies") replies = [];
  @Input("comment") comment;
  @Input("post") post;
  description = "";
  isAuthed = false;

  ngOnInit(): void {
    this.isAuthed = this.SpaarksService.authData.isAuthenticated;
  }

  update(eve) {
    this.description = eve.target.value;
  }

  createReply() {
    console.log(this.description);
    if (this.description == "" || this.description.match(/^\s*$/)) {
      this.SpaarksService.somethingWentWrong("Please write something");
      this.description = "";
      return;
    }
    console.log(this.comment);
    this.SpaarksService.createReply(
      this.description,
      this.comment._id,
      this.post.featureName
    ).subscribe((suc) => {
      console.log(suc);
      this.description = "";
      this.replies = suc;
    });
  }
}
