import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
  SimpleChanges,
  ViewChildren,
  QueryList,
} from "@angular/core";
import { ChatService } from "../../../chat.service";
import * as _ from "lodash";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AudioService } from "../audio.service";
import { SpaarksService } from "../../../spaarks.service";
import { trigger, transition, style, animate } from "@angular/animations";
import { AllpurposeserviceService } from "src/app/allpurposeservice.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-chat-person-specific",
  templateUrl: "./chat-person-specific.component.html",
  styleUrls: ["./chat-person-specific.component.scss"],

  animations: [
    trigger("inOutAnimation", [
      transition(":enter", [
        style({ height: 0, opacity: 0 }),
        animate(".5s ease-out", style({ height: 65, opacity: 1 })),
      ]),
      transition(":leave", [
        style({ height: 100, opacity: 1 }),
        animate(".5s ease-in", style({ height: 0, opacity: 0 })),
      ]),
    ]),
    trigger("inOutAnimation2", [
      transition(":enter", [
        style({ height: 0, opacity: 0 }),
        animate(".5s ease-out", style({ height: 70, opacity: 1 })),
      ]),
      transition(":leave", [
        style({ height: 100, opacity: 1 }),
        animate(".5s ease-in", style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class ChatPersonSpecificComponent implements OnInit {
  constructor(
    private chatService: ChatService,
    private router: Router,
    private allpurposeService: AllpurposeserviceService,
    public _zone: MatSnackBar,
    private audio: AudioService,
    private renderer: Renderer2,
    private spaarksService: SpaarksService
  ) {}

  @Input() active;
  @Input() activeoptions;
  @Input() stoprecord;

  text_message = "";
  @Input("forwardfrommobile") forwardfrommobile = "";
  normaluser;
  anouser;
  rowcount = 1;
  internetconnection;

  @Output("multioutput") multioutput = new EventEmitter();
  @Input("chatpersondata") chatpersondata = undefined;
  @Input("multiinput") multiinput = undefined;
  previousScrl;
  previousmsg;

  @Input() account;
  @Input() stopRecordaudio;
  @ViewChild("filepicker") filepicker: ElementRef;
  @Output() isAno = new EventEmitter();
  @Output() stopre = new EventEmitter();
  @Output() endRecoed = new EventEmitter();
  @ViewChild("content", { static: true }) content: ElementRef;

  addfile_;
  screenwidth = window.innerWidth;
  addF_src;
  selectEmoji = false;

  emoji_src = "../../../assets/chat/Frame-2.svg";
  @ViewChild("filee") filee: ElementRef;
  @ViewChild("fileee") fileee: ElementRef;

  isMicEnabled: boolean;
  @Input() isBlocked = false;
  exitChat;
  exitChatMe;
  forwardNumber = 0;
  listFinalForward = [];

  resumeOpt = false;

  blocked;
  blockedme;

  allOptions = [
    { name: "Clear", src: "../../../assets/faqs.svg" },
    { name: "Block", src: "../../../assets/help.svg" },
    { name: "Exit", src: "../../../assets/settings.svg" },
    { name: "Add Nickname", src: "../../../assets/settings.svg" },
  ];

  listToForward = [];
  newmessageCount = 0;
  showForwardForMobile = false;
  verticalScroll;
  showArrow = false;

  scrollableElement = document.getElementById("scroller"); //document.getElementById('scrollableElement');
  scrollDir = null;
  time = null;
  recording = false;
  url = null;

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
    if (changes) {
      if (changes.forwardfrommobile) {
        if (changes.forwardfrommobile.currentValue) {
          if (changes.forwardfrommobile.currentValue == "forwardfrommobile") {
            this.startForwardProcess();
          }
        }
      }

      if (changes.chatpersondata) {
        if (changes.chatpersondata.currentValue) {
          this.scrollToBottom();

          this.exitChat = changes.chatpersondata.currentValue.chatExit;
          this.exitChatMe = changes.chatpersondata.currentValue.chatExitMe;
          this.blocked = changes.chatpersondata.currentValue.blocked;
          this.blockedme = changes.chatpersondata.currentValue.blockedMe;
          if (this.addfile_) {
            this.addfile_ = !this.addfile_;
          }
        }
      }
    }
  }

  ngOnInit(): void {
    this.screenwidth = window.innerWidth;
    ChatService.sortAtSite.subscribe((succe) => {
      // console.log(succe);
      if (succe.key) {
        if (succe.key == "minimized") {
          if (succe.minimizeAcc == 1) {
            if (succe.minimizeAcc == 1) {
              _.map(ChatService.myChats, (user) => {
                if (user.jid == succe.minimizeJid) {
                  // console.log(this.active);
                  // console.log("setting user to");
                  // console.log(user);
                  this.exitChat = user.chatExit;
                  this.exitChatMe = user.chatExitMe;
                  this.blocked = user.blocked;
                  this.blockedme = user.blockedMe;
                  // this.succecontent = succe.content;
                  if (succe.key == "canresume") {
                    this.resumeOpt = true;
                  }
                  //console.log(user);
                }
              });
            }
          } else {
            _.map(ChatService.myAnoChats, (user) => {
              if (user.jid == succe.minimizeJid) {
                // console.log(this.active);
                // console.log("setting user to");
                // console.log(user);
                this.exitChat = user.chatExit;
                // this.succecontent = succe.content;
                this.exitChatMe = user.chatExitMe;
                this.blocked = user.blocked;
                this.blockedme = user.blockedMe;
                if (succe.key == "canresume") {
                  this.resumeOpt = true;
                }
                //console.log(user);
              }
            });
          }
        }

        if (
          succe.key == "exit" ||
          succe.key == "exitme" ||
          succe.key == "resume" ||
          succe.key == "resumeme" ||
          succe.key == "canresume" ||
          succe.key == "unblocked" ||
          succe.key == "unblockedme" ||
          succe.key == "block" ||
          succe.key == "blockedme" ||
          succe.key == "blockedme" ||
          succe.key == "blocked" ||
          succe.key == "unblock"
        ) {
          this.addfile_ = false;
          this.selectEmoji = false;
          if (this.account == 1) {
            // console.log("succ.ccount and this.account is 1");
            var indd;

            //     ChatService.myChats.forEach((val,ind)=>{
            //       if(val.jid==this.active){
            //         //console.log(val);
            //         indd = ind;

            //     this.exitChat = ChatService.myChats[indd].chatExit;
            //     this.exitChatMe = ChatService.myChats[indd].chatExitMe;
            //     this.blocked = ChatService.myChats[indd].blocked;
            //     this.blockedme = ChatService.myChats[indd].blockedMe;
            //     if(succe.key=='canresume'){
            //       this.resumeOpt=true;

            //     }
            //     console.log(ChatService.myChats[indd])
            //   }
            // })

            _.map(ChatService.myChats, (user) => {
              if (user.jid == succe.content && succe.content == this.active) {
                try {
                  this.endRec(0);
                } catch {}
                // console.log(this.active);
                // console.log("setting user to");
                // console.log(user);
                this.exitChat = user.chatExit;
                this.exitChatMe = user.chatExitMe;
                this.blocked = user.blocked;
                this.blockedme = user.blockedMe;
                // this.succecontent = succe.content;
                if (succe.key == "canresume") {
                  this.resumeOpt = true;
                }

                //console.log(user);
              }
            });

            // _.map(ChatService.myAnoChats, (user) => {
            //   if((user.jid == succe.content)&&(succe.content==this.active)) {
            //     console.log(this.active)
            //     console.log('setting user to')
            //     console.log(user)
            //     this.succecontent = succe.content;
            //     this.exitChat = user.chatExit;
            //     this.exitChatMe = user.chatExitMe;
            //     this.blocked = user.blocked;
            //     this.blockedme = user.blockedMe;
            //     if(succe.key=='canresume'){
            //       this.resumeOpt=true;
            //     }
            //     //console.log(user);
            //   }
            // })
          } else if (this.account == 2) {
            var inddd;

            // console.log("succ.ccount and this.account is 2");
            //     ChatService.myAnoChats.forEach((val,ind)=>{
            //       if(val.jid==this.active){
            //         console.log(val);
            //         inddd = ind;

            //     this.exitChat = ChatService.myAnoChats[inddd].chatExit;
            //     this.exitChatMe = ChatService.myAnoChats[inddd].chatExitMe;
            //     this.blocked =   ChatService.myAnoChats[inddd].blocked;
            //     this.blockedme = ChatService.myAnoChats[inddd].blockedMe;
            //     if(succe.key=='canresume'){
            //       this.resumeOpt=true;
            //     }
            //      console.log(ChatService.myAnoChats[inddd])
            //   }
            // })
            // _.map(ChatService.myChats, (user) => {
            //   if((user.jid == succe.content)&&(succe.content==this.active)) {
            //     console.log(this.active)
            //     console.log('setting user to')
            //     console.log(user)
            //     this.exitChat = user.chatExit;
            //  this.succecontent = succe.content;
            //     this.exitChatMe = user.chatExitMe;
            //     this.blocked = user.blocked;
            //     this.blockedme = user.blockedMe;
            //     if(succe.key=='canresume'){
            //       this.resumeOpt=true;
            //     }
            //     //console.log(user);
            //   }
            // })

            _.map(ChatService.myAnoChats, (user) => {
              if (user.jid == succe.content && succe.content == this.active) {
                try {
                  this.endRec(0);
                } catch {}
                // console.log(this.active);
                // console.log("setting user to");
                // console.log(user);
                this.exitChat = user.chatExit;
                // this.succecontent = succe.content;
                this.exitChatMe = user.chatExitMe;
                this.blocked = user.blocked;
                this.blockedme = user.blockedMe;

                if (succe.key == "canresume") {
                  this.resumeOpt = true;
                }
                //console.log(user);
              }
            });
          }
        }
      }
    });

    if (this.account == 1) {
      var indd;

      // ChatService.myChats.forEach((val,ind)=>{
      //   if(val.jid==this.active){
      //     indd = ind;
      //   }
      // })
      _.map(ChatService.myChats, (user) => {
        if (user.jid == this.active) {
          this.exitChat = user.chatExit;
          this.exitChatMe = user.chatExitMe;
          this.blocked = user.blocked;
          this.blockedme = user.blockedMe;
        }
      });
    } else {
      var inddd;
      // ChatService.myAnoChats.forEach((val,ind)=>{
      //   if(val.jid==this.active){
      //     inddd = ind;
      //   }
      // })
      // this.exitChat = ChatService.myAnoChats[inddd].chatExit;
      // this.exitChatMe = ChatService.myAnoChats[inddd].chatExitMe;
      _.map(ChatService.myAnoChats, (user) => {
        if (user.jid == this.active) {
          this.exitChat = user.chatExit;
          this.exitChatMe = user.chatExitMe;
          this.blocked = user.blocked;
          this.blockedme = user.blockedMe;
        }
      });
    }

    // console.log("in ngoninit");
    setTimeout(() => {
      this.scrollToBottom();
    }, 1000);
  }

  submit(x) {
    
    this.addfile_ = false;
    if (x.keyCode != 13) {
      if (x.code == "Backslash") {
      }
    }
    if (x.keyCode == 13 && x.shiftKey) {
      if (this.rowcount == 1) this.rowcount = 2;
    } else if (x.keyCode == 13) {
      this.send_msg();
      this.rowcount = 1;
    }
  }

  send_msg() {

    if(this.text_message.length>2000)
    { 
      alert("Maximum of 2000 characters are allowed");
      return;
    }

    if (this.text_message == "" || this.text_message.match(/^\s*$/)) {
      this.spaarksService.somethingWentWrong("Type something");
      this.text_message = "";
      return;
    }
    if (this.internetconnection == false) {
      return;
    }
    // console.log(this.account, this.active);
    try {
      if (this.spaarksService.bufferSendReqInfoBool == true) {
        this.chatService.fromGreet = false; // Changed - Added Newly
        this.chatService.reg_sendRequest(this.spaarksService.bufferSendReqInfo);
      }
      this.chatService.sendMessages(
        this.text_message,
        this.account,
        this.active
      );
      // ChatService.sortAtSite.next({key:'refreshRoster'});

      this.text_message = "";
      this.selectEmoji = false;
      this.scrollToBottom();
    } catch {
      this.text_message = "";
      this.selectEmoji = false;
    }
  }

  getEmoji(em) {
    console.log(em);
    let emAr = [];
    let em_text = this.renderer.createText(em);
    let g = document.createElement("div");
    g.innerHTML = em;
    let z = g.innerHTML;
    this.text_message = this.text_message + " " + z;
  }

  checkExitChat() {
    //console.log(this.active,this.account)
    if (this.account == 1) {
      for (var x = 0; x < ChatService.myChats.length; x++) {
        if (ChatService.myChats[x].jid == this.active) {
          // if(ChatService.myChats[x].msg.length==0)return false;
          // if(ChatService.myChats[x].msg[ChatService.myChats[x].msg.length-1].type=='exit')
          // {
          //   this.resumeOpt = (ChatService.myChats[x].jid== ChatService.myChats[x].msg[ChatService.myChats[x].msg.length-1].to )
          //   return true;
          // }
          // return false;
          if (
            ChatService.myChats[x].blocked ||
            ChatService.myChats[x].blockedMe
          )
            return false;
          this.resumeOpt = ChatService.myChats[x].canResume;
          return ChatService.myChats[x].chatExit;
        }
      }
    } else {
      for (var x = 0; x < ChatService.myAnoChats.length; x++) {
        // if(ChatService.myAnoChats[x].jid==this.active)
        // {
        //   if(ChatService.myAnoChats[x].msg.length==0)return false;
        //   if(ChatService.myAnoChats[x].msg[ChatService.myAnoChats[x].msg.length-1].type=='exit')
        //   {
        //     this.resumeOpt = (ChatService.myAnoChats[x].jid== ChatService.myAnoChats[x].msg[ChatService.myAnoChats[x].msg.length-1].to )
        //     return true;
        //   }
        //   return false;
        // }
        if (
          ChatService.myAnoChats[x].blocked ||
          ChatService.myAnoChats[x].blockedMe
        )
          return false;
        this.resumeOpt = ChatService.myAnoChats[x].canResume;
        return ChatService.myAnoChats[x].chatExit;
      }
    }
  }

  resumeChat() {
    this.exitChat = false;
    if (this.account == 1) {
      var iddd;

      this.loadashNormal(this.active, "resume");
      this.chatService.resumeChat(this.active, "", this.account);
    }

    if (this.account == 2) {
      var ippp;

      this.loadashAno(this.active, "resume");
      this.chatService.resumeChat(this.active, "", this.account);
    }
  }

  loadashNormal(jid, opt?) {
    this.normaluser = _.map(ChatService.myChats, (user) => {
      if (user.jid == jid) {
        if (opt == "resume") {
          user.chatExit = false;
        }
      }
    });
    this.normaluser = _.without(this.normaluser, undefined);
    return this.normaluser;
  }

  loadashAno(jid, opt?) {
    this.anouser = _.map(ChatService.myAnoChats, (user) => {
      if (user.jid == jid) {
        if (opt == "resume") {
          user.chatExit = false;
        }
      }
    });
    this.anouser = _.without(this.anouser, undefined);
    return this.anouser;
  }
  // account=1;
  // active= this.chatpersondata.jid;

  deletefromparentmsg(msg) {
    console.log(msg);
    this.multioutput.emit({ type: "deletefromparentmsg", action: msg });
  }

  multipurposeMsgs(eve) {
    console.log(eve);

    if (eve) {
      if (eve.type) {
        if (eve.type == "jaiDeleteMsg") {
          this.deletefromparentmsg(eve.action);
        }
        if (eve.type == "forwardmessage") {
          this.startForwardProcess();
          this.multioutput.emit({ type: eve.type, action: eve.action });
        }
      }
    }
  }

  changedTick(chatperson, eve) {
    console.log(chatperson);
    console.log(eve);

    if (chatperson.isTicked == true && eve.checked == true) {
      console.log(chatperson);
      this.forwardNumber = this.forwardNumber + 1;
      this.multioutput.emit({
        type: "forwardMoblist",
        forward: true,
        isForwardAdd: true,
        chatperson: chatperson,
      });
    } else {
      this.forwardNumber = this.forwardNumber - 1;
      this.multioutput.emit({
        type: "forwardMoblist",
        forward: true,
        isForwardAdd: false,
        chatperson: chatperson,
      });
    }
  }

  startForwardProcess() {
    console.log("started the process");

    if (this.screenwidth < 700) {
      this.showForwardForMobile = true;
    } else {
      return;
    }
    let totalList = [];

    if (this.account == 1) {
      totalList = [...ChatService.myChats];
    } else {
      totalList = [...ChatService.myAnoChats];
    }

    let currentId = this.active;
    let finList = [...totalList];

    totalList.forEach((vall, indd) => {
      if (vall) {
        vall.isTicked = false;
      }
    });

    totalList.forEach((val, ind) => {
      if (val) {
        if (val.jid) {
          if (val.jid == currentId) {
            finList.splice(ind, 1);
            this.listToForward = finList;
          }
        }
      }
    });
  }

  clickForward() {
    this.multioutput.emit({ forwardclicked: true });
    this.forwardNumber = 0;
  }

  onScroll(event) {
    if (this.scrollDir == "UP") {
      return;
    }
    // console.log(event)
    var elmnt = document.getElementById("scroller");

    this.verticalScroll = elmnt.scrollHeight;
    // console
    /*  */
    //  console.log(elmnt.scrollHeight)

    //  if(this.verticalScroll>0){
    //    this.showArrow=true;
    //  }
    //  else{
    //    this.showArrow=false;
    //  }
    // console.log(document.getElementById('scroller'))
    // console.log(document.getElementById('scroller').scrollHeight)

    if (!document.getElementById("scroller")) {
      return;
    }
    // console.log(event.target.offsetHeight,event.target.scrollTop,event.target.scrollHeight )
    if (
      event.target.offsetHeight + event.target.scrollTop >=
      event.target.scrollHeight
    ) {
      this.showArrow = false;
    } else {
      this.showArrow = true;
    }

    if (document.getElementById("scroller").scrollTop < 10) {
      //this.showArrow=true;
      this.previousScrl = document.getElementById("scroller").scrollHeight;
      if (this.account == 1) {
        this.chatService.reg_loadOldMessages(this.active);
      } else {
        this.chatService.ano_loadOldMessages(this.active);
      }
      // setTimeout(() => {
      //   if (document.getElementById('scroller')) {
      //     document.getElementById('scroller').scrollTop = document.getElementById('scroller').scrollHeight - this.previousScrl;
      //   }
      // }, 700)
    }
  }

  checkScrollDirection(event) {
    if (this.checkScrollDirectionIsUp(event)) {
      // console.log('UP');
      this.scrollDir = "UP";
    } else {
      // console.log('Down');
      this.scrollDir = "Down";
    }
  }

  checkScrollDirectionIsUp(event) {
    if (event.wheelDelta) {
      return event.wheelDelta > 0;
    }
    return event.deltaY < 0;
  }

  scrollToBottom = () => {
    this.verticalScroll = 0;
    console.log("scrolled to bottom.....");
    this.text_message = "";
    try {
      setTimeout(() => {
        this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
      }, 300);
    } catch (err) {
      // console.log(err);
    }
  };

  OutputFromInput(eve) {
    console.log(eve);
    this.chatService.sendMessages(
      eve.content,
      this.account,
      this.chatpersondata.jid
    );
  }

  show_addfile() {
    if (this.selectEmoji) {
      this.selectEmoji = false;
      this.emoji_src = "../../../assets/chat/Frame-2.svg";
      setTimeout(() => {
        this.addfile_ = !this.addfile_;
        // if (this.addfile_) {
        //   this.addF_src = "../../../assets/chat/add active.png"
        // }
        // else {
        //   this.addF_src = "../../../assets/chat/plus.png"
        // }
      }, 500);
    } else {
      this.addfile_ = !this.addfile_;
      // if (this.addfile_) {
      //   this.addF_src = "../../../assets/chat/add active.png"
      // }
      // else {
      //   this.addF_src = "../../../assets/chat/plus.png"
      // }
    }
  }

  showEmoji() {
    if (this.addfile_) {
      this.addfile_ = false;
      this.addF_src = "../../../assets/chat/plus.svg";
      setTimeout(() => {
        this.selectEmoji = !this.selectEmoji;
        // if (this.selectEmoji) {
        //   this.emoji_src = "../../../assets/chat/emojiactive.png"
        // }
        // else {
        //   this.emoji_src = "../../../assets/chat/Frame-2.svg"
        // }
        this.emoji_src = "../../../assets/chat/Frame-2.svg";
      }, 500);
    } else {
      this.selectEmoji = !this.selectEmoji;
      // if (this.selectEmoji) {
      //   this.emoji_src = "../../../assets/chat/emojiactive.png"
      // }
      // else {
      //   this.emoji_src = "../../../assets/chat/Frame-2.svg"
      // }
      this.emoji_src = "../../../assets/chat/Frame-2.svg";
    }
    //console.log(this.selectEmoji)
  }

  goToList() {
    if (this.spaarksService.clickedChatFromFeed) {
      this.router.navigateByUrl("chat");
      window.location.reload();
    } else this.multioutput.emit({ type: "gotolist" });
  }

  async onImagePicked(event: Event) {
    // taking only one image for now
    // this.filee.nativeElement.value=null;
    const file = (event.target as HTMLInputElement).files;

    // console.log(event);
    //console.log(this.imageForm); img
    // console.log(file[0].size / 1048576)

    // console.log(file)
    if (file.length > 10) {
      // alert('You cannot upload more than 10 files at once');
      //alert('Max 10 images can be uploaded.');
      this.allpurposeService.triggerModal.next({
        type: "alertModal",
        modal: true,
        modalMsg: "Max 10 images can be uploaded.",
      });

      return;
    }
    for (let i = 0; i < file.length; i++) {
      if (file[i].size / 1048576 > 25) {
        if (!file[i].type.includes("video")) {
          // alert("File size cannot exceed 25MB");
          //alert('File size cannot exceed 25MB');
          this.allpurposeService.triggerModal.next({
            type: "alertModal",
            modal: true,
            modalMsg: "File size cannot exceed 25MB",
          });
          return;
        } else if (file[i].type.includes("video")) {
          if (file[i].size / 1048576 > 50) {
            // alert("Video size cannot exceed 50MB");
            //this.spaarksService.showAlert('Video size cannot exceed 50MB');
            this.allpurposeService.triggerModal.next({
              type: "alertModal",
              modal: true,
              modalMsg: "Video size cannot exceed 50MB",
            });
            return;
          }
        }
      }
    }

    for (let i = 0; i < file.length; i++) {
      console.log(file[i].type);
      if (file[i].type.includes("image")) {
        if (
          file[i].type != "image/jpeg" &&
          file[i].type != "image/jpg" &&
          file[i].type != "image/png" &&
          file[i].type != "image/webp" &&
          file[i].type != "image/bmp"
        ) {
          // alert('Format not supported');
          // this.spaarksService.showAlert('Format not supported');

          this.allpurposeService.triggerModal.next({
            type: "alertModal",
            modal: true,
            modalMsg: "Format not supported",
          });
          return;
        }
      }
    }

    console.log(file);
    let gil = Array.from(file);
    let kil = [...gil];

    this.sendImageFunc(kil, this.account, this.active);
    const reader = new FileReader();
    reader.onload = () => {
      console.log(file);
      // this.chat.sendImage(file[0]);
    };
    this.show_addfile();
  }

  // used for sending images in chat
  sendImageFunc(file, acc, active) {
    let gun = 0;
    let bun = [...file];
    let intt = setInterval(() => {
      try {
        // console.log(file);
        // console.log(gun);
        // console.log(file[0]);
        if (!file[0]) {
          console.log("returning");
          clearInterval(intt);
          return;
        }
        this.chatService.sendImage(file[0], this.account, this.active);
        setTimeout(() => {
          this.scrollToBottom();
        }, 1000);
      } catch {
        clearInterval(intt);
      }
      // console.log(bun.length);
      if (gun < bun.length) {
        // console.log(typeof file);
        file.splice(0, 1);
        console.log(file);
        gun = gun + 1;
      } else {
        gun = gun + 1002;
        clearInterval(intt);
      }
    }, 1500);
  }

  async onDocPicked(event: Event) {
    console.log("file");
    // taking only one image for now
    const file = (event.target as HTMLInputElement).files;

    // console.log(event);
    //console.log(this.imageForm); img
    // console.log(file[0].size / 1048576)

    // console.log(file)
    if (file.length > 10) {
      // alert('You cannot upload more than 10 files at once');
      // this.spaarksService.showAlert('Max 10 files can be uploaded.');
      this.allpurposeService.triggerModal.next({
        type: "alertModal",
        modal: true,
        modalMsg: "Max 10 files can be uploaded.",
      });
      return;
    }
    let types = [
      ".pdf",
      ".doc",
      ".docx",
      ".docm",
      ".xlsx",
      ".xls",
      ".xlsb",
      ".xlsm",
      ".ppt",
      ".pptx",
      ".pptm",
      ".txt",
    ];
    for (let io = 0; io < file.length; io++) {
      console.log(file[io]);
      var bl = file[io].name.slice(file[io].name.lastIndexOf("."));

      if (!types.includes(bl)) {
        // alert('Format Not supported')
        //alert('Format not supported');
        this.allpurposeService.triggerModal.next({
          type: "alertModal",
          modal: true,
          modalMsg: "Format not supported",
        });
        return;
      }
      if (file[io].size / 1048576 > 25) {
        // alert("File size cannot exceed 25MB");
        //this.spaarksService.showAlert('File size cannot exceed 25MB');
        this.allpurposeService.triggerModal.next({
          type: "alertModal",
          modal: true,
          modalMsg: "File size cannot exceed 25MB",
        });
        return;
      }
    }
    let gil = Array.from(file);
    let kil = [...gil];

    try {
      this.sendImageFunc(kil, this.account, this.active);
    } catch {
      console.log("something went wrong");
    }

    const reader = new FileReader();
    reader.onload = () => {
      // console.log(file[0])
      // this.chat.sendImage(file[0]);
    };
    this.show_addfile();
  }

  pick_img() {
    let element: HTMLElement = document.getElementById(
      "imgPicker"
    ) as HTMLElement;
    this.filee.nativeElement.value = null;
    element.click();
  }

  addDoc() {
    let element: HTMLElement = document.getElementById(
      "filePicker"
    ) as HTMLElement;
    this.filee.nativeElement.value = null;
    element.click();
  }

  startRec() {
    try {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          stream.getAudioTracks().forEach((track) => track.stop());
          this.isMicEnabled = true;
          this.recording = true;
          this.stopOtherAudios();
          this.audio.startRecording();
        })
        .catch((err) => {
          this.isMicEnabled = false;
          this.micError();
          console.log("catch in start rec");
          alert("Media devices fetching failed");
        });
    } catch {
      console.log("catch in start rec");
      // alert('Media devices fetching failed');
      this.allpurposeService.triggerModal.next({
        type: "alertModal",
        modal: true,
        modalMsg: "Media devices fetching failed",
      });
    }
  }

  endRec(check) {
    this.recording = false;
    this.endRecoed.emit(false);
    this.audio.stopRecording(check, "smallchat");
  }

  stopOtherAudios() {
    var tempAudios: any = document.querySelectorAll("audio");

    try {
      tempAudios.forEach((aud) => {
        aud.pause();
      });
    } catch {
      console.log(`stop aud err catch`);
    }
  }

  // cancelRec(){
  //   this.recording = false;
  // }

  micError() {
    console.log("error in start rec");
    let message = "Please Enable Mic/Device Not Supported";

    this._zone.open(message, "ok", {
      duration: 4000,
    });
  }

  navigateByOption(eve) {
    console.log(eve);
    if (eve == "Clear") {
      this.multioutput.emit({ opt: "clear", person: this.chatpersondata });
    } else if (eve == "Block") {
      this.multioutput.emit({ opt: "block", person: this.chatpersondata });
    } else if (eve == "Exit") {
      this.multioutput.emit({ opt: "exit", person: this.chatpersondata });
    } else if (eve == "Add Nickname") {
      this.multioutput.emit({ opt: "alias", person: this.chatpersondata });
    }
  }

  goToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  ngOnDestroy() {
    try {
      this.endRec(0);
    } catch {}
  }
}
