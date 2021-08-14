import { Component, OnInit, Input } from "@angular/core";
import { SpaarksService } from "../../spaarks.service";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import * as moment from "moment";
import { ReportService } from "../../report.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ChatService } from "../../chat.service";
import { AllpurposeserviceService } from "src/app/allpurposeservice.service";
import { ReplaySubject, Subject } from "rxjs";

@Component({
  selector: "app-repliesitem",
  templateUrl: "./repliesitem.component.html",
  styleUrls: ["./repliesitem.component.scss"],
})
export class RepliesitemComponent implements OnInit {
  constructor(
    private spaarksService: SpaarksService,
    private allpurpose: AllpurposeserviceService,
    private _bottomSheet: MatBottomSheet,
    private reportService: ReportService,
    private _zone: MatSnackBar,
    private chat: ChatService
  ) {}

  listtorender = ["block", "report", "share", "list 1", "list 1", "list 1"];
  userName;
  finalAgo = "";
  canBlock;
  @Input("reply") reply = undefined;
  @Input("comment") comment = undefined;
  
  ngOnInit(): void {
    // if(this.reply.userId.name){
    this.spaarksService.receiveCreated(this.reply.createdAt);
    this.finalAgo = this.spaarksService.finalAgo;
    // }
    console.log(this.reply);
    this.userName = localStorage.getItem("name");
  }

  openOptions() {
    // this.spaarksService.arraytoOpenBottomsheet = this.listtorender;
    // this.spaarksService.showOptions.spaarkscardOptions = true;
    // this.spaarksService.showOptions.showSettings = false;
    // this._bottomSheet.open(AllpurposelistComponent);
  }

  onReport(id) {
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
      fromWhere: "reportReply",
    });
    let canReport = false;

    this.spaarksService.confirmResponse.subscribe((x: any) => {
      this.spaarksService.confirmResponse = new ReplaySubject(1);

      if (x.fromWhere == "reportReply") {
        canReport = x.status;
        if (canReport == false) return;

        this.reportService
          .reportComment(id, this.comment.featureName)
          .subscribe(
            (succ: any) => {
              // this.commentData.report.length = this.commentData.report.length + 1;
              this._zone.open(succ.message, "ok", {
                duration: 2000,
              });
              //console.log(succ);
            },
            (err) => {
              if (err.status === 409) {
                this._zone.open(err.error.message, "ok", {
                  duration: 2000,
                });
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

    // console.log('report', id);
  }

  onBlock(id, featureName, name, jid_main, jid_ano) {
    console.log(this.reply);
    console.log(this.reply.userId.jid_main);

    // if (this.languageCheck == 'hi') {
    //   let str = this.hindi.langs['Are you sure, you want to block this user?']
    //   this.canBlock = confirm(str);
    // } else {
    //   this.canBlock = confirm('Are you sure, you want to block this user?');
    // }

    // let canBlock = this.spaarksService.doConfirm('Are you sure?');

    this.allpurpose.triggerModal.next({
      type: "confirmModal",
      modal: true,
      modalMsg: "Are you sure?",
      fromWhere: "BlockReply",
    });
    let canReport = false;

    this.spaarksService.confirmResponse.subscribe((x: any) => {
      this.spaarksService.confirmResponse = new ReplaySubject(1);

      if (x.fromWhere == "BlockReply") {
        canReport = x.status;
        if (canReport == false) return;
        var blkBody = {
          userId: id,
          postId: this.comment.postId,
          featureName: featureName,
          jid: jid_main,
        };
        // console.log("blkBody",this.comment);
        if (name == "Anonymous") {
          blkBody.jid = jid_ano;
        } else {
          blkBody.jid = jid_main;
        }
        // console.log(blkBody);

        this.reportService.blockOther(blkBody).subscribe(
          (succ: any) => {
            // console.log(succ);
            if (succ.myjidtobeblock) {
              if (succ.myjidtobeblock == this.chat.cookieJid) {
                this.chat.blockUserUtil(succ.jid, 1);
              } else {
                this.chat.blockUserUtil(succ.jid, 2);
              }
            }

            // this.activeService.hideOnBlock = true;

            this.spaarksService.somethingWentWrong(succ.message);
          },
          (err) => {
            this.spaarksService.somethingWentWrong(err.error.message);
            // console.log('error while blocking user', err);
          }
        );
      } else {

      this.spaarksService.confirmResponse = new ReplaySubject(1);
      return;
      }
    });
    // console.log(this.commentData);

    // var body = { userId: id, postId: this.comment._id, featureName: featureName, jid: jid_main }
    // if (name == 'Anonymous') {
    //   body.jid = jid_ano
    // } else {
    //   body.jid = jid_main
    // }
    // // console.log(body);

    // this.reportService.blockOther(body).subscribe(
    //   (succ: any) => {
    //     if(succ.myjidtobeblock&&succ.jid){
    //       if(succ.myjidtobeblock==localStorage.getItem('jid')){

    //         this.chat.blockUserUtil(succ.jid, 1);
    //       }else{
    //         this.chat.blockUserUtil(succ.jid, 2);
    //       }
    //     }

    //     console.log('you have succesfully blocked this user');

    //     this.spaarksService.somethingWentWrong('Blocked Succesfully');
    //         this._zone.open(succ.message, 'ok', {
    //           duration: 2000,
    //         });
    //         //console.log(succ);

    //     // console.log(succ.val);
    //   },
    //   (err) => {
    //     console.log(err);
    //     this.spaarksService.somethingWentWrong('something went wrong');
    //   }
    // );
    // alert(featureName);
  }
}
