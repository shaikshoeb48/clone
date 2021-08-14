import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { SpaarksService } from "../../spaarks.service";
import * as moment from "moment";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { ReportService } from "../../report.service";
import { ChatService } from "../../chat.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatMenuTrigger } from "@angular/material/menu";
import { AllpurposeserviceService } from "src/app/allpurposeservice.service";
import { ReplaySubject, Subject } from "rxjs";

@Component({
  selector: "app-commentitem",
  templateUrl: "./commentitem.component.html",
  styleUrls: ["./commentitem.component.scss"],
})
export class CommentitemComponent implements OnInit {
  constructor(
    private spaarksService: SpaarksService,
    private _bottomSheet: MatBottomSheet,
    private reportService: ReportService,
    private _zone: MatSnackBar,
    private chatService: ChatService,
    private allpurpose: AllpurposeserviceService
  ) {}

  @Input("post") post = undefined;
  @Input("comment") comment = undefined;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  postId;
  userId;
  showReplies = false;
  languageCheck = localStorage.getItem("language");
  canBlock = false;

  @ViewChild("commentcontent", { static: false }) commentcontent: ElementRef;

  showmoreorless = "more";
  listtorender = ["block", "report", "share", "list 1", "list 1", "list 1"];

  ngOnInit(): void {
    this.postId = this.comment.userId._id;
    this.userId = localStorage.getItem("id");

    this.spaarksService.receiveCreated(this.comment.createdAt);
    this.finalAgo = this.spaarksService.finalAgo;
    console.log(this.post);
  }

  showRepliescontainer() {
    this.showReplies = !this.showReplies;
    console.log(this.comment);
    // if (this.showReplies == true) {
    //   this.spaarksService.getReplies(this.comment._id, this.comment.featureName).subscribe((suc) => {
    //     console.log(suc)
    //     // this.co
    //   })
    // }
  }

  openFullScreen(image) {
    this.spaarksService.sendSinglePhoto(image);
  }

  finalAgo = "";

  reportComment(id) {
    // if (this.languageCheck == 'hi') {
    //   let str = this.hindi.langs['Are you sure you want to report?']
    //   this.canReport = confirm(str);
    // } else {
    //   this.canReport = confirm('Are you sure you want to report?');
    // }

    this.allpurpose.triggerModal.next({
      type: "confirmModal",
      modal: true,
      modalMsg: "Are you sure?",
      fromWhere: "reportComment",
    });
    let canReport = false;

    this.spaarksService.confirmResponse.subscribe((x: any) => {
      if (x.fromWhere == "reportComment") {
        this.spaarksService.confirmResponse = new ReplaySubject(1);

        canReport = x.status;
        if (canReport == false) return;

        console.log("id of report post is", id);
        console.log(this.comment);
        console.log(this.post.featureName);

        this.reportService
          .reportSubpost(id, this.comment.featureName)
          .subscribe(
            (succ: any) => {
              // this.comment.report.length = this.post.report.length + 1;

              this.spaarksService.somethingWentWrong(succ.message);
            },
            (err) => {
              this.spaarksService.somethingWentWrong(err.error.message);
              if (err.status === 409) {
              }
              console.log("error while reporting post", err);
            }
          );
      } else
      {
        this.spaarksService.confirmResponse = new ReplaySubject(1);
        return;
      } 
    });
    // let canReport = this.spaarksService.doConfirm('Are you sure?');

    // alert(i)
  }

  toggleShow() {
    console.log(this.commentcontent.nativeElement);
    if (this.showmoreorless == "more") {
      this.showmoreorless = "less";
    } else {
      this.showmoreorless = "more";
    }
  }

  blockComment(id, featureName, name, jid_main, jid_ano) {
    console.log(this.comment);
    if (!this.post) {
      return;
    }
    // if (this.languageCheck == 'hi') {
    //   this.dummyStr = this.hindi.langs['BlockConfirm']
    //   // this.canBlock = confirm(str);
    // } else if(this.languageCheck=="te"){
    //   this.dummyStr=this.telgu.langs["Block Alert"]
    //   //
    // }else{
    //   this.canBlock = confirm('Are you sure you want to block this user?');
    // }

    // this.canBlock = confirm(this.dummyStr);

    this.allpurpose.triggerModal.next({
      type: "confirmModal",
      modal: true,
      modalMsg: "Are you sure?",
      fromWhere: "blockComment",
    });
    let canBlock = false;

    this.spaarksService.confirmResponse.subscribe((x: any) => {
      if (x.fromWhere == "blockComment") {
        this.spaarksService.confirmResponse = new ReplaySubject(1);

        canBlock = x.status;
        if (canBlock == false) return;

        var blkBody = {
          userId: id,
          postId: this.post._id,
          featureName: this.post.featureName,
          jid: jid_main,
        };
        console.log("blkBody", blkBody);
        if (name == "Anonymous") {
          blkBody.jid = jid_ano;
        } else {
          blkBody.jid = jid_main;
        }
        console.log(blkBody);

        this.reportService.blockOther(blkBody).subscribe(
          (succ: any) => {
            console.log(succ);
            if (succ.myjidtobeblock) {
              if (succ.myjidtobeblock == this.chatService.cookieJid) {
                this.chatService.blockUserUtil(succ.jid, 1);
              } else {
                this.chatService.blockUserUtil(succ.jid, 2);
              }
            }

            // this.activeService.hideOnBlock = true;

            this.spaarksService.somethingWentWrong(succ.message);
          },
          (err) => {
            this.spaarksService.somethingWentWrong(err.error.message);
            console.log("error while blocking user", err);
          }
        );
      } else {
        this.spaarksService.confirmResponse = new ReplaySubject(1);

        return;
      }
    });
    //this.canBlock = confirm('Are you sure you want to block this user?');

    // const postid = this.activeService.postId;
    // alert(featureName);
    // featureName = this.activeService.serviceState;

    //console.log('id of block post is',id);
    // console.log(this.post);

    // alert(featureName);
  }

  openOptions() {
    // this.trigger.openMenu();
  }
}
