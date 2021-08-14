import { AllpurposeserviceService } from "../../allpurposeservice.service";
import { SpaarksService } from "../../spaarks.service";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Renderer2,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { CompileShallowModuleMetadata } from "@angular/compiler";
import { Router } from "@angular/router";
import { ChatService } from "../../chat.service";
import { mergeMap, delay } from "rxjs/operators";

@Component({
  selector: "app-requests",
  templateUrl: "./requests.component.html",
  styleUrls: ["./requests.component.scss"],
})
export class RequestsComponent implements OnInit {
  @Input("requestData") request;
  @Input("fromSentRequest") fromSentRequest = false;
  @Input("otherRequests") otherRequests = false;
  @Input("name") name = "John";
  @Input("showfooter") showfooter = true;
  @Input("description") description =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem natus dicta voluptate molestiaemaxime sed aliquam modi ipsa, ex iure provident minima expedita a eum! Debitis labore maiores velit   quas!";
  @Input("reqPill") pillType;
  @Input("fromFriendRequest") fromFriendRequest = false;
  constructor(
    private spaarks: SpaarksService,
    private router: Router,
    private chat: ChatService,
    private allPurposeService: AllpurposeserviceService,
    private renderer: Renderer2
  ) {}

  funn = new Date();
  totalChars;
  pendingRequests;
  showDate = true;
  postPhoto = "";
  postName = "";
  @ViewChild("showmoredata") showmorecontent: ElementRef;
  shomorebollean = true;
  @Output("allSentRequests") allSentRequests = new EventEmitter();

  ngOnInit(): void {
    console.log(this.request);

    this.allPurposeService.multiPurposeSubj.subscribe((succ: any) => {
      // console.log(succ);

      //confirmrefresh for accepting requests
      if (succ.type == "confirmrefresh") {
        //other user's data
        console.log(this.request);

        if (
          succ.data.jid == this.request.jid &&
          this.request.mjid == succ.data.mjid
        ) {
          if (succ.data.mjid) {
            // if (succ.data.mjid == 1) {
            this.chat.reg_sendRequestIq(succ.data.mjid, "Make Friends");

            // }
            //anonymous
            // else if (succ.data.mjid == 2) {
            // this.chat.ano_sendRequestIq(succ.data.jid);

            // }
            setTimeout(() => {
              // this.chat.chatToOpen = { jid: succ.data.jid, account: succ.data.mjid }
              this.spaarks.openChatVar = { ano: false, jid: succ.data.jid };
              console.log(this.chat.chatToOpen);

              this.router.navigate(["/chat"]);
            }, 500);
          }
        }
      }

      if (succ.type == "refreshrequests") {
        this.request = "";
      }
    });

    this.postPhoto = this.request.postPhoto;
    this.postName = this.request.postName;
    if (this.fromSentRequest) {
      if (this.request.greetRequest)
        this.postPhoto = this.request.greetRequest[0].uservisibility.profilePic;
      else this.postPhoto = "assets/profile.svg";
    }

    if (window.innerWidth < 1080) {
      this.totalChars = 28;
    } else if (window.innerWidth >= 1301 && window.innerWidth <= 1599) {
      this.totalChars = 37;
    } else if (window.innerWidth < 1301) {
      this.totalChars = 25;
    } else {
      this.totalChars = 44;
    }
    if (window.innerWidth < 1740) {
      this.showDate = false;
    }
  }

  showMore() {
    if (this.request.content) {
      // if (this.request.content.split(/\r\n|\r|\n/).length > 5 || this.request.content.length > 50) {
      // }
      this.renderer.removeClass(this.showmorecontent.nativeElement, "showmore");
    }
    this.shomorebollean = false;
  }

  showLess() {
    if (this.request.content) {
      this.renderer.addClass(this.showmorecontent.nativeElement, "showmore");
    }
    this.shomorebollean = true;
  }

  confirmRequest(pending?) {
    if (pending) {
      if (pending == "pending") {
        this.spaarks.somethingWentWrong(
          "Please wait for user to accept your requests"
        );
        return;
      }

      if (pending == "self") {
        console.log(this.request);

        this.allPurposeService.triggerModal.next({
          type: "RequestContainerModal",
          request: this.request,
          modal: true,
          isMine: true,
        });
      }
    } else {
      console.log(this.request);

      this.allPurposeService.triggerModal.next({
        type: "RequestContainerModal",
        request: this.request,
        modal: true,
        isMine: false,
      });
    }

    //  this.spaarks.somethingWentWrong("Request has been Accepted");
  }

  ignoreRequest(eve) {
    this.spaarks
      .ignoreRequest(eve)
      .pipe(
        mergeMap((succ: any) => {
          return this.spaarks.getPendingRequests();
        })
      )
      .subscribe((succ2) => {
        this.spaarks.getRequestsSub.next(succ2);
      }),
      (err) => {
        this.spaarks.somethingWentWrong(err.error.message);
      };
  }

  deleteRequest(otherPostId) {
    this.spaarks
      .removeRequest(otherPostId)
      .pipe(
        mergeMap((succ: any) => {
          console.log(succ);
          return this.spaarks.getMyRequests();
        }),
        delay(4000)
      )
      .subscribe((succ2: any) => {
        this.allSentRequests.emit({
          dat: succ2.message,
          type: "deleterequest",
        });
        this.spaarks.somethingWentWrong("Request has been deleted");
      }),
      (err) => {
        this.spaarks.somethingWentWrong(err.error.message);
      };

    // this.spaarks.removeRequest(otherPostId).subscribe(succ=>{
    //   console.log(succ);
    //   this.spaarks.getMyRequests().pipe(delay(4000)).subscribe((succ2:any)=>{
    //     this.allSentRequests.emit({ dat: succ2.message, type: 'deleterequest' });
    //     this.spaarks.somethingWentWrong("Request has been deleted");

    //   },(err)=>{
    //     this.spaarks.somethingWentWrong(err.error.message);
    //   })

    // })
  }
}
