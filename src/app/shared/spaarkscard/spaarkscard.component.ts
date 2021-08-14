import {
  Component,
  OnInit,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
  ElementRef,
  Renderer2,
} from "@angular/core";
import { Router } from "@angular/router";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { PreferencesComponent } from "../../spaarks/preferences/preferences.component";
import { AllpurposelistComponent } from "../../spaarks/allpurposelist/allpurposelist.component";
import { SpaarksService } from "../../spaarks.service";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AllpurposeserviceService } from "../../allpurposeservice.service";
import * as _ from "lodash";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { ChatService } from "../../chat.service";
import * as moment from "moment";
import { ReplaySubject, Subject } from "rxjs";

@Component({
  selector: "app-spaarkscard",
  templateUrl: "./spaarkscard.component.html",
  styleUrls: ["./spaarkscard.component.scss"],
})
export class SpaarkscardComponent implements OnInit, OnChanges {
  constructor(
    private router: Router,
    private _bottomSheet: MatBottomSheet,
    private http: HttpClient,
    private _zone: MatSnackBar,
    private spaarksService: SpaarksService,
    private zone: MatSnackBar,
    private allpurposeService: AllpurposeserviceService,
    private chatService: ChatService,
    private renderer: Renderer2
  ) { }

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  @Input("featureName") featureName;
  @Input("openComments") openComments = false;
  @Input("fromShare") fromShare = false;
  @ViewChild("target", { static: false }) target: ElementRef;

  dateOfSpaark = Date.now();
  userId = 1;

  @Input("post") post = undefined;
  @Input("isexplore") isexplore = false;
  @Input("isDummyPost") isDummyPost;
  name;
  rating;

  @Output("coordinates") coordinates = new EventEmitter();
  @Output("clickedDesktop") clickedDesktop = new EventEmitter();
  @Input("scrolltoview") scrolltoview = null;
  @Output("outputmulti") outputmulti = new EventEmitter();

  lat;
  lon;
  imgSrc = "../../../assets/options.svg";
  option;
  showMsgModal = false;

  @Input("fromUserProfile") fromUserProfile = false;
  @Input("postIndex") postIndex = undefined;
  @Input("showComments") showCommentsBool = false;

  isDesk = true;
  reviews;
  totalLikes = 0;
  finalAgo;
  postlength;
  connection = [];
  alreadyReqsted: boolean;
  inRequestModal = false;
  postId1;
  userId1;
  inputColor;
  showMorediv = true;
  toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];
  mat = false;
  typeOfCat;
  inputTxt;
  toggleMenu = false;
  showComments = false
  listtorender = ["block", "report", "share", "list 1", "list 1", "list 1"];

  showReviews = false;
  loading = false;
  canDelete = true;
  commentsArray = [];
  sellerProf = true;

  @ViewChild("showmoredata") showmorecontent: ElementRef;
  shomorebollean = true;
  clicklike = false;
  isAuthed = this.spaarksService.authData.isAuthenticated;
  isbookmarked = false;
  onshare = false;

  ngOnChanges(changes: SimpleChanges) {
    if (this.post) {
      if (changes) {
        // console.log(changes);
        if (changes.post) {
          if (changes.post.currentValue) {
            this.postId1 = changes.post.currentValue.userId;
            this.spaarksService.receiveCreated(
              changes.post.currentValue.createdAt
            );
            this.finalAgo = this.spaarksService.finalAgo;
          }
        }
        if (changes.scrolltoview) {
          if (changes.scrolltoview.currentValue) {
            // console.log(changes.scrolltoview.currentValue)
            // console.log(this.target);
            if (
              String(changes.scrolltoview.currentValue.id) ==
              String(this.post._id)
            ) {
              // console.log(this.post._id);
              // console.log(changes.scrolltoview.currentValue.id);
              // console.log('got no target');
              // console.log(this.target);

              setTimeout(() => {
                if (this.target) {
                  // console.log('got target');
                  this.target.nativeElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }, 1000);
            }
          }
        }

        if (this.post.isProvider) {
          if (this.post.isProvider == true) {
            this.typeOfCat = "seller";
          }
        } else {
          this.typeOfCat = "buyer";
        }

        if (this.post.featureName == "greet") {
          this.typeOfCat = "greet";
        } else if (this.post.featureName == "showtime") {
          this.typeOfCat = "announce";
        }

        if (changes.post) {
          if (changes.post.currentValue.locationStatic.coordinates) {
            this.coordinates.emit(
              changes.post.currentValue.locationStatic.coordinates
            );
            this.lat = changes.post.currentValue.locationStatic.coordinates[1];
            this.lon = changes.post.currentValue.locationStatic.coordinates[0];
          }

          // console.log(this.lat, this.lon);
        }

        if (changes.openComments) {
          if (changes.openComments.currentValue == true) {
            // console.log(changes);

            this.changeComments({ change: changes.openComments.currentValue });
          }
        }

        if (changes.triggerClickOnmapCard) {
          if (changes.triggerClickOnmapCard.currentValue) {
            if (changes.triggerClickOnmapCard.currentValue == true) {
              this.clickedOnMobileCard();
            }
          }
        }
      }
      if (this.post.content) {
        this.postlength = this.post.content.split(/\r\n|\r|\n/).length;
      }
    }
  }

  ngOnInit(): void {

    this.mat = this.toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    });
    this.typeOfCat = this.featureName;

    this.onshare = this.spaarksService.onShared;
    let locUrll = document.URL;
    if (this.router.url.includes("profile")) {
      this.showMorediv = false;
    }

    if (this.router.url.includes("bookmark")) {
      this.isbookmarked = true;
    }

    this.inRequestModal = false;
    //  console.log("the post",this.post)
    if (window.innerWidth > 768) {
      this.toggleMenu = true;
    } else if (window.innerWidth <= 768) {
      this.toggleMenu = false;
    }

    if (window.innerWidth > 950) {
      this.isDesk = true;
    } else {
      this.isDesk = false;
    }

    // console.log(this.post);
    if (this.post && this.post.reviews && this.post.reviews[0]) {
      this.reviews = this.post.reviews[0].reviews;
    }

    if (this.post) {
      // console.log(this.post);
      this.clicklike = this.post.Iliked;
      let userid = localStorage.getItem("id");
      if (this.router.url.includes("bookmark")) {
        this.isbookmarked = true;
        this.clicklike = this.post.likes.includes(userid);
        // this.clicklike=this.post.likes.includes(this.userId1)
      } else {
        this.isbookmarked = this.post.bookmarked;
      }

      // if(this.post.likes.filter(name  => name == userid))
      // {
      //   this.clicklike=true;

      // }
      // else{
      //   this.clicklike=this.post.Iliked;
      // }

      this.spaarksService.receiveCreated(this.post.createdAt);
      if (this.post.isProvider) {
        if (this.post.isProvider == true) {
          this.typeOfCat = "seller";
        }
      } else {
        this.typeOfCat = "buyer";
      }

      if (this.post.featureName == "greet") {
        this.typeOfCat = "greet";
      } else if (this.post.featureName == "showtime") {
        this.typeOfCat = "announce";
      }

      if (this.post.seller) {
        if (this.post.seller.length > 0) {
          this.post.seller[0].market.categories.forEach((element, ind) => {
            // console.log(this.post.seller.market.categories.subCategory);
            // console.log(element);
            if (element.subCategory == this.post.subCategory) {
              // console.log(ind);
              // console.log(element);

              // console.log(element.rating);
              this.rating = element.rating;
            }
          });
        }
      }

      this.finalAgo = this.spaarksService.finalAgo;

      // console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu');

      // console.log(this.post);
    }
    if (this.post) {
      this.alreadyReqsted = this.post.requested;

      this.postId1 = this.post.userId;

      this.userId1 = localStorage.getItem("id");

      if (this.spaarksService.modalType == "RequestContainerModal") {
        this.inRequestModal = true;
      }
    }
    if (this.post) {
      if (this.post.condition == "Deleted") {
        //this.spaarksService.somethingWentWrong("Oops, the spaark is deleted!");
      }
    }
    if (this.showCommentsBool)
      this.changeComments();
  }

  whatsAppShare(post) {
    var content;
    var postSlogan = "";
    var postName = "";
    var tagName = "";
    var tagName1 = "";
    var postLink = `*Post Link:*%0a${post.uservisibility.share}%0a`;
    if (post) {
      if (!post.questionNo) {
        this.spaarksService.somethingWentWrong("Something went wrong");
        return;
      }

      if (post.content) {
        content = `*Content:* %0a${post.content}%0a%0a`;
      } else {
        content = "";
      }

      if (post.questionNo == 1 || post.questionNo == 8) {
        tagName = "";
      } else {
        if (!post.tags[0]) {
          tagName = "";
        } else {
          tagName = `%0a*${post.tags[0].name}*%0a`;
        }
      }

      if (!(post.questionNo == 5)) {
        tagName1 = "";
      } else {
        if (!post.tags[1]) {
          tagName1 = "";
        } else {
          tagName1 = `%0a*${post.tags[1].name}*%0a`;
        }
      }

      switch (post.questionNo) {
        case "1":
          console.log("case1");
          postName = `%0a*Name:* ${post.uservisibility.name.substr(
            0,
            15
          )}%0a%0a`;
          postSlogan =
            "Kuch bhi announce karein. Local area mein batayein. Free. Easy.";
          break;

        case "3":
          postName = `%0a*Name:* ${post.uservisibility.name.substr(
            0,
            15
          )}%0a%0a`;
          postSlogan =
            "Apni Services Dijiye. Apni income badaiye. Free to use.";
          break;

        case "4":
          postName = `%0a*Name:* ${post.uservisibility.name.substr(
            0,
            15
          )}%0a%0a`;
          postSlogan =
            "Kuch bhi sell karien. Apne aas paas. Ghar baithe. Easy.";
          break;

        case "5":
          postSlogan =
            "Apne aas pass, Service dene wale ko connect karien. Free. Easy.";
          break;

        case "6":
          postSlogan =
            "Vacancy ko post karien. Staff payein. Ghar baithe. Free to use.";
          break;

        case "7":
          postName = `%0a*Name:* ${post.uservisibility.name.substr(
            0,
            15
          )}%0a%0a`;
          postSlogan = "Job dhoondein. Naukari payein. Ghar baithe.Free. Easy.";
          break;

        case "8":
          postSlogan =
            "Kuch bhi announce karein. Local area mein batayein. Free. Easy.";
      }
    }

    try {
      var b =
        tagName +
        tagName1 +
        postName +
        content +
        postLink +
        "%0a*Download Spaarks App :* %0ahttps://cutt.ly/Spaarks-app %0a%0a" +
        postSlogan;
      let url = b;
      return url;
    } catch (err) { }
  }

  clickedWhatsappShare() {
    // console.log(this.post);
    if (!this.post.questionNo) {
      this.spaarksService.somethingWentWrong("Something went wrong");
      return;
    }
    let resultt = this.whatsAppShare(this.post);

    // console.log(resultt);
    var fakeLink = document.createElement("a");
    fakeLink.setAttribute(
      "href",
      "https://api.whatsapp.com/send?text=" + resultt
    );
    fakeLink.setAttribute("data-action", "share/whatsapp/share");
    fakeLink.setAttribute("target", "_blank");
    fakeLink.click();
  }

  clickedCookieOk() {
    // localStorage.setItem('cookieAccess', 'true');
    this.showMsgModal = false;
  }

  showMsg(eve) {
    // this.allpurposeService.triggerModal.next({
    //   type: "noBothCall",
    //   modal: true,

    // });

    this.showMsgModal = true;
    this.option = eve;
  }

  showCall(eve) {
    if (this.spaarksService.authData.isAuthenticated == true) {
      if (this.userId1 == this.postId1) {
        this.spaarksService.somethingWentWrong("It's your own Spaark.");
        return;
      }
    }

    this.allpurposeService.triggerModal.next({
      type: "noBothCall",
      modal: true,
    });
  }

  openGreetRequest() {
    console.log("i came here");
    if (this.spaarksService.authData.isAuthenticated == true) {
      if (this.userId1 == this.postId1) {
        this.spaarksService.somethingWentWrong("It's your own Spaark.");
        return;
      }

      console.log(this.post);
      if (this.post.featureName == "greet") {
        console.log("i came here");
        this.allpurposeService.getGreetConfirmation(this.post._id).subscribe(
          (success: any) => {
            console.log(success);
            if (success.alreadyRequestedFromOther == true) {
              this.spaarksService.somethingWentWrong(
                "You have already requested this user, please go to requests and check"
              );
            }
            if (
              success.isFriend == false &&
              success.alreadyRequestedFromOther == false && success.requested == false
            ) {
              this.allpurposeService.triggerModal.next({
                type: "openGreetRequest",
                modal: true,
                featureName: this.post.featureName,
                postData: this.post,
              });
            } else if (success.isFriend == true) {
              this.spaarksService.somethingWentWrong(
                " You are already connected, please go to chat and message"
              );
            } else if (success.requested) {
              this.spaarksService.somethingWentWrong(
                "You have already requested this user, please go to requests and check"
              );
            }
          },
          (err) => {
            console.log(err);
          }
        );
      }
      // this.allpurposeService.triggerModal.next('openGreetRequest');
      // this.allpurposeService.triggerModal.next({ type: 'openGreetRequest'})

      this.alreadyReqsted = this.post.requested;
    } else {
      this.spaarksService.triggerLogin();
    }
  }

  openChat(post) {
    // console.log(post);
    if (this.spaarksService.authData.isAuthenticated) {
      console.log(post);

      if (this.userId1 == this.postId1) {
        this.spaarksService.somethingWentWrong("It's your own Spaark.");
        return;
      }

      this.sendRequest();
    } else {
      this.spaarksService.triggerLogin();
    }
  }

  sendRequest() {
    this.spaarksService.clickedChatFromFeed = true;
    // this.newService.sendConnectionDetails(this.post._id,this.post.userId);
    // console.log(this.post)
    var id = localStorage.getItem("id");
    //alert(this.post.jid);
    if (!this.post.jid) {
      this.allpurposeService.triggerModal.next({
        type: "alertModal",
        modal: true,
        modalMsg: "something went wrong",
      });
      //this.spaarksService.showAlert("something went wrong");
      return;
    }
    if (this.post.jid.includes(id) || this.post.jid.length < id.length + 14) {
      //alert('yoop')
      return;
    }
    let jid = this.post.jid.split("@")[1];
    // if (jid != '192.168.0.254') {
    //   alert('yoox')
    //   return;
    // }

    // if (this.post.jid.indexOf('@') != 24 && this.post.jid.indexOf('@') != 26) {
    //   alert('yool')
    //   return
    // }
    // Changed
    if (this.post.greetRequest && this.post.featureName == "greet") {
      if (this.post.isFriend) {
        this.spaarksService.somethingWentWrong(
          "You already have this user in your list"
        );
        return;
      }

      if (this.post.greetRequest.length > 0) {
        let mjid = this.post.greetRequest[0].mjid;
        // console.log(mjid);

        if (mjid == 1) {
          this.chatService.reg_sendRequest(this.post);
          this.chatService.chatToOpen = { jid: this.post.jid, account: 1 };
          this.spaarksService.openChatVar = { jid: this.post.jid, ano: false };
          // console.log('in sendreq regular');
        } else if (mjid == 2) {
          this.chatService.ano_sendRequest(this.post);
          this.chatService.chatToOpen = { jid: this.post.jid, account: 2 };
          this.spaarksService.openChatVar = { jid: this.post.jid, ano: true };
          // console.log('in sendreq ano');
        }
        this.router.navigateByUrl("chat");
      }
    } else {
      this.spaarksService.bufferSendReqInfoBool = true;
      this.spaarksService.bufferSendReqInfo = this.post;
      //
      if (!this.post.jid) {
        return;
      }
      // console.log(jid);
      //console.log(this.Users);
      var currentuser = _.map(ChatService.myChats, (user) => {
        //console.log(user.jid);
        if (user.jid == this.post.jid) {
          return user;
        }
      });
      // console.log(currentuser);
      currentuser = _.without(currentuser, undefined);
      // console.log(currentuser);

      this.connection.push(this.post.OriginalName);
      // if (this.post.featureName == 'showtime') {
      //   this.connection.push('Announce');
      // }
      // else if (this.post.featureName == 'market') {
      //   this.connection.push('Market');
      // }

      //
      if (currentuser.length == 0) {
        //this.chat.addToBackendRoster(this.post.jid,this.post.uservisibility.name,this.post.uservisibility.profilePic);
        this.chatService.newInfoAddData = {
          jid: this.post.jid,
          name: this.post.uservisibility.name,
          profilePic: this.post.uservisibility.profilePic,
          featureName: this.post.OriginalName,
        };
        var a = {
          //userId to be get from info
          userId: this.post.jid.substring(0, this.post.jid.indexOf("@")),
          jid: this.post.jid,
          name: this.post.uservisibility.name,
          profilePic: this.post.uservisibility.profilePic,
          clearChat: -1,
          blocked: false,
          chatExit: false,
          canResume: false,
          connection: this.connection,
          blockedMe: false,
          chatExitMe: false,
          aid: "",
          msg: [],
          unread: 0,
          loaded: true,
          reachedEnd: false,
          isNew: true,
          isOtherAnonymous: false,
        };
        // console.log(a);
        ChatService.myChats.unshift(a);
      }
      // console.log(ChatService.myChats);
      this.chatService.ChatPopUp.next({ jid: this.post.jid, ano: false });
      this.spaarksService.openChatVar = { jid: this.post.jid, ano: false };
      this.chatService.chatToOpen = { jid: this.post.jid, account: 1 };

      this.router.navigateByUrl("chat");
    }
    // Changed
    //  console.log(this.post)
    this.allpurposeService.updateback(
      this.post._id,
      this.post.userId,
      this.post.uservisibility.profilePic,
      this.post.jid
    );
  }

  goToMap() {
    if (this.post.distance < 1) {
      return;
    }
    // console.log('inside goto map');
  //  if (this.allpurposeService.modalStatus == true) {
      //return;
   // } else {
      // console.log(this.post);
      this.spaarksService.currentPost = this.post;
      this.spaarksService.postForMap = true;
      this.spaarksService.idFromExplore = true;
      // this.spaarksService.exploretriggerSubj.next(this.post._id);
      this.router.navigateByUrl("explore");
   // }

    if (this.isDesk == true) {
      // console.log('clicked')
      this.clickedDesktop.emit({ post: this.post, index: this.postIndex });
    } else {
      // console.log('clicked')
      this.allpurposeService.triggerModal.next({
        type: "spaarkinmodal",
        post: this.post,
        modal: true,
      });
    }
  }

  clickedOnMobileCard() {
    if (this.isexplore == true) {
      if (this.isDesk == true) {
        this.clickedDesktop.emit({
          post: this.post,
          index: JSON.stringify(this.postIndex),
        });
      } else {
        this.allpurposeService.triggerModal.next({
          type: "spaarkinmodal",
          post: this.post,
          modal: true,
        });
      }
    }
  }

  checkupdatecomments() {
    this.spaarksService
      .getComments(this.post._id, this.post.featureName)
      .subscribe((succe: any) => {
        console.log(succe);
        this.loading = false;
        this.commentsArray = succe;
        this.post.subposts = succe;
      });
  }

  clickedAboveText(post) {
    if (!post.aboveCard.includes("View")) return;
    // console.log(post)

    this.router.navigate([
      "/profile/seller/",
      post.userId,
      { section: post.tags[0].name },
    ]);
  }

  onRemoveRequest(otherPostId) {
    // this.spaarksService.removeRequest(otherPostId).subscribe(
    //   (res: any) => {
    //     // this.spaarksService.somethingWentWrong(res.message);
    //     console.log(res);

    //     this.spaarksService.getPendingRequests();

    //   },
    //   err => {
    //     this.spaarksService.somethingWentWrong();
    //   }
    // )
    this.spaarksService.somethingWentWrong(
      "Your request is pending with the user."
    );

    this.alreadyReqsted = this.post.requested;
  }

  openOptions() {
    this.spaarksService.arraytoOpenBottomsheet = this.listtorender;
    this.spaarksService.showOptions.spaarkscardOptions = true;
    this.spaarksService.showOptions.showSettings = false;
    this._bottomSheet.open(AllpurposelistComponent);
  }

  onBlock(userId, featureName, postId, jid_main, jid_ano, name) {
    // console.log(this.post)
    // console.log(userId)
    // console.log(featureName)
    // console.log(postId)
    // console.log(jid_main)
    // console.log(jid_ano)
    // console.log(name)

    if (this.spaarksService.authData.isAuthenticated == false) {
      this.spaarksService.somethingWentWrong("Please login to block");
      this.spaarksService.triggerLogin();
    } else {
      name = name.replace(/\s\s+/g, " ");
      // if (this.LanguageCheck == 'hi') {
      //   let str = this.hindi.langs['BlockConfirm']
      //   this.canBlock = confirm(str);
      // } else {
      //   this.canBlock = confirm('Are you sure you want to block this user?');
      // }
      let canBlock = false;
      this.allpurposeService.triggerModal.next({
        type: "confirmModal",
        modal: true,
        modalMsg: "Are you sure, you want to block this user?",
        fromWhere: "Block",
      });
      this.spaarksService.confirmResponse.subscribe((x: any) => {
        if (x.fromWhere == "Block") {
          this.spaarksService.confirmResponse = new ReplaySubject(1);

          canBlock = x.status;
          if (canBlock == false) return;

          var blkBody = {
            userId: userId,
            featureName: featureName,
            postId: postId,
            jid: this.post.jid,
          };
          //need to change jai
          if (name == "Anonymous") {
            blkBody.jid = jid_ano;
          } else {
            blkBody.jid = this.post.jid;
          }
          // console.log(blkBody);
          var url = environment.baseUrl + "/api/v2.0/user/blockuser/post";
          // console.log('http options in the end is ')
          var obj;
          if (blkBody.featureName == "chat") {
            obj = {
              featureName: "chat",
              jid: blkBody.jid,
              userId: blkBody.userId,
              mjid: this.chatService.account,
            };
          } else {
            obj = {
              featureName: blkBody.featureName,
              postId: blkBody.postId,
              userId: blkBody.userId,
              jid: blkBody.jid,
            };
          }
          this.http.post(url, obj, { withCredentials: true }).subscribe(
            (succ: any) => {
              if (name == "Anonymous") {
                blkBody.jid = jid_ano;
              } else {
                blkBody.jid = jid_main;
              }
              if (this.post.featureName) {
                if (this.post.featureName == "greet") {
                  // console.log(this.post);
                  if (this.post.greetRequest[0].mjid) {
                    if (this.post.greetRequest[0].mjid == 2) {
                      this.chatService.blockUserUtil(blkBody.jid, 2);
                    } else {
                      this.chatService.blockUserUtil(blkBody.jid, 1);
                    }
                  }
                } else {
                  this.chatService.blockUserUtil(blkBody.jid, 1);
                }
              }

              // console.log('you have succesfully blocked this user');

              this._zone.open(succ.message, "ok", {
                duration: 2000,
              });
              this.outputmulti.emit({ type: "blocksuccess" });
            },
            (err) => {
              console.log(err, "i came");
              this.spaarksService.somethingWentWrong(err.error.message);
            }
          );
        } else {
          this.spaarksService.confirmResponse = new ReplaySubject(1);
          return;
        }
      });
    }

    //remove current marker
  }

  optionMenu() {
    this.trigger.openMenu();
  }

  deleteSpaark(id, fname, origname, post) {
    // this.canDelete = this.newService.doConfirm('Are you sure, you want to delete this Spaark?')
    // console.log(this.canDelete);
    this.allpurposeService.triggerModal.next({
      type: "confirmModal",
      modal: true,
      modalMsg: "Are you sure, you want to delete this spaark?",
      fromWhere: "Delete",
    });
    let canDelete = false;

    this.spaarksService.confirmResponse.subscribe((x: any) => {
      if (x.fromWhere == "Delete") {
        this.spaarksService.confirmResponse = new ReplaySubject(1);

        canDelete = x.status;
        if (canDelete) {
          this.spaarksService.deleteSpaark(fname, id).subscribe(
            (suc) => {
              // console.log(suc)
              this.spaarksService.somethingWentWrong("Spaark Deleted");
              if (post.photos.length) {
                this.spaarksService.photoDeleted.next(post.photos);
              }
              this.spaarksService.infoDeleted.next(id);

              this.post = null;
            },
            (err) => {
              this.spaarksService.somethingWentWrong("Something went Wrong");
            }
          );
        } else {
          return;
        }
      } else {

        this.spaarksService.confirmResponse = new ReplaySubject(1);
        return;

      }
    });

    // if (this.canDelete == false)
    //   return;

    // if (this.childState == 'Market') {
    //   if (this.newService.category == 'all' || this.newService.category == 'All' || this.newService.subCategory == '') {

    //     this.newService.routeControllerSubj.next('postList');
    //   }
    //   else {
    //     this.newService.routeControllerSubj.next('postList');
    //   }
    // }
    // else {
    //   this.newService.routeControllerSubj.next('info');
    // }
  }

  reportclicked(id, fname, origname) {
    if (this.spaarksService.authData.isAuthenticated == false) {
      this.spaarksService.somethingWentWrong("Please login to report");
      this.spaarksService.triggerLogin();
    } else {
      let canReport = false;
      this.allpurposeService.triggerModal.next({
        type: "confirmModal",
        modal: true,
        modalMsg: "Are you sure, you want to report this Spaark?",
        fromWhere: "Report",
      });
      this.spaarksService.confirmResponse.subscribe((x: any) => {
        if (x.fromWhere == "Report") {
          this.spaarksService.confirmResponse = new ReplaySubject(1);

          canReport = x.status;
          if (canReport == false) return;

          var data = {
            reason: "Reported users post",
            featureId: id,
            featureName: fname,
            originalName: origname,
          };

          // console.log('report', id);
          this.http
            .post(
              environment.baseUrl + "/api/v2.0/" + fname + "/report/post",
              data,
              { withCredentials: true }
            )
            .subscribe(
              (succ: any) => {
                // console.log(succ);

                // this._zone.open(succ.message, 'ok', {
                //   duration: 2000,
                // });
                this.spaarksService.somethingWentWrong(succ.message);
              },
              (err) => {
                this.spaarksService.somethingWentWrong(err.error.message);
                if (err.status === 409) {
                  // this.allpurposeService.triggerModal.next({ type: 'login', modal: true })
                }
                // console.log('error while reporting post', err);
              }
            );
        } else {
          this.spaarksService.confirmResponse = new ReplaySubject(1);
          return;
        }
      });
    }
  }

  goToSellerProf() {
    this.router.navigateByUrl("profile");
  }

  changeComments(opt?) {
    this.showReviews = false;
    // console.log('change')
    if (opt) {
      if (opt.change == true) {
        this.showComments = true;
        this.loading = true;
        if (this.showComments) {
          try {
            this.spaarksService
              .getComments(this.post._id, this.post.featureName)
              .subscribe((succe: any) => {
                // console.log(succe)
                this.loading = false;
                this.commentsArray = succe;
              });
          } catch {
            (err) => {
              this.spaarksService.catchInternalErrs(err);
            };
          }
        }
      }
    } else {
      this.showComments = !this.showComments;
      this.loading = true;
      if (!this.showComments) {
        return;
      }
      try {
        this.spaarksService
          .getComments(this.post._id, this.post.featureName)
          .subscribe((succe: any) => {
            // console.log(succe)
            this.loading = false;
            this.commentsArray = succe;
          });
      } catch {
        (err) => {
          this.spaarksService.catchInternalErrs(err);
        };
      }
    }
  }

  openReviews() {
    this.showComments = false;
    console.log("clicked");
    //this.showReviews = !this.showReviews;
    this.allpurposeService.triggerModal.next({
      type: "reviewsmodal",
      post: this.reviews,
      modal: true,
    });
  }

  copyText(val: any) {
    this.allpurposeService.triggerModal.next({
      type: "clickedShare",
      modal: true,
      modalPost: val,
    });
  }

  toggleBookmark(postId) {
    if (this.isAuthed) {
      if (this.router.url.includes("bookmark")) {
        this.spaarksService
          .removepostbookmark(postId)
          .subscribe((successcallBack) => {
            console.log(successcallBack);
          });
        this.spaarksService.somethingWentWrong("Bookmark removed successfully");
        this.spaarksService.removebookmarkPost.next(this.post);
        this.post = "";
      } else {
        if (!this.isbookmarked) {
          this.isbookmarked = !this.isbookmarked;
          this.spaarksService
            .bookmarkpost(postId)
            .subscribe((succescallBack) => {
              console.log(succescallBack);
              this.spaarksService.somethingWentWrong("Bookmarked successfully");
            });
        } else {
          this.spaarksService
            .removepostbookmark(postId)
            .subscribe((successcallBack) => {
              console.log(successcallBack);
              this.spaarksService.somethingWentWrong(
                "Bookmark removed successfully"
              );
            });

          this.isbookmarked = !this.isbookmarked;
        }
      }
    } else {
      this.spaarksService.somethingWentWrong("Please login to bookmark post");
      // this.router.navigateByUrl('home/profile');
      this.spaarksService.triggerLogin();
    }
  }

  callClicked() {
    if (this.spaarksService.authData.isAuthenticated == true) {
      if (this.userId1 == this.postId1) {
        this.spaarksService.somethingWentWrong("It's your own Spaark.");
        return;
      }
    }
    if (this.post.mobileNumber != "NA" || this.post.uservisibility.phoneCall) {
      this.makeCall(this.post);
      return;
    }
    if (
      this.post.uservisibility.phoneCall == false &&
      this.post.mobileNumber == "NA"
    ) {
      this.showCall("Call");
      return;
    }
  }

  chatClicked() {
    if (this.typeOfCat == "greet") {
      this.openGreetRequest();
      return;
    }
    if (
      this.typeOfCat != "greet" &&
      this.post.uservisibility.chat == true &&
      !this.alreadyReqsted
    ) {
      this.openChat(this.post);
      return;
    }
    if (
      this.typeOfCat != "greet" &&
      this.post.uservisibility.chat == false &&
      !this.alreadyReqsted
    ) {
      this.showMsg("Chat");
      return;
    }
  }

  makeCall(pos) {
    if (this.spaarksService.authData.isAuthenticated == true) {
      if (this.userId1 == this.postId1) {
        this.spaarksService.somethingWentWrong("It's your own Spaark.");
        return;
      }
    }
    if (this.post.uservisibility.phoneCall && this.post.mobileNumber != "NA") {
      this.allpurposeService.triggerModal.next({
        type: "openBothCall",
        modal: true,
        phoneNumber: pos.mobileNumber,
      });
    } else if (this.post.uservisibility.phoneCall) {
      this.allpurposeService.triggerModal.next({
        type: "openSpaarksCall",
        modal: true,
        phoneNumber: pos.mobileNumber,
      });
    } else {
      this.allpurposeService.triggerModal.next({
        type: "onlyPhoneCall",
        modal: true,
        phoneNumber: pos.mobileNumber,
      });
    }
  }

  showMore() {
    if (this.post.content) {
      if (
        
        this.post.content.length > 200
      ) {
        this.renderer.removeClass(
          this.showmorecontent.nativeElement,
          "showmore"
        );
        this.shomorebollean = false;
      }
    }
  }

  showLess() {
    if (this.post.content) {
      this.renderer.addClass(this.showmorecontent.nativeElement, "showmore");
      this.shomorebollean = true;
    }
  }

  clickedLike() {
    if (this.isAuthed) {
      // console.log(this.post);
      this.clicklike = !this.clicklike;
      if (this.clicklike) {
        this.post.likes.length += 1;
      } else {
        this.post.likes.length -= 1;
      }
      this.spaarksService.postLiked(this.post._id).subscribe((x) => {
        // console.log(x);
      });
    } else {
      this.spaarksService.somethingWentWrong("Please login to like post");
      // this.router.navigateByUrl('home/profile');
      this.spaarksService.triggerLogin();
    }
  }

  clickedAnonymous() {
    this.spaarksService.somethingWentWrong(
      "No profile for Anonymous and Makefriends"
    );
  }

  showDirections(lat, long) {
    // alert("1");
    this.spaarksService.exploreDrawLine.next({
      lat: lat,
      long: long,
      ...this.post,
    });
  }

  clickedPill(eve) {
    var obj;

    var urlIL = document.URL;
    // console.log(eve);

    if (
      this.typeOfCat == "seller" &&
      eve.category == "" &&
      eve.subCategory == "" &&
      eve.questionNo != "7"
    )
      return;
    if (urlIL.includes("explore")) {
      console.log("explore includes");
      if (eve.questionNo == "7") {
        obj = {
          category: "Work",
          subCategory: "Work",
          subCategoryFinal: "Work",
        };
      } else
        obj = {
          category: eve.category,
          subCategory: eve.subCategory,
          subCategoryFinal: eve.category,
        };
      console.log(obj);
      this.spaarksService.sendToExplore.next(obj);
    } else {
      console.log("explore not includes");
      if (eve.questionNo == "7") {
        obj = {
          category: "Work",
          subCategory: "Work",
          subCategoryFinal: "Work",
        };
      } else
        obj = {
          preview: eve.subCategory,
          category: eve.category,
          subCategory: eve.subCategory,
          subCategoryFinal: eve.subCategory,
        };
      console.log(obj);
      this.spaarksService.clickedPillFormCard.next(obj);
    }
  }
}

// postHover(post){
//   console.log(post);
// }
