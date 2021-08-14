//***********************************************************************************************
// Organization    : OSOS Pvt Ltd
// Name            : chat.service.ts
// Created         : Jun 16 2020
//-----------------------------------------------------------------------------------------------
//
// What It Does - Takes care of everything related to chat and its functionality.
//
// Program Description- In this we will connect the user's ejabberd account to the ejabberd server through strophe.js.
//
//
// How It Works- ----
//
//-----------------------------------------------------------------------------------------------
// Inputs                      Access Type   |         Description
//    -                             -                        Not Applicable
//-----------------------------------------------------------------------------------------------
// Outputs                 Access Type    Description
//    -                             -                        Not Applicable
//-----------------------------------------------------------------------------------------------
// Component Inputs                      from component   | to component |        Description
//    -                             -                        Not Applicable
//-----------------------------------------------------------------------------------------------
// Component Outputs                      to Component   |         Description
//          -                                   -                       -
//***********************************************************************************************
//************************************************************************************************
// Revision Author            Date      Change
// Number
//  V1.0    Vikram      16/05/2020  Intial FrameWork
//  V2.0    Jai         20/07/2020  Modifications in connecting the normal auser and anonymous user to the ejabberd server.
import { Injectable } from "@angular/core";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as $ from "../assets/xmpp/vikram.js";
//Strophe js file import
import { Parser } from "xml2js";
import { environment } from "src/environments/environment.js";
// import { ReportService } from '../feature3/services/report.service';
// import { ActiveusersService } from '../feature3/services/activeusers.service.js';
import * as _ from "lodash";

import * as CryptoJS from "crypto-js";
import { ReportService } from "./report.service.js";
import { ActiveusersService } from "./activeusers.service.js";
import { SpaarksService } from "./spaarks.service.js";
import * as axios from "axios";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  //Creation of Variables used in this files...

  temp = new Date();
  private msg_Obs = new Subject<any>();
  fromGreet = true; // Changed - Added Newly

  buffer = "@741vpd*$#";
  sp_j_cp;
  sp_j_id;
  sp_j_jd;
  sp_j_Jda;

  cookieId;
  cookieJid = "";
  cookieJidAno = "";

  rjid = this.cookieJid; //= this.sp_j_jd;
  ajid = this.cookieJidAno; //= this.sp_j_Jda;
  notfineArray = ["exit", "resume", "block", "unblock"];

  static active = "";
  static account = 0;
  static initLoadCount = 20;
  static scrollLoadCount = 10;
  static totalRegUnread = 0;
  static totalAnoUnread = 0;
  username = localStorage.getItem("username");
  static reg_connection: any;
  reg_connection_this = ChatService.reg_connection;
  static ano_connection: any;
  static tempArr = [];
  static myChats = [
    {
      userId: "y",
      msg: [],
      unread: 0,
      loaded: false,
      jid: "sdgsdg",
      aid: "",
      clearChat: 1,
      blocked: false,
      chatExit: false,
      chatExitMe: false,
      reachedEnd: false,
      canResume: false,
      blockedMe: false,
      profilePic: "",
      isNew: false,
      isOtherAnonymous: false,
    },
  ]; //un, us, pp
  static myAnoChats = [
    {
      userId: "y",
      msg: [],
      unread: 0,
      loaded: false,
      jid: "sdgsdg",
      aid: "",
      clearChat: 1,
      blocked: false,
      chatExit: false,
      chatExitMe: false,
      reachedEnd: false,
      canResume: false,
      blockedMe: false,
      profilePic: "",
      isNew: false,
      isOtherAnonymous: false,
    },
  ];
  //Gets triggered after the conection to the normal account has been established. This is nexted in the reg_on_roster
  static jidEmitter = new Subject<any>();

  //Gets triggered after the conection to the anonymous account has been established. This is nexted in the ano_on_roster
  static jidEmitter2 = new Subject<any>();

  uploadedFile = [];
  tempArray = [];

  static allDataCommonSubj = new Subject();
  clearInputsSub = new Subject<any>();
  static disconnectSub = new Subject<any>();
  static accountTab = 1;
  static currentActiveIndex = 0;
  activeJid;

  DummyID;
  featchingReg = { initialListCount: 0, fullListCount: 0, marked: false };
  fetchingAno = { initialListCount: 0, fullListCount: 0, marked: false };
  //DummyJID=this.toDecrypt("jid");
  //DummyJIANO=this.toDecrypt("jidAno")

  //constructor is the first thing that gets executed when this service is being called or injected.
  constructor(
    private http: HttpClient,
    private report: ReportService,
    private newService: ActiveusersService,
    private spaarksService: SpaarksService
  ) {
    // private report :ReportService, private newService: ActiveusersService

    //Clearing the chat list, by removing all the elements from the arrays(myChats and myAnoChats).
    ChatService.myChats.pop();
    ChatService.myAnoChats.pop();
    // var x = new Date();

    // if(this.DummyJID ==this.rjid && this.DummyJIANO == this.ajid){
    //   alert("we Are Safe to use ");
    // }

    //iterates over the values in the local storage and decrypts them with the secret key and then stores in the variables
    this.getUserDetailsEach("jai", "jai");

    //id is not encrypted and is directly stored as id,, so retreiving it directly.
    this.cookieId = localStorage.getItem("id");

    //this is the variable that decides if the user is authorized or not. It is initialized with false.
    let isAuth = false;

    // this.toDecrypt("details")
    try {
      if (localStorage.getItem("iJAIa")) {
        if (localStorage.getItem("iJAIa") == environment.ijaiaahut) {
          //setting authorized to true, if the above conditions are being satisfied
          isAuth = true;
        }
      }
    } catch {}

    if (isAuth) {
      setTimeout(() => {
        //connecting xmpp to ejabberd server after 4 seconds, This time can be further reduced and observed for careful optimization. 6 seconds is being declared by vikram. Brought to 4 seconds by jai. Brought to 2 seconds by namrata.
        this.connect_xmpp("");
      }, 1000);
    }
    //alert("im i running on every reload");

    // alert("Chat Service Runs" +this.ajid);
    // alert("Chat Service Runs" +this.rjid);

    //not used
    ChatService.noticeList.subscribe((succ) => {
      // console.log(succ);

      if (this.list.length) {
        let lastNotificationTime = this.list[this.list.length - 1].createdAt;
        let currentNotificationTime = succ.createdAt;

        // console.log(lastNotificationTime);
        // console.log(currentNotificationTime);

        if (lastNotificationTime == currentNotificationTime) {
          return;
        }

        let today = new Date();
        let yesterday = today.setDate(today.getDate() - 1);

        if (currentNotificationTime < yesterday) {
          return;
        }
      }
      this.list.unshift(succ);

      // Sort Notifications
      this.list.sort((a, b) => b.createdAt - a.createdAt);
      // Sort Notifications

      if (succ.content.length > 35) {
        succ.content = succ.content.substring(0, 35) + "...";
      }
    });

    //urlEmitter will get some value as subscription, when we upload any file from the normal account.
    ChatService.urlEmitter.subscribe((emObj) => {
      console.log(emObj);
      //Here we are doing a put request, we are basically altering the empty file initialization
      // that ejabberd assigns us and overriding it with the file that we want to upload
      http
        .put(emObj.slot, this.uploadedFile[this.uploadedFile.length - 1], {
          responseType: "blob",
        })
        .subscribe((v) => {
          //console.log(v);
          var filetype = this.uploadedFile[this.uploadedFile.length - 1].type;
          var yo = filetype.substring(
            filetype.indexOf("/") + 1,
            filetype.length
          );
          var typex = ChatService.getType(yo);

          // console.log(filetype, typex, yo)

          //current date instance
          let gun = new Date();
          let jaiTime = gun.getTime() * 1000;
          var temp = {
            type: typex,
            name: this.uploadedFile[this.uploadedFile.length - 1].name,
            src: emObj.slot,
            date: new Date(),
            to: emObj.active,
            UID: new Date().getTime() * 10000,
            from: this.cookieJid,
            unique: jaiTime,
          }; //ikkada date correct cheyyali-jai            console.log(temp)
          if (temp == undefined) {
            console.log("returning due to undefined");
            return;
          }
          if (emObj.account == 2) {
            temp.from = this.cookieJidAno;
          }

          var msgString = JSON.stringify({
            type: typex,
            content: emObj.slot,
            unique: jaiTime,
          });
          // console.log(msgString)
          var active;

          if (emObj.account == 1) {
            //if the file upload is from account 1 (original account), iterate over the entire normal chat list
            ChatService.myChats.forEach((x, ind) => {
              //if the current iterating jid is equal to the jid that we are sending the file to....
              if (x.jid == emObj.active) {
                active = ind;

                //then push this message to the user's chat list.
                ChatService.myChats[ind].msg.push(temp);
                //check if we are currently chatting with that user (is this user's jid the current active person?  if yes?)
                if (x.jid == this.activeJid) {
                  //after pushing this message to the array of the messages of that
                  // user, let the chat related components know it by emiting this subject.
                  this.newchatsubj_jai.next({
                    newchat: true,
                    msg: temp,
                    from: emObj.active,
                    account: 1,
                    unreadCnt: ChatService.myChats[ind].unread,
                  });
                } else {
                  //else,, that means the user that we are messaging is not the person that send this file..
                  //So, increase the unread messages count for this user and then next the featuredot with the total unread
                  this.allTotalUnread = this.allTotalUnread + 1;
                  this.featureDot.next({ unread: this.allTotalUnread });
                }
              }
            });

            // ChatService.myChats = ChatService.mergeSort(ChatService.myChats);
          }
          if (emObj.account == 2) {
            //if the file upload is from account 2 (anonymous account), iterate over the entire anonymous chat list
            ChatService.myAnoChats.forEach((x, ind) => {
              //if the current iterating jid is equal to the jid that we are sending the file to....
              if (x.jid == emObj.active) {
                active = ind;
                //then push this message to the user's chat list.
                ChatService.myAnoChats[active].msg.push(temp);
                if (x.jid == this.activeJid) {
                  //after pushing this message to the array of the messages of that
                  // user, let the chat related components know it by emiting this subject.
                  this.newchatsubj_jai.next({
                    newchat: true,
                    msg: temp,
                    from: emObj.active,
                    account: 2,
                    unreadCnt: ChatService.myAnoChats[ind].unread,
                  });
                } else {
                  //else,, that means the user that we are messaging is not the person that send this file..
                  //So, increase the unread messages count for this user and then next the featuredot with the total unread
                  this.allTotalUnread = this.allTotalUnread + 1;
                  this.featureDot.next({ unread: this.allTotalUnread });
                }
              }
            });

            //ChatService.myAnoChats = ChatService.mergeSort(ChatService.myAnoChats);
          }

          // setTimeout(() => {
          //   ChatService.scrl_Obs.next('yodfhk')
          // }, 500)

          var q = emObj;
          //After the process of the file upload is being completed, remove all the files existing in that value.
          this.uploadedFile.pop();

          //Building the message xml with strophe.$msg and keeping msgstring in the body of this xml.
          var message = $.$msg({ to: q.active, type: "chat" })
            .c("body")
            .t(msgString);

          // console.log(message)
          if (q.account == 1) {
            //if the account that we want to send this is from 1, then it is original account.
            ChatService.reg_connection.send(message);
          } else {
            //if the account that we want to send this is from 2, then it is anonymous account.
            ChatService.ano_connection.send(message);
          }
        });
      // ChatService.sortAtSite.next("yoo");

      //inorder to bring the user to the bottom of the screen
      ChatService.scrollToBottom.next({});
    });
    try {
      console.log(ChatService.reg_connection);
    } catch {}

    //this will be called after the account gets connected to the ejabberd server and gets roster listfrom the ejabberd server.
    // This method will get called in the reg_on_Roster.
    ChatService.jidEmitter.subscribe((jidArr) => {
      try {
        // console.log(ChatService.reg_connection)
      } catch {}
      // console.log('jidEmitter')
      //Getting the list of the users that we chat with, from backend

      if (isAuth) {
        http
          .post(
            environment.baseUrl + "/api/v2.0/user/chatRoster",
            { data: jidArr, mjid: 1 },
            { withCredentials: true }
          )
          .subscribe((succ: any) => {
            // console.log(succ);

            let temp = succ;
            try {
              //removing all the duplicate values that we receive from the backend, with lodash uniqby
              //This will eliminate the duplicate people in the list and thereby making sure that there are no two people with same jid in this list.
              temp = _.uniqBy(temp, "jid");
            } catch {}
            // alert('lop')

            try {
              if (temp.length > 0) {
                this.chatLoadedArr.norm = temp[temp.length - 1].jid;
              }
            } catch {}
            try {
              if (temp.length > 0) {
                this.chatLoadedArr.norm = temp[temp.length - 1].jid;
              }
            } catch {}
            // console.log(temp)

            //emptying the mychats (chat list ) of the normal user
            ChatService.myChats = [];
            ChatService.regJidArr = [];
            try {
              console.log(ChatService.reg_connection);
            } catch {}

            this.featchingReg.fullListCount = temp.length;

            //iterating over the list of people in chat roster that we got from the backend and initializing them with the default values.
            for (var x = 0; x < temp.length; x++) {
              console.log(temp[x]);
              this.featchingReg.initialListCount =
                this.featchingReg.initialListCount + 1;
              var a = {
                userId: temp[x].userId,
                jid: temp[x].jid,
                name: temp[x].name,
                profilePic: temp[x].profilePic,
                clearChat: temp[x].clearChat,
                blocked: temp[x].blocked,
                chatExit: temp[x].chatExit,
                canResume: temp[x].canResume,
                connection: temp[x].connection,
                blockedMe: temp[x].blockedMe,
                aid: temp[x].aid,
                chatExitMe: temp[x].chatExitMe,
                msg: [],
                unread: 0,
                loaded: true,
                reachedEnd: false,
                isNew: false,
                amIAnonymous: temp[x].amIAnonymous,
                isOtherAnonymous: temp[x].isOtherAnonymous,
              };
              //pushing this default value initialzed list to the list of the chat contacts
              ChatService.myChats.push(a);

              //Here we will push the jid of this to the regJidArr
              ChatService.regJidArr.push(temp[x].jid);
              //   //console.log(a.userId)

              var d = new Date();
              var p = d.getTime() * 1000;
              //Building the iq packet to get the list of old messages from the ejabberd MAM (Message archive
              // managemnet server. By fetching first 10 messages). Getting these messages before date.like get
              // 10 messages for this person that happened before today.
              var iq2 = $.$iq({ type: "set", id: "reg_oldmessages" }).c(
                "query",
                { xmlns: "urn:xmpp:mam:2" }
              );
              iq2.c("x", { xmlns: "jabber:x:data", type: "submit" });
              iq2
                .c("field", { var: "FORM_TYPE", type: "hidden" })
                .c("value")
                .t("urn:xmpp:mam:2")
                .up()
                .up();
              iq2
                .c("field", { var: "with" })
                .c("value")
                .t(a.jid)
                .up()
                .up()
                .up();
              iq2
                .c("set", { xmlns: "http://jabber.org/protocol/rsm" })
                .c("max")
                .t(ChatService.initLoadCount)
                .up();
              iq2.c("before").t(p);

              //  console.log(iq2 )
              //install strophe-plugin-mam
              //install strophe-plugin-rsm
              //   let params = {
              //     "before": p,
              //     "max": 10,
              //     onMessage: ()=>{console.log('onMessage handler')},
              //     onComplete:()=>{console.log('onComplete handler')},
              // }
              // console.log(ChatService.reg_connection)
              // console.log(ChatService.reg_connection.mam)

              // ChatService.reg_connection.mam.query($.getBareJidFromJid(this.cookieJid), params);
              try {
                //sending that iq that requests 10 messages to the ejaabberd server from the regural normal account.
                ChatService.reg_connection.sendIQ(iq2, this.fun);
              } catch {
                console.log("lllllll");
              }
              ChatService.myChats[x].loaded = true;
              if (
                this.featchingReg.initialListCount ==
                this.featchingReg.fullListCount - 1
              ) {
                setTimeout(() => {
                  //after 1 second, making the normal chat connected as true and emitting the same to the chat related components
                  //So that they can refresh the view;
                  this.chatLoadedArr.loadedArr.push("norm");
                  this.report.multiPurposeSubj.next({
                    chatLoad: { originalChatLoaded: true },
                  });
                }, 1000);
              }

              //uncomment this to get all the previous messages from node server instead of Ejabberd's MAM server.
              // if(x<3||document.URL.includes('9000')){

              //   this.callBackendtoGetChatNorm(temp[x].jid);
              // }
            }

            console.log(ChatService.myChats);
            setTimeout(() => {
              //sorting the list of the chats after 100 milliseconds
              ChatService.myChats = ChatService.mergeSort(ChatService.myChats);
            }, 100);

            setTimeout(() => {
              //nexting this so that the list will get refreshed upon receiving a subscription in the chat component
              // and it will again recalculate the chat and its messages.
              ChatService.refreshList.next({ refresh: "jai" });
            }, 900);
          });
      }
    });

    //this will be called after the account 2 gets connected to the ejabberd server and gets roster listfrom the ejabberd server.
    // This method will get called in the ano_on_Roster.
    ChatService.jidEmitter2.subscribe((jidArr) => {
      // console.log(jidArr)
      //Getting the list of the users that we chat with, from backend
      if (isAuth) {
        http
          .post(
            environment.baseUrl + "/api/v2.0/user/chatRoster",
            { data: jidArr, mjid: 2 },
            { withCredentials: true }
          )
          .subscribe((succ: any) => {
            let temp = succ;

            try {
              //removing all the duplicate values that we receive from the backend, with lodash uniqby
              //This will eliminate the duplicate people in the list and thereby making sure that there are no two people with same jid in this list.

              temp = _.uniqBy(temp, "jid");
            } catch {}

            try {
              this.chatLoadedArr.ano = temp[temp.length - 1].jid;
            } catch {}
            this.fetchingAno.fullListCount = temp.length;
            // console.log(temp)
            //emptying the myAnoChats (chat list ) of the anonymous user
            ChatService.myAnoChats = [];
            ChatService.anoJidArr = [];

            //iterating over the list of people in chat roster that we got from the backend and initializing them with the default values.
            for (var x = 0; x < temp.length; x++) {
              var a = {
                userId: temp[x].userId,
                name: temp[x].name,
                jid: temp[x].jid,
                aid: temp[x].aid,
                profilePic: temp[x].profilePic,
                clearChat: temp[x].clearChat,
                blocked: temp[x].blocked,
                chatExit: temp[x].chatExit,
                blockedMe: temp[x].blockedMe,
                canResume: temp[x].canResume,
                chatExitMe: temp[x].chatExitMe,
                msg: [],
                unread: 0,
                loaded: false,
                reachedEnd: false,
                isNew: false,
                isOtherAnonymous: temp[x].isOtherAnonymous,
              };
              //pushing this default value initialzed list to the list of the chat contacts
              ChatService.myAnoChats.push(a);
              //Here we will push the jid of this to the anoJidArr
              ChatService.anoJidArr.push(temp[x].jid);
              //console.log(a.userId)

              var d = new Date();
              var p = d.getTime() * 1000;
              //Building the iq packet to get the list of old messages from the ejabberd MAM (Message archive
              // managemnet server. By fetching first 10 messages). Getting these messages before date.like get
              // 10 messages for this person that happened before today.
              var iq2 = $.$iq({ type: "set", id: "reg_oldmessages" }).c(
                "query",
                { xmlns: "urn:xmpp:mam:2" }
              );
              iq2.c("x", { xmlns: "jabber:x:data", type: "submit" });
              iq2
                .c("field", { var: "FORM_TYPE", type: "hidden" })
                .c("value")
                .t("urn:xmpp:mam:2")
                .up()
                .up();
              iq2
                .c("field", { var: "with" })
                .c("value")
                .t(a.jid)
                .up()
                .up()
                .up();
              iq2
                .c("set", { xmlns: "http://jabber.org/protocol/rsm" })
                .c("max")
                .t(ChatService.initLoadCount)
                .up();
              iq2.c("before").t(p);

              // //console.log(iq2 )
              try {
                //sending that iq that requests 10 messages to the ejaabberd server from the anonymous normal account.
                ChatService.ano_connection.sendIQ(iq2, this.fun);
              } catch {}
              ChatService.myAnoChats[x].loaded = true;
              if (
                this.fetchingAno.initialListCount ==
                this.fetchingAno.fullListCount - 1
              ) {
                setTimeout(() => {
                  //after 1 second, making the anonymous chat connected as true and emitting the same to the chat related components
                  //So that they can refresh the view;
                  // console.log('ano ready');
                  this.chatLoadedArr.loadedArr.push("ano");
                  this.report.multiPurposeSubj.next({
                    chatLoad: { AnonymousChatLoaded: true },
                  });
                }, 1000);
              }

              //uncomment this to get all the previous messages from node server instead of Ejabberd's MAM server.
              // if(x<3||document.URL.includes('9000')){

              //   this.callBackendtoGetChatAno(temp[x].jid);
              // }
            }

            setTimeout(() => {
              //Sorting the list of our chats of the anonymous account by the date.
              ChatService.myAnoChats = ChatService.mergeSort(
                ChatService.myAnoChats
              );
            }, 100);

            setTimeout(() => {
              //Emitting refresh here, so that the chat related components can refresh their view.
              ChatService.refreshList.next({ refresh: "jai" });
              ChatService.refreshList.next({ refresh: "jaiano" });
            }, 900);
          });
      }
    });
    // this.toDecrypt("details");
  }

  //This subject is th emost important subject, as it updates the new messages to the chat related components.
  newchatsubj_jai = new Subject();
  featureDot = new Subject();

  scrtJaikey = "ace0900brz8j";

  chatToOpen = { account: 1, jid: null };

  getUserDetailsEach(key, jai?) {
    //this function will decrypt and assign it for all the keys.
    try {
      if (jai) {
        if (jai) {
          try {
            this.userDetailsArr.forEach((val, ind) => {
              let fun = localStorage.getItem(val.fakeName);
              // console.log(fun)
              if (fun) {
                let unCypher = CryptoJS.AES.decrypt(
                  fun,
                  this.scrtJaikey
                ).toString(CryptoJS.enc.Utf8);
                // console.log('--------------------->')

                val.decrValue = unCypher;

                if (val.name == "jid_main") {
                  this.cookieJid = unCypher;
                } else if (val.name == "jid_anonymous") {
                  this.cookieJidAno = unCypher;
                } else if (val.name == "chatpassword") {
                  this.cookiePass = unCypher;
                }

                // console.log(unCypher)

                // console.log('--------------------->')
              } else {
                return null;
              }
            });
          } catch {
            (err) => {
              // this.catchInternalErrs(err)
            };
          }
        }
      } else {
        return null;
      }
    } catch {
      (err) => {
        // console.log(err)
      };
    }
  }

  //original names and fake names that are being stored in the localstorage.
  userDetailsArr = [
    { name: "jid_main", fakeName: "sjpiad", decrValue: "" },
    { name: "jid_anonymous", fakeName: "sjpiadaarn", decrValue: "" },
    { name: "chatpassword", fakeName: "scppaaars", decrValue: "" },
    { name: "chatDomainWeb", fakeName: "sdpoamaari", decrValue: "" },
  ];

  userDetailsStrings = [
    "jid_main",
    "jid_anonymous",
    "chatpassword",
    "chatDomainWeb",
  ];

  //To get the past messages from node backend instead of the MAM ejabberd backend server.
  callBackendtoGetChatNorm(jid, acc?) {
    this.http
      .get(
        "https://staging-api.ososweb.com/getmessages/" +
          localStorage.getItem("id") +
          "/" +
          jid.slice(0, jid.indexOf("@")),
        { withCredentials: true }
      )
      .subscribe((suc: any) => {
        // console.log(suc);
        let myId = localStorage.getItem("id");
        let too;
        let from;
        let temp = undefined;
        if (suc) {
          if (suc.data) {
            let counter = 0;
            let triggerMsgs = (val) => {
              let jaii = undefined;
              if (counter == suc.data.length) {
                val.msg.forEach((val, ind) => {
                  if (val.type == "clearchat") {
                    jaii = ind;
                  }
                });
                if (jaii != undefined) {
                  val.msg = val.msg.slice(jaii);
                }
              }
            };
            suc.data.forEach((data, ind) => {
              // console.log(data)
              if (data.txt) {
                let obj = JSON.parse(data.txt);
                // console.log(obj);
                var d = new Date(data.timestamp / 1000);
                // console.log(d)
                var xmlString = data.xml;

                // let stringifiedXml =new XMLSerializer().serializeToString(JSON.parse(data.xml));
                // console.log(xmlString)

                const parser = new Parser({ strict: false, trim: true });
                parser.parseString(xmlString, (err, result) => {
                  // console.log(result)
                  if (result) {
                    if (result.MESSAGE) {
                      if (result.MESSAGE.$) {
                        too = result.MESSAGE.$.TO;
                        from = result.MESSAGE.$.FROM;

                        if (too.indexOf("/") != -1)
                          too = too.substring(0, too.indexOf("/"));

                        if (from.indexOf("/") != -1)
                          from = from.substring(0, from.indexOf("/"));

                        if (obj.type == "chat") {
                          temp = {
                            type: "text",
                            text: obj.content,
                            date: d,
                            to: too,
                            UID: data.timestamp,
                            from: from,
                            msgXml: "stringifiedXml",
                            msgStanzaId: "",
                            unique: obj.unique,
                          };
                        } else {
                          if (
                            obj.type == "exit" ||
                            obj.type == "resume" ||
                            obj.type == "block" ||
                            obj.type == "unblock"
                          ) {
                            // console.log(tempmsg.type);

                            // temp = { type:tempmsg.type, content:tempmsg.content, date:d, to, UID  }
                            return;
                          } else {
                            console.log("else type");
                            var filename = "file";
                            try {
                              filename = obj.content.substring(
                                obj.content.lastIndexOf("/") + 1,
                                obj.content.length
                              );
                            } catch {}
                            if (obj.unique) {
                              temp = {
                                type: obj.type,
                                name: filename,
                                src: obj.content,
                                date: d,
                                to: too,
                                UID: data.timestamp,
                                from: from,
                                msgXml: "stringifiedXml",
                                msgStanzaId: "",
                                unique: obj.unique,
                              };
                            } else {
                              temp = {
                                type: obj.type,
                                name: filename,
                                src: obj.content,
                                date: d,
                                to: too,
                                UID: data.timestamp,
                                from: from,
                                msgXml: "stringifiedXml",
                                msgStanzaId: "",
                              };
                            }

                            // console.log(temp);

                            // if(y["STANZA-ID"]){
                            //   temp.msgStanzaId=y["STANZA-ID"][0].$.ID
                            // }
                          }
                        }

                        if (temp) {
                          ChatService.myChats.forEach((val, ind) => {
                            if (val.jid == too || val.jid == from) {
                              console.log(
                                "----------------><-----------------"
                              );
                              // console.log(val)
                              // console.log('----------------><-----------------')
                              val.msg.push(temp);
                              // console.log('----------------::-----------------')
                              // console.log(val)
                              // console.log('----------------::-----------------')
                              counter = counter + 1;
                              triggerMsgs(val);
                            }
                          });
                        }
                      }
                    }
                  }
                });
              }
            });
          }
        }
      });
  }

  //To get the past messages from node backend instead of the MAM ejabberd backend server.
  callBackendtoGetChatAno(jid, acc?) {
    this.http
      .get(
        "https://staging-api.ososweb.com/getmessages/" +
          localStorage.getItem("id") +
          "-1" +
          "/" +
          jid.slice(0, jid.indexOf("@")),
        { withCredentials: true }
      )
      .subscribe((suc: any) => {
        console.log(suc);
        let myId = localStorage.getItem("id");
        let too;
        let from;
        let temp = undefined;
        if (suc) {
          if (suc.data) {
            let counter = 0;
            let triggerMsgs = (val) => {
              let jaii = undefined;
              if (counter == suc.data.length) {
                val.msg.forEach((val, ind) => {
                  if (val.type == "clearchat") {
                    jaii = ind;
                  }
                });
                if (jaii != undefined) {
                  val.msg = val.msg.slice(jaii);
                }
              }
            };
            suc.data.forEach((data, ind) => {
              console.log(data);
              if (data.txt) {
                let obj = JSON.parse(data.txt);
                // console.log(obj);
                var d = new Date(data.timestamp / 1000);
                // console.log(d)
                var xmlString = data.xml;

                // let stringifiedXml =new XMLSerializer().serializeToString(JSON.parse(data.xml));
                // console.log(xmlString)
                const parser = new Parser({ strict: false, trim: true });
                parser.parseString(xmlString, (err, result) => {
                  console.log(result);
                  if (result) {
                    if (result.MESSAGE) {
                      if (result.MESSAGE.$) {
                        too = result.MESSAGE.$.TO;
                        from = result.MESSAGE.$.FROM;

                        if (too.indexOf("/") != -1)
                          too = too.substring(0, too.indexOf("/"));

                        if (from.indexOf("/") != -1)
                          from = from.substring(0, from.indexOf("/"));

                        if (obj.type == "chat") {
                          temp = {
                            type: "text",
                            text: obj.content,
                            date: d,
                            to: too,
                            UID: data.timestamp,
                            from: from,
                            msgXml: "stringifiedXml",
                            msgStanzaId: "",
                            unique: obj.unique,
                          };
                        } else {
                          if (
                            obj.type == "exit" ||
                            obj.type == "resume" ||
                            obj.type == "block" ||
                            obj.type == "unblock"
                          ) {
                            // console.log(tempmsg.type);
                            // temp = { type:tempmsg.type, content:tempmsg.content, date:d, to, UID  }
                          } else {
                            console.log("else type");
                            var filename = "file";
                            try {
                              filename = obj.content.substring(
                                obj.content.lastIndexOf("/") + 1,
                                obj.content.length
                              );
                            } catch {}
                            if (obj.unique) {
                              temp = {
                                type: obj.type,
                                name: filename,
                                src: obj.content,
                                date: d,
                                to: too,
                                UID: data.timestamp,
                                from: from,
                                msgXml: "stringifiedXml",
                                msgStanzaId: "",
                                unique: obj.unique,
                              };
                            } else {
                              temp = {
                                type: obj.type,
                                name: filename,
                                src: obj.content,
                                date: d,
                                to: too,
                                UID: data.timestamp,
                                from: from,
                                msgXml: "stringifiedXml",
                                msgStanzaId: "",
                              };
                            }

                            // console.log(temp);

                            // if(y["STANZA-ID"]){
                            //   temp.msgStanzaId=y["STANZA-ID"][0].$.ID
                            // }
                          }
                        }

                        if (temp) {
                          if (too) {
                            ChatService.myAnoChats.forEach((val, ind) => {
                              if (val.jid == from || val.jid == too) {
                                val.msg.push(temp);
                                counter = counter + 1;
                                triggerMsgs(val);
                              }
                            });
                          }
                        }
                      }
                    }
                  }
                });
              }
            });
          }
        }
      });
  }

  chatLoadedArr = { loadedArr: [], norm: "jai", ano: "jai" };

  //This is used to send a iq to the ejabberd server.
  sendFunctionStrophe(sendMsg) {
    ChatService.reg_connection.sendIQ(sendMsg, (f) => {
      console.log(f);
    });
  }

  callMessagesToBackendNorm() {
    console.log("norm roster done");
  }

  callMessagesToBackendAno() {
    console.log("Ano roster done");
  }

  //We used to call this in the version 1, where we display the unread messages from the overall account.
  openedChatOfJid(jid, acc) {
    if (acc == 1) {
      //if it is account 1, then we should be iterating over the myChats
      _.map(ChatService.myChats, (user, ind) => {
        if (user.jid == jid) {
          //if the jid of the current and the jid of the person we are chatting to is the same..
          // Then we should make the unread count of that chat to 0;
          this.allTotalUnread = this.allTotalUnread - user.unread;
          this.featureDot.next({ unread: this.allTotalUnread });
          user.unread = 0;
        }
      });
    } else {
      //if it is account 2, then we should be iterating over the myAnoChats
      _.map(ChatService.myAnoChats, (user, ind) => {
        if (user.jid == jid) {
          //if the jid of the current and the jid of the person we are chatting to is the same..
          // Then we should make the unread count of that chat to 0;
          this.allTotalUnread = this.allTotalUnread - user.unread;
          this.featureDot.next({ unread: this.allTotalUnread });
          user.unread = 0;
        }
      });
    }
  }
  encryptedlogindata;
  //old function to encrypt and set the values.
  setEncrDetails(dat) {
    console.log(dat);

    this.cookieId = dat.id;
    this.cookieJid = dat.jid;
    this.cookieJidAno = dat.jidAno;
    this.sp_j_cp = dat.cp;

    this.encryptedlogindata = CryptoJS.AES.encrypt(
      JSON.stringify(dat),
      this.cookiePass
    ).toString();
    let encrid = CryptoJS.AES.encrypt(dat.id, this.cookiePass).toString();
    if (localStorage.getItem("sp_j_id")) {
    } else {
      localStorage.setItem("sp_j_id", encrid);
    }
    let cpp = CryptoJS.AES.encrypt(dat.cp, this.cookiePass).toString();
    if (localStorage.getItem("sp_j_cp")) {
    } else {
      localStorage.setItem("sp_j_cp", cpp);
    }
    localStorage.setItem("sp_j_cp", cpp);
    let encrjid = CryptoJS.AES.encrypt(dat.jid, this.cookiePass).toString();
    if (localStorage.getItem("sp_j_jd")) {
    } else {
      localStorage.setItem("sp_j_jd", encrjid);
    }

    let encrjidAno = CryptoJS.AES.encrypt(
      dat.jidAno,
      this.cookiePass
    ).toString();
    if (localStorage.getItem("sp_j_Jda")) {
    } else {
      localStorage.setItem("sp_j_Jda", encrjidAno);
    }

    let encralllogin = CryptoJS.AES.encrypt(
      JSON.stringify(dat),
      this.cookiePass
    ).toString();
    if (localStorage.getItem("sp_jlaoi")) {
    } else {
      localStorage.setItem("sp_jlaoi", encralllogin);
    }
  }

  //To connect the user to the ejabberd server.
  connect_xmpp(userI) {
    console.log("inside connect xmpp");
    let idd;
    try {
      idd = localStorage.getItem("id");
    } catch {}

    var userId = this.cookieId;
    if (idd) {
      userId = idd;
      this.cookieId = idd;
    }
    if (userId == null || userId == undefined) return;

    console.log("not returned connect xmpp");

    console.log("inside chat connection with encry password");
    try {
      setTimeout(() => {
        //Connecting to the web socket to the ejabberd server and saving the callback to the reg_connection after 2.5 seconds.
        //Again this time can be observed and reduced.
        ChatService.reg_connection = new $.Strophe.Connection(
          environment.websocket
        );
        console.log(ChatService.reg_connection);

        this.reg_connection_this = ChatService.reg_connection;
        // console.log('llllllllllllllllllllllllllllllmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm'+this.spaarksService.getUserDetailsEach('jid_main'))
        ChatService.reg_connection.connect(
          this.spaarksService.userDetailsArr[0].decrValue,
          this.spaarksService.userDetailsArr[2].decrValue,
          this.onConnectNorm
        );
      }, 1000);
    } catch {
      (err) => {
        console.log(err);
      };
    }

    try {
      //uncomment this to make the anonymous account to connect to the ejabberd server.
      // setTimeout(() => {
      //   //Connecting to the web socket to the ejabberd server and saving the callback to the ano_connection after 5 seconds.
      //   //Again this time can be observed and reduced.
      //   ChatService.ano_connection = new $.Strophe.Connection(environment.websocket);
      //   ChatService.ano_connection.connect(this.spaarksService.userDetailsArr[1].decrValue,
      //     this.spaarksService.userDetailsArr[2].decrValue,
      //     this.onConnectAnon);
      // }, 5000)
    } catch {
      (err) => {
        console.log(err);
      };
    }

    // setTimeout(() => {
    //   var iq = $.$iq({ type: 'get', }).c('query', { xmlns: 'jabber:iq:roster' });
    //   var iq2 = $.$iq({ type:'get'}).c('query',{xmlns:'http://jabber.org/protocol/disco#items'})
    //     console.log(iq)
    //   ChatService.reg_connection.sendIQ(iq, this.reg_on_roster);
    //   ChatService.reg_connection.send($.$pres());

    //   ChatService.reg_connection.addHandler(this.reg_on_message, null, "message", "chat")
    //   ChatService.reg_connection.addHandler(this.reg_presence, null, "presence", "subscribe")
    //   ChatService.reg_connection.addHandler(this.reg_oldMessages, null, "message", null)

    //   ChatService.ano_connection.sendIQ(iq, this.ano_on_roster);
    //   ChatService.ano_connection.send($.$pres());
    //   ChatService.reg_connection.sendIQ(iq2, this.ano_offline);
    //   ChatService.ano_connection.addHandler(this.ano_on_message, null, "message", "chat")
    //   ChatService.ano_connection.addHandler(this.ano_presence, null, "presence", "subscribe")
    //   ChatService.ano_connection.addHandler(this.ano_oldMessages, null, "message", null)

    //   ////////////////notifications
    //   var d = new Date();
    //   var p = d.getTime() * 1000;
    //   // var iq2 = $.$iq({ type: 'set', id: 'reg_oldmessages' }).c('query', { xmlns: 'urn:xmpp:mam:2' });
    //   //   iq2.c('x', { xmlns: 'jabber:x:data', type: 'submit' })
    //   //   iq2.c('field', { var: 'FORM_TYPE', type: 'hidden' }).c('value').t('urn:xmpp:mam:2').up().up();
    //   //   iq2.c('field', { var: 'with' }).c('value').t('notify_user@192.168.0.254').up().up().up()
    //   //   iq2.c('set', { xmlns: 'http://jabber.org/protocol/rsm' }).c('max').t(20).up()
    //   //   iq2.c('before').t(p)
    //   // ChatService.reg_connection.sendIQ(iq2, this.fun3)
    //   ////////////////
    //   var iq2 = $.$iq({ type: 'set', id: 'reg_oldmessages' }).c('query', { xmlns: 'urn:xmpp:mam:2' });
    //     iq2.c('x', { xmlns: 'jabber:x:data', type: 'submit' })
    //     iq2.c('field', { var: 'FORM_TYPE', type: 'hidden' }).c('value').t('urn:xmpp:mam:2').up().up();
    //     iq2.c('field', { var: 'with' }).c('value').t('notify_event@192.168.0.254').up().up().up()
    //     iq2.c('set', { xmlns: 'http://jabber.org/protocol/rsm' }).c('max').t(20).up()
    //     iq2.c('before').t(p)
    //   ChatService.reg_connection.sendIQ(iq2, this.fun2)
    // }, 5100);
  }

  //old function that is not being used now.
  connectNormal() {
    if (
      document.URL.includes("192.168.0.254") ||
      document.URL.includes("staging-angular.ososweb.com")
    ) {
      console.log("inside chat connection with encry password");

      ChatService.reg_connection = new $.Strophe.Connection(
        environment.websocket
      );
      this.reg_connection_this = ChatService.reg_connection;
      ChatService.reg_connection.connect(
        this.cookieJid,
        this.sp_j_cp,
        this.onConnectNorm
      );
    } else {
      ChatService.reg_connection = new $.Strophe.Connection(
        environment.websocket
      );
      this.reg_connection_this = ChatService.reg_connection;
      ChatService.reg_connection.connect(
        this.cookieJid,
        localStorage.getItem("id"),
        this.onConnectNorm
      );
    }
  }

  //old function that is not being used now.
  connectAno() {
    if (
      document.URL.includes("192.168.0.254") ||
      document.URL.includes("staging-angular.ososweb.com")
    ) {
      ChatService.ano_connection = new $.Strophe.Connection(
        environment.websocket
      );
      ChatService.ano_connection.connect(
        this.cookieJidAno,
        this.sp_j_cp,
        this.onConnectAnon
      );
    } else {
      ChatService.ano_connection = new $.Strophe.Connection(
        environment.websocket
      );
      ChatService.ano_connection.connect(
        this.cookieJidAno,
        localStorage.getItem("id") + "-1",
        this.onConnectAnon
      );
    }
  }

  //old function that is not being used now.
  // sendOldMessages(m, account) {
  //   try {
  //     var message = $.$msg({ to: m.activeJid, type: "chat" })
  //       .c("body")
  //       .t(JSON.stringify(m.msgOdj));
  //   } catch {
  //     return;
  //   }
  //   if (account == 1) {
  //     _.map(ChatService.myChats, (user) => {
  //       if (user.jid == m.activeJid) {
  //         user.msg.push(m);
  //       }
  //     });
  //     ChatService.reg_connection.send(message);
  //     // ChatService.myChats = ChatService.mergeSort(ChatService.myChats);
  //   } else {
  //     _.map(ChatService.myAnoChats, (user) => {
  //       if (user.jid == m.activeJid) {
  //         user.msg.push(m);
  //       }
  //     });
  //     ChatService.ano_connection.send(message);
  //     // ChatService.myAnoChats = ChatService.mergeSort(ChatService.myAnoChats); //change check see here
  //   }
  // }

  //this is used to disconnect the account's connection with the ejabberd server and then again connect after 2 seconds
  disconnect_xmpp(arg?) {
    // let arrcnt = 0;
    if (ChatService.reg_connection) {
      ChatService.reg_connection.disconnect();
    }
    if (ChatService.ano_connection) {
      ChatService.ano_connection.disconnect();
    }

    if (arg) {
      if (arg == "reconnectJai") {
        setTimeout(() => {
          this.connect_xmpp("jai");
        }, 2000);
      }
    }
  }
  x;

  //old function that is not being used now.
  onConnect(status) {
    if (status == $.Strophe.Status.CONNECTING) {
      // console.log('Strophe is connecting.');
    } else if (status == $.Strophe.Status.CONNFAIL) {
      // console.log('Strophe failed to connect.');
    } else if (status == $.Strophe.Status.DISCONNECTING) {
      // console.log('Strophe is disconnecting.');
    } else if (status == $.Strophe.Status.DISCONNECTED) {
      // console.log('Strophe is disconnected.');
    } else if (status == $.Strophe.Status.CONNECTED) {
      // console.log('Strophe is connected.');
      // console.log(ChatService.reg_connection)
    }
  }

  decryptedData;
  cookiePass = "osos123";
  userDetails;
  encryptedData;

  locallogindat = { id: "", jid: "", jidAno: "" };
  // This Function Decrypts id,jid,JidAno from encrypted cookie.
  //old function that is not being used now.
  toDecrypt(key?) {
    if (localStorage.getItem("sp_j_cp")) {
      this.decryptedData = localStorage.getItem("sp_j_cp");
      this.sp_j_cp = CryptoJS.AES.decrypt(
        this.decryptedData.trim(),
        this.cookiePass.trim()
      ).toString(CryptoJS.enc.Utf8);
    }
    if (localStorage.getItem("sp_jlaoi")) {
      let jai_encryDatLogin = CryptoJS.AES.decrypt(
        localStorage.getItem("sp_jlaoi").trim(),
        this.cookiePass.trim()
      ).toString(CryptoJS.enc.Utf8);
      this.locallogindat = JSON.parse(jai_encryDatLogin);
      console.log("......");
      this.setEncrDetails(this.locallogindat);
    } else {
      return;
    }

    switch (key) {
      case "id":
        console.log("id is Called");
        this.cookieId = this.locallogindat.id;
        return this.cookieId;

      case "jid":
        //key='jid';
        console.log("Jid is called");
        this.cookieJid = this.locallogindat.jid;
        this.rjid = this.cookieJid;
        return this.cookieJid;

      case "jidAno":
        console.log("jidAno is Called");
        this.cookieJidAno = this.locallogindat.jidAno;
        this.ajid = this.cookieJidAno;
        return this.cookieJidAno;
    }

    return this.userDetails;

    //   if(key=="details"){

    //     this.cookiePass="osos123"; // This Password Should Be Match With Backend
    //     if (key.trim() === "" || this.cookiePass.trim() === "") {
    //       console.log("please Fill proper details");
    //       return;
    //        }
    //       //console.log(key);
    //       var data = this.cookie.get("details");
    //       console.log(data+'--><--')
    //       console.log(data)
    //       this.decryptedData = CryptoJS.AES.decrypt(data.trim(),this.cookiePass.trim()).toString(CryptoJS.enc.Utf8);

    //       console.log("Decrypt Function");
    //       this.userDetails= JSON.parse(this.decryptedData);
    //       console.log(this.userDetails);

    //       // this.sp_j_id=this.userDetails[0].userid;
    //       // this.sp_j_jd=this.userDetails[1].user_jid;
    //       // this.sp_j_Jda=this.userDetails[2].user_jid_anonymous;

    //        this.cookieId=this.userDetails[0].userid;
    //        this.cookieJid=this.userDetails[1].user_jid;
    //        this.cookieJidAno=this.userDetails[2].user_jid_anonymous;

    //       // console.log(this.sp_j_id);
    //       // console.log(this.sp_j_jd);
    //       // console.log(this.sp_j_Jda);
    //       this.tempDetails(this.userDetails);
    //       //this.setDecryptedValues();
    //       if(localStorage.getItem("sp_j_cp")){
    //         this.decryptedData = localStorage.getItem("sp_j_cp");
    //         this.sp_j_cp = CryptoJS.AES.decrypt(this.decryptedData.trim(),this.cookiePass.trim()).toString(CryptoJS.enc.Utf8);
    //       }

    //   }

    // switch(key){

    //   case 'id':

    //     console.log('id is Called');
    //     this.cookieId = this.userDetails[0].userid;
    //     return this.cookieId;

    //   case 'jid':
    //     //key='jid';
    //     console.log('Jid is called');
    //     this.cookieJid = this.userDetails[1].user_jid;
    //     return this.cookieJid;

    //   case 'jidAno':

    //     console.log('jidAno is Called');
    //     this.cookieJidAno = this.userDetails[2].user_jid_anonymous;
    //     return this.cookieJidAno;

    // }

    // return this.userDetails;
  }
  // end of Fucntion

  // Temp Details will Encrypt and Store the data into local Storage
  //old function that is not being used now.
  tempDetails(userDetails, key?) {
    try {
      this.cookiePass = "osos123";
      if (key == "sp_j_cp") {
        console.log(userDetails);

        this.encryptedData = CryptoJS.AES.encrypt(
          userDetails,
          this.cookiePass
        ).toString();
        localStorage.setItem("sp_j_cp", this.encryptedData);
      } else {
        return;
        this.encryptedData = CryptoJS.AES.encrypt(
          userDetails[0].userid.trim(),
          this.cookiePass.trim()
        ).toString();
        localStorage.setItem("sp_j_id", this.encryptedData);

        this.encryptedData = CryptoJS.AES.encrypt(
          userDetails[1].user_jid.trim(),
          this.cookiePass.trim()
        ).toString();
        localStorage.setItem("sp_j_jd", this.encryptedData);

        this.encryptedData = CryptoJS.AES.encrypt(
          userDetails[2].user_jid_anonymous.trim(),
          this.cookiePass.trim()
        ).toString();
        localStorage.setItem("sp_j_Jda", this.encryptedData);
      }
    } catch {}
  }

  // setDecryptedValues(){
  // this.decryptedData = localStorage.getItem("sp_j_id");
  // this.sp_j_id = CryptoJS.AES.decrypt(this.decryptedData.trim(),this.cookiePass.trim()).toString(CryptoJS.enc.Utf8);

  // this.decryptedData = localStorage.getItem("sp_j_jd");
  // this.sp_j_jd = CryptoJS.AES.decrypt(this.decryptedData.trim(),this.cookiePass.trim()).toString(CryptoJS.enc.Utf8);

  // this.decryptedData = localStorage.getItem("sp_j_Jda");
  // this.sp_j_Jda = CryptoJS.AES.decrypt(this.decryptedData.trim(),this.cookiePass.trim()).toString(CryptoJS.enc.Utf8);

  // this.decryptedData = localStorage.getItem("sp_j_cp");
  // this.sp_j_cp = CryptoJS.AES.decrypt(this.decryptedData.trim(),this.cookiePass.trim()).toString(CryptoJS.enc.Utf8);

  // }

  //Encryption And Decryption Ends Here

  list = [];
  static noticeList = new Subject<any>();
  account = 1;

  //This is a handler that gets the callback when the normal account gets connected and the ejabberd sends the roster list to us.
  reg_on_roster(iq) {
    // alert('jj')
    console.log(iq);
    var xmlString = new XMLSerializer().serializeToString(iq);
    var temp = [];

    // not used
    const parser = new Parser({ strict: false, trim: true });
    parser.parseString(xmlString, (err, result) => {
      console.log(result);
      temp = result.IQ.QUERY[0].ITEM;
    });

    ChatService.myChats = [];
    var tempArr = [];
    if (temp) {
      temp.forEach((x, i) => {
        tempArr.push(x.$.JID);
      });
      // console.log(tempArr)
    }

    //used
    //Here we are emitting jidEmitter, thereby starting the process of getting the list from backend and getting old messages from MAM.
    ChatService.jidEmitter.next(tempArr);

    return true;
  }

  //This is a handler that gets the callback when the anonymous account gets connected and the ejabberd sends the roster list to us.
  ano_on_roster(iq) {
    // console.log(iq)
    var xmlString = new XMLSerializer().serializeToString(iq);
    var temp = [];
    const parser = new Parser({ strict: false, trim: true });
    parser.parseString(xmlString, (err, result) => {
      temp = result.IQ.QUERY[0].ITEM;
    });
    ChatService.myAnoChats = [];
    var tempArr = [];
    if (temp) {
      temp.forEach((x, i) => {
        tempArr.push(x.$.JID);
      });
      //console.log(tempArr)
    }
    //Here we are emitting jidEmitter, thereby starting the process of getting the list from backend and getting old messages from MAM.
    ChatService.jidEmitter2.next(tempArr);

    return true;
  }

  allTotalUnread = 0;
  static completedOldChats = false;
  static completedOldChatsAno = false;

  //change all forEach to lodash map and give seperate keys to blocked and blockedme... unblock and unblockedme

  //Every message that has chat and message in the xml being received by the regular acount will have to pass
  //through this function.
  reg_on_message = (x) => {
    console.log(x);
    //Here we are converting the xml to json format, by using the package xml2js.
    var xmlString = new XMLSerializer().serializeToString(x);
    const parser = new Parser({ strict: false, trim: true });
    console.log(xmlString);
    var jidFromAny = ""; //Other person jid
    var jidToAny = ""; //Our jid

    // var a = new Date();
    parser.parseString(xmlString, (err, result) => {
      //result is the final converted json from the xml.
      var a;
      console.log(result);
      try {
        //Initially we will not know if the message is being send by us or is being received by us.
        //So we will check for it here
        if (result.MESSAGE.RECEIVED) {
          //If the message contains received keyword, it means that that message is being received by us.
          if (result.MESSAGE.RECEIVED[0]) {
            //to know from which jid we got the message from..
            jidFromAny =
              result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM;

            //to know to which jid we got the message from..
            jidToAny = result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.TO;
            if (jidFromAny.indexOf("/") != -1) {
              //Here we are checking if the from jid contains a slash(/).. If there is a slash in the from jid, then it means that we need to slice the jid from 0th index to index of slash;
              jidFromAny = result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM.slice(
                0,
                result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM.indexOf(
                  "/"
                )
              );
            }

            if (jidToAny.indexOf("/") != -1) {
              //Here we are checking if the to jid contains a slash(/).. If there is a slash in the to jid, then it means that we need to slice the jid from 0th index to index of slash;
              jidToAny = result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.TO.slice(
                0,
                result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.TO.indexOf(
                  "/"
                )
              );
            }
            console.log(
              result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].BODY[0]
            );
          }
        } else if (result.MESSAGE.SENT) {
          if (result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.FROM) {
            if (
              result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.FROM.includes(
                this.cookieJid
              )
            ) {
            }
          }

          //The TO in the message is other person's jid.
          jidToAny = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.FROM;
          jidFromAny = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO;
          if (jidFromAny.indexOf("/") != -1) {
            //Here we are checking if the from jid contains a slash(/).. If there is a slash in the from jid, then it means that we need to slice the jid from 0th index to index of slash;
            jidFromAny = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.slice(
              0,
              result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.indexOf("/")
            );
          }

          if (jidToAny.indexOf("/") != -1) {
            //Here we are checking if the to jid contains a slash(/).. If there is a slash in the to jid, then it means that we need to slice the jid from 0th index to index of slash;
            jidToAny = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.FROM.slice(
              0,
              result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.FROM.indexOf("/")
            );
          }
          let temp = jidFromAny;
          jidFromAny = jidToAny;
          jidToAny = jidFromAny;
        } else if (result.MESSAGE.BODY) {
          //Here there is no slash in the jid, so we are directly assigning the to and from without manipulating it.
          jidToAny = result.MESSAGE.$.TO;
          jidFromAny = result.MESSAGE.$.FROM;
        }
      } catch {}
      //console.log(result.MESSAGE.$.FROM)
      if (result) {
        console.log(result);
        var bodyyy;
        var bodyyunchange;
        try {
          bodyyy = JSON.parse(result.MESSAGE.BODY);
          bodyyunchange = bodyyy;
        } catch {
          if (!bodyyy) {
            //if sent is existing in a message, then take body from send, else take it from received.. if received is existing
            if (result.MESSAGE.SENT) {
              bodyyy = JSON.parse(
                result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].BODY[0]
              );
              bodyyunchange = bodyyy;
            }
            if (result.MESSAGE.RECEIVED) {
              console.log("received");
              bodyyy = JSON.parse(
                result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].BODY[0]
              );
              bodyyunchange = bodyyy;
            }
          }
        }

        //console.log(bodyyy.type);

        //console.log(result.MESSAGE.$.TO);
        //console.log(result.MESSAGE.$.FROM);
        var xx = new Date();
        var msgggg;
        console.log(bodyyy);
        console.log(bodyyunchange);
        console.log(bodyyy.type);
        if (
          bodyyy.type != "deleteforboth" &&
          bodyyy.type != "deleteforboths" &&
          bodyyy.type != "delete" &&
          bodyyy.type != "exit" &&
          bodyyy.type != "resume" &&
          bodyyy.type != "block" &&
          bodyyy.type != "unblock" &&
          bodyyy.type != "image" &&
          bodyyy.type != "clearchat" &&
          bodyyy.type != "file" &&
          bodyyy.type != "audio" &&
          bodyyy.type != "video"
        ) {
          //If the body.type is not equal to none of the above types, then it must bea file. and we should assign its type as it is.
          msgggg = {
            text: bodyyy.content,
            type: "text",
            UID: JSON.stringify(xx.getTime() * 1000),
            date: xx,
            to: result.MESSAGE.$.TO,
            from: result.MESSAGE.$.FROM,
            unique: bodyyy.unique,
          };
        } else {
          if (bodyyy.type) {
            var toto = "";
            try {
              //in toto , we save the jid to which the message is being sent to .
              //if it is sent type message, then toto(message send to ) will be $.to.
              if (result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO) {
                if (
                  result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.indexOf(
                    "/"
                  ) != -1
                ) {
                  toto = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.slice(
                    0,
                    result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.indexOf(
                      "/"
                    )
                  );
                } else {
                  toto = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO;
                }
              }
            } catch {}

            try {
              if (result.MESSAGE.RECEIVED) {
                //if it is received type message, then toto(message send to ) will be $.from
                if (result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM) {
                  if (
                    result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM.indexOf(
                      "/"
                    ) != -1
                  ) {
                    toto = result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM.slice(
                      0,
                      result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM.indexOf(
                        "/"
                      )
                    );
                  } else {
                    toto =
                      result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM;
                  }
                }
              } else if (result.MESSAGE.SENT) {
                if (result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO) {
                  //if it is sent type message, then toto(message send to ) will be $.to
                  if (
                    result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.indexOf(
                      "/"
                    ) != -1
                  ) {
                    toto = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.slice(
                      0,
                      result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.indexOf(
                        "/"
                      )
                    );
                  } else {
                    toto = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO;
                  }
                }
              }
            } catch {}

            //if both from and to jid's are our own.. then it means that the message is a carbon.
            //meaning that the message is coming from our id to ourself. (probably from users mobile to someone else)
            //but that has to get reflected in web app aswell.
            if (
              result.MESSAGE.$.FROM.includes(this.cookieJid) &&
              result.MESSAGE.$.TO.includes(this.cookieJid)
            ) {
              console.log("same");
              if (result.MESSAGE.SENT) {
                //If the message has sent in it , that means the message is being send by us. But it should reflct in the other user's app aswell.

                if (bodyyy.type == "exit") {
                  console.log("exit itt");
                  console.log(jidFromAny);
                  //Any repeated functionlity with different values are being redirected to a different function.
                  this.loadashNormal(jidFromAny, "exit", "jai");
                } else if (bodyyy.type == "resume") {
                  console.log("resume itt");
                  //Any repeated functionlity with different values are being redirected to a different function.
                  this.loadashNormal(jidFromAny, "resume", "jai");
                } else if (bodyyy.type == "block") {
                  //Any repeated functionlity with different values are being redirected to a different function.
                  this.loadashNormal(jidFromAny, "block", "jai");
                  console.log("block itt");
                } else if (bodyyy.type == "unblock") {
                  console.log("unblock itt");
                  //Any repeated functionlity with different values are being redirected to a different function.
                  this.loadashNormal(jidFromAny, "unblock", "jai");
                } else if (bodyyy.type == "clearchat") {
                  console.log("clear chat itt");
                  try {
                    console.log(bodyyunchange);
                    //Any repeated functionlity with different values are being redirected to a different function.
                    this.loadashNormal(bodyyunchange.content, "clearchat", {
                      time: bodyyunchange.clearstamp,
                      reallyFromJai: true,
                    });
                  } catch {
                    console.log("catch in clear chat 971");
                  }
                }
              } else {
                //If the message does not have sent in it , that means the message is being received to us. But it should reflct in the other user's app aswell.
                if (bodyyy.type == "exit") {
                  console.log("exit ...");
                  console.log(toto);
                  //Any repeated functionlity with different values are being redirected to a different function.
                  this.loadashNormal(jidFromAny, "exitMe");
                } else if (bodyyy.type == "resume") {
                  console.log("resume ...");
                  //Any repeated functionlity with different values are being redirected to a different function.
                  this.loadashNormal(jidFromAny, "resumeMe");
                } else if (bodyyy.type == "block") {
                  //Any repeated functionlity with different values are being redirected to a different function.
                  this.loadashNormal(jidFromAny, "blockMe");
                  console.log("block ...");
                } else if (bodyyy.type == "unblock") {
                  console.log("unblock ...");
                  //Any repeated functionlity with different values are being redirected to a different function.
                  this.loadashNormal(jidFromAny, "unblockMe");
                } else if (bodyyy.type == "clearchat") {
                  console.log("clear chat ...");
                  try {
                    //Any repeated functionlity with different values are being redirected to a different function.
                    this.loadashNormal(bodyyunchange.content, "clearchat", {
                      time: bodyyunchange.time,
                    });
                  } catch {}
                }
              }
            } else {
              //if any one of the from or to does not match with our jid, then it might not be a carbon
              if (bodyyy.type == "exit") {
                console.log("exit ...");
                console.log(toto);
                this.loadashNormal(jidFromAny, "exitMe");
              } else if (bodyyy.type == "resume") {
                console.log("resume ...");

                this.loadashNormal(jidFromAny, "resumeMe");
              } else if (bodyyy.type == "block") {
                this.loadashNormal(jidFromAny, "blockMe");
                console.log("block ...");
              } else if (bodyyy.type == "unblock") {
                console.log("unblock ...");
                this.loadashNormal(jidFromAny, "unblockMe");
              }
            }
          }
          // if unique key is present in the message, then we can form a message that has unique key.
          // Else we willl not include unique key.
          // If unique key is absent, then we can delete the message.. That means that we will not be seeing delete option for the individual message.

          if (bodyyy.unique) {
            msgggg = {
              text: bodyyy.content,
              type: bodyyy.type,
              UID: JSON.stringify(xx.getTime() * 1000),
              date: xx,
              to: result.MESSAGE.$.TO,
              from: result.MESSAGE.$.FROM,
              unique: bodyyy.unique,
            };
          } else {
            msgggg = {
              text: bodyyy.content,
              type: bodyyy.type,
              UID: JSON.stringify(xx.getTime() * 1000),
              date: xx,
              to: result.MESSAGE.$.TO,
              from: result.MESSAGE.$.FROM,
            };
          }
        }
        console.log(msgggg); //Here1
        var too = result.MESSAGE.$.TO;
        var frommmsg = result.MESSAGE.$.FROM;
        try {
          if (result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM) {
            frommmsg =
              result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM;
            msgggg.from =
              result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM;
          }
        } catch {
          console.log("catch");
        }
        try {
          if (result.MESSAGE.SENT) {
            if (result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO) {
              frommmsg = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO;
              msgggg.to = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO;
            }
          }
        } catch {
          console.log("catch");
        }
        too = msgggg.to;
        frommmsg = msgggg.from;
        var funn = too;
        if (too.indexOf("/") != -1) {
          funn = too.slice(0, too.indexOf("/"));
          too = funn;
          msgggg.to = too;
        }
        if (frommmsg.indexOf("/") != -1) {
          frommmsg = frommmsg.slice(0, frommmsg.indexOf("/"));

          msgggg.from = frommmsg;
        }
        console.log(msgggg); //Here1
        console.log(frommmsg);

        console.log(result.MESSAGE.$.FROM);
        console.log(result.MESSAGE.$.FROM == this.cookieJid);

        if (
          result.MESSAGE.$.FROM.includes(this.cookieJid) &&
          result.MESSAGE.$.TO.includes(this.cookieJid)
        ) {
          // ChatService.myChats.forEach((val,ind)=>{
          //   console.log(ind);
          //   console.log(too);

          //   console.log(typeof(too));
          //   var funn = too;
          //   if(too.indexOf("/")!=-1){
          //      funn = too.slice(0,too.indexOf("/"));
          //      too = funn;
          //      msgggg.to = too;
          //   }
          //   msgggg.to = too;
          //   console.log(funn);
          //   console.log(val)

          //   if(val.jid==funn){
          //     console.log(ind);

          //     ChatService.myChats[ind].msg.push(msgggg);
          //     console.log(ChatService.myChats[ind].msg);

          //     ChatService.sortAtSite.next({key:'carbon'});
          //     ChatService.scrollToBottom.next({})
          //   }
          // })
          console.log(msgggg);
          console.log(too);
          console.log(ChatService.myChats);
          let toto = "";
          if (result.MESSAGE.SENT) {
            toto = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO;
          } else if (result.MESSAGE.RECEIVED) {
            toto = result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM;
          }

          if (toto.indexOf("/") != -1) {
            toto = toto.slice(0, toto.indexOf("/"));
          }
          // console.log(too)
          // console.log(toto)
          // console.log(this.activeJid)
          // console.log(jidFromAny)

          //   console.log(too)
          // console.log(toto)
          // console.log(this.activeJid)

          _.map(ChatService.myChats, (user) => {
            if (result.MESSAGE.SENT) {
              console.log("carbon with sent");
              if (
                result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.includes(
                  user.jid
                )
              ) {
                console.log(too);
                console.log(toto);
                console.log(
                  result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO
                );
                console.log(this.activeJid);

                console.log(msgggg.type);
                //this.msgList.next(user.msg);
                if (this.activeJid == toto) {
                  if (
                    msgggg.type == "exit" ||
                    msgggg.type == "resume" ||
                    msgggg.type == "block" ||
                    msgggg.type == "unblock"
                  ) {
                    if (msgggg.type == "exit") {
                      user.chatExit = true;
                    } else if (msgggg.type == "resume") {
                      user.chatExit = false;
                    } else if (msgggg.type == "block") {
                      user.blocked = true;
                    } else if (msgggg.type == "unblock") {
                      user.blocked = false;
                    } else if (msgggg.type == "delete") {
                      msgggg.delete = bodyyy;
                      console.log(msgggg);
                    } else if (msgggg.type == "deleteforboth") {
                      msgggg.delete = bodyyy;
                      console.log(msgggg);
                    }

                    ChatService.sortAtSite.next({
                      key: msgggg.type,
                      content: toto,
                      account: 1,
                      msg: msgggg,
                    });
                  }
                  try {
                    msgggg.unique = bodyyy.unique;
                    if (bodyyunchange.type) {
                      if (
                        bodyyunchange.type == "delete" ||
                        bodyyunchange.type == "deleteforboth"
                      ) {
                        msgggg.delete = bodyyy;
                      }
                    }
                  } catch {}
                  console.log(msgggg);

                  this.newchatsubj_jai.next({
                    newchat: true,
                    msg: msgggg,
                    from: toto,
                    account: 1,
                    unreadCnt: user.unread,
                  });
                  user.msg.push(msgggg);
                } else {
                  if (
                    msgggg.type == "exit" ||
                    msgggg.type == "resume" ||
                    msgggg.type == "block" ||
                    msgggg.type == "unblock" ||
                    msgggg.type == "clearchat"
                  ) {
                    if (msgggg.type == "exit") {
                      user.chatExit = true;
                    } else if (msgggg.type == "resume") {
                      user.chatExit = false;
                    } else if (msgggg.type == "block") {
                      user.blocked = true;
                    } else if (msgggg.type == "unblock") {
                      user.blocked = false;
                    } else if (msgggg.type == "delete") {
                      msgggg.delete = bodyyy;
                      console.log(msgggg);
                    } else if (msgggg.type == "deleteforboth") {
                      msgggg.delete = bodyyy;
                      console.log(msgggg);
                    } else if (msgggg.type == "clearchat") {
                      ///////////////////////////
                      try {
                        this.loadashNormal(bodyyunchange.content, "clearchat", {
                          time: bodyyunchange.time,
                        });
                      } catch {}
                    }

                    ChatService.sortAtSite.next({
                      key: msgggg.type,
                      content: toto,
                      account: 1,
                      msg: msgggg,
                    });
                  }

                  if (msgggg.type == "delete") {
                    msgggg.delete = bodyyy;
                  } else if (msgggg.type == "deleteforboth") {
                    msgggg.delete = bodyyy;
                  }
                  console.log(msgggg);
                  this.newchatsubj_jai.next({
                    newchat: false,
                    msg: msgggg,
                    from: toto,
                    account: 1,
                    unreadCnt: user.unread,
                  });
                  user.msg.push(msgggg);
                  if (
                    msgggg.from.includes(this.cookieJid) ||
                    msgggg.from.includes(this.cookieJidAno)
                  ) {
                  } else {
                    user.uread = user.unread + 1;
                    this.allTotalUnread = this.allTotalUnread + 1;
                    this.featureDot.next({ unread: this.allTotalUnread });
                  }
                }
              }
            }

            if (result.MESSAGE.RECEIVED) {
              console.log(too);
              console.log(toto);
              console.log(
                result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.TO
              );
              console.log(this.activeJid);
              console.log("carbon with received");
              if (
                result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM.includes(
                  user.jid
                )
              ) {
                console.log(user.jid);
                user.msg.push(msgggg);

                if (this.activeJid == toto) {
                  this.newchatsubj_jai.next({
                    newchat: true,
                    msg: msgggg,
                    from: toto,
                    account: 1,
                    unreadCnt: user.unread,
                  });
                  user.msg.push(msgggg);
                } else {
                  this.newchatsubj_jai.next({
                    newchat: false,
                    msg: msgggg,
                    from: toto,
                    account: 1,
                    unreadCnt: user.unread,
                  });
                  user.msg.push(msgggg);
                  if (
                    msgggg.from.includes(this.cookieJid) ||
                    msgggg.from.includes(this.cookieJidAno)
                  ) {
                  } else {
                    user.uread = user.unread + 1;
                    this.allTotalUnread = this.allTotalUnread + 1;
                    this.featureDot.next({ unread: this.allTotalUnread });
                  }
                }
              }
            }
          });

          // _.map(ChatService.myChats, (user) => {
          //   var funn = too;
          //   if(too.indexOf("/")!=-1){
          //      funn = too.slice(0,too.indexOf("/"));
          //      too = funn;
          //      msgggg.to = too;
          //   }
          //   msgggg.to = too;
          //   console.log(funn);
          //   console.log(too);
          //   if(user.jid==funn){
          //     console.log('carbonn')

          //     user.msg.push(msgggg);

          //     //this.msgList.next(user.msg);
          //     ChatService.sortAtSite.next({key:'carbon'});
          //     ChatService.scrollToBottom.next({})
          //     return;
          //   }
          // })
        }

        if (result.MESSAGE.$.FROM.includes(this.cookieJid)) {
          console.log("returning from chats");
          return;
        }
      }

      var resultt = result;
      // console.log(resultt.MESSAGE.$.FROM)
      console.log(typeof resultt.MESSAGE.$.FROM);
      var fromm = resultt.MESSAGE.$.FROM;
      var finFrom;
      finFrom = fromm.indexOf("/");
      var finaljidfrom;
      if (finFrom != -1) {
        finaljidfrom = resultt.MESSAGE.$.FROM.slice(0, finFrom);
      } else {
        finaljidfrom = resultt.MESSAGE.$.FROM;
      }
      if (!result.MESSAGE.$.FROM.includes(this.cookieJid)) {
      }

      console.log(finaljidfrom);
      console.log(ChatService.regJidArr);
      // console.log(ChatService.regJidArr);
      if (ChatService.regJidArr.includes(finaljidfrom)) {
      } else {
        console.log("new roster add,, new message");
        ChatService.jidEmitter.next([]);
        ChatService.refreshList.next([]);
      }

      if (
        result.MESSAGE.ARCHIVED != undefined &&
        result.MESSAGE.ARCHIVED != null
      ) {
        a = new Date(result.MESSAGE.ARCHIVED[0].$.ID / 1000);
      }
      if (result.MESSAGE.BODY != undefined && result.MESSAGE.BODY != null) {
        var str = result.MESSAGE.$.FROM;
        var pos = str.indexOf("/");
        str = str.substring(0, pos);
        var msgBody = result.MESSAGE.BODY[0];
        // console.log(msgBody)
        var msgObj;
        try {
          msgObj = JSON.parse(msgBody);
        } catch {
          if (msgObj == undefined) {
            return;
          }
        }

        console.log(msgObj);
        console.log(result.MESSAGE.$.TO);
        //Checking if the message is for account 1 or 2
        if (result.MESSAGE.$.TO.includes(this.cookieJid)) {
          msgObj.account = 1;
        } else {
          msgObj.account = 2;
        }
        console.log(msgObj);
        if (msgObj.type == "notification") {
          console.log(msgObj);
          // console.log(str)
          ChatService.noticeList.next(msgObj);
          return true;
        }
        //checking if the type of message is block.
        if (msgObj.type == "block") {
          // ChatService.myChats.forEach((val,ind)=>{
          //   if(val.jid==msgObj.content){
          //     console.log(val);

          //     ChatService.myChats[ind].blockedMe = true;
          //     ChatService.myChats[ind].msg.push({ text: msgObj.content, date: a, to: msgObj.content, type: 'block' })
          //     console.log(val);
          //       ChatService.sortAtSite.next({key:'block',content:msgObj.content,account:1});
          //   }
          // })

          _.map(ChatService.myChats, (user) => {
            //iterate over the list of normal chats
            if (user.jid == msgObj.content) {
              //in msgObj.content we will get which person to block,,

              //console.log(val);

              //change the blockedme flag, to true....
              user.blockedMe = true;

              //push that new message to user's messages.
              user.msg.push({
                text: msgObj.content,
                date: a,
                to: msgObj.content,
                type: "block",
              });
              //console.log(val);
              //with sortatsite, we will let the components know that some user's val;ue got
              // changed and it needs to be updated in the view
              ChatService.sortAtSite.next({
                key: "block",
                content: msgObj.content,
                account: 1,
              });

              //  if(msgObj.account==1){
              //   ChatService.sortAtSite.next({key:'block',content:msgObj.content,account:1});
              //  }
            }
          });

          // ChatService.myAnoChats.forEach((val,ind)=>{
          //   if(val.jid==msgObj.content){
          //     console.log(val);
          //     ChatService.myAnoChats[ind].blockedMe = true;
          //     ChatService.myAnoChats[ind].msg.push({ text: msgObj.content, date: a, to: msgObj.content, type: 'block' })
          //     console.log(val);
          //       ChatService.sortAtSite.next({key:'block',content:msgObj.content,account:1});
          //   }
          // })

          _.map(ChatService.myAnoChats, (user) => {
            //iterate over the list of normal chats
            if (user.jid == msgObj.content) {
              //in msgObj.content we will get which person to block,,
              //onsole.log(val);

              //change the blockedme flag, to true....
              user.blockedMe = true;

              //with sortatsite, we will let the components know that some user's val;ue got
              // changed and it needs to be updated in the view
              user.msg.push({
                text: msgObj.content,
                date: a,
                to: msgObj.content,
                type: "block",
              });
              ///console.log(val);
              ChatService.sortAtSite.next({
                key: "block",
                content: msgObj.content,
                account: 2,
              });
              //  if(msgObj.account==2){
              //   ChatService.sortAtSite.next({key:'block',content:msgObj.content,account:2});
              //  }
            }
          });
        }
        //checking if the type of the message is unblock
        if (msgObj.type == "unblock") {
          // ChatService.myChats.forEach((val,ind)=>{
          //   if(val.jid==msgObj.content){
          //     ChatService.myChats[ind].blockedMe = false;
          //     ChatService.myChats[ind].msg.push({ text: msgObj.content, date: a, to: msgObj.content, type: 'unblock' })
          //       ChatService.sortAtSite.next({key:'unblockedme',content:msgObj.content,account:1});
          //   }
          // })

          _.map(ChatService.myChats, (user) => {
            //iterate over normal chats list
            if (user.jid == msgObj.content) {
              //checking if the person we want to block and the current iterating user's jid is same or not./
              //console.log(val);

              user.blockedMe = false;
              //change the blockedme flag to false

              //push that message to that user's messages array.
              user.msg.push({
                text: msgObj.content,
                date: a,
                to: msgObj.content,
                type: "unblock",
              });
              //console.log(val);

              //nexting that through sortatsight so that the ui will be updated,, like shiowing the input bar to the user
              ChatService.sortAtSite.next({
                key: "unblock",
                content: msgObj.content,
                account: 1,
              });
              //  if(msgObj.account==1){
              //   ChatService.sortAtSite.next({key:'unblock',content:msgObj.content,account:1});
              //  }
            }
          });

          // ChatService.myAnoChats.forEach((val,ind)=>{
          //   if(val.jid==msgObj.content){
          //     console.log(val);
          //     ChatService.myAnoChats[ind].blockedMe = true;
          //     ChatService.myAnoChats[ind].msg.push({ text: msgObj.content, date: a, to: msgObj.content, type: 'block' })
          //     console.log(val);
          //       ChatService.sortAtSite.next({key:'block',content:msgObj.content,account:1});
          //   }
          // })

          _.map(ChatService.myAnoChats, (user) => {
            //iterating over the anonymous list of chat users
            if (user.jid == msgObj.content) {
              //checking if the jid of the mesage is same as the current iterating user's jid.
              //console.log(val);
              user.blockedMe = false;
              //change the blockedme to false;

              //push that message to the messages array of that user, so that we can preview ot in the list of users.
              user.msg.push({
                text: msgObj.content,
                date: a,
                to: msgObj.content,
                type: "unblock",
              });
              ///console.log(val);

              //nexting, so that the components that get this will update their values.
              ChatService.sortAtSite.next({
                key: "unblock",
                content: msgObj.content,
                account: 2,
              });
              //  if(msgObj.account==2){
              //   ChatService.sortAtSite.next({key:'unblock',content:msgObj.content,account:2});
              //  }
            }
          });
        }

        //checking if the type of the message is unblock
        if (msgObj.type == "exit") {
          try {
            //alert('ll')
            _.map(ChatService.myChats, (user) => {
              //iterate over normal chats list
              if (user.jid == msgObj.content) {
                //checking if the person we want to block and the current iterating user's jid is same or not./

                user.msg.push({
                  text: msgObj.content,
                  date: a,
                  to: result.MESSAGE.$.TO,
                  type: "exit",
                });
                //change the chatExitMe flag to true

                //push that message to that user's messages array.
                user.chatExitMe = true;
                console.log(user);
                if (msgObj.account == 1) {
                  console.log(msgObj);
                  //nexting that through sortatsight so that the ui will be updated,, like shiowing the input bar to the user
                  ChatService.sortAtSite.next({
                    key: "exitme",
                    content: msgObj.content,
                    account: 1,
                  });
                  return;
                }
              }
            });

            _.map(ChatService.myAnoChats, (user) => {
              //iterating over the anonymous list of chat users
              if (user.jid == msgObj.content) {
                //checking if the jid of the mesage is same as the current iterating user's jid.
                //onsole.log(val);
                user.chatExitMe = true;
                //change the chatExitMe to true;

                //push that message to the messages array of that user, so that we can preview ot in the list of users.
                user.msg.push({
                  text: msgObj.content,
                  date: a,
                  to: result.MESSAGE.$.TO,
                  type: "exit",
                });
                ///console.log(val);
                if (msgObj.account == 2) {
                  console.log(msgObj);

                  //nexting, so that the components that get this will update their values.
                  ChatService.sortAtSite.next({
                    key: "exitme",
                    content: msgObj.content,
                    account: 2,
                  });
                  return;
                }
              }
            });
          } catch {
            console.log("chat service exit catch");
          }
        }

        if (msgObj.type == "resume") {
          _.map(ChatService.myChats, (user) => {
            if (user.jid == msgObj.content) {
              console.log(msgObj);

              user.msg.push({
                text: msgObj.content,
                date: a,
                to: result.MESSAGE.$.TO,
                type: "resume",
              });
              user.chatExitMe = false;
              //console.log(val);
              if (msgObj.account == 1) {
                ChatService.sortAtSite.next({
                  key: "resumeme",
                  content: msgObj.content,
                  account: 1,
                });
                return;
              }
            }
          });

          _.map(ChatService.myAnoChats, (user) => {
            if (user.jid == msgObj.content) {
              console.log(msgObj);
              user.chatExitMe = false;
              user.msg.push({
                text: msgObj.content,
                date: a,
                to: result.MESSAGE.$.TO,
                type: "resume",
              });
              ///console.log(val);
              if (msgObj.account == 2) {
                ChatService.sortAtSite.next({
                  key: "resumeme",
                  content: msgObj.content,
                  account: 2,
                });
                return;
              }
            }
          });
        }
        var x = new Date();
        // ChatService.myChats.forEach((val,ind)=>{
        //   if(val.jid==msgObj.content){
        //     var i = ind;
        //     if( msgObj.type=="exit" )
        //     {
        //       ChatService.myChats[i].msg.push({ text: msgObj.content, date: a, to: result.MESSAGE.$.TO, type: 'exit' })
        //       ChatService.myChats[i].chatExitMe=true;
        //       // console.log(ChatService.myChats);
        //       ChatService.sortAtSite.next({key:'exit',content:finaljidfrom});

        //     }
        //     else if( msgObj.type=="resume")
        //     {
        //       ChatService.myChats[i].msg.push({ text: msgObj.content, date: a, to: result.MESSAGE.$.TO, type: 'resume' })
        //       ChatService.myChats[i].chatExitMe=false;
        //       // console.log(ChatService.myChats);
        //       ChatService.sortAtSite.next({key:'resume',content:finaljidfrom});
        //     }
        //   }
        // })
        //my chats
        _.map(ChatService.myChats, (user) => {
          if (user.jid == finaljidfrom) {
            //var i = ind;
            // if( msgObj.type=="exit" )
            // {
            //   user.msg.push({ text: msgObj.content, date: a, to: result.MESSAGE.$.TO, type: 'exit' })
            //   user.chatExitMe=true;
            //   // console.log(ChatService.myChats);
            //   ChatService.sortAtSite.next({key:'exitme',content:finaljidfrom, account:1});

            // }
            // else if( msgObj.type=="resume")
            // {
            //   user.msg.push({ text: msgObj.content, date: a, to: result.MESSAGE.$.TO, type: 'resume' })
            //   user.chatExitMe=false;
            //   // console.log(ChatService.myChats);
            //   ChatService.sortAtSite.next({key:'resumeme',content:finaljidfrom, account:1});
            // }

            //If the chat message type is none of the above,, that means it is a media file.
            if (
              msgObj.type != "chat" &&
              msgObj.type != "exit" &&
              msgObj.type != "resume" &&
              msgObj.type != "block" &&
              msgObj.type != "unblock" &&
              msgObj.type != "clear" &&
              msgObj.type != "clearchat" &&
              msgObj.type != "clearChat" &&
              msgObj.type != "delete" &&
              msgObj.type != "deleteforboth"
            ) {
              //check media type
              console.log("media files or file");
              // ChatService.isUrl(url) && msgBody.length > 30
              //  ChatService.myAnoChats[i].chatExit=false;
              //   ChatService.myAnoChats[i].blockedMe=false;
              var url = msgObj.content;
              //Inorder to preview the file or do something about it, we will get the url for that file in msgObj.content
              //   var extension = url.substring(url.lastIndexOf('.') + 1, url.length);
              var filename;
              try {
                filename = url.substring(url.lastIndexOf("/") + 1, url.length);
              } catch {}

              var temp;
              //Building the message object to push to the array of the messages.
              if (msgObj.unique) {
                temp = {
                  type: msgObj.type,
                  name: filename,
                  src: url,
                  date: new Date(),
                  to: result.MESSAGE.$.TO,
                  from: finaljidfrom,
                  UID: x.getTime() * 1000,
                  unique: msgObj.unique,
                };
              } else {
                temp = {
                  type: msgObj.type,
                  name: filename,
                  src: url,
                  date: new Date(),
                  to: result.MESSAGE.$.TO,
                  from: finaljidfrom,
                  UID: x.getTime() * 1000,
                };
              }

              //If the jid of the person that got the message from and the jid of the person we are chatting with are NOT same
              //Then we should send a featureDot (to update unread messages)
              if (this.activeJid != user.jid) {
                if (ChatService.completedOldChats == true) {
                  this.allTotalUnread = this.allTotalUnread + 1;
                  user.unread = user.unread + 1;
                  this.featureDot.next({ unread: this.allTotalUnread });
                  user.msg.push(temp);
                  this.newchatsubj_jai.next({
                    newchat: false,
                    msg: temp,
                    from: finaljidfrom,
                    account: 1,
                    unreadCnt: user.unread,
                  });
                }
              } else if (this.activeJid == user.jid) {
                //Or else ,, just update the message in the chat component with this subject.
                user.msg.push(temp);
                this.newchatsubj_jai.next({
                  newchat: true,
                  msg: temp,
                  from: finaljidfrom,
                  account: 1,
                  unreadCnt: user.unread,
                });
              }

              // if((this.activeJid==user.jid)&& ChatService.account==1){
              //     this.msgList.next(user.msg)
              // }
            } else if (msgObj.type == "chat") {
              //If the type of the message is chat, then we do the following.

              //   ChatService.myAnoChats[i].chatExit=false;
              //   ChatService.myAnoChats[i].blockedMe=false;
              //alert('klll')

              var v = {
                text: msgObj.content,
                date: a,
                to: result.MESSAGE.$.TO,
                type: "text",
                UID: x.getTime() * 1000,
                from: finaljidfrom,
                unique: msgObj.unique,
              };
              //building sample message object here..
              console.log(v); //Here2
              if (this.activeJid != finaljidfrom) {
                //If the message is not from the person that we are currently chatting with..
                // then we increase the unread count and them notify the other chat components by nexting the same.
                console.log("not eaual , so emiting new message false");
                if (ChatService.completedOldChats == true) {
                  this.allTotalUnread = this.allTotalUnread + 1;
                  user.unread = user.unread + 1;
                  this.featureDot.next({ unread: this.allTotalUnread });
                  user.msg.push(v);
                  this.newchatsubj_jai.next({
                    newchat: false,
                    msg: v,
                    from: finaljidfrom,
                    account: 1,
                    unreadCnt: user.unread,
                  });
                }
              } else if (this.activeJid == finaljidfrom) {
                //Else, just push it to the essages array and then notifiy the chat components about the new update about the view.
                console.log("not eaual , so emiting new message false");
                user.msg.push(v);
                this.newchatsubj_jai.next({
                  newchat: true,
                  msg: v,
                  from: finaljidfrom,
                  account: 1,
                  unreadCnt: user.unread,
                });
              }
              console.log(user.msg);

              console.log(user.msg);

              //   if((this.activeJid==user.jid)&& ChatService.account==1){
              //     this.msgList.next(user.msg)
              // }
              //this.msgList.next(user.msg);
            } else if (
              msgObj.type == "delete" ||
              msgObj.type == "deleteforboth"
            ) {
              //If the type of the message is either delete or deleteforboth, then this following code will execute
              var ve = {
                text: msgObj.content,
                date: a,
                to: result.MESSAGE.$.TO,
                type: "text",
                UID: x.getTime() * 1000,
                from: finaljidfrom,
                unique: msgObj.unique,
                delete: msgObj,
              };
              //building sample format for the delete or deleteforboth messages.
              console.log(ve); //Here2
              if (this.activeJid != finaljidfrom) {
                //If the message is not from the person that we are currently chatting with..
                // then we increase the unread count and them notify the other chat components by nexting the same.
                console.log("not eaual , so emiting new message false");
                if (ChatService.completedOldChats == true) {
                  this.allTotalUnread = this.allTotalUnread + 1;
                  user.unread = user.unread + 1;
                  this.featureDot.next({ unread: this.allTotalUnread });
                  //user.msg.push(v)
                  user.msg.forEach((vall, indd) => {
                    if (vall.unique) {
                      if (vall.unique == ve.delete.unique) {
                        if (ve.delete.type == "deleteforboth") {
                          vall.type = ve.delete.type;
                        } else {
                          if (
                            ve.delete.myjid == this.cookieJid ||
                            ve.delete.myjid == this.cookieJidAno
                          ) {
                            vall.type = ve.delete.type;
                          }
                        }
                      }
                    }
                  });
                  this.newchatsubj_jai.next({
                    newchat: false,
                    msg: ve,
                    from: finaljidfrom,
                    account: 1,
                    unreadCnt: user.unread,
                  });
                }
              } else if (this.activeJid == finaljidfrom) {
                //Else, just change the type of the message and then next the object to chat related components, so that the view gets updated
                console.log(" eaual , so emiting new message true");
                // user.msg.push(ve)
                user.msg.forEach((vall, indd) => {
                  if (vall.unique) {
                    if (vall.unique == ve.delete.unique) {
                      if (ve.delete.type == "deleteforboth") {
                        vall.type = ve.delete.type;
                      } else {
                        if (
                          ve.delete.myjid == this.cookieJid ||
                          ve.delete.myjid == this.cookieJidAno
                        ) {
                          vall.type = ve.delete.type;
                        }
                      }
                    }
                  }
                });
                this.newchatsubj_jai.next({
                  newchat: true,
                  msg: ve,
                  from: finaljidfrom,
                  account: 1,
                  unreadCnt: user.unread,
                });
              }
              console.log(user.msg);

              console.log(user.msg);
            }
          }
        });
      } else {
        //console.log(result)
      }
    });

    // ChatService.myChats = ChatService.mergeSort(ChatService.myChats);
    // ChatService.sortAtSite.next('yoo');
    return true;
  };

  //same functionality of reg_on_msg, only change is that here we will get the messages to the anonymous account.
  //and we generally iterate through anonymous chat roster. and messages will be to the anonymous user.

  ano_on_message_two = (x) => {
    console.log(x);
    var xmlString = new XMLSerializer().serializeToString(x);
    const parser = new Parser({ strict: false, trim: true });
    console.log(xmlString);
    var jidFromAny = ""; //Other person jid
    var jidToAny = ""; //Our jid

    // var a = new Date();
    parser.parseString(xmlString, (err, result) => {
      var a;
      console.log(result);
      if (result.MESSAGE.RECEIVED) {
        if (result.MESSAGE.RECEIVED[0]) {
          jidFromAny =
            result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM;
          jidToAny = result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.TO;
          if (jidFromAny.indexOf("/") != -1) {
            jidFromAny = result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM.slice(
              0,
              result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM.indexOf(
                "/"
              )
            );
          }

          if (jidToAny.indexOf("/") != -1) {
            jidToAny = result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.TO.slice(
              0,
              result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.TO.indexOf(
                "/"
              )
            );
          }
          console.log(
            result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].BODY[0]
          );
        }
      } else if (result.MESSAGE.SENT) {
        if (result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.FROM) {
          if (
            result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.FROM.includes(
              this.cookieJidAno
            )
          ) {
          }
        }
        //sent lo TO vere vadidi
        jidToAny = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.FROM;
        jidFromAny = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO;
        if (jidFromAny.indexOf("/") != -1) {
          jidFromAny = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.slice(
            0,
            result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.indexOf("/")
          );
        }

        if (jidToAny.indexOf("/") != -1) {
          jidToAny = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.FROM.slice(
            0,
            result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.FROM.indexOf("/")
          );
        }
        let temp = jidFromAny;
        jidFromAny = jidToAny;
        jidToAny = jidFromAny;
      } else if (result.MESSAGE.BODY) {
        jidToAny = result.MESSAGE.$.TO;
        jidFromAny = result.MESSAGE.$.FROM;
      }
      //console.log(result.MESSAGE.$.FROM)
      if (result) {
        // console.log(result.MESSAGE.BODY);
        var bodyyy;
        var bodyyunchange;
        try {
          bodyyy = JSON.parse(result.MESSAGE.BODY);
          bodyyunchange = bodyyy;
        } catch {
          if (!bodyyy) {
            if (result.MESSAGE.SENT) {
              bodyyy = JSON.parse(
                result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].BODY[0]
              );
              bodyyunchange = bodyyy;
            }
            if (result.MESSAGE.RECEIVED) {
              console.log("received");
              bodyyy = JSON.parse(
                result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].BODY[0]
              );
              bodyyunchange = bodyyy;
            }
          }
        }

        //console.log(bodyyy.type);

        //console.log(result.MESSAGE.$.TO);
        //console.log(result.MESSAGE.$.FROM);
        var xx = new Date();
        var msgggg;
        if (
          bodyyy.type != "deleteforboth" &&
          bodyyy.type != "deleteforboths" &&
          bodyyy.type != "delete" &&
          bodyyy.type != "exit" &&
          bodyyy.type != "clearchat" &&
          bodyyy.type != "resume" &&
          bodyyy.type != "block" &&
          bodyyy.type != "unblock" &&
          bodyyy.type != "image" &&
          bodyyy.type != "file" &&
          bodyyy.type != "audio" &&
          bodyyy.type != "video"
        ) {
          msgggg = {
            text: bodyyy.content,
            type: "text",
            UID: JSON.stringify(xx.getTime() * 1000),
            date: xx,
            to: result.MESSAGE.$.TO,
            from: result.MESSAGE.$.FROM,
          };
        } else {
          if (bodyyy.type) {
            var toto = "";
            try {
              if (result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO) {
                if (
                  result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.indexOf(
                    "/"
                  ) != -1
                ) {
                  toto = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.slice(
                    0,
                    result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.indexOf(
                      "/"
                    )
                  );
                } else {
                  toto = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO;
                }
              }
            } catch {}

            try {
              if (result.MESSAGE.RECEIVED) {
                if (result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM) {
                  if (
                    result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM.indexOf(
                      "/"
                    ) != -1
                  ) {
                    toto = result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM.slice(
                      0,
                      result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM.indexOf(
                        "/"
                      )
                    );
                  } else {
                    toto =
                      result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM;
                  }
                }
              } else if (result.MESSAGE.SENT) {
                if (result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO) {
                  if (
                    result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.indexOf(
                      "/"
                    ) != -1
                  ) {
                    toto = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.slice(
                      0,
                      result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.indexOf(
                        "/"
                      )
                    );
                  } else {
                    toto = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO;
                  }
                }
              }
            } catch {}
            if (
              result.MESSAGE.$.FROM.includes(this.cookieJidAno) &&
              result.MESSAGE.$.TO.includes(this.cookieJidAno)
            ) {
              console.log("same");
              if (result.MESSAGE.SENT) {
                if (bodyyy.type == "exit") {
                  console.log("exit itt");
                  console.log(jidFromAny);
                  this.loadashAno(jidFromAny, "exit", "jai");
                } else if (bodyyy.type == "resume") {
                  console.log("resume itt");

                  this.loadashAno(jidFromAny, "resume", "jai");
                } else if (bodyyy.type == "block") {
                  this.loadashAno(jidFromAny, "block", "jai");
                  console.log("block itt");
                } else if (bodyyy.type == "unblock") {
                  console.log("unblock itt");
                  this.loadashAno(jidFromAny, "unblock", "jai");
                } else if (bodyyy.type == "clearchat") {
                  console.log("clear chat itt");
                  try {
                    this.loadashAno(jidFromAny, "clearchat", {
                      time: bodyyunchange.time,
                      reallyFromJai: true,
                    });
                  } catch {}
                }
              } else {
                if (bodyyy.type == "exit") {
                  console.log("exit ...");
                  console.log(toto);
                  this.loadashAno(jidFromAny, "exitMe");
                } else if (bodyyy.type == "resume") {
                  console.log("resume ...");

                  this.loadashAno(jidFromAny, "resumeMe");
                } else if (bodyyy.type == "block") {
                  this.loadashAno(jidFromAny, "blockMe");
                  console.log("block ...");
                } else if (bodyyy.type == "unblock") {
                  console.log("unblock ...");
                  this.loadashAno(jidFromAny, "unblockMe");
                } else if (bodyyy.type == "clearchat") {
                  console.log("clear chat itt");
                  try {
                    this.loadashAno(jidFromAny, "clearchat", {
                      time: bodyyunchange.time,
                      reallyFromJai: true,
                    });
                  } catch {}
                }
              }
            } else {
              if (bodyyy.type == "exit") {
                console.log("exit ...");
                console.log(toto);
                this.loadashAno(jidFromAny, "exitMe");
              } else if (bodyyy.type == "resume") {
                console.log("resume ...");

                this.loadashAno(jidFromAny, "resumeMe");
              } else if (bodyyy.type == "block") {
                this.loadashAno(jidFromAny, "blockMe");
                console.log("block ...");
              } else if (bodyyy.type == "unblock") {
                console.log("unblock ...");
                this.loadashAno(jidFromAny, "unblockMe");
              }
            }
          }
          if (bodyyy.unique) {
            msgggg = {
              text: bodyyy.content,
              type: bodyyy.type,
              UID: JSON.stringify(xx.getTime() * 1000),
              date: xx,
              to: result.MESSAGE.$.TO,
              from: result.MESSAGE.$.FROM,
              unique: bodyyy.unique,
            };
          } else {
            msgggg = {
              text: bodyyy.content,
              type: bodyyy.type,
              UID: JSON.stringify(xx.getTime() * 1000),
              date: xx,
              to: result.MESSAGE.$.TO,
              from: result.MESSAGE.$.FROM,
            };
          }
        }
        console.log(msgggg); //Here1
        var too = result.MESSAGE.$.TO;
        var frommmsg = result.MESSAGE.$.FROM;
        try {
          if (result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM) {
            frommmsg =
              result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM;
            msgggg.from =
              result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM;
          }
        } catch {
          console.log("catch");
        }
        try {
          if (result.MESSAGE.SENT) {
            if (result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO) {
              frommmsg = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO;
              msgggg.to = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO;
            }
          }
        } catch {
          console.log("catch");
        }
        too = msgggg.to;
        frommmsg = msgggg.from;
        var funn = too;
        if (too.indexOf("/") != -1) {
          funn = too.slice(0, too.indexOf("/"));
          too = funn;
          msgggg.to = too;
        }
        if (frommmsg.indexOf("/") != -1) {
          frommmsg = frommmsg.slice(0, frommmsg.indexOf("/"));

          msgggg.from = frommmsg;
        }
        console.log(msgggg); //Here1
        console.log(frommmsg);

        console.log(result.MESSAGE.$.FROM);
        console.log(result.MESSAGE.$.FROM == this.cookieJidAno);

        if (
          result.MESSAGE.$.FROM.includes(this.cookieJidAno) &&
          result.MESSAGE.$.TO.includes(this.cookieJidAno)
        ) {
          // ChatService.myChats.forEach((val,ind)=>{
          //   console.log(ind);
          //   console.log(too);

          //   console.log(typeof(too));
          //   var funn = too;
          //   if(too.indexOf("/")!=-1){
          //      funn = too.slice(0,too.indexOf("/"));
          //      too = funn;
          //      msgggg.to = too;
          //   }
          //   msgggg.to = too;
          //   console.log(funn);
          //   console.log(val)

          //   if(val.jid==funn){
          //     console.log(ind);

          //     ChatService.myChats[ind].msg.push(msgggg);
          //     console.log(ChatService.myChats[ind].msg);

          //     ChatService.sortAtSite.next({key:'carbon'});
          //     ChatService.scrollToBottom.next({})
          //   }
          // })
          console.log(msgggg);
          console.log(too);
          console.log(ChatService.myAnoChats);
          let toto;
          if (result.MESSAGE.SENT) {
            toto = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO;
          } else if (result.MESSAGE.RECEIVED) {
            toto = result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM;
          }

          if (toto.indexOf("/") != -1) {
            toto = toto.slice(0, toto.indexOf("/"));
          }
          console.log(too);
          console.log(toto);
          console.log(this.activeJid);
          console.log(jidFromAny);

          console.log(too);
          console.log(toto);
          console.log(this.activeJid);

          _.map(ChatService.myAnoChats, (user) => {
            if (result.MESSAGE.SENT) {
              console.log("carbon with sent");
              if (
                result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.includes(
                  user.jid
                )
              ) {
                console.log(too);
                console.log(toto);
                console.log(
                  result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO
                );
                console.log(this.activeJid);

                //this.msgList.next(user.msg);
                if (this.activeJid == toto) {
                  if (
                    msgggg.type == "exit" ||
                    msgggg.type == "resume" ||
                    msgggg.type == "block" ||
                    msgggg.type == "unblock"
                  ) {
                    if (msgggg.type == "exit") {
                      user.chatExit = true;
                    } else if (msgggg.type == "resume") {
                      user.chatExit = false;
                    } else if (msgggg.type == "block") {
                      user.blocked = true;
                    } else if (msgggg.type == "unblock") {
                      user.blocked = false;
                    } else if (msgggg.type == "delete") {
                      msgggg.delete = bodyyy;
                      console.log(msgggg);
                    } else if (msgggg.type == "deleteforboth") {
                      msgggg.delete = bodyyy;
                      console.log(msgggg);
                    }

                    ChatService.sortAtSite.next({
                      key: msgggg.type,
                      content: toto,
                      account: 2,
                    });
                  }
                  try {
                    msgggg.unique = bodyyy.unique;
                    if (bodyyunchange.type) {
                      if (
                        bodyyunchange.type == "delete" ||
                        bodyyunchange.type == "deleteforboth"
                      ) {
                        msgggg.delete = bodyyy;
                      }
                    }
                  } catch {}
                  console.log(msgggg);
                  this.newchatsubj_jai.next({
                    newchat: true,
                    msg: msgggg,
                    from: toto,
                    account: 2,
                    unreadCnt: user.unread,
                  });
                  user.msg.push(msgggg);
                } else {
                  if (
                    msgggg.type == "exit" ||
                    msgggg.type == "resume" ||
                    msgggg.type == "block" ||
                    msgggg.type == "unblock" ||
                    msgggg.type == "clearchat"
                  ) {
                    if (msgggg.type == "exit") {
                      user.chatExit = true;
                    } else if (msgggg.type == "resume") {
                      user.chatExit = false;
                    } else if (msgggg.type == "block") {
                      user.blocked = true;
                    } else if (msgggg.type == "unblock") {
                      user.blocked = false;
                    } else if (msgggg.type == "delete") {
                      msgggg.delete = bodyyy;
                      console.log(msgggg);
                    } else if (msgggg.type == "deleteforboth") {
                      msgggg.delete = bodyyy;
                      console.log(msgggg);
                    } else if (msgggg.type == "clearchat") {
                      ///////////////////////////
                      try {
                        this.loadashAno(jidFromAny, "clearchat", {
                          time: bodyyunchange.time,
                        });
                      } catch {}
                    }

                    ChatService.sortAtSite.next({
                      key: msgggg.type,
                      content: toto,
                      account: 2,
                      msg: msgggg,
                    });
                  }

                  if (msgggg.type == "delete") {
                    msgggg.delete = bodyyy;
                  } else if (msgggg.type == "deleteforboth") {
                    msgggg.delete = bodyyy;
                  }

                  this.newchatsubj_jai.next({
                    newchat: false,
                    msg: msgggg,
                    from: toto,
                    account: 2,
                    unreadCnt: user.unread,
                  });
                  user.msg.push(msgggg);
                  if (
                    msgggg.from.includes(this.cookieJid) ||
                    msgggg.from.includes(this.cookieJidAno)
                  ) {
                  } else {
                    user.unread = user.unread + 1;
                    this.allTotalUnread = this.allTotalUnread + 1;
                    this.featureDot.next({ unread: this.allTotalUnread });
                  }
                }
              }
            }

            if (result.MESSAGE.RECEIVED) {
              console.log(too);
              console.log(toto);
              console.log(
                result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.TO
              );
              console.log(this.activeJid);
              console.log("carbon with received");
              if (
                result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM.includes(
                  user.jid
                )
              ) {
                console.log(user.jid);
                user.msg.push(msgggg);

                if (this.activeJid == toto) {
                  this.newchatsubj_jai.next({
                    newchat: true,
                    msg: msgggg,
                    from: toto,
                    account: 2,
                    unreadCnt: user.unread,
                  });
                  user.msg.push(msgggg);
                } else {
                  this.newchatsubj_jai.next({
                    newchat: false,
                    msg: msgggg,
                    from: toto,
                    account: 2,
                    unreadCnt: user.unread,
                  });
                  user.msg.push(msgggg);

                  if (
                    msgggg.from.includes(this.cookieJid) ||
                    msgggg.from.includes(this.cookieJidAno)
                  ) {
                  } else {
                    user.unread = user.unread + 1;
                    this.allTotalUnread = this.allTotalUnread + 1;
                    this.featureDot.next({ unread: this.allTotalUnread });
                  }
                }
              }
            }
          });

          // _.map(ChatService.myChats, (user) => {
          //   var funn = too;
          //   if(too.indexOf("/")!=-1){
          //      funn = too.slice(0,too.indexOf("/"));
          //      too = funn;
          //      msgggg.to = too;
          //   }
          //   msgggg.to = too;
          //   console.log(funn);
          //   console.log(too);
          //   if(user.jid==funn){
          //     console.log('carbonn')

          //     user.msg.push(msgggg);

          //     //this.msgList.next(user.msg);
          //     ChatService.sortAtSite.next({key:'carbon'});
          //     ChatService.scrollToBottom.next({})
          //     return;
          //   }
          // })
        }

        if (result.MESSAGE.$.FROM.includes(this.cookieJidAno)) {
          console.log("returning from chats");
          return;
        }
      }

      var resultt = result;
      // console.log(resultt.MESSAGE.$.FROM)
      console.log(typeof resultt.MESSAGE.$.FROM);
      var fromm = resultt.MESSAGE.$.FROM;
      var finFrom;
      finFrom = fromm.indexOf("/");
      var finaljidfrom;
      if (finFrom != -1) {
        finaljidfrom = resultt.MESSAGE.$.FROM.slice(0, finFrom);
      } else {
        finaljidfrom = resultt.MESSAGE.$.FROM;
      }
      if (!result.MESSAGE.$.FROM.includes(this.cookieJidAno)) {
      }

      console.log(finaljidfrom);
      console.log(ChatService.anoJidArr);
      // console.log(ChatService.regJidArr);
      if (ChatService.anoJidArr.includes(finaljidfrom)) {
      } else {
        console.log("new roster add,, new message");
        ChatService.jidEmitter2.next([]);
        ChatService.refreshList.next([]);
      }

      if (
        result.MESSAGE.ARCHIVED != undefined &&
        result.MESSAGE.ARCHIVED != null
      ) {
        a = new Date(result.MESSAGE.ARCHIVED[0].$.ID / 1000);
      }
      if (result.MESSAGE.BODY != undefined && result.MESSAGE.BODY != null) {
        var str = result.MESSAGE.$.FROM;
        var pos = str.indexOf("/");
        str = str.substring(0, pos);
        var msgBody = result.MESSAGE.BODY[0];
        // console.log(msgBody)
        var msgObj;
        try {
          msgObj = JSON.parse(msgBody);
        } catch {
          if (msgObj == undefined) {
            return;
          }
        }

        console.log(msgObj);
        console.log(result.MESSAGE.$.TO);
        if (result.MESSAGE.$.TO.includes(this.cookieJidAno)) {
          msgObj.account = 2;
        } else {
          msgObj.account = 1;
        }
        console.log(msgObj);
        if (msgObj.type == "notification") {
          console.log(msgObj);
          // console.log(str)
          ChatService.noticeList.next(msgObj);
          return true;
        }
        if (msgObj.type == "block") {
          // ChatService.myChats.forEach((val,ind)=>{
          //   if(val.jid==msgObj.content){
          //     console.log(val);

          //     ChatService.myChats[ind].blockedMe = true;
          //     ChatService.myChats[ind].msg.push({ text: msgObj.content, date: a, to: msgObj.content, type: 'block' })
          //     console.log(val);
          //       ChatService.sortAtSite.next({key:'block',content:msgObj.content,account:1});
          //   }
          // })

          _.map(ChatService.myChats, (user) => {
            if (user.jid == msgObj.content) {
              //console.log(val);

              user.blockedMe = true;
              user.msg.push({
                text: msgObj.content,
                date: a,
                to: msgObj.content,
                type: "block",
              });
              //console.log(val);
              //
              ChatService.sortAtSite.next({
                key: "block",
                content: msgObj.content,
                account: 1,
              });

              //  if(msgObj.account==1){
              //   ChatService.sortAtSite.next({key:'block',content:msgObj.content,account:1});
              //  }
            }
          });

          // ChatService.myAnoChats.forEach((val,ind)=>{
          //   if(val.jid==msgObj.content){
          //     console.log(val);
          //     ChatService.myAnoChats[ind].blockedMe = true;
          //     ChatService.myAnoChats[ind].msg.push({ text: msgObj.content, date: a, to: msgObj.content, type: 'block' })
          //     console.log(val);
          //       ChatService.sortAtSite.next({key:'block',content:msgObj.content,account:1});
          //   }
          // })

          _.map(ChatService.myAnoChats, (user) => {
            if (user.jid == msgObj.content) {
              //onsole.log(val);
              user.blockedMe = true;
              user.msg.push({
                text: msgObj.content,
                date: a,
                to: msgObj.content,
                type: "block",
              });
              ///console.log(val);
              ChatService.sortAtSite.next({
                key: "block",
                content: msgObj.content,
                account: 2,
              });
              //  if(msgObj.account==2){
              //   ChatService.sortAtSite.next({key:'block',content:msgObj.content,account:2});
              //  }
            }
          });
        }
        if (msgObj.type == "unblock") {
          // ChatService.myChats.forEach((val,ind)=>{
          //   if(val.jid==msgObj.content){
          //     ChatService.myChats[ind].blockedMe = false;
          //     ChatService.myChats[ind].msg.push({ text: msgObj.content, date: a, to: msgObj.content, type: 'unblock' })
          //       ChatService.sortAtSite.next({key:'unblockedme',content:msgObj.content,account:1});
          //   }
          // })

          _.map(ChatService.myChats, (user) => {
            if (user.jid == msgObj.content) {
              //console.log(val);

              user.blockedMe = false;
              user.msg.push({
                text: msgObj.content,
                date: a,
                to: msgObj.content,
                type: "unblock",
              });
              //console.log(val);
              ChatService.sortAtSite.next({
                key: "unblock",
                content: msgObj.content,
                account: 1,
              });
              //  if(msgObj.account==1){
              //   ChatService.sortAtSite.next({key:'unblock',content:msgObj.content,account:1});
              //  }
            }
          });

          // ChatService.myAnoChats.forEach((val,ind)=>{
          //   if(val.jid==msgObj.content){
          //     console.log(val);
          //     ChatService.myAnoChats[ind].blockedMe = true;
          //     ChatService.myAnoChats[ind].msg.push({ text: msgObj.content, date: a, to: msgObj.content, type: 'block' })
          //     console.log(val);
          //       ChatService.sortAtSite.next({key:'block',content:msgObj.content,account:1});
          //   }
          // })

          _.map(ChatService.myAnoChats, (user) => {
            if (user.jid == msgObj.content) {
              //onsole.log(val);
              user.blockedMe = false;
              user.msg.push({
                text: msgObj.content,
                date: a,
                to: msgObj.content,
                type: "unblock",
              });
              ///console.log(val);
              ChatService.sortAtSite.next({
                key: "unblock",
                content: msgObj.content,
                account: 2,
              });
              //  if(msgObj.account==2){
              //   ChatService.sortAtSite.next({key:'unblock',content:msgObj.content,account:2});
              //  }
            }
          });
        }

        if (msgObj.type == "exit") {
          try {
            //alert('ll')
            _.map(ChatService.myChats, (user) => {
              if (user.jid == msgObj.content) {
                user.msg.push({
                  text: msgObj.content,
                  date: a,
                  to: result.MESSAGE.$.TO,
                  type: "exit",
                });
                user.chatExitMe = true;
                console.log(user);
                if (msgObj.account == 1) {
                  console.log(msgObj);
                  ChatService.sortAtSite.next({
                    key: "exitme",
                    content: msgObj.content,
                    account: 1,
                  });
                  return;
                }
              }
            });

            _.map(ChatService.myAnoChats, (user) => {
              if (user.jid == msgObj.content) {
                //onsole.log(val);
                user.chatExitMe = true;
                user.msg.push({
                  text: msgObj.content,
                  date: a,
                  to: result.MESSAGE.$.TO,
                  type: "exit",
                });
                ///console.log(val);
                if (msgObj.account == 2) {
                  console.log(msgObj);
                  ChatService.sortAtSite.next({
                    key: "exitme",
                    content: msgObj.content,
                    account: 2,
                  });
                  return;
                }
              }
            });
          } catch {
            console.log("chat service exit catch");
          }
        }

        if (msgObj.type == "resume") {
          _.map(ChatService.myChats, (user) => {
            if (user.jid == msgObj.content) {
              console.log(msgObj);

              user.msg.push({
                text: msgObj.content,
                date: a,
                to: result.MESSAGE.$.TO,
                type: "resume",
              });
              user.chatExitMe = false;
              //console.log(val);
              if (msgObj.account == 1) {
                ChatService.sortAtSite.next({
                  key: "resumeme",
                  content: msgObj.content,
                  account: 1,
                });
                return;
              }
            }
          });

          _.map(ChatService.myAnoChats, (user) => {
            if (user.jid == msgObj.content) {
              console.log(msgObj);
              user.chatExitMe = false;
              user.msg.push({
                text: msgObj.content,
                date: a,
                to: result.MESSAGE.$.TO,
                type: "resume",
              });
              ///console.log(val);
              if (msgObj.account == 2) {
                ChatService.sortAtSite.next({
                  key: "resumeme",
                  content: msgObj.content,
                  account: 2,
                });
                return;
              }
            }
          });
        }
        var x = new Date();
        // ChatService.myChats.forEach((val,ind)=>{
        //   if(val.jid==msgObj.content){
        //     var i = ind;
        //     if( msgObj.type=="exit" )
        //     {
        //       ChatService.myChats[i].msg.push({ text: msgObj.content, date: a, to: result.MESSAGE.$.TO, type: 'exit' })
        //       ChatService.myChats[i].chatExitMe=true;
        //       // console.log(ChatService.myChats);
        //       ChatService.sortAtSite.next({key:'exit',content:finaljidfrom});

        //     }
        //     else if( msgObj.type=="resume")
        //     {
        //       ChatService.myChats[i].msg.push({ text: msgObj.content, date: a, to: result.MESSAGE.$.TO, type: 'resume' })
        //       ChatService.myChats[i].chatExitMe=false;
        //       // console.log(ChatService.myChats);
        //       ChatService.sortAtSite.next({key:'resume',content:finaljidfrom});
        //     }
        //   }
        // })
        //my chats
        _.map(ChatService.myAnoChats, (user) => {
          if (user.jid == finaljidfrom) {
            //var i = ind;
            // if( msgObj.type=="exit" )
            // {
            //   user.msg.push({ text: msgObj.content, date: a, to: result.MESSAGE.$.TO, type: 'exit' })
            //   user.chatExitMe=true;
            //   // console.log(ChatService.myChats);
            //   ChatService.sortAtSite.next({key:'exitme',content:finaljidfrom, account:1});

            // }
            // else if( msgObj.type=="resume")
            // {
            //   user.msg.push({ text: msgObj.content, date: a, to: result.MESSAGE.$.TO, type: 'resume' })
            //   user.chatExitMe=false;
            //   // console.log(ChatService.myChats);
            //   ChatService.sortAtSite.next({key:'resumeme',content:finaljidfrom, account:1});
            // }
            if (
              msgObj.type != "chat" &&
              msgObj.type != "exit" &&
              msgObj.type != "resume" &&
              msgObj.type != "block" &&
              msgObj.type != "unblock" &&
              msgObj.type != "clear" &&
              msgObj.type != "clearchat" &&
              msgObj.type != "clearChat" &&
              msgObj.type != "delete" &&
              msgObj.type != "deleteforboth"
            ) {
              //check media type
              // ChatService.isUrl(url) && msgBody.length > 30
              //  ChatService.myAnoChats[i].chatExit=false;
              //   ChatService.myAnoChats[i].blockedMe=false;
              var url = msgObj.content;
              //   var extension = url.substring(url.lastIndexOf('.') + 1, url.length);
              var filename = url.substring(
                url.lastIndexOf("/") + 1,
                url.length
              );

              var temp;
              if (msgObj.unique) {
                temp = {
                  type: msgObj.type,
                  name: filename,
                  src: url,
                  date: new Date(),
                  to: result.MESSAGE.$.TO,
                  from: finaljidfrom,
                  UID: x.getTime() * 1000,
                  unique: msgObj.unique,
                };
              } else {
                temp = {
                  type: msgObj.type,
                  name: filename,
                  src: url,
                  date: new Date(),
                  to: result.MESSAGE.$.TO,
                  from: finaljidfrom,
                  UID: x.getTime() * 1000,
                };
              }

              if (this.activeJid != user.jid) {
                if (ChatService.completedOldChats == true) {
                  this.allTotalUnread = this.allTotalUnread + 1;
                  user.unread = user.unread + 1;
                  this.featureDot.next({ unread: this.allTotalUnread });
                  user.msg.push(temp);
                  this.newchatsubj_jai.next({
                    newchat: false,
                    msg: temp,
                    from: finaljidfrom,
                    account: 2,
                    unreadCnt: user.unread,
                  });
                }
              } else if (this.activeJid == user.jid) {
                this.newchatsubj_jai.next({
                  newchat: true,
                  msg: temp,
                  from: finaljidfrom,
                  account: 2,
                  unreadCnt: user.unread,
                });
                user.msg.push(temp);
              }

              // if((this.activeJid==user.jid)&& ChatService.account==1){
              //     this.msgList.next(user.msg)
              // }
            } else if (msgObj.type == "chat") {
              //   ChatService.myAnoChats[i].chatExit=false;
              //   ChatService.myAnoChats[i].blockedMe=false;
              //alert('klll')
              console.log(finaljidfrom);
              console.log(this.activeJid);
              var v = {
                text: msgObj.content,
                date: a,
                to: result.MESSAGE.$.TO,
                type: "text",
                UID: x.getTime() * 1000,
                from: finaljidfrom,
                unique: msgObj.unique,
              };
              console.log(v); //Here2
              if (this.activeJid != finaljidfrom) {
                if (ChatService.completedOldChats == true) {
                  this.allTotalUnread = this.allTotalUnread + 1;
                  user.unread = user.unread + 1;
                  this.featureDot.next({ unread: this.allTotalUnread });
                  user.msg.push(v);
                  this.newchatsubj_jai.next({
                    newchat: false,
                    msg: v,
                    from: finaljidfrom,
                    account: 2,
                    unreadCnt: user.unread,
                  });
                }
              } else if (this.activeJid == finaljidfrom) {
                user.msg.push(v);
                this.newchatsubj_jai.next({
                  newchat: true,
                  msg: v,
                  from: finaljidfrom,
                  account: 2,
                  unreadCnt: user.unread,
                });
              }
              console.log(user.msg);

              console.log(user.msg);

              //   if((this.activeJid==user.jid)&& ChatService.account==1){
              //     this.msgList.next(user.msg)
              // }
              //this.msgList.next(user.msg);
            } else if (
              msgObj.type == "delete" ||
              msgObj.type == "deleteforboth"
            ) {
              var ve = {
                text: msgObj.content,
                date: a,
                to: result.MESSAGE.$.TO,
                type: "text",
                UID: x.getTime() * 1000,
                from: finaljidfrom,
                unique: msgObj.unique,
                delete: msgObj,
              };
              console.log(ve); //Here2
              if (this.activeJid != finaljidfrom) {
                console.log("not eaual , so emiting new message false");
                if (ChatService.completedOldChats == true) {
                  this.allTotalUnread = this.allTotalUnread + 1;
                  user.unread = user.unread + 1;
                  this.featureDot.next({ unread: this.allTotalUnread });
                  //user.msg.push(v)
                  user.msg.forEach((vall, indd) => {
                    if (vall.unique) {
                      if (vall.unique == ve.delete.unique) {
                        if (ve.delete.type == "deleteforboth") {
                          vall.type = ve.delete.type;
                        } else {
                          if (
                            ve.delete.myjid == this.cookieJid ||
                            ve.delete.myjid == this.cookieJidAno
                          ) {
                            vall.type = ve.delete.type;
                          }
                        }
                      }
                    }
                  });
                  //this.cookieJid
                  this.newchatsubj_jai.next({
                    newchat: false,
                    msg: ve,
                    from: finaljidfrom,
                    account: 2,
                    unreadCnt: user.unread,
                  });
                }
              } else if (this.activeJid == finaljidfrom) {
                console.log(" eaual , so emiting new message true");
                // user.msg.push(ve)
                user.msg.forEach((vall, indd) => {
                  if (vall.unique) {
                    if (vall.unique == ve.delete.unique) {
                      if (ve.delete.type == "deleteforboth") {
                        vall.type = ve.delete.type;
                      } else {
                        if (
                          ve.delete.myjid == this.cookieJid ||
                          ve.delete.myjid == this.cookieJidAno
                        ) {
                          vall.type = ve.delete.type;
                        }
                      }
                    }
                  }
                });
                this.newchatsubj_jai.next({
                  newchat: true,
                  msg: ve,
                  from: finaljidfrom,
                  account: 2,
                  unreadCnt: user.unread,
                });
              }
              console.log(user.msg);

              console.log(user.msg);
            }
          }
        });
      } else {
        //console.log(result)
      }
    });
    setTimeout(() => {
      ChatService.scrl_Obs.next("yodfhk");
    }, 100);

    // ChatService.myChats = ChatService.mergeSort(ChatService.myChats);
    // ChatService.sortAtSite.next('yoo');
    return true;
  };

  static anoJidArr = [];
  static regJidArr = [];
  lastRefreshTime = new Date();
  //old function, currenly not being used.
  // ano_on_message = (x) => {
  //   console.log(x);
  //   var xmlString = new XMLSerializer().serializeToString(x);
  //   const parser = new Parser({ strict: false, trim: true });
  //   console.log(xmlString);

  //   // var a = new Date();
  //   parser.parseString(xmlString, (err, result) => {
  //     var a;
  //     console.log(result);
  //     if (result.MESSAGE.RECEIVED) {
  //       if (result.MESSAGE.RECEIVED[0]) {
  //         console.log(
  //           result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].BODY[0]
  //         );
  //       }
  //     }

  //     if (result) {
  //       //console.log(JSON.parse(result.MESSAGE.BODY));
  //       var bodyyy;
  //       try {
  //         bodyyy = JSON.parse(result.MESSAGE.BODY);
  //       } catch {
  //         if (!bodyyy) {
  //           if (result.MESSAGE.SENT) {
  //             bodyyy = JSON.parse(
  //               result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].BODY
  //             );
  //           }
  //           if (result.MESSAGE.RECEIVED) {
  //             console.log("received");
  //             bodyyy = JSON.parse(
  //               result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].BODY[0]
  //             );
  //           }
  //         }
  //       }

  //       var xx = new Date();
  //       var msgggg;
  //       if (
  //         bodyyy.type != "exit" &&
  //         bodyyy.type != "resume" &&
  //         bodyyy.type != "block" &&
  //         bodyyy.type != "unblock"
  //       ) {
  //         msgggg = {
  //           text: bodyyy.content,
  //           type: "text",
  //           UID: JSON.stringify(xx.getTime() * 1000),
  //           date: xx,
  //           to: result.MESSAGE.$.TO,
  //           from: result.MESSAGE.$.FROM,
  //         };
  //       } else {
  //         if (bodyyy.type) {
  //           var toto = "";
  //           try {
  //             if (result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO) {
  //               if (
  //                 result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.indexOf(
  //                   "/"
  //                 ) != -1
  //               ) {
  //                 toto = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.slice(
  //                   0,
  //                   result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.indexOf(
  //                     "/"
  //                   )
  //                 );
  //               }
  //             } else {
  //               toto = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO;
  //             }
  //           } catch {}
  //           if (bodyyy.type == "exit") {
  //             console.log("exit itt");
  //             this.loadashAno(toto, "exitMe");
  //           } else if (bodyyy.type == "resume") {
  //             console.log("resume itt");

  //             this.loadashAno(toto, "resumeMe");
  //           } else if (bodyyy.type == "block") {
  //             this.loadashAno(toto, "blockedMe");
  //             console.log("block itt");
  //           } else if (bodyyy.type == "unblock") {
  //             console.log("unblock itt");
  //             this.loadashAno(toto, "unblockMe");
  //           }
  //         }
  //         msgggg = {
  //           text: bodyyy.content,
  //           type: bodyyy.type,
  //           UID: JSON.stringify(xx.getTime() * 1000),
  //           date: xx,
  //           to: result.MESSAGE.$.TO,
  //           from: result.MESSAGE.$.FROM,
  //         };
  //       }

  //       console.log(msgggg);
  //       var too = result.MESSAGE.$.TO;
  //       var frommmsg = result.MESSAGE.$.FROM;
  //       try {
  //         if (result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM) {
  //           frommmsg =
  //             result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM;
  //           msgggg.from =
  //             result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM;
  //         }
  //       } catch {}

  //       try {
  //         if (result.MESSAGE.SENT) {
  //           if (result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.FROM) {
  //             frommmsg = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.FROM;
  //             msgggg.from =
  //               result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.FROM;
  //           }
  //         }
  //       } catch {
  //         console.log("catch");
  //       }
  //       var funn = too;
  //       if (too.indexOf("/") != -1) {
  //         funn = too.slice(0, too.indexOf("/"));
  //         too = funn;
  //         msgggg.to = too;
  //       }
  //       if (frommmsg.indexOf("/") != -1) {
  //         frommmsg = frommmsg.slice(0, frommmsg.indexOf("/"));

  //         msgggg.from = frommmsg;
  //       }
  //       console.log(msgggg); //Here1
  //       console.log(frommmsg);

  //       console.log(result.MESSAGE.$.FROM);

  //       if (
  //         result.MESSAGE.$.FROM.includes(this.cookieJidAno) &&
  //         result.MESSAGE.$.TO.includes(this.cookieJidAno)
  //       ) {
  //         // ChatService.myAnoChats.forEach((val,ind)=>{
  //         //   console.log(typeof(too));
  //         //   var funn = too;
  //         //   if(too.indexOf("/")!=-1){
  //         //      funn = too.slice(0,too.indexOf("/"));
  //         //      too = funn;
  //         //      msgggg.to = too;
  //         //   }
  //         //   msgggg.to = too;

  //         let toto;
  //         if (result.MESSAGE.SENT) {
  //           toto = result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO;
  //         } else if (result.MESSAGE.RECEIVED) {
  //           toto = result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM;
  //         }

  //         if (toto.indexOf("/") != -1) {
  //           toto = toto.slice(0, toto.indexOf("/"));
  //         }
  //         console.log(too);
  //         console.log(toto);
  //         console.log(this.activeJid);

  //         if (too.includes(this.cookieJidAno)) {
  //           console.log(too);
  //           console.log(toto);
  //           console.log(this.activeJid);

  //           _.map(ChatService.myAnoChats, (user) => {
  //             if (result.MESSAGE.SENT) {
  //               console.log("carbon with sent");
  //               if (
  //                 result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO.includes(
  //                   user.jid
  //                 )
  //               ) {
  //                 console.log(too);
  //                 console.log(toto);
  //                 console.log(
  //                   result.MESSAGE.SENT[0].FORWARDED[0].MESSAGE[0].$.TO
  //                 );
  //                 console.log(this.activeJid);

  //                 //this.msgList.next(user.msg);
  //                 if (this.activeJid == toto) {
  //                   this.newchatsubj_jai.next({
  //                     newchat: true,
  //                     msg: msgggg,
  //                     from: toto,
  //                     account: 2,
  //                     unreadCnt: user.unread,
  //                   });
  //                   user.msg.push(msgggg);
  //                 } else {
  //                   this.newchatsubj_jai.next({
  //                     newchat: false,
  //                     msg: msgggg,
  //                     from: toto,
  //                     account: 2,
  //                     unreadCnt: user.unread,
  //                   });
  //                   user.msg.push(msgggg);
  //                   this.allTotalUnread = this.allTotalUnread + 1;
  //                   this.featureDot.next({ unread: this.allTotalUnread });
  //                 }
  //               }
  //             }

  //             if (result.MESSAGE.RECEIVED) {
  //               console.log(too);
  //               console.log(toto);
  //               console.log(
  //                 result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.TO
  //               );
  //               console.log(this.activeJid);
  //               console.log("carbon with received");
  //               if (
  //                 result.MESSAGE.RECEIVED[0].FORWARDED[0].MESSAGE[0].$.FROM.includes(
  //                   user.jid
  //                 )
  //               ) {
  //                 console.log(user.jid);
  //                 user.msg.push(msgggg);

  //                 if (this.activeJid == toto) {
  //                   this.newchatsubj_jai.next({
  //                     newchat: true,
  //                     msg: msgggg,
  //                     from: toto,
  //                     account: 2,
  //                     unreadCnt: user.unread,
  //                   });
  //                   user.msg.push(msgggg);
  //                 } else {
  //                   this.newchatsubj_jai.next({
  //                     newchat: false,
  //                     msg: msgggg,
  //                     from: toto,
  //                     account: 2,
  //                     unreadCnt: user.unread,
  //                   });
  //                   user.msg.push(msgggg);
  //                   this.allTotalUnread = this.allTotalUnread + 1;
  //                   this.featureDot.next({ unread: this.allTotalUnread });
  //                 }
  //               }
  //             }
  //           });
  //         }
  //       }
  //       if (result.MESSAGE.$.FROM.includes(this.cookieJidAno)) {
  //         console.log("returning from chats");
  //         return;
  //       }
  //     }

  //     var resultt = result;
  //     // console.log(resultt.MESSAGE.$.FROM)
  //     // console.log(typeof(resultt.MESSAGE.$.FROM));
  //     var fromm = resultt.MESSAGE.$.FROM;
  //     var finFrom;
  //     finFrom = fromm.indexOf("/");
  //     var finaljidfrom;
  //     if (finFrom != -1) {
  //       finaljidfrom = resultt.MESSAGE.$.FROM.slice(0, finFrom);
  //     } else {
  //       finaljidfrom = resultt.MESSAGE.$.FROM;
  //     }

  //     // console.log(ChatService.anoJidArr);
  //     if (ChatService.anoJidArr.includes(finaljidfrom)) {
  //     } else {
  //       console.log("new roster add,, new message");
  //       ChatService.jidEmitter2.next([]);
  //       ChatService.refreshList.next([]);
  //     }

  //     if (
  //       result.MESSAGE.ARCHIVED != undefined &&
  //       result.MESSAGE.ARCHIVED != null
  //     ) {
  //       a = new Date(result.MESSAGE.ARCHIVED[0].$.ID / 1000);
  //     }
  //     if (result.MESSAGE.BODY != undefined && result.MESSAGE.BODY != null) {
  //       var str = result.MESSAGE.$.FROM;
  //       var pos = str.indexOf("/");
  //       str = str.substring(0, pos);
  //       var msgBody = result.MESSAGE.BODY[0];
  //       // console.log(msgBody)
  //       var msgObj;
  //       try {
  //         msgObj = JSON.parse(msgBody);
  //       } catch {
  //         if (msgObj == undefined) {
  //           return;
  //         }
  //       }
  //       if (result.MESSAGE.$.TO.includes(this.cookieJidAno)) {
  //         msgObj.account = 2;
  //       } else {
  //         msgObj.account = 1;
  //       }

  //       console.log(msgObj);
  //       if (msgObj.type == "notification") {
  //         console.log(msgObj);
  //         // console.log(str)
  //         ChatService.noticeList.next(msgObj);
  //         return true;
  //       }
  //       if (result.MESSAGE.$.TO == this.cookieJid) {
  //         msgObj.account = 1;
  //       } else {
  //         msgObj.account = 2;
  //       }

  //       if (msgObj.type == "block") {
  //         // ChatService.myChats.forEach((val,ind)=>{
  //         //   if(val.jid==msgObj.content){
  //         //     val.blockedMe = true;
  //         //     ChatService.myChats[ind].msg.push({ text: msgObj.content, date: new Date(), to: msgObj.content, type: 'block' })
  //         //       ChatService.sortAtSite.next({key:'block',content:msgObj.content});
  //         //   }
  //         // })
  //         _.map(ChatService.myAnoChats, (user) => {
  //           if (user.jid == msgObj.content) {
  //             //console.log(val);

  //             user.blockedMe = true;
  //             user.msg.push({
  //               text: msgObj.content,
  //               date: a,
  //               to: msgObj.content,
  //               type: "block",
  //             });
  //             //console.log(val);
  //             ChatService.sortAtSite.next({
  //               key: "block",
  //               content: msgObj.content,
  //               account: 2,
  //             });
  //             //  if(msgObj.account==1){
  //             //   ChatService.sortAtSite.next({key:'block',content:msgObj.content,account:1});
  //             //  }
  //           }
  //         });

  //         // ChatService.myAnoChats.forEach((val,ind)=>{
  //         //   if(val.jid==msgObj.content){
  //         //     console.log(val);
  //         //     ChatService.myAnoChats[ind].blockedMe = true;
  //         //     ChatService.myAnoChats[ind].msg.push({ text: msgObj.content, date: a, to: msgObj.content, type: 'block' })
  //         //     console.log(val);
  //         //       ChatService.sortAtSite.next({key:'block',content:msgObj.content,account:1});
  //         //   }
  //         // })

  //         _.map(ChatService.myChats, (user) => {
  //           if (user.jid == msgObj.content) {
  //             //onsole.log(val);
  //             user.blockedMe = true;
  //             user.msg.push({
  //               text: msgObj.content,
  //               date: a,
  //               to: msgObj.content,
  //               type: "block",
  //             });
  //             ///console.log(val);
  //             ChatService.sortAtSite.next({
  //               key: "block",
  //               content: msgObj.content,
  //               account: 1,
  //             });
  //             //  if(msgObj.account==2){
  //             //   ChatService.sortAtSite.next({key:'block',content:msgObj.content,account:2});
  //             //  }
  //           }
  //         });
  //       }
  //       if (msgObj.type == "unblock") {
  //         // ChatService.myChats.forEach((val,ind)=>{
  //         //   if(val.jid==msgObj.content){
  //         //     ChatService.myChats[ind].blockedMe = false;
  //         //     ChatService.myChats[ind].msg.push({ text: msgObj.content, date: a, to: msgObj.content, type: 'unblock' })
  //         //       ChatService.sortAtSite.next({key:'unblock',content:msgObj.content});
  //         //   }
  //         // })
  //         _.map(ChatService.myChats, (user) => {
  //           if (user.jid == msgObj.content) {
  //             //console.log(val);

  //             user.blockedMe = false;
  //             user.msg.push({
  //               text: msgObj.content,
  //               date: a,
  //               to: msgObj.content,
  //               type: "unblock",
  //             });
  //             //console.log(val);
  //             ChatService.sortAtSite.next({
  //               key: "unblock",
  //               content: msgObj.content,
  //               account: 1,
  //             });
  //             //  if(msgObj.account==1){
  //             //   ChatService.sortAtSite.next({key:'unblockedme',content:msgObj.content,account:1});
  //             //  }
  //           }
  //         });

  //         // ChatService.myAnoChats.forEach((val,ind)=>{
  //         //   if(val.jid==msgObj.content){
  //         //     console.log(val);
  //         //     ChatService.myAnoChats[ind].blockedMe = true;
  //         //     ChatService.myAnoChats[ind].msg.push({ text: msgObj.content, date: a, to: msgObj.content, type: 'block' })
  //         //     console.log(val);
  //         //       ChatService.sortAtSite.next({key:'block',content:msgObj.content,account:1});
  //         //   }
  //         // })

  //         _.map(ChatService.myAnoChats, (user) => {
  //           if (user.jid == msgObj.content) {
  //             //onsole.log(val);
  //             user.blockedMe = false;
  //             user.msg.push({
  //               text: msgObj.content,
  //               date: a,
  //               to: msgObj.content,
  //               type: "unblock",
  //             });
  //             ///console.log(val);
  //             ChatService.sortAtSite.next({
  //               key: "unblock",
  //               content: msgObj.content,
  //               account: 2,
  //             });
  //             //  if(msgObj.account==2){
  //             //   ChatService.sortAtSite.next({key:'unblockedme',content:msgObj.content,account:2});
  //             //  }
  //           }
  //         });
  //       }

  //       if (msgObj.type == "exit") {
  //         _.map(ChatService.myChats, (user) => {
  //           if (user.jid == msgObj.content) {
  //             //console.log(val);

  //             user.chatExitMe = true;
  //             user.msg.push({
  //               text: msgObj.content,
  //               date: a,
  //               to: msgObj.content,
  //               type: "exit",
  //             });
  //             //console.log(val);
  //             if (msgObj.account == 1) {
  //               ChatService.sortAtSite.next({
  //                 key: "exitme",
  //                 content: msgObj.content,
  //                 account: 1,
  //               });
  //               return;
  //             }
  //           }
  //         });

  //         // ChatService.myAnoChats.forEach((val,ind)=>{
  //         //   if(val.jid==msgObj.content){
  //         //     console.log(val);
  //         //     ChatService.myAnoChats[ind].blockedMe = true;
  //         //     ChatService.myAnoChats[ind].msg.push({ text: msgObj.content, date: a, to: msgObj.content, type: 'block' })
  //         //     console.log(val);
  //         //       ChatService.sortAtSite.next({key:'block',content:msgObj.content,account:1});
  //         //   }
  //         // })

  //         _.map(ChatService.myAnoChats, (user) => {
  //           if (user.jid == msgObj.content) {
  //             //onsole.log(val);
  //             user.chatExitMe = true;
  //             user.msg.push({
  //               text: msgObj.content,
  //               date: a,
  //               to: msgObj.content,
  //               type: "exit",
  //             });
  //             ///console.log(val);
  //             if (msgObj.account == 2) {
  //               ChatService.sortAtSite.next({
  //                 key: "exit",
  //                 content: msgObj.content,
  //                 account: 2,
  //               });
  //               return;
  //             }
  //           }
  //         });
  //       }

  //       if (msgObj.type == "resume") {
  //         _.map(ChatService.myChats, (user) => {
  //           if (user.jid == msgObj.content) {
  //             console.log(msgObj);

  //             user.msg.push({
  //               text: msgObj.content,
  //               date: a,
  //               to: result.MESSAGE.$.TO,
  //               type: "resume",
  //             });
  //             user.chatExitMe = false;
  //             //console.log(val);
  //             if (msgObj.account == 1) {
  //               ChatService.sortAtSite.next({
  //                 key: "resumeme",
  //                 content: msgObj.content,
  //                 account: 1,
  //               });
  //               return;
  //             }
  //           }
  //         });

  //         _.map(ChatService.myAnoChats, (user) => {
  //           if (user.jid == msgObj.content) {
  //             console.log(msgObj);
  //             user.chatExitMe = false;
  //             user.msg.push({
  //               text: msgObj.content,
  //               date: a,
  //               to: result.MESSAGE.$.TO,
  //               type: "resume",
  //             });
  //             ///console.log(val);
  //             if (msgObj.account == 2) {
  //               ChatService.sortAtSite.next({
  //                 key: "resumeme",
  //                 content: msgObj.content,
  //                 account: 2,
  //               });
  //               return;
  //             }
  //           }
  //         });
  //       }

  //       _.map(ChatService.myAnoChats, (user) => {
  //         if (user.jid == finaljidfrom) {
  //           //console.log(url);
  //           var x = new Date();
  //           // if( msgObj.type=="exit" )
  //           // {
  //           //   user.msg.push({ text: msgObj.content, date: a, to: result.MESSAGE.$.TO, type: 'exit' })
  //           //   user.chatExitMe=true;
  //           //   // console.log(ChatService.myAnoChats);
  //           //   ChatService.sortAtSite.next({key:'exitme',content:msgObj.content,account:2});

  //           // }
  //           // else if( msgObj.type=="resume" )
  //           // {
  //           //   user.msg.push({ text: msgObj.content, date: a, to: result.MESSAGE.$.TO, type: 'resume' })
  //           //   user.chatExitMe=false;
  //           //   // console.log(ChatService.myAnoChats);
  //           //   ChatService.sortAtSite.next({key:'resumeme',content:msgObj.content,account:2});
  //           // }
  //           // else if(msgObj.type=="block")
  //           // {
  //           //   ChatService.myAnoChats[i].msg.push({ text: msgObj.content, date: a, to: result.MESSAGE.$.TO, type: 'block' })
  //           //   ChatService.myAnoChats[i].blockedMe=true;
  //           //   ChatService.sortAtSite.next({key:'block'});
  //           // }
  //           // else if(msgObj.type=="unblock")
  //           // {
  //           //   ChatService.myAnoChats[i].msg.push({ text: msgObj.content, date: a, to: result.MESSAGE.$.TO, type: 'unblock' })
  //           //   ChatService.myAnoChats[i].blockedMe=false;
  //           //   ChatService.sortAtSite.next({key:'unblock'});
  //           // }
  //           if (
  //             msgObj.type != "chat" &&
  //             msgObj.type != "exit" &&
  //             msgObj.type != "resume" &&
  //             msgObj.type != "block" &&
  //             msgObj.type != "unblock" &&
  //             msgObj.type != "clear" &&
  //             msgObj.type != "clearchat" &&
  //             msgObj.type != "clearChat"
  //           ) {
  //             //check media type
  //             // ChatService.isUrl(url) && msgBody.length > 30
  //             //  ChatService.myAnoChats[i].chatExit=false;
  //             //   ChatService.myAnoChats[i].blockedMe=false;
  //             var url = msgObj.content;
  //             //   var extension = url.substring(url.lastIndexOf('.') + 1, url.length);
  //             var filename = url.substring(
  //               url.lastIndexOf("/") + 1,
  //               url.length
  //             );

  //             var temp = {
  //               type: msgObj.type,
  //               name: filename,
  //               src: url,
  //               date: x,
  //               to: result.MESSAGE.$.TO,
  //               from: finaljidfrom,
  //             };

  //             user.msg.push(temp);
  //             if (this.activeJid != user.jid) {
  //               if (ChatService.completedOldChatsAno == true) {
  //                 this.allTotalUnread = this.allTotalUnread + 1;
  //                 user.unread = user.unread + 1;
  //                 this.allTotalUnread = this.allTotalUnread + 1;
  //                 this.newchatsubj_jai.next({
  //                   newchat: false,
  //                   msg: temp,
  //                   from: finaljidfrom,
  //                   account: 2,
  //                   unreadCnt: user.unread,
  //                 });
  //                 this.featureDot.next({ unread: this.allTotalUnread });
  //               } else if (this.activeJid == user.jid) {
  //                 this.newchatsubj_jai.next({
  //                   newchat: true,
  //                   msg: temp,
  //                   from: finaljidfrom,
  //                   account: 2,
  //                   unreadCnt: user.unread,
  //                 });
  //               }
  //             }
  //             // if((this.activeJid==user.jid)&& ChatService.account==2){
  //             //     this.msgList.next(user.msg)
  //             // }
  //           } else if (msgObj.type == "chat") {
  //             //   ChatService.myAnoChats[i].chatExit=false;
  //             //   ChatService.myAnoChats[i].blockedMe=false;
  //             console.log(v);

  //             var v = {
  //               text: msgObj.content,
  //               date: a,
  //               to: result.MESSAGE.$.TO,
  //               type: "text",
  //               UID: x.getTime() * 1000,
  //               from: finaljidfrom,
  //             };

  //             if (this.activeJid != finaljidfrom) {
  //               if (ChatService.completedOldChatsAno == true) {
  //                 user.unread = user.unread + 1;
  //                 user.msg.push(v);
  //                 this.allTotalUnread = this.allTotalUnread + 1;
  //                 this.newchatsubj_jai.next({
  //                   newchat: false,
  //                   msg: v,
  //                   from: finaljidfrom,
  //                   account: 2,
  //                   unreadCnt: user.unread,
  //                 });
  //                 this.featureDot.next({ unread: this.allTotalUnread });
  //               }
  //             } else if (this.activeJid == finaljidfrom) {
  //               user.msg.push(v);
  //               this.newchatsubj_jai.next({
  //                 newchat: true,
  //                 msg: v,
  //                 from: finaljidfrom,
  //                 account: 2,
  //                 unreadCnt: user.unread,
  //               });
  //             }
  //             //   if((this.activeJid==user.jid)&& ChatService.account==2){
  //             //     this.msgList.next(user.msg)
  //             // }
  //             //this.msgList.next(user.msg);
  //           }
  //           ///
  //         }
  //       });
  //       // for (var i = 0; i < ChatService.myAnoChats.length; i++) {
  //       //   if (ChatService.myAnoChats[i].jid == str) {
  //       //     //console.log(url);
  //       //     var x = new Date();
  //       //     if( msgObj.type=="exit" )
  //       //     {
  //       //       ChatService.myAnoChats[i].msg.push({ text: msgObj.content, date: a, to: result.MESSAGE.$.TO, type: 'exit' })
  //       //       ChatService.myAnoChats[i].chatExitMe=true;
  //       //       // console.log(ChatService.myAnoChats);
  //       //       ChatService.sortAtSite.next({key:'exitme',content:msgObj.content,account:2});

  //       //     }
  //       //     else if( msgObj.type=="resume" )
  //       //     {
  //       //       ChatService.myAnoChats[i].msg.push({ text: msgObj.content, date: a, to: result.MESSAGE.$.TO, type: 'resume' })
  //       //       ChatService.myAnoChats[i].chatExitMe=false;
  //       //       // console.log(ChatService.myAnoChats);
  //       //       ChatService.sortAtSite.next({key:'resumeme',content:msgObj.content,account:2});
  //       //     }
  //       //     // else if(msgObj.type=="block")
  //       //     // {
  //       //     //   ChatService.myAnoChats[i].msg.push({ text: msgObj.content, date: a, to: result.MESSAGE.$.TO, type: 'block' })
  //       //     //   ChatService.myAnoChats[i].blockedMe=true;
  //       //     //   ChatService.sortAtSite.next({key:'block'});
  //       //     // }
  //       //     // else if(msgObj.type=="unblock")
  //       //     // {
  //       //     //   ChatService.myAnoChats[i].msg.push({ text: msgObj.content, date: a, to: result.MESSAGE.$.TO, type: 'unblock' })
  //       //     //   ChatService.myAnoChats[i].blockedMe=false;
  //       //     //   ChatService.sortAtSite.next({key:'unblock'});
  //       //     // }
  //       //     else if (msgObj.type!="chat") {
  //       //       //check media type
  //       //       // ChatService.isUrl(url) && msgBody.length > 30
  //       //     //  ChatService.myAnoChats[i].chatExit=false;
  //       //     //   ChatService.myAnoChats[i].blockedMe=false;
  //       //       var url = msgObj.content
  //       //    //   var extension = url.substring(url.lastIndexOf('.') + 1, url.length);
  //       //       var filename = url.substring(url.lastIndexOf('/') + 1, url.length)

  //       //       var temp = { type: msgObj.type, name: filename, src: url, date: x, to: result.MESSAGE.$.TO }

  //       //       ChatService.myAnoChats[i].msg.push(temp);

  //       //     }
  //       //     else {
  //       //    //   ChatService.myAnoChats[i].chatExit=false;
  //       //    //   ChatService.myAnoChats[i].blockedMe=false;
  //       //       //console.log('ffffffff')
  //       //       this.report.newchatsubj_jai.next({newchat:true});
  //       //       var v = { text: msgObj.content, date: a, to: result.MESSAGE.$.TO, type: 'text', UID: x.getTime() * 1000 };
  //       //       ChatService.myAnoChats[i].msg.push(v)

  //       //     }
  //       //     ///
  //       //     if (ChatService.myAnoChats[i].jid != ChatService.active && ChatService.account==1 ) {
  //       //     }
  //       //     else
  //       //     {
  //       //       ChatService.scrollToBottom.next({})
  //       //     }
  //       //     if(ChatService.myAnoChats[i].jid != ChatService.active && msgObj.type!='notification')
  //       //       {  ChatService.myAnoChats[i].unread++;
  //       //         ChatService.totalAnoUnread++;
  //       //         // console.log("increased")
  //       //        }
  //       //   }
  //       // }
  //     } else {
  //       //console.log(result)
  //     }
  //   });
  //   setTimeout(() => {
  //     ChatService.scrl_Obs.next("yodfhk");
  //   }, 100);

  //   // ChatService.myAnoChats = ChatService.mergeSort(ChatService.myAnoChats);
  //   //ChatService.sortAtSite.next('yoo');
  //   return true;
  // };

  ano_offline(x) {}

  //This function is used to send messages , it might be either from the normal user or the anonymous user.
  sendMessages(textMsg: any, account: number, activeJid: string, type?: any) {
    //Here we will receive generally four arguments .. fourth being optional argument.

    // If the type of the message is not passed, then it is defaulty considered as type chat

    // ===================================================================================
    // console.log(textMsg);
    // console.log(account);
    // console.log(type);

    //console.log('yooo')
    //console.log(account,activeJid)
    var x = new Date();
    textMsg = textMsg.trim();
    if (textMsg.length == 0) {
      return;
    }
    // var body = textMsg.substring(14, textMsg.length - 14)

    if (type == null) {
      type = "chat";
      //console.log(textMsg)
    }
    if (type == "exit") {
    }
    // else if (ChatService.isUrl(body)) {
    else {
      var active;

      var msgOdj = {
        type: "chat",
        content: textMsg,
        unique: x.getTime() * 1000,
      };

      //forming a sample message to push into array of messages.
      var msgtopush = {
        text: textMsg,
        type: "text",
        UID: x.getTime() * 1000,
        date: x,
        to: activeJid,
        offlineMsg: "false",
        myMessage: "true",
        msgOdj: {},
        activeJid: activeJid,
        from: "",
        unique: x.getTime() * 1000,
      };

      var msgToPushToSelf = {
        newMessage: "",
        isAno: false,
        offlineMsg: "false",
      };
      if (account == 1) {
        if (this.chatDisconnectCnt.includes("norm")) {
          msgtopush.offlineMsg = "true";
          msgToPushToSelf.offlineMsg = "true";
          msgtopush.msgOdj = msgOdj;
        }

        msgtopush.from = this.cookieJid;
        this.normaluser = _.map(ChatService.myChats, (user, indd) => {
          if (user.jid == activeJid) {
            // alert('ppppjjjj')
            console.log(ChatService.myChats);

            msgToPushToSelf.newMessage = user.jid;
            active = indd;
            // console.log(msgtopush);
            // console.log(this.normaluser);
            // console.log(msgToPushToSelf);

            ChatService.myChats[active].msg.push(msgtopush);
            //ChatService.sortAtSite.next(msgtopush);
            this.newchatsubj_jai.next({
              newchat: true,
              msg: msgtopush,
              from: activeJid,
              account: 1,
              unreadCnt: user.unread,
            });

            // console.log(msgtopush);
            // console.log(this.normaluser);
            // console.log(msgToPushToSelf);
            // console.log(this.newInfoAddData);

            if (user.isNew == true) {
              //checking if the user is newly added and no messages are being send to him.
              user.isNew = false;
              //If yes, then make it to false and the adding that person to our list.
              this.addToBackendRoster(
                this.newInfoAddData.jid,
                this.newInfoAddData.name,
                this.newInfoAddData.profilePic,
                this.newInfoAddData.featureName
              );
            }
          }
          // console.log(ChatService.myChats);
        });
      }
      //same process as above , just the process is for anonymous account.
      if (account == 2) {
        msgtopush.from = this.cookieJidAno;
        msgToPushToSelf.isAno = true;
        if (this.chatDisconnectCnt.includes("ano")) {
          (msgtopush.offlineMsg = "true"), (msgtopush.msgOdj = msgOdj);
        }
        this.anouser = _.map(ChatService.myAnoChats, (user, indd) => {
          if (user.jid == activeJid) {
            active = indd;
            msgToPushToSelf.newMessage = user.jid;
            user.msg.push(msgtopush);
            //ChatService.sortAtSite.next(msgtopush);
            this.newchatsubj_jai.next({
              newchat: true,
              msg: msgtopush,
              from: activeJid,
              account: 2,
              unreadCnt: user.unread,
            });
            if (user.isNew == true) {
              user.isNew = false;
            }
          }
        });
      }
    }
    console.log(msgOdj);
    var actualMsg = JSON.stringify(msgOdj);
    console.log(actualMsg);
    let gun = new Date();
    let jaiTime = gun.getTime() * 1000;

    //forming an iq packet to send
    var message = $.$msg({ to: activeJid, type: "chat", unique: jaiTime })
      .c("body")
      .t(actualMsg);

    //console.log(message)

    //scrolling to btm
    setTimeout(() => {
      ChatService.scrl_Obs.next("jai");
    }, 100);

    //Sending the iq packet to the ejabberd server.
    if (account == 1) {
      ChatService.reg_connection.send(message);
      // ChatService.myChats = ChatService.mergeSort(ChatService.myChats);
    } else {
      ChatService.ano_connection.send(message);
      // ChatService.myAnoChats = ChatService.mergeSort(ChatService.myAnoChats); //change check see here
    }
    //ChatService.sortAtSite.next('jai');
    ChatService.scrollToBottom.next({});
  }

  chatWindowForward = new Subject<any>();

  //This function is used to forward the messages to appropriate function
  forwardMessage(account, jid, actualMsg, timeunique?) {
    //We will receive the details to whom we should send and the message that we need to send through the parameters
    console.log(account, jid, actualMsg);
    let uniqueTemp = JSON.parse(actualMsg);
    console.log(actualMsg);
    let message = $.$msg({ to: jid, type: "chat", unique: Date.now() * 1000 })
      .c("body")
      .t(actualMsg);
    if (timeunique) {
      message = $.$msg({ to: jid, type: "chat", unique: timeunique })
        .c("body")
        .t(actualMsg);
    } else {
      message = $.$msg({ to: jid, type: "chat", unique: Date.now() * 1000 })
        .c("body")
        .t(actualMsg);
    }
    //send that iq packet from the appropriate account
    if (account == 1) {
      ChatService.reg_connection.send(message);
    } else {
      ChatService.ano_connection.send(message);
    }
  }
  newInfoAddData = { jid: "", name: "", profilePic: "", featureName: "" };
  static urlEmitter = new Subject<any>();

  //This function will be called while a file is being tried to upload in the chat.
  onUrl(x) {
    console.log(x);
    var xmlString = new XMLSerializer().serializeToString(x);
    var slot;
    var account;
    var active;
    const parser = new Parser({ strict: false, trim: true });
    parser.parseString(xmlString, (err, result) => {
      var temp: string = result.IQ.$.ID;
      console.log(result);
      account = parseInt(temp[0]);
      active = temp.substring(2, temp.length);
      //Here we will get the slot URL, the url to which you can upload the file to.
      //To this we can do a put request and send the file that we want to upload.
      //This process will be done in urlEmitter.subscribe
      slot = result.IQ.SLOT[0].PUT[0].$.URL;
      console.log(slot);
      ChatService.urlEmitter.next({
        slot: slot,
        account: account,
        active: active,
      });
    });
  }

  //fileUploadlist = []

  sendImage(fff: File, account, active, type?) {
    console.log(fff);
    this.uploadedFile.unshift(fff);
    console.log(this.uploadedFile);
    var x = new Date();
    if (type) {
      if (!type) {
        var str = fff.type;
        str = str.substring(0, str.indexOf("/"));
      } else {
        str = type;
      }
    }

    //this.fileUploadlist.unshift({account:account,jid:active});

    var iqx = $.$iq({
      type: "get",
      id: account + "/" + active,
      to: "upload.chat.spaarksweb.com",
    }).c("request", {
      filename: fff.name,
      size: fff.size,
      "content-type": fff.type,
      xmlns: "urn:xmpp:http:upload:0",
    });
    console.log(iqx);
    //forming an iq packet and sending to ejabberd server requesting it for a slot
    //So that we can upload the necessery files.
    ChatService.reg_connection.sendIQ(iqx, this.onUrl);
  }

  //function that is not being used.
  // sendFile(x: string) {
  //   // this.msg.push({type:"text",src:x, date:this.temp})
  // }

  msgList = new Subject<any>();
  //absorvable being returned to subscribe

  getMessages() {
    return this.msgList.asObservable();
  }

  static scrl_Obs = new Subject<any>();

  scroller() {
    return ChatService.scrl_Obs;
  }

  //function that runs when the tab is changed in the chat.
  tabChanged(id, account) {
    //we will get the jid and the account to which the user has changed the chattab to.
    var v;
    //check for the aoppropriate ccount
    if (account == 1) {
      // ChatService.myChats.forEach((x,ind)=>{
      //       if(x.jid ==  id){
      //         ChatService.active = id;
      //         ChatService.account = account
      //         this.msgList.next(ChatService.myChats[ind].msg);
      //         ChatService.totalRegUnread -= ChatService.myChats[ind].unread;
      //         ChatService.myChats[ind].unread=0;
      //         ChatService.scrollToBottom.next({})
      //       }
      // })

      //Iterate over the chat list
      _.map(ChatService.myChats, (user) => {
        //if the jid of the user and the user that we are currently chatting with is same, then
        if (user.jid == id) {
          ChatService.active = id;
          ChatService.account = account;
          console.log(user);
          console.log(user.msg);
          this.msgList.next(user.msg);
          //making the unread messages of the user to 0
          ChatService.totalRegUnread -= user.unread;
          user.unread = 0;
          ChatService.scrollToBottom.next({});
        }
      });
    }
    //same as above other than the fact that this is used for anonymous account
    else {
      //     ChatService.myAnoChats.forEach((x,ind)=>{
      //       if(x.jid ==  id){
      //         ChatService.active = id;
      //         ChatService.account = account
      //         this.msgList.next(ChatService.myAnoChats[ind].msg);
      //         ChatService.totalAnoUnread -= ChatService.myAnoChats[ind].unread;
      //             ChatService.myAnoChats[ind].unread=0;
      //             ChatService.scrollToBottom.next({})
      //       }
      // })
      _.map(ChatService.myAnoChats, (userr) => {
        if (userr.jid == id) {
          ChatService.active = id;
          ChatService.account = account;
          console.log(userr);
          console.log(userr.msg);
          this.msgList.next(userr.msg);
          ChatService.totalAnoUnread -= userr.unread;
          userr.unread = 0;
          ChatService.scrollToBottom.next({});
        }
      });
    }
  }

  //old functiuon that is not being used now
  // totalUnread() {
  //   var count = 0;
  //   for (var i = 0; i < ChatService.myChats.length; i++) {
  //     count = count + ChatService.myChats[i].unread;
  //   }
  //   return count;
  // }

  fun(x) {
    // console.log(x)
  }
  fun2(x) {
    // console.log(x)
  }
  fun3 = (x) => {
    console.log(x);
    ChatService.stopOldReg = true;
  };

  //function to sort the chat list(main)
  static sortFun() {
    console.log(ChatService.myChats);

    var funn = ChatService.myChats.sort(function (a, b) {
      try {
        var c = a.msg[a.msg.length - 1].date;
        var d = b.msg[b.msg.length - 1].date;
        return d - c;
      } catch {
        return d;
      }
    });
    ChatService.myChats = funn;
    console.log(funn);
    ChatService.completedOldChats = true;
  }

  //function to sort the chat list(anonymous)
  static sortFunAno() {
    var funn = ChatService.myAnoChats.sort(function (a, b) {
      try {
        var c = a.msg[a.msg.length - 1].date;
        var d = b.msg[b.msg.length - 1].date;
        return d - c;
      } catch {
        return d;
      }
    });
    ChatService.myAnoChats = funn;
    ChatService.completedOldChatsAno = true;
    // console.log(funn)
  }

  jaiitime = new Date().getTime() * 10000;

  //any message without the chat attribute is being forwarded to this handler for normal chat account.
  reg_oldMessages = async (xml) => {
    //  console.log(xml)
    //  console.log(ChatService.stopOldReg);

    var t = 0;
    var xmlString = new XMLSerializer().serializeToString(xml);
    let stringifiedXml = new XMLSerializer().serializeToString(xml);
    const parser = new Parser({ strict: false, trim: true });
    parser.parseString(xmlString, (err, result) => {
      // console.log(result)

      var x = result.MESSAGE.RESULT;
      if (x == undefined) {
        if (result.MESSAGE.BODY) {
          x = result.MESSAGE.BODY;
          // console.log(x)
        }
      }

      //  console.log(x)
      if (x != undefined && x != null) {
        // console.log('x is valid');
        if (!x[0].FORWARDED) {
          return;
        }
        var y = x[0].FORWARDED[0].MESSAGE[0];
        //  console.log(y)
        var UID = y.ARCHIVED[0].$.ID;

        // console.log(ChatService.p);
        // console.log(typeof(ChatService.p))
        // console.log(typeof(UID))
        // console.log(UID);
        // console.log(this.jaiitime<Number(UID));
        if (this.jaiitime < Number(UID)) {
          // console.log('old receiving current');
          return;
        } else {
          // console.log('old receiving elseee');
        }
        var d = new Date(UID / 1000);
        //  console.log(d);
        var to = y.$.TO;
        if (to.indexOf("/") != -1) to = to.substring(0, to.indexOf("/"));
        var from = y.$.FROM;
        if (from.indexOf("/") != -1)
          from = from.substring(0, from.indexOf("/"));
        var msgBody = y.BODY[0];
        // console.log(msgBody)

        try {
          if (this.chatLoadedArr.norm != "jai") {
            // if(to.i this.chatLoadedArr.norm)

            if (from.includes(this.chatLoadedArr.norm)) {
              setTimeout(() => {
                this.chatLoadedArr.loadedArr.push("norm");
                this.report.multiPurposeSubj.next({
                  chatLoad: { originalChatLoaded: true },
                });
              }, 2000);
            }
          }
        } catch {}
        try {
          var tempmsg = JSON.parse(msgBody);
          //  console.log(tempmsg)
          //  if(this.someArr.includes(tempmsg.unique)){
          //   alert(tempmsg.unique)
          // }else{
          //   this.someArr.push(tempmsg.unique);
          //   console.log(this.someArr)

          //  }
        } catch {
          (err) => {
            //   console.log(err)
            //    console.log(result)
            //  console.log('arehoooooooooooooo');
            return true;
          };
        }
        //console.log(tempmsg)

        //  if(tempmsg.type=="exit"){ return true; }

        if (tempmsg && tempmsg.type == "notification") {
          //  console.log(tempmsg)
          //console.log(from)
          ChatService.noticeList.next(tempmsg);
          return true;
        }

        var userInd;
        this.normaluser = _.map(ChatService.myChats, (user, indd) => {
          if (user.jid == to || user.jid == from) {
            if (user) {
              if (user.clearChat > UID) {
                // console.log(user.clearChat)
                // console.log(UID)
                user.reachedEnd = true;
                return true;
              } else {
                // console.log(tempmsg)
                // console.log(temp)
              }
            }
            //Forming the message object  with necessery checks and conditions
            var temp;
            if (tempmsg && tempmsg.type == "chat") {
              // console.log(tempmsg)
              if (tempmsg.unique) {
                temp = {
                  type: "text",
                  text: tempmsg.content,
                  date: d,
                  to: to,
                  UID: UID,
                  from: from,
                  msgXml: stringifiedXml,
                  msgStanzaId: "",
                  unique: tempmsg.unique,
                };
                // console.log(tempmsg)
                // console.log(temp)
              } else {
                // console.log(tempmsg)
                temp = {
                  type: "text",
                  text: tempmsg.content,
                  date: d,
                  to: to,
                  UID: UID,
                  from: from,
                  msgXml: stringifiedXml,
                  msgStanzaId: "",
                };
              }
              if (y["STANZA-ID"]) {
                temp.msgStanzaId = y["STANZA-ID"][0].$.ID;
              }
            } else {
              if (
                tempmsg &&
                (tempmsg.type == "exit" ||
                  tempmsg.type == "resume" ||
                  tempmsg.type == "block" ||
                  tempmsg.type == "unblock")
              ) {
                // console.log(tempmsg.type);

                temp = {
                  type: tempmsg.type,
                  content: tempmsg.content,
                  date: d,
                  to,
                  UID,
                };
              } else {
                console.log("else type");
                var filename = "file";
                try {
                  filename = tempmsg.content.substring(
                    tempmsg.content.lastIndexOf("/") + 1,
                    tempmsg.content.length
                  );
                } catch {}
                if (tempmsg && tempmsg.unique) {
                  temp = {
                    type: tempmsg.type,
                    name: filename,
                    src: tempmsg.content,
                    date: d,
                    to: to,
                    UID: UID,
                    from: from,
                    msgXml: stringifiedXml,
                    msgStanzaId: "",
                    unique: tempmsg.unique,
                  };
                } else {
                  temp = {
                    type: tempmsg.type,
                    name: filename,
                    src: tempmsg.content,
                    date: d,
                    to: to,
                    UID: UID,
                    from: from,
                    msgXml: stringifiedXml,
                    msgStanzaId: "",
                  };
                }

                console.log(temp);

                if (y["STANZA-ID"]) {
                  temp.msgStanzaId = y["STANZA-ID"][0].$.ID;
                }
              }
            }
            // console.log(tempmsg ,temp)
            if (!this.notfineArray.includes(temp.type)) {
              if (user.msg.length == 0) {
                user.msg.push(temp);
                console.log(user.msg);
              } else {
                for (var i = 0; i < user.msg.length; i++) {
                  // console.log(user.msg[i].UID)
                  // console.log(UID)
                  // console.log(JSON.stringify(UID <= user.msg[i].UID))
                  if (UID <= user.msg[i].UID) {
                    console.log(user.msg);
                    let feeldouble = user.msg.filter((val) => {
                      return val.unique == temp.unique;
                    });
                    if (feeldouble.length == 0) {
                      user.msg.splice(i, 0, temp);
                    }
                    console.log(user.msg);
                    break;
                  }
                  if (i + 1 == user.msg.length) {
                    let feeldouble = user.msg.filter((val) => {
                      return val.unique == temp.unique;
                    });
                    if (feeldouble.length == 0) {
                      //pushing th message to the users msg array

                      user.msg.push(temp);
                    }
                    console.log(user.msg);
                    break;
                  }
                }
              }
            }
          }
        });
        //filtering the normal user without the undefineds
        this.normaluser = _.without(this.normaluser, undefined);
      }
    });

    //sort the chat list
    await ChatService.sortFun();
    ////console.log(xml)
    ////console.log(this.chathistory)
    return true;
  };

  someArr = [];

  // getOld_messages(jidd){
  //   if (user.jid == to || user.jid==from) {

  //     if(user){
  //       if(user.clearChat>UID)
  //       {
  //         user.reachedEnd = true;
  //         return true;
  //       }
  //      }
  //         var temp
  //         if(tempmsg.type=='chat')
  //         {
  //           temp = {type:'text',text:tempmsg.content, date: d, to: to, UID: UID, from:from ,msgXml:stringifiedXml,msgStanzaId:'' }
  //           if(y["STANZA-ID"]){
  //             temp.msgStanzaId=y["STANZA-ID"][0].$.ID
  //           }
  //         }
  //         else{
  //           if(tempmsg.type=='exit'||tempmsg.type=='resume'||tempmsg.type=='block'||tempmsg.type=='unblock')
  //           {
  //             // console.log(tempmsg.type);

  //               temp = { type:tempmsg.type, content:tempmsg.content, date:d, to, UID  }
  //           }
  //           else{
  //             console.log('else type')
  //             var filename = 'file'
  //             try{
  //               filename = tempmsg.content.substring(tempmsg.content.lastIndexOf('/') + 1, tempmsg.content.length)
  //             }catch{}
  //             temp = { type: tempmsg.type, name: filename, src: tempmsg.content, date: d, to: to, UID: UID,from:from,msgXml:stringifiedXml,msgStanzaId:'' };
  //             if(y["STANZA-ID"]){
  //               temp.msgStanzaId=y["STANZA-ID"][0].$.ID
  //             }
  //           }
  //         }
  //         // console.log(tempmsg ,temp)

  //           if(user.msg.length==0)
  //           {
  //             user.msg.push(temp)
  //           }
  //           else
  //          {
  //             for (var i = 0; i < user.msg.length; i++) {
  //               if (UID <= user.msg[i].UID) {
  //                 user.msg.splice(i, 0, temp);
  //                 break;
  //               }
  //               if(i +1 == user.msg.length)
  //               {
  //                 user.msg.push(temp)
  //                 break;
  //               }
  //             }
  //           }
  //   }
  // }
  static d = new Date();
  static p = ChatService.d.getTime() * 1000;
  //any message without the chat attribute is being forwarded to this handler from anonmymous acount.
  //same as above old_messages function, except that this is for anonymous account.
  ano_oldMessages = async (xml) => {
    //  console.log(xml)
    // console.log(new XMLSerializer().serializeToString(xml))
    let stringifiedXml = new XMLSerializer().serializeToString(xml);
    // if(ChatService.p<){
    //   return;
    // }
    var t = 0;
    var xmlString = new XMLSerializer().serializeToString(xml);
    const parser = new Parser({ strict: false, trim: true });
    parser.parseString(xmlString, (err, result) => {
      // console.log(result)

      var x = result.MESSAGE.RESULT;

      // //console.log(x)
      if (x != undefined && x != null) {
        var y = x[0].FORWARDED[0].MESSAGE[0];
        //  //console.log(y)+
        var UID = y.ARCHIVED[0].$.ID;
        var d = new Date(UID / 1000);
        // //console.log(d);
        var to = y.$.TO;
        if (to.indexOf("/") != -1) to = to.substring(0, to.indexOf("/"));
        var from = y.$.FROM;
        if (from.indexOf("/") != -1)
          from = from.substring(0, from.indexOf("/"));
        var msgBody = y.BODY[0];
        //  console.log(msgBody)
        try {
          if (this.chatLoadedArr.ano != "jai") {
            // if(to.i this.chatLoadedArr.norm)
            if (from.includes(this.chatLoadedArr.ano)) {
              setTimeout(() => {
                this.chatLoadedArr.loadedArr.push("ano");
                this.report.multiPurposeSubj.next({
                  chatLoad: { anonymousChatLoaded: true },
                });
              }, 2000);
            }
          }
        } catch {}
        try {
          var tempmsg = JSON.parse(msgBody);
        } catch {
          console.log(result);
          console.log("arehoooooooooooooo");
          return true;
        }
        //console.log(tempmsg)

        //  if(tempmsg.type=="exit"){ return true; }

        if (tempmsg.type == "notification") {
          // console.log(tempmsg)
          //console.log(from)
          ChatService.noticeList.next(tempmsg);
          return true;
        }

        var userInd;
        ChatService.myAnoChats.forEach((item, ind) => {
          if (item.jid == to || item.jid == from) {
            userInd = ind;
            if (item.clearChat > UID) {
              item.reachedEnd = true;
              return true;
            }
            var temp;
            if (tempmsg.type == "chat") {
              if (tempmsg.unique) {
                temp = {
                  type: "text",
                  text: tempmsg.content,
                  date: d,
                  to: to,
                  UID: UID,
                  from: from,
                  msgXml: stringifiedXml,
                  msgStanzaId: "",
                  unique: tempmsg.unique,
                };
              } else {
                temp = {
                  type: "text",
                  text: tempmsg.content,
                  date: d,
                  to: to,
                  UID: UID,
                  from: from,
                  msgXml: stringifiedXml,
                  msgStanzaId: "",
                };
              }
              if (y["STANZA-ID"]) {
                temp.msgStanzaId = y["STANZA-ID"][0].$.ID;
              }
            } else {
              if (
                tempmsg.type == "exit" ||
                tempmsg.type == "resume" ||
                tempmsg.type == "block" ||
                tempmsg.type == "unblock"
              ) {
                temp = {
                  type: tempmsg.type,
                  content: tempmsg.content,
                  date: d,
                  to,
                  UID,
                };
              } else {
                var filename = tempmsg.content.substring(
                  tempmsg.content.lastIndexOf("/") + 1,
                  tempmsg.content.length
                );
                temp = {
                  type: tempmsg.type,
                  name: filename,
                  src: tempmsg.content,
                  date: d,
                  to: to,
                  UID: UID,
                  from: from,
                  msgXml: stringifiedXml,
                  msgStanzaId: "",
                };
                if (y["STANZA-ID"]) {
                  console.log(y["STANZA-ID"]);
                  temp.msgStanzaId = y["STANZA-ID"][0].$.ID;
                } else {
                  console.log("...");
                }
              }
            }
            // console.log(temp)
            if (!this.notfineArray.includes(temp.type)) {
              if (item.msg.length == 0) {
                item.msg.push(temp);
              } else {
                for (var i = 0; i < item.msg.length; i++) {
                  if (UID <= item.msg[i].UID) {
                    let feeldouble = item.msg.filter((val) => {
                      return val.unique == temp.unique;
                    });
                    if (feeldouble.length == 0) {
                      item.msg.splice(i, 0, temp);
                    }

                    break;
                  }
                  if (i + 1 == item.msg.length) {
                    let feeldouble = item.msg.filter((val) => {
                      return val.unique == temp.unique;
                    });
                    if (feeldouble.length == 0) {
                      item.msg.push(temp);
                    }

                    break;
                  }
                }
              }
              return;
            }
          }
        });
      } else {
        //console.log(result);
      }
    });

    await ChatService.sortFunAno();
    ////console.log(xml)
    ////console.log(this.chathistory)
    return true;
  };

  //This function is called when the user scrolls and the bottom space is less.
  //We will ask MAM for 10 more old messages
  reg_loadOldMessages(activeJid) {
    var act;
    ChatService.myChats.forEach((x, ind) => {
      if (x.jid == activeJid) {
        act = ind;
        try {
          if (x.clearChat != -1) {
            //going forward only if we have cleared the chat.
            var iq2 = $.$iq({ type: "set", id: "loadmessages" }).c("query", {
              xmlns: "urn:xmpp:mam:2",
            });
            iq2.c("x", { xmlns: "jabber:x:data", type: "submit" });
            iq2
              .c("field", { var: "FORM_TYPE", type: "hidden" })
              .c("value")
              .t("urn:xmpp:mam:2")
              .up()
              .up();
            iq2
              .c("field", { var: "with" })
              .c("value")
              .t(ChatService.myChats[act].jid)
              .up()
              .up()
              .up();
            iq2
              .c("set", { xmlns: "http://jabber.org/protocol/rsm" })
              .c("max")
              .t(ChatService.scrollLoadCount)
              .up();
            iq2.c("before").t(ChatService.myChats[act].msg[0].UID);
            iq2.c("after").t(x.clearChat);
            //after clearchat time

            ChatService.reg_connection.sendIQ(iq2);
          } else {
            var iq2 = $.$iq({ type: "set", id: "loadmessages" }).c("query", {
              xmlns: "urn:xmpp:mam:2",
            });
            iq2.c("x", { xmlns: "jabber:x:data", type: "submit" });
            iq2
              .c("field", { var: "FORM_TYPE", type: "hidden" })
              .c("value")
              .t("urn:xmpp:mam:2")
              .up()
              .up();
            iq2
              .c("field", { var: "with" })
              .c("value")
              .t(ChatService.myChats[act].jid)
              .up()
              .up()
              .up();
            iq2
              .c("set", { xmlns: "http://jabber.org/protocol/rsm" })
              .c("max")
              .t(ChatService.scrollLoadCount)
              .up();
            iq2.c("before").t(ChatService.myChats[act].msg[0].UID);
            //after clearchat time

            //send that iq to ejabberd server
            ChatService.reg_connection.sendIQ(iq2);
          }
        } catch {}
      }
    });
  }

  //same as reg_loadOldMessages only change is that this is for anonymou acount
  ano_loadOldMessages(activeJid) {
    var act;
    ChatService.myAnoChats.forEach((x, ind) => {
      if (x.jid == activeJid) {
        act = ind;
      }
    });
    var iq2 = $.$iq({ type: "set", id: "loadmessages" }).c("query", {
      xmlns: "urn:xmpp:mam:2",
    });
    iq2.c("x", { xmlns: "jabber:x:data", type: "submit" });
    iq2
      .c("field", { var: "FORM_TYPE", type: "hidden" })
      .c("value")
      .t("urn:xmpp:mam:2")
      .up()
      .up();
    iq2
      .c("field", { var: "with" })
      .c("value")
      .t(ChatService.myAnoChats[act].jid)
      .up()
      .up()
      .up();
    iq2
      .c("set", { xmlns: "http://jabber.org/protocol/rsm" })
      .c("max")
      .t(ChatService.scrollLoadCount)
      .up();
    iq2.c("before").t(ChatService.myAnoChats[act].msg[0].UID);

    ChatService.ano_connection.sendIQ(iq2);
  }

  //This function is used to delete a message, either for me or delete for both.
  deleteMessagesXmpp(msgBodyForDelete, account) {
    console.log(msgBodyForDelete);
    let jaiObj = {
      type: msgBodyForDelete.timestamp.type,
      content: msgBodyForDelete.timestamp.text,
      unique: msgBodyForDelete.timestamp.unique,
    };
    if (msgBodyForDelete.timestamp.type) {
      if (msgBodyForDelete.timestamp.type == "text") {
        jaiObj.type = "chat";
      } else {
        jaiObj.content = msgBodyForDelete.timestamp.src;

        jaiObj = {
          type: msgBodyForDelete.timestamp.type,
          content: msgBodyForDelete.timestamp.src,
          unique: msgBodyForDelete.timestamp.unique,
        };
      }
    }
    let deleteBody = {
      isme: msgBodyForDelete.deleteforme,
      timestamp: JSON.stringify(jaiObj),
      jid: msgBodyForDelete.jid,
    };
    let funn = { data: [deleteBody] };
    console.log(funn);
    var msgOdj = {
      type: "delete",
      otherjid: msgBodyForDelete.jid,
      myjid: this.cookieJid,
      content: "This message was deleted",
      unique: msgBodyForDelete.timestamp.unique,
    };
    var actualMsg = "";
    var message;
    //If delete for me
    if (msgBodyForDelete.deleteforme == true) {
      actualMsg = JSON.stringify(msgOdj);
      message = $.$msg({ to: msgBodyForDelete.jid, type: "delete" })
        .c("body")
        .t(actualMsg);
      var messageone = $.$msg({ to: msgBodyForDelete.jid, type: "chat" });
      // message = $.$msg({to: msgBodyForDelete.jid, type:"deletee"})

      if (account == 1) {
        //For normal account
        try {
          var messagee = $.$msg({
            to: msgBodyForDelete.jid,
            type: "chat",
            unique: new Date().getTime() * 1000,
          })
            .c("body")
            .t(actualMsg);
          // ChatService.reg_connection.send(message)
          ChatService.reg_connection.send(messagee);
        } catch {}
      } else {
        //for anonymous account
        try {
          ChatService.ano_connection.send(message);
        } catch {}
      }
    } else {
      //for delete for both
      msgOdj.type = "deleteforboth";
      actualMsg = JSON.stringify(msgOdj);
      message = $.$msg({
        to: msgBodyForDelete.jid,
        type: "chat",
        unique: new Date().getTime() * 1000,
      })
        .c("body")
        .t(actualMsg);

      //deciding and sending messages from our account to the ejabberd server.
      if (account == 1) {
        try {
          ChatService.reg_connection.send(message);
        } catch {}
      } else {
        try {
          ChatService.ano_connection.send(message);
        } catch {}
      }
    }
    //making a request to backend to delete that message
    return this.http.post(
      environment.baseUrl + "/api/v2.0/user/deletemessage",
      funn,
      { withCredentials: true }
    );
  }

  unreadAccountsArr = [];

  ChatPopUp = new Subject<any>();
  //function used by version 1, not in use now.
  // listenChatPopUp() {
  //   return this.ChatPopUp.asObservable();
  // }

  //This is used to send a request from original account
  reg_sendRequest(info: any) {
    var jid_ = info.jid;
    console.log(info);

    var sendReq = true;
    var t = 0;
    // for(var i=0;i<ChatService.myChats.length;i++)
    // {
    //   if(jid_ === ChatService.myChats[i].jid){
    //     ChatService.myChats[i].profilePic = info.uservisibility.profilePic;
    //       sendReq=false;
    //       console.log('breaking');
    //       this.ChatPopUp.next({jid : info.jid,ano:false})
    //       break;
    //   }
    // }

    //iterating through the chats of original account
    var normalreq = _.map(ChatService.myChats, (user) => {
      if (jid_ == user.jid) {
        user.profilePic = info.uservisibility.profilePic;
        sendReq = false;
        console.log("breaking");
        this.ChatPopUp.next({ jid: info.jid, ano: false });
        return user;
      }
    });
    normalreq = _.without(normalreq, undefined);
    if (normalreq.length == 0) {
      if (sendReq) {
        //forming a subscribed iq pcket
        var iqy = $.$pres({ to: jid_, type: "subscribed" });
        ChatService.reg_connection.send(iqy, this.fun);

        var iqx = $.$iq({ type: "set", id: "vvvv" }).c("query", {
          xmlns: "jabber:iq:roster",
        });
        iqx.c("item", { jid: jid_ });
        //console.log(iqx);
        ChatService.reg_connection.sendIQ(iqx, this.fun);

        //forming a subscribe iq pcket
        var iqy = $.$pres({ to: jid_, type: "subscribe" });
        ChatService.reg_connection.send(iqy, this.fun);

        //sending request to backend to add this person to the list.
        this.addToBackendRoster(
          info.jid,
          info.uservisibility.name,
          info.uservisibility.profilePic,
          info.featureName
        );

        // var iq = $.$iq({ type: 'get', }).c('query', { xmlns: 'jabber:iq:roster' });
        // ChatService.reg_connection.sendIQ(iq, this.reg_on_roster);
        // t=3000

        //again get the chat list from node backend
        ChatService.jidEmitter.next([]);

        //Triggering refresh roster
        ChatService.sortAtSite.next({ key: "refreshroster" });
      }
    }

    // setTimeout( ()=>{
    // this.ChatPopUp.next({jid : jid_,ano:false})
    // },1000 )
  }

  //same as reg_sendRequest only difference is that it is for anonymous account
  ano_sendRequest(info: any) {
    // alert('ppp')

    var jid_ = info.jid;
    //console.log(jid_)

    var sendReq = true;

    // for(var i=0;i<ChatService.myAnoChats.length;i++)
    // {
    //   if(jid_ === ChatService.myAnoChats[i].jid){
    //     ChatService.myAnoChats[i].profilePic=info.uservisibility.profilePic;
    //       sendReq=false;
    //       this.ChatPopUp.next({jid : info.jid,ano:true})
    //       break;
    //   }
    // }
    var anoreq = _.map(ChatService.myAnoChats, (user) => {
      if (jid_ == user.jid) {
        user.profilePic = info.uservisibility.profilePic;
        sendReq = false;
        console.log("breaking");
        this.ChatPopUp.next({ jid: info.jid, ano: false });
        return user;
      }
    });
    anoreq = _.without(anoreq, undefined);
    if (anoreq.length == 0) {
      if (sendReq) {
        var iqy = $.$pres({ to: jid_, type: "subscribed" });
        ChatService.ano_connection.send(iqy, this.fun);

        this.addToBackendRoster(
          info.jid,
          info.uservisibility.name,
          info.uservisibility.profilePic,
          info.featureName
        );

        var iqx = $.$iq({ type: "set", id: "vvvv" }).c("query", {
          xmlns: "jabber:iq:roster",
        });
        iqx.c("item", { jid: jid_ });
        //console.log(iqx);
        ChatService.ano_connection.sendIQ(iqx, this.fun);

        var iqy = $.$pres({ to: jid_, type: "subscribe" });
        ChatService.ano_connection.send(iqy, this.fun);

        // var iq = $.$iq({ type: 'get', }).c('query', { xmlns: 'jabber:iq:roster' });
        // ChatService.reg_connection.sendIQ(iq, this.reg_on_roster);
        // t=3000
        var a = {
          //userId to be get from info
          userId: info.jid.substring(0, info.jid.indexOf("@")),
          jid: jid_,
          name: info.uservisibility.name,
          profilePic: info.uservisibility.profilePic,
          clearChat: -1,
          blocked: false,
          chatExit: false,
          canResume: false,
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
        console.log(a);

        ChatService.myAnoChats.unshift(a);
        console.log(ChatService.myAnoChats);

        ChatService.sortAtSite.next({ key: "refreshroster" });
      }
    }

    // setTimeout( ()=>{
    this.ChatPopUp.next({ jid: jid_, ano: true });
    // },1000 )
  }

  //Old function, not being used now
  // checkReg(jid) {
  //   console.log(jid);
  //   for (var i = 0; i < ChatService.myChats.length; i++) {
  //     if (jid === ChatService.myChats[i].jid) {
  //       console.log("yo");
  //       this.ChatPopUp.next({ jid: jid, ano: false });
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  //Old function, not being used now

  checkAno(jid) {
    for (var i = 0; i < ChatService.myAnoChats.length; i++) {
      if (jid === ChatService.myAnoChats[i].jid) {
        this.ChatPopUp.next({ jid: jid, ano: true });
        return true;
      }
    }
    return false;
  }

  //to catch the presence xmls received from the ejabberd server (handler for subscription).
  reg_presence(xml) {
    console.log(xml);
    var xmlString = new XMLSerializer().serializeToString(xml);
    const parser = new Parser({ strict: false, trim: true });
    var jid_;
    parser.parseString(xmlString, (err, result) => {
      console.log(result);
      jid_ = result.PRESENCE.$.FROM;
    });
    var iqy = $.$pres({ to: jid_, type: "subscribed" });
    ChatService.reg_connection.send(iqy, this.fun);

    console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvv");

    var iqx = $.$iq({ type: "set", id: "vvvv" }).c("query", {
      xmlns: "jabber:iq:roster",
    });
    iqx.c("item", { jid: jid_ });
    ChatService.reg_connection.sendIQ(iqx, this.fun);

    var iqy = $.$pres({ to: jid_, type: "subscribe" });
    ChatService.reg_connection.send(iqy, this.fun);

    var iq = $.$iq({ type: "get" }).c("query", { xmlns: "jabber:iq:roster" });
    ChatService.reg_connection.sendIQ(iq, this.reg_on_roster);

    //ChatService.jidEmitter.next( []) ;
    //ChatService.jidEmitter2.next([]);
  }

  //to catch the presence xmls received from the ejabberd server (handler for subscription).
  ano_presence(xml) {
    var xmlString = new XMLSerializer().serializeToString(xml);
    const parser = new Parser({ strict: false, trim: true });
    var jid_;
    parser.parseString(xmlString, (err, result) => {
      //console.log(result)
      jid_ = result.PRESENCE.$.FROM;
    });
    var iqy = $.$pres({ to: jid_, type: "subscribed" });
    ChatService.ano_connection.send(iqy, this.fun);

    var iqx = $.$iq({ type: "set", id: "vvvv" }).c("query", {
      xmlns: "jabber:iq:roster",
    });
    iqx.c("item", { jid: jid_ });
    //console.log(iqx);
    ChatService.ano_connection.sendIQ(iqx, this.fun);

    var iqy = $.$pres({ to: jid_, type: "subscribe" });
    ChatService.ano_connection.send(iqy, this.fun);

    var iq = $.$iq({ type: "get" }).c("query", { xmlns: "jabber:iq:roster" });
    ChatService.ano_connection.sendIQ(iq, this.ano_on_roster);
  }

  //takes care of the exit chat functionality
  exitChat(jid, account, aid) {
    var myjid;
    console.log(account);
    if (account == 1) {
      myjid = this.cookieJid;
    } else {
      myjid = this.cookieJidAno;
    }

    //make a request to node backend about the exit
    this.http
      .post(
        environment.baseUrl + "/api/v2.0/user/endChat",
        { mjid: account, jid: jid, aid: aid },
        { withCredentials: true }
      )
      .subscribe((msg: { message: string }) => {
        console.log(msg);

        var active;
        var msgString;
        var x = new Date();
        var temp = { type: "exit", content: myjid };
        msgString = JSON.stringify(temp);
        var message = $.$msg({ to: jid, type: "chat" }).c("body").t(msgString);
        if (account == 1) {
          //redirect the exit functionality to the external function that reuses the exit functionality
          this.loadashNormal(jid, "exit");
          // ChatService.myChats.forEach((x,ind)=>{
          //   if(x.jid==jid){
          //     active = ind;
          //     ChatService.myChats[active].chatExit =true;
          //     ChatService.myChats[active].canResume = true;
          //     ChatService.myChats[active].msg.push({ type:'exit',content:jid,to:jid,date:x  })
          //     ChatService.reg_connection.send(message);
          //   }
          // })
        }
        if (account == 2) {
          //redirect the exit functionality to the external function that reuses the exit functionality
          this.loadashAno(jid, "exit");
          // ChatService.myAnoChats.forEach((x,ind)=>{
          //   if(x.jid==jid){
          //     active = ind
          //     ChatService.myAnoChats[active].chatExit =true;
          //     ChatService.myAnoChats[active].canResume =true;
          //     ChatService.myAnoChats[active].msg.push({ type:'exit',content:jid,to:jid,date:x })
          //     ChatService.ano_connection.send(message)

          //   }
          // })
        }
        //ChatService.sortAtSite.next({key:'exit'});
      });

    var msgString;
    var temp = { type: "exit", content: jid };
    msgString = JSON.stringify(temp);
    // console.log(msgString);

    var message = $.$msg({ to: jid, type: "chat" }).c("body").t(msgString);
    //sending the above built exit iq packet to ejabberd server
    ChatService.reg_connection.send(message, (x) => {
      console.log(x);
    });
  }

  //function used to resume chat
  resumeChat(jid, aid, account) {
    var myjid;
    console.log(account);
    if (account == 1) {
      myjid = this.cookieJid;
    } else {
      myjid = this.cookieJidAno;
    }

    console.log(jid, account, aid);
    //make a request to node backend about the resume
    this.http
      .post(
        environment.baseUrl + "/api/v2.0/user/resumeChat",
        { mjid: account, jid: jid, aid: aid },
        { withCredentials: true }
      )
      .subscribe((msg: any) => {
        console.log(msg);

        var active;
        var msgString;
        var x = new Date();
        var temp = { type: "resume", content: myjid };
        msgString = JSON.stringify(temp);
        var message = $.$msg({ to: jid, type: "chat" }).c("body").t(msgString);

        if (account == 1) {
          //redirect the resume functionality to the external function that reuses the resume functionality
          this.loadashNormal(jid, "resume");
          // ChatService.myChats.forEach((x,ind)=>{
          //   if(x.jid==jid){
          //     active = ind
          //     ChatService.myChats[active].chatExit =false;
          //     ChatService.myChats[active].canResume = false;
          //     ChatService.myChats[active].msg.push({ type:'resume',content:jid,to:jid ,date: new Date() })
          //     console.log(message);
          //     ChatService.reg_connection.send(message);
          //     ChatService.sortAtSite.next({key:'resume',content:ChatService.myChats[ind].jid});
          //   }
          // })
        }
        if (account == 2) {
          //redirect the resume functionality to the external function that reuses the resume functionality
          this.loadashAno(jid, "resume");
          // ChatService.myAnoChats.forEach((x,ind)=>{
          //   if(x.jid==jid){
          //     active = ind;
          //     ChatService.myAnoChats[active].chatExit =false;
          //     ChatService.myAnoChats[active].canResume =false;
          //     ChatService.myAnoChats[active].msg.push({ type:'resume',content:jid,to:jid,date:x  })
          //     ChatService.ano_connection.send(message)
          //     ChatService.sortAtSite.next({key:'resume',content:ChatService.myAnoChats[ind].jid});
          //   }
          // })
        }
      });
  }

  clearMsgBox = new Subject<any>();

  //function used to clear chat
  clearChat(jid, account) {
    var time = new Date().getTime() * 1000;

    //Make a request to node backend, to let the node server know about the clearing chat
    this.http
      .post(
        environment.baseUrl + "/api/v2.0/user/clearChat",
        { mjid: account, jid: jid, time: time },
        { withCredentials: true }
      )
      .subscribe((msg: any) => {
        var active;
        console.log(msg);
        if (msg.time) {
          console.log(msg);
          if (account == 1) {
            console.log(msg);
            //send clearchat message to mobile and other devices
            this.loadashNormal(jid, "clearchatt", {
              time: msg.time,
              account: account,
              reallyFromJai: true,
            });
          }
          if (account == 2) {
            console.log(msg);
            //send clearchat message to mobile and other devices
            this.loadashAno(jid, "clearchatt", {
              time: msg.time,
              account: account,
              reallyFromJai: true,
            });
          }
        }
      });
  }
  normaluser;
  anouser;

  //Does the reusable heavy lifting of chat functionality like exit, resume, block, unblock
  loadashNormal(jid, opt, JaiOrNot?) {
    //Here we will get the jid, opt, jaiornot as parameters to this funciton
    console.log(jid);
    console.log(typeof jid);
    console.log(opt);
    var x = new Date();
    var fakeVar = true;
    this.normaluser = _.map(ChatService.myChats, (user) => {
      //console.log(user.jid)
      console.log(user.jid + "==>" + jid);
      if (user.jid == jid) {
        //finding the target user to apply the functionality
        console.log(user.jid);
        if (opt == "unblock") {
          //If it is unblock
          console.log(user);
          user.blocked = false;
          console.log(ChatService.myChats);
          //push a unblock message to the target user's messages array, so that we can show necessery text in the left bar.
          user.msg.push({
            type: "unblock",
            content: this.rjid,
            to: user.jid,
            date: x,
          });
          if (fakeVar == true) {
            console.log(ChatService.myChats);
            var msgString = { type: "unblock", content: this.rjid };
            var v = JSON.stringify(msgString);
            var message = $.$msg({ to: user.jid, type: "chat" }).c("body").t(v);
            if (JaiOrNot) {
              if (JaiOrNot == "jai") {
                //If jaiOrNot is Jai, then we do nothing
              }
            } else {
              //else send the iq to ejabberd server
              ChatService.reg_connection.send(message);
            }

            ChatService.sortAtSite.next({
              key: "unblocked",
              content: user.jid,
              account: 1,
            });
          }

          // for anonymous list
        }

        if (opt == "block") {
          //If we want to block, change the blocked flag to true
          user.blocked = true;
          user.msg.push({ type: "block", content: jid, to: user.jid, date: x });
          //refresh chat related components with sortAtsite
          ChatService.sortAtSite.next({
            key: "block",
            content: user.jid,
            account: 1,
          });
        }

        if (opt == "exit") {
          //If we want to exit, change the chatexit flag to true
          var temp = { type: "exit", content: this.cookieJid };
          var msgStringg = JSON.stringify(temp);
          // console.log(msgString);

          var message = $.$msg({ to: jid, type: "chat" })
            .c("body")
            .t(msgStringg);
          // active = ind;
          user.chatExit = true;
          user.canResume = true;
          // console.log(message);

          user.msg.push({ type: "exit", content: jid, to: user.jid, date: x });
          // console.log(user.msg);
          if (JaiOrNot) {
            if (JaiOrNot == "jai") {
              // console.log("inside if");
            }
          } else {
            // console.log("else");

            try {
              //send the final message to the ejabberd server
              ChatService.reg_connection.send(message);
            } catch {}
          }
          //refresh chat related components with sortAtsite
          ChatService.sortAtSite.next({
            key: "exit",
            content: user.jid,
            account: 1,
          });
        }

        if (opt == "resume") {
          //if the opt is resume

          var temp = { type: "resume", content: this.cookieJid };
          var msgStringl = JSON.stringify(temp);
          var message = $.$msg({ to: jid, type: "chat" })
            .c("body")
            .t(msgStringl);
          if (user.jid == jid) {
            //active = ind
            user.chatExit = false;
            user.canResume = false;
            user.msg.push({
              type: "resume",
              content: jid,
              to: user.jid,
              date: new Date(),
            });
            console.log(msgStringl);
            if (JaiOrNot) {
              if (JaiOrNot == "jai") {
              }
            } else {
              ChatService.reg_connection.send(message);
            }
            //refresh chat related components with sortAtsite
            ChatService.sortAtSite.next({
              key: "resume",
              content: user.jid,
              account: 1,
            });
          }
        }

        if (opt == "clearchatt") {
          //if the opt is clearchatt
          console.log("clearrchatttt");
          if (JaiOrNot) {
            if (JaiOrNot.time && JaiOrNot.reallyFromJai) {
              user.clearChat = JaiOrNot.time;
              user.msg = [];
              var tempp = {
                type: "clearchat",
                content: jid,
                clearstamp: JaiOrNot.time,
              };
              var msgStringl = JSON.stringify(tempp);
              var message = $.$msg({ to: jid, type: "chat" })
                .c("body")
                .t(msgStringl);
              try {
                ChatService.reg_connection.send(message);
              } catch {}
              //refresh chat related components with sortAtsite
              ChatService.sortAtSite.next({
                key: "clearchat",
                content: user.jid,
                account: 1,
              });
            }
          }
        }

        if (opt == "clearchat" || opt == "clearchat") {
          console.log("clearrchatt");
          if (JaiOrNot) {
            if (JaiOrNot.time && JaiOrNot.reallyFromJai) {
              user.clearChat = JaiOrNot.time;
              user.msg = [];
              console.log(ChatService.myChats);
              //refresh chat related components with sortAtsite
              ChatService.sortAtSite.next({
                key: "clearchat",
                content: user.jid,
                account: 1,
              });
            }
          }
        }

        if (opt == "exitMe") {
          user.chatExitMe = true;
          //changing the necessery flag, of the user
          //refresh chat related components with sortAtsite
          ChatService.sortAtSite.next({
            key: "exit",
            content: user.jid,
            account: 1,
          });
        }

        if (opt == "resumeMe") {
          //changing the necessery flag, of the user
          user.chatExitMe = false;
          //refresh chat related components with sortAtsite
          ChatService.sortAtSite.next({
            key: "resume",
            content: user.jid,
            account: 1,
          });
        }

        if (opt == "blockedMe") {
          //changing the necessery flag, of the user
          user.blockedMe = true;
          //refresh chat related components with sortAtsite
          ChatService.sortAtSite.next({
            key: "block",
            content: user.jid,
            account: 1,
          });
        }

        if (opt == "unblockedMe") {
          //changing the necessery flag, of the user
          user.blockedMe = false;
          //refresh chat related components with sortAtsite
          ChatService.sortAtSite.next({
            key: "unblock",
            content: user.jid,
            account: 1,
          });
        }
      }
    });
    this.normaluser = _.without(this.normaluser, undefined);

    // if(opt=='unblock'){
    //   this.anouser = _.map(ChatService.myAnoChats, (user) => {
    //     if (user.jid == jid) {
    //       if(opt=='unblock'){
    //         user.blocked = false;
    //         console.log(ChatService.myAnoChats)
    //         user.msg.push({ type:'unblock',content:this.rjid,to:user.jid,date:x  })
    //           console.log(ChatService.myAnoChats)
    //           if(fakeVar==true){  //to check, I have commented this code logically
    //             var msgString = { type:'unblock',content:this.rjid }
    //             var v = JSON.stringify(msgString)
    //             var message = $.$msg({ to:user.jid, type: "chat" })
    //               .c("body").t(v);
    //             ChatService.ano_connection.send(message);
    //           }
    //           ChatService.sortAtSite.next({key:'unblock',content:user.jid,account:1});

    //       }
    //     //   if(opt == 'exit') {
    //     //     var temp = {type:'exit',content:this.cookieJidAno };
    //     //     var msgStringg = JSON.stringify(temp) ;

    //     //     var message = $.$msg({ to:jid, type: "chat" })
    //     //     .c("body").t(msgStringg);
    //     //     // active = ind;
    //     //     user.chatExit =true;
    //     //     user.canResume = true;
    //     //     user.msg.push({ type:'exit',content:jid,to:user.jid,date:x})
    //     //     ChatService.ano_connection.send(message);
    //     //     ChatService.sortAtSite.next({key:'exit',content:user.jid,account:2});
    //     //   }
    //     //   if(opt == 'resume') {
    //     //     var temp = {type:'resume',content: this.cookieJidAno }
    //     //     var msgStringl = JSON.stringify(temp);
    //     //     var message = $.$msg({ to:jid, type: "chat" })
    //     //     .c("body").t(msgStringl);
    //     //     if(user.jid==jid){
    //     //       //active = ind
    //     //       user.chatExit =false;
    //     //       user.canResume = false;
    //     //       user.msg.push({ type:'resume',content:jid,to:user.jid ,date: new Date() })
    //     //       console.log(message);
    //     //       ChatService.ano_connection.send(message);
    //     //       ChatService.sortAtSite.next({key:'resume',content: user.jid,account:2});
    //     //     }
    //     // }
    //     }
    //   });
    // }
    return this.normaluser;
  }

  //Does the reusable heavy lifting of chat functionality like exit, resume, block, unblock
  //This is same as above lodash normal, except that this works on anonymous user.
  loadashAno(jid, opt, JaiOrNot?) {
    console.log(jid);
    var x = new Date();
    var fakeVar = true;
    this.anouser = _.map(ChatService.myAnoChats, (user) => {
      if (user.jid == jid) {
        if (opt == "unblock") {
          user.blocked = false;
          console.log(ChatService.myAnoChats);
          user.msg.push({
            type: "unblock",
            content: this.ajid,
            to: user.jid,
            date: x,
          });
          console.log(ChatService.myAnoChats);
          if (fakeVar == true) {
            //to check, I have commented this code logically
            var msgString = { type: "unblock", content: this.ajid };
            var v = JSON.stringify(msgString);
            var message = $.$msg({ to: user.jid, type: "chat" }).c("body").t(v);
            if (JaiOrNot) {
              if (JaiOrNot == "jai") {
              }
            } else {
              try {
                ChatService.ano_connection.send(message);
              } catch {}
            }
          }
          ChatService.sortAtSite.next({
            key: "unblocked",
            content: user.jid,
            account: 2,
          });
        }
        if (opt == "block") {
          user.blocked = true;
          user.msg.push({ type: "block", content: jid, to: user.jid, date: x });
          ChatService.sortAtSite.next({
            key: "block",
            content: user.jid,
            account: 2,
          });
        }
        if (opt == "exit") {
          var temp = { type: "exit", content: this.cookieJidAno };
          var msgStringg = JSON.stringify(temp);

          var message = $.$msg({ to: jid, type: "chat" })
            .c("body")
            .t(msgStringg);
          // active = ind;
          user.chatExit = true;
          user.canResume = true;
          user.msg.push({ type: "exit", content: jid, to: user.jid, date: x });
          if (JaiOrNot) {
            if (JaiOrNot == "jai") {
            }
          } else {
            ChatService.ano_connection.send(message);
          }
          ChatService.sortAtSite.next({
            key: "exit",
            content: user.jid,
            account: 2,
          });
        }
        if (opt == "resume") {
          var temp = { type: "resume", content: this.cookieJidAno };
          var msgStringl = JSON.stringify(temp);
          var message = $.$msg({ to: jid, type: "chat" })
            .c("body")
            .t(msgStringl);
          if (user.jid == jid) {
            //active = ind
            user.chatExit = false;
            user.canResume = false;
            user.msg.push({
              type: "resume",
              content: jid,
              to: user.jid,
              date: new Date(),
            });
            console.log(message);
            if (JaiOrNot) {
              if (JaiOrNot == "jai") {
              }
            } else {
              ChatService.ano_connection.send(message);
            }

            ChatService.sortAtSite.next({
              key: "resume",
              content: user.jid,
              account: 2,
            });
          }
        }
        if (opt == "clearchatt") {
          if (JaiOrNot) {
            if (JaiOrNot.time && JaiOrNot.reallyFromJai) {
              user.clearChat = JaiOrNot.time;
              user.msg = [];
              var tempp = {
                type: "clearchat",
                content: jid,
                clearstamp: JaiOrNot.time,
              };
              var msgStringl = JSON.stringify(tempp);
              var message = $.$msg({ to: jid, type: "chat" })
                .c("body")
                .t(msgStringl);
              try {
                ChatService.ano_connection.send(message);
              } catch {}
              ChatService.sortAtSite.next({
                key: "clearchat",
                content: user.jid,
                account: 2,
              });
            }
          }
        }

        if (opt == "clearchat") {
          if (JaiOrNot) {
            if (JaiOrNot.time && JaiOrNot.reallyFromJai) {
              user.clearChat = JaiOrNot.time;
              user.msg = [];

              ChatService.sortAtSite.next({
                key: "clearchat",
                content: user.jid,
                account: 2,
              });
            }
          }
        }

        if (opt == "exitMe") {
          user.chatExitMe = true;
          ChatService.sortAtSite.next({
            key: "exit",
            content: user.jid,
            account: 2,
          });
        }

        if (opt == "resumeMe") {
          user.chatExitMe = false;
          ChatService.sortAtSite.next({
            key: "resume",
            content: user.jid,
            account: 2,
          });
        }

        if (opt == "blockMe") {
          user.blockedMe = true;
          ChatService.sortAtSite.next({
            key: "block",
            content: user.jid,
            account: 2,
          });
        }

        if (opt == "unblockMe") {
          user.blockedMe = false;
          ChatService.sortAtSite.next({
            key: "unblock",
            content: user.jid,
            account: 2,
          });
        }
      }
    });
    this.anouser = _.without(this.anouser, undefined);
    // if(opt=='unblock'){
    //   this.anouser = _.map(ChatService.myChats, (user) => {
    //     if(user.jid==jid){
    //       user.blocked = false;
    //       console.log(ChatService.myChats)
    //       user.msg.push({ type:'unblock',content:this.ajid,to:user.jid,date:x  })
    //         console.log(ChatService.myAnoChats)
    //         if(fakeVar==true){  //to check, I have commented this code logically
    //           var msgString = { type:'unblock',content:this.ajid }
    //           var v = JSON.stringify(msgString)
    //           var message = $.$msg({ to:user.jid, type: "chat" })
    //             .c("body").t(v);
    //           ChatService.reg_connection.send(message);
    //         }
    //         ChatService.sortAtSite.next({key:'unblock',content:user.jid,account:2});

    //     }
    //   });
    // }
    return this.anouser;
  }

  //This function is used to block a user
  blockUser(userId, account, jid) {
    var blk = { featureName: "chat", jid: jid, userId: userId };
    console.log(blk);
    //send request to node backend and the await the response
    this.report.blockUser(blk).subscribe((x: any) => {
      console.log(x);

      this.blockUserUtil(jid, account);

      //ChatService.sortAtSite.next({key:'block'});
      this.newService.refrehPosts.next({ refresh: true, original: false });
      //this.report.blockedSubj.next(true);
      console.log(ChatService.myChats);
      console.log(ChatService.myAnoChats);
    });
    //ChatService.sortAtSite.next('yoo');
    //ChatService.sortAtSite.next({key:'blocked'});
    //ChatService.sortAtSite.next({key:'block'});
  }

  //on receiving response then proceed to block the user through the ejabberd and reflect the changes to the chat related components
  blockUserUtil(userId, account) {
    console.log(userId, account);
    //ChatService.jidEmitter.next([]);
    //ChatService.jidEmitter2.next([]);
    ChatService.refreshList.next({ refresh: "jai" });
    console.log(userId);
    console.log(ChatService.myChats);
    console.log(ChatService.myAnoChats);
    var myJid;
    //assignong myJid to which account.
    if (account == 1) {
      myJid = this.cookieJid;
    } else {
      myJid = this.cookieJidAno;
    }

    var act;
    var currentuser = _.map(ChatService.myChats, (user) => {
      //console.log(user.jid);
      if (user.jid == userId) {
        //Find the target user and do the necesery changes
        user.blocked = true;
        var x = new Date();
        user.msg.push({ type: "block", content: myJid, to: user.jid, date: x });
        //push the respective message to the target user's message list
        var msgString = { type: "block", content: myJid };
        var v = JSON.stringify(msgString);
        console.log(v);
        //nexting through this subject to reflect that changes to chat related components
        ChatService.sortAtSite.next({
          key: "blocked",
          content: userId,
          account: 1,
        });
        if (account == 1) {
          var message = $.$msg({ to: user.jid, type: "chat" }).c("body").t(v);
          try {
            //send iq packet to ejabberd server.
            ChatService.reg_connection.send(message);
          } catch {
            return user;
          }
        }
        console.log(user);
        return user;
      }
    });
    currentuser = _.without(currentuser, undefined);
    console.log(currentuser);

    //repeating same functionality as above, for the anonymous account
    var currentuserano = _.map(ChatService.myAnoChats, (user) => {
      //console.log(user.jid);
      if (user.jid == userId) {
        //Find the target user and do the necesery changes
        user.blocked = true;
        var x = new Date();
        console.log(user);
        user.msg.push({ type: "block", content: myJid, to: user.jid, date: x });
        var msgString = { type: "block", content: myJid };
        var v = JSON.stringify(msgString);
        ChatService.sortAtSite.next({
          key: "blocked",
          content: userId,
          account: 2,
        });
        console.log(v);
        if (account == 2) {
          var message = $.$msg({ to: user.jid, type: "chat" }).c("body").t(v);
          try {
            ChatService.ano_connection.send(message);
          } catch {
            return user;
          }
        }
        return user;
      }
    });
    currentuserano = _.without(currentuserano, undefined);
    console.log(currentuserano);
    //ChatService.sortAtSite.next({});

    return;

    ChatService.myChats.forEach((item, idx) => {
      if (item.jid == userId) {
        console.log(item);

        act = idx;
        var x = new Date();
        ChatService.myChats[act].blocked = true;
        console.log(ChatService.myChats[act]);

        ChatService.myChats[act].msg.push({
          type: "block",
          content: myJid,
          to: ChatService.myChats[act].jid,
          date: x,
        });
        var msgString = { type: "block", content: myJid };
        var v = JSON.stringify(msgString);
        console.log(v);
        var message = $.$msg({ to: ChatService.myChats[act].jid, type: "chat" })
          .c("body")
          .t(v);
        ChatService.reg_connection.send(message);
      }
    });

    ChatService.myAnoChats.forEach((item, idx) => {
      if (item.jid == userId) {
        console.log(item);
        console.log(ChatService.myChats[act]);
        act = idx;
        var x = new Date();
        ChatService.myAnoChats[act].blocked = true;
        ChatService.myAnoChats[act].msg.push({
          type: "block",
          content: myJid,
          to: ChatService.myAnoChats[act].jid,
          date: x,
        });
        var msgString = { type: "block", content: myJid };
        var v = JSON.stringify(msgString);
        console.log(v);
        var message = $.$msg({
          to: ChatService.myAnoChats[act].jid,
          type: "chat",
        })
          .c("body")
          .t(v);
        ChatService.ano_connection.send(message);
      }
    });
    ChatService.sortAtSite.next({});
  }

  //function to unblock a user
  unblockUser(userId) {
    // alert('1')
    var act;
    var x = new Date();
    //calling lodashnormalto unblock a user with this user id from normal list
    var usertounblock = this.loadashNormal(userId, "unblock");

    //calling lodashnormal to unblock a user with this userid from ano list
    var usertounblockano = this.loadashAno(userId, "unblock");

    return;
    ChatService.myChats.forEach((item, idx) => {
      if (item.jid == userId) {
        // alert('2')
        act = idx;
        ChatService.myChats[act].blocked = false;
        ChatService.myChats[act].msg.push({
          type: "unblock",
          content: this.rjid,
          to: ChatService.myChats[act].jid,
          date: x,
        });
        var msgString = { type: "unblock", content: this.rjid };
        var v = JSON.stringify(msgString);
        var message = $.$msg({ to: ChatService.myChats[act].jid, type: "chat" })
          .c("body")
          .t(v);
        ChatService.reg_connection.send(message);
        ChatService.sortAtSite.next({ key: "unblocked" });
      }
    });

    ChatService.myAnoChats.forEach((item, idx) => {
      if (item.jid == userId) {
        // alert('3')
        act = idx;
        ChatService.myAnoChats[act].blocked = false;
        ChatService.myAnoChats[act].msg.push({
          type: "unblock",
          content: this.ajid,
          to: ChatService.myAnoChats[act].jid,
          date: x,
        });
        var msgString = { type: "unblock", content: this.ajid };
        var v = JSON.stringify(msgString);
        var message = $.$msg({
          to: ChatService.myAnoChats[act].jid,
          type: "chat",
        })
          .c("body")
          .t(v);
        ChatService.ano_connection.send(message);
        ChatService.sortAtSite.next({ key: "unblocked" });
      }
    });
    ChatService.sortAtSite.next({ key: "unblocked" });
  }

  toChatTab = new Subject();
  toChatScreen = new BehaviorSubject<any>({ account: -1, idx: -1 });
  static scrollToBottom = new BehaviorSubject<any>({});
  fullScreeenFromMyChats = new BehaviorSubject<any>(null);
  closeNavFromChat = new BehaviorSubject<any>(false);
  goToChatTab() {
    return this.toChatTab;
  }

  goToChatScreen() {
    return this.toChatScreen;
  }
  closeFromChatScreen() {
    return this.closeNavFromChat;
  }

  /////////////////////////////////////

  //old function not being used
  // static isUrl(string) {
  //   var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;

  //   var localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/;
  //   var nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;
  //   if (typeof string !== "string") {
  //     return false;
  //   }

  //   var match = string.match(protocolAndDomainRE);
  //   if (!match) {
  //     return false;
  //   }

  //   var everythingAfterProtocol = match[1];
  //   if (!everythingAfterProtocol) {
  //     return false;
  //   }

  //   if (
  //     localhostDomainRE.test(everythingAfterProtocol) ||
  //     nonLocalhostDomainRE.test(everythingAfterProtocol)
  //   ) {
  //     return true;
  //   }
  //   return false;
  // }

  static getType(str: string) {
    var imgType = ["png", "gif", "svg", "jpg", "jpeg", "jfif", "pjpeg", "pjp"];
    var videoType = ["mp4"];
    var audioType = ["mp3", "wav"];
    if (imgType.indexOf(str) != -1) return "image";
    if (videoType.indexOf(str) != -1) return "video";
    if (audioType.indexOf(str) != -1) return "audio";
    else return "file";
  }

  static sortAtSite = new Subject<any>();
  static refreshList = new Subject<any>();

  //function related to sort
  static mergeSort(unsortedArray) {
    var funn = unsortedArray.sort(function (a, b) {
      try {
        var c = a.msg[a.msg.length - 1].date;
        var d = b.msg[b.msg.length - 1].date;
        return c - d;
      } catch {
        return c;
      }
    });

    console.log(funn);

    // No need to sort the array if the array only has one element or empty
    if (unsortedArray.length <= 1) {
      return unsortedArray;
    } else {
      console.log(unsortedArray[0].msg);
      let sortedActivities: any;

      console.log(sortedActivities);
    }
    // In order to divide the array in half, we need to figure out the middle
    const middle = Math.floor(unsortedArray.length / 2);

    // This is where we will be dividing the array into left and right
    const left = unsortedArray.slice(0, middle);
    const right = unsortedArray.slice(middle);

    // Using recursion to combine the left and right
    return ChatService.merge(
      ChatService.mergeSort(left),
      ChatService.mergeSort(right)
    );
  }
  //function related to sort
  static merge(left, right) {
    let resultArray = [],
      leftIndex = 0,
      rightIndex = 0;
    //console.log(left ,right)
    // We will concatenate values into the resultArray in order
    while (leftIndex < left.length && rightIndex < right.length) {
      if (ChatService.compare(left[leftIndex], right[rightIndex]) == -1) {
        resultArray.push(left[leftIndex]);
        leftIndex++; // move left array cursor
      } else {
        resultArray.push(right[rightIndex]);
        rightIndex++; // move right array cursor
      }
    }

    // We need to concat here because there will be one element remaining
    // from either left OR the right
    resultArray = resultArray
      .concat(left.slice(leftIndex))
      .concat(right.slice(rightIndex));
    //console.log(left,right);
    // console.log(resultArray)

    return resultArray;
  }

  //function related to sort
  static compare = (a, b) => {
    try {
      var d1 = a.clearChat / 1000;
      if (a.msg.length > 0 && d1 < a.msg[a.msg.length - 1].date.getTime()) {
        d1 = a.msg[a.msg.length - 1].date.getTime();
      }
      var d2 = b.clearChat / 1000;
      if (b.msg.length > 0 && d2 < b.msg[b.msg.length - 1].date.getTime()) {
        d2 = b.msg[b.msg.length - 1].date.getTime();
      }
      //    console.log(d1,d2)
      if (d1 > d2) {
        return -1;
      } else {
        return 1;
      }
    } catch {}
  };

  //function to change the alias of an anonymous user.
  sendAlias(jid, name, mjid) {
    //sending the backend request for the alias
    return this.http.post(
      environment.user,
      { name: name, jid: jid },
      { withCredentials: true }
    );
  }

  //function related to sort
  sortTheList(sortIttt) {
    var sorteddd: any = sortIttt.sort((a, b) => {
      if (a.msg.length > 0 && b.msg.length > 0) {
        return (
          a.msg[a.msg.length - 1].getTime() - b.msg[b.msg.length - 1].getTime()
        );
      }
    });
    console.log("+++++");
    console.log(sorteddd);
    return sorteddd;
  }

  clearNotifications() {
    return this.http.get(environment.baseUrl + "user/deleteallnotification", {
      withCredentials: true,
    });
  }

  //anonymous function related to sending request
  ano_sendRequestIq(jid_, fname?) {
    // console.log(ChatService.myAnoChats);
    //forming the iq packet and sending it to the ejabberd server
    var iqy = $.$pres({ to: jid_, type: "subscribed" });
    ChatService.ano_connection.send(iqy, this.fun);

    var iqx = $.$iq({ type: "set", id: "vvvv" }).c("query", {
      xmlns: "jabber:iq:roster",
    });
    iqx.c("item", { jid: jid_ });
    //console.log(iqx);
    ChatService.ano_connection.sendIQ(iqx, this.fun);

    var iqy = $.$pres({ to: jid_, type: "subscribe" });
    ChatService.ano_connection.send(iqy, this.fun);

    for (var i = 0; i < ChatService.myAnoChats.length; i++) {
      if (jid_ === ChatService.myAnoChats[i].jid) {
        let user = ChatService.myAnoChats[i];
        //calling the function that is responsible to add the user to the list by sending request to node backend
        this.addToBackendRoster(
          user.jid,
          user["name"],
          user["profilePic"],
          fname ? fname : ""
        );
      }
    }

    //refreshing the lsit of chat contacts
    ChatService.jidEmitter2.next([]);
    // console.log(ChatService.myAnoChats);
  }

  //regular function related to sending request
  reg_sendRequestIq(jid_, fname?) {
    // console.log(ChatService.myChats);
    // alert(fname)
    console.log(fname);

    //forming the iq packet and sending it to the ejabberd server
    var iqy = $.$pres({ to: jid_, type: "subscribed" });
    ChatService.reg_connection.send(iqy, this.fun);

    var iqx = $.$iq({ type: "set", id: "vvvv" }).c("query", {
      xmlns: "jabber:iq:roster",
    });
    iqx.c("item", { jid: jid_ });
    //console.log(iqx);
    ChatService.reg_connection.sendIQ(iqx, this.fun);

    var iqy = $.$pres({ to: jid_, type: "subscribe" });
    ChatService.reg_connection.send(iqy, this.fun);

    // Changed Added Newly
    for (var i = 0; i < ChatService.myChats.length; i++) {
      if (jid_ === ChatService.myChats[i].jid) {
        let user = ChatService.myChats[i];
        // alert('2222222')
        console.log(user);

        //calling the function that is responsible to add the user to the list by sending request to node backend
        this.addToBackendRoster(
          user.jid,
          user["name"],
          user["profilePic"],
          fname ? fname : ""
        );
      }
    }
    //refreshing the lsit of chat contacts
    ChatService.jidEmitter.next([]);
    // console.log(ChatService.myChats);
    // Changed Added Newly
  }

  //Function to call to add a person to our roster list by calling node backend
  addToBackendRoster(jid, name, profilePic, fname) {
    this.http
      .post(
        environment.baseUrl + "/api/v2.0/user/addtoroster",
        { jid: jid, name: name, profilePic: profilePic, featureName: fname },
        { withCredentials: true }
      )
      .subscribe((res) => {
        // console.log(res);
      });
  }

  fun4(ress) {
    console.log(ress);
  }

  fun5 = (x) => {
    console.log(x);
    ChatService.stopOldAno = true;
  };
  static stopOldReg = false;
  static stopOldAno = false;

  //old function not being used now
  sendLogToBackend(data) {
    var dataa = {
      connection: data,
    };

    // this.http.post(environment.base+'api/v1.0/user/ejabberdweblogs',dataa,{withCredentials:true}).subscribe((suc)=>{

    // })
  }
  discLog = "";
  isChatDisconnected = false;
  chatDisconnectCnt = [];

  //this will be called once the connection to the normal account gives something in return like a handler
  onConnectNorm = (status) => {
    //status is automaticlly given by the ejabberd server after getting any changes in the connection state
    if (status == $.Strophe.Status.CONNECTING) {
      // console.log('Strophe is connecting.');
    } else if (status == $.Strophe.Status.CONNFAIL) {
      // console.log('Strophe failed to connect.');
      this.discLog = localStorage.getItem("discLog");
      var datee = new Date();
      this.sendLogToBackend(
        "<------->" + JSON.stringify(datee) + "connfail" + "<------->"
      );
      try {
        this.discLog = this.discLog.concat(
          "<------->" + JSON.stringify(datee) + "connfail" + "<------->"
        );
        localStorage.setItem("discLog", this.discLog);
      } catch {
        this.discLog =
          "<------->" + JSON.stringify(datee) + "connfail" + "<------->";
        localStorage.setItem("discLog", this.discLog);
      }

      //  setTimeout(()=>{ this.connect_xmpp('jai reconnect again');},3000)
    } else if (status == $.Strophe.Status.DISCONNECTING) {
      this.discLog = localStorage.getItem("discLog");
      var datee = new Date();

      try {
        this.discLog = this.discLog.concat(
          JSON.stringify(datee) + "<------->" + "disconnected" + "<------->"
        );
        localStorage.setItem("discLog", this.discLog);
      } catch {
        this.discLog =
          JSON.stringify(datee) + "<------->" + "disconnected" + "<------->";
        localStorage.setItem("discLog", this.discLog);
      }
    } else if (status == $.Strophe.Status.DISCONNECTED) {
      this.chatDisconnectCnt.push("norm");
      this.discLog = localStorage.getItem("discLog");
      var datee = new Date();
      this.sendLogToBackend(
        "<------->" +
          " " +
          JSON.stringify(datee) +
          "disconnected" +
          " " +
          "<------->"
      );
      this.isChatDisconnected = true;
      try {
        this.discLog = this.discLog.concat(
          JSON.stringify(datee) + "<------->" + "disconnected" + "<------->"
        );
        localStorage.setItem("discLog", this.discLog);
      } catch {
        this.discLog =
          JSON.stringify(datee) + "<------->" + "disconnected" + "<------->";
        localStorage.setItem("discLog", this.discLog);
      }
      // this.newService.somethingWentWrong('Chat Disconnected');
      // console.log('Strophe is disconnected.');
      this.newService.multipurposeSubject.next({
        chatDisconnected: true,
        acc: 1,
      });
      this.disconnectedArray.push("norm");
    } else if (status == $.Strophe.Status.CONNECTED) {
      //This is what gets executed once the chat gets connected to ejabberd server
      console.log(" connected normm");
      if (this.chatDisconnectCnt.includes("norm")) {
        this.chatDisconnectCnt.splice(
          this.chatDisconnectCnt.indexOf("norm"),
          1
        );
      }
      if (this.disconnectedArray.includes("norm")) {
        this.disconnectedArray.splice(
          this.disconnectedArray.indexOf("norm"),
          1
        );
      }
      this.newService.multipurposeSubject.next({
        chatDisconnected: false,
        acc: 1,
      });
      var datee = new Date();
      this.isChatDisconnected = false;
      this.sendLogToBackend(
        "<------->" + JSON.stringify(datee) + "connected" + "<------->"
      );
      try {
        this.discLog = this.discLog.concat(
          JSON.stringify(datee) + "<------->" + "connected" + "<------->"
        );
        localStorage.setItem("discLog", this.discLog);
      } catch {
        this.discLog =
          JSON.stringify(datee) + "<------->" + "connected" + "<------->";
        localStorage.setItem("discLog", this.discLog);
      }
      // console.log('Strophe is connected.');
      // console.log('original chat connected')
      // console.log(ChatService.reg_connection)

      //iq packet to get the roster list from ejabberd server
      var iq = $.$iq({ type: "get" }).c("query", { xmlns: "jabber:iq:roster" });
      var iq2 = $.$iq({ type: "get" }).c("query", {
        xmlns: "http://jabber.org/protocol/disco#items",
      });

      //setting up handler to the messages that has chat attribute to them
      ChatService.reg_connection.addHandler(
        this.reg_on_message,
        null,
        "message",
        "chat"
      );
      //setting up handler to the presence that has subscribe attribute to them
      ChatService.reg_connection.addHandler(
        this.reg_presence,
        null,
        "presence",
        "subscribe"
      );

      //uncomment this to get self messages back to us, without self appending
      // ChatService.reg_connection.addHandler(this.reg_on_message ,null, "message", "delete")

      //setting up handler to the message
      ChatService.reg_connection.addHandler(
        this.reg_oldMessages,
        null,
        "message",
        null,
        null,
        null
      );
      // ChatService.reg_connection.addHandler((v)=>{console.log(v)} ,null, "message", "delete")
      // ChatService.reg_connection.addHandler((x)=>{console.log(x); return true;}, null,)
      //ChatService.reg_connection.send($.$pres());
      //sending the presence to the ejabberd server
      ChatService.reg_connection.send($.$pres().tree());

      //iq packet to enable carbon copy to the messages
      var carbonn = $.$iq({
        type: "set",
        id: "enable1",
        from: this.cookieJid,
      }).c("enable", { xmlns: "urn:xmpp:carbons:2" });
      console.log(carbonn);

      //         <iq xmlns='jabber:client'
      //     from='romeo@montague.example/garden'
      //     id='enable1'
      //     type='set'>
      //   <enable xmlns='urn:xmpp:carbons:2'/>
      // </iq>

      ChatService.reg_connection.sendIQ(iq, this.reg_on_roster);
      ChatService.reg_connection.sendIQ(carbonn, this.fun4);
      return;
      //remove this return to call previous messages from xmpp:mam

      var d = new Date();
      var p = d.getTime() * 1000;

      //not used,, old functionality
      var iq2 = $.$iq({ type: "set", id: "reg_oldmessages" }).c("query", {
        xmlns: "urn:xmpp:mam:2",
      });
      iq2.c("x", { xmlns: "jabber:x:data", type: "submit" });
      iq2
        .c("field", { var: "FORM_TYPE", type: "hidden" })
        .c("value")
        .t("urn:xmpp:mam:2")
        .up()
        .up();
      iq2
        .c("field", { var: "with" })
        .c("value")
        .t("notify_user@192.168.0.254")
        .up()
        .up()
        .up();
      iq2
        .c("set", { xmlns: "http://jabber.org/protocol/rsm" })
        .c("max")
        .t(20)
        .up();
      iq2.c("before").t(p);

      ChatService.reg_connection.sendIQ(iq2, this.fun3);

      ////////////////notifications
      // var d = new Date();
      // var p = d.getTime() * 1000;
      // var iq2 = $.$iq({ type: 'set', id: 'reg_oldmessages' }).c('query', { xmlns: 'urn:xmpp:mam:2' });
      //   iq2.c('x', { xmlns: 'jabber:x:data', type: 'submit' })
      //   iq2.c('field', { var: 'FORM_TYPE', type: 'hidden' }).c('value').t('urn:xmpp:mam:2').up().up();
      //   iq2.c('field', { var: 'with' }).c('value').t(a.jid).up().up().up()
      //   iq2.c('set', { xmlns: 'http://jabber.org/protocol/rsm' }).c('max').t(20).up()
      //   iq2.c('before').t(p)
      // ChatService.reg_connection.sendIQ(iq2, this.fun3)
    }
  };
  disconnectedArray = [];
  sampleFunc = (dat) => {
    console.log(dat);
  };

  //this will be called once the connection to the normal account gives something in return like a handler
  //This is same as onConnectNorm, only difference is that this is responsible for the anonymous account and not the normal one
  onConnectAnon = (status) => {
    if (status == $.Strophe.Status.CONNECTING) {
      // console.log('Strophe is connecting.');
    } else if (status == $.Strophe.Status.CONNFAIL) {
      var datee = new Date();
      this.sendLogToBackend(
        "<------->" + JSON.stringify(datee) + "connfail Ano" + "<------->"
      );
      try {
        this.discLog = this.discLog.concat(
          JSON.stringify(datee) + "<------->" + "connfail Ano" + "<------->"
        );
        localStorage.setItem("discLog", this.discLog);
      } catch {
        this.discLog =
          JSON.stringify(datee) + "<------->" + "connfail Ano" + "<------->";
        localStorage.setItem("discLog", this.discLog);
      }
      // console.log('Strophe failed to connect.');
      //  setTimeout(()=>{ this.connect_xmpp('jai reconnect again');},3000)
    } else if (status == $.Strophe.Status.DISCONNECTING) {
      // console.log('Strophe is disconnecting.');
    } else if (status == $.Strophe.Status.DISCONNECTED) {
      this.chatDisconnectCnt.push("ano");
      this.newService.multipurposeSubject.next({
        chatDisconnected: true,
        acc: 2,
      });
      this.disconnectedArray.push("ano");
      this.isChatDisconnected = true;
      var datee = new Date();
      this.sendLogToBackend(
        "<------->" + JSON.stringify(datee) + "disconnected Ano" + "<------->"
      );
      try {
        this.discLog = this.discLog.concat(
          JSON.stringify(datee) + "<------->" + "disconnected Ano" + "<------->"
        );
        localStorage.setItem("discLog", this.discLog);
      } catch {
        this.discLog =
          JSON.stringify(datee) +
          "<------->" +
          "disconnected Ano" +
          "<------->";
        localStorage.setItem("discLog", this.discLog);
      }
      // console.log('Strophe is disconnected.');
    } else if (status == $.Strophe.Status.CONNECTED) {
      if (this.chatDisconnectCnt.includes("ano")) {
        this.chatDisconnectCnt.splice(this.chatDisconnectCnt.indexOf("ano"), 1);
      }

      if (this.disconnectedArray.includes("ano")) {
        this.disconnectedArray.splice(this.disconnectedArray.indexOf("ano"), 1);
      }

      this.newService.multipurposeSubject.next({
        chatDisconnected: false,
        acc: 2,
      });
      this.isChatDisconnected = false;
      var datee = new Date();
      this.sendLogToBackend(
        "<------->" + JSON.stringify(datee) + "connected Ano" + "<------->"
      );
      try {
        this.discLog = this.discLog.concat(
          JSON.stringify(datee) + "<------->" + "connected Ano" + "<------->"
        );
        localStorage.setItem("discLog", this.discLog);
      } catch {
        this.discLog =
          JSON.stringify(datee) + "<------->" + "connected Ano" + "<------->";
        localStorage.setItem("discLog", this.discLog);
      }
      // console.log('Strophe is connected.');
      // console.log('anonymous chat connected')
      // console.log(ChatService.reg_connection)
      var iq = $.$iq({ type: "get" }).c("query", { xmlns: "jabber:iq:roster" });
      var iq2 = $.$iq({ type: "get" }).c("query", {
        xmlns: "http://jabber.org/protocol/disco#items",
      });

      //ChatService.ano_connection.send($.$pres());
      ChatService.ano_connection.addHandler(
        this.ano_on_message_two,
        null,
        "message",
        "chat"
      );
      ChatService.ano_connection.addHandler(
        this.ano_presence,
        null,
        "presence",
        "subscribe"
      );
      ChatService.ano_connection.addHandler(
        this.ano_oldMessages,
        null,
        "message",
        null
      );

      try {
        ChatService.ano_connection.send($.$pres().tree());
        ChatService.ano_connection.sendIQ(iq, this.ano_on_roster);
        ChatService.ano_connection.sendIQ(carbonn, this.fun4);
      } catch {}
      return;
      //remove this return to get old messages from xmpp:mam

      //////////////notifications
      var d = new Date();
      var p = d.getTime() * 1000;
      var iq2 = $.$iq({ type: "set", id: "reg_oldmessages" }).c("query", {
        xmlns: "urn:xmpp:mam:2",
      });
      iq2.c("x", { xmlns: "jabber:x:data", type: "submit" });
      iq2
        .c("field", { var: "FORM_TYPE", type: "hidden" })
        .c("value")
        .t("urn:xmpp:mam:2")
        .up()
        .up();
      iq2
        .c("field", { var: "with" })
        .c("value")
        .t("notify_user@192.168.0.254")
        .up()
        .up()
        .up();
      iq2
        .c("set", { xmlns: "http://jabber.org/protocol/rsm" })
        .c("max")
        .t(20)
        .up();
      iq2.c("before").t(p);

      var carbonn = $.$iq({
        type: "set",
        id: "enable1",
        from: this.cookieJidAno,
      }).c("enable", { xmlns: "urn:xmpp:carbons:2" });

      ChatService.ano_connection.sendIQ(iq2, this.fun5);
    }
  };
  greetRequestSubj = new Subject();

  //Function to get the greet request count
  greetRequestsCount() {
    return this.http.get<any>(environment.baseUrl + "user/greetCount", {
      withCredentials: true,
    });
  }
}
