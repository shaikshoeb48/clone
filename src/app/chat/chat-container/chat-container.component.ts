import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { SpaarksService } from "../../spaarks.service";
import { ChatService } from "../../chat.service";

import { environment } from "src/environments/environment";
import * as _ from "lodash";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { AllpurposeserviceService } from "src/app/allpurposeservice.service";
@Component({
  selector: "app-chat-container",
  templateUrl: "./chat-container.component.html",
  styleUrls: ["./chat-container.component.scss"],
})
export class ChatContainerComponent implements OnInit {
  constructor(
    private spaarkService: SpaarksService,
    private chatService: ChatService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private location: Location,
    private allpurpose: AllpurposeserviceService
  ) {
    this.isMobileVersion = this.spaarkService.isMobileVersion;
    this.removeRightfeed = this.spaarkService.removeRightfeed;
  }
  ngAfterContentChecked(): void {
    this.changeDetectorRef.detectChanges();
  }
  showDivs = "both";
  isMobileVersion;
  removeRightfeed;
  isLoading = true;

  chatNormList = [...ChatService.myChats];
  chatAnonList = [...ChatService.myAnoChats];
  Users = this.chatNormList;
  activeJid = "";
  unreadAccountsArr = [];
  bottomNav = true;
  textonTop = "You chatted with these users using your name visible to them";
  textonTopAno = "You chatted as anonymous with these users";
  username = "user";
  notForMob = false;
  ngOnInit(): void {
    if (this.spaarkService.selectedChatFromRecentChats) {
      this.clickedList(this.spaarkService.selectedChatFromRecentChats);
      // console.log(this.spaarkService.selectedChatFromRecentChats.chatitem);

      //updating jid of clicked post
      this.chatService.chatToOpen = {
        jid: this.spaarkService.selectedChatFromRecentChats.chatitem.jid,
        account: 1,
      };
      // console.log(this.Users);
      this.Users.forEach((val, ind) => {
        if (
          this.spaarkService.selectedChatFromRecentChats.chatitem.userId ==
          val.userId
        ) {
          this.Users.splice(ind, 1);
          this.Users.unshift(
            this.spaarkService.selectedChatFromRecentChats.chatitem
          );
          return;
        }
      });

      this.spaarkService.selectedChatFromRecentChats = "";
    }

    this.notForMob = this.spaarkService.isMobileVersion;
    this.spaarkService.checkforLocation();

    // console.log(this.chatService.chatToOpen.account);
    // console.log(this.account);

    if (Number(this.chatService.chatToOpen.account) == this.account) {
    } else {
      this.clickedTab(Number(this.chatService.chatToOpen.account));
      this.chatService.chatToOpen.account = 1;
    }

    if (window.innerWidth < 450) {
      this.bottomNav = false;
    } else {
      this.bottomNav = true;
    }

    if (localStorage.getItem("name")) {
      this.username = localStorage.getItem("name");
    }

    if (this.spaarkService.openChatVar) {
      // console.log(this.spaarkService.openChatVar);
      let chatvar = this.spaarkService.openChatVar;
      if (chatvar) {
        if (chatvar.ano == false) {
          this.clickedTab(1);
          if (chatvar.jid) {
            _.map(this.Users, (user, ind) => {
              if (user.jid == chatvar.jid) {
                this.chatpersondata = user;
              }
            });
          }
        } else {
          this.clickedTab(2);
          if (chatvar.jid) {
            _.map(this.Users, (user, ind) => {
              if (user.jid == chatvar.jid) {
                this.chatpersondata = user;
              }
            });
          }
        }
      }
    }

    this.spaarkService.showLoginScreen.subscribe((bool) => {
      this.clickedLoginBool = bool;
    });

    this.chatService.newchatsubj_jai.subscribe((succe: any) => {
      console.log(succe);
      if (succe.account == this.account) {
        _.map(this.Users, (user, ind) => {
          if (user.jid == succe.from) {
            // console.log(user);
            if (succe.msg.delete) {
              _.map(user.msg, (m, i) => {
                // console.log(user.msg);
                // console.log(m);
                if (m.unique) {
                  if (m.unique == succe.msg.delete.unique) {
                    user.unread = user.unread - 1;
                    // console.log(succe);
                    if (succe.msg.delete.type == "deleteforboth") {
                      m.type = "deleteforboths";
                      // console.log(m);
                    } else if (
                      succe.msg.delete.myjid == this.chatService.cookieJid ||
                      succe.msg.delete.myjid == this.chatService.cookieJidAno
                    ) {
                      m.type = succe.msg.delete.type;
                      // console.log(m);
                    }
                  }
                }
              });
            } else {
              // console.log(this.activeJid);
              // console.log(user.jid);
              if (this.activeJid != user.jid) {
                user.unread = user.unread;
              }

              var gg = this.Users.splice(ind, 1);
              this.Users.unshift(gg[0]);
            }
          }
        });
      } else {
        // console.log(this.unreadAccountsArr);
        if (succe.account == 1) {
          if (succe.msg.delete) {
            _.map(ChatService.myChats, (user, ind) => {
              if (user.jid == succe.from) {
                user.msg.forEach((val, indd) => {
                  if (val.unique) {
                    if (val.unique == succe.msg.delete.unique) {
                      val.type = succe.msg.delete.type;
                    }
                  }
                });
              }
            });
          } else {
            this.unreadAccountsArr = this.chatService.unreadAccountsArr;
            if (!this.chatService.unreadAccountsArr.includes("norm")) {
              this.chatService.unreadAccountsArr.push("norm");
              this.unreadAccountsArr = this.chatService.unreadAccountsArr;
              // console.log(this.unreadAccountsArr);
            }

            _.map(ChatService.myChats, (user, ind) => {
              if (user.jid == succe.from) {
                var gg = ChatService.myChats.splice(ind, 1);
                ChatService.myChats.unshift(gg[0]);
              }
            });
          }
        } else {
          if (succe.type != "delete" || succe.type != "deleteforboth") {
            if (!this.chatService.unreadAccountsArr.includes("ano")) {
              this.chatService.unreadAccountsArr.push("ano");
              this.unreadAccountsArr = this.chatService.unreadAccountsArr;
              // console.log(this.unreadAccountsArr);
            }
            _.map(ChatService.myAnoChats, (user, ind) => {
              if (user.jid == succe.from) {
                var gg = ChatService.myAnoChats.splice(ind, 1);
                ChatService.myAnoChats.unshift(gg[0]);
              }
            });
          } else if (succe.type == "delete" || succe.type == "deleteforboth") {
            _.map(ChatService.myAnoChats, (user, ind) => {
              if (user.jid == succe.from) {
                user.msg.forEach((val, indd) => {
                  if (val.unique) {
                    if (val.unique == succe.msg.delete.unique) {
                      if (succe.type == "deleteforboth") {
                        val.type = "deleteforboths";
                      } else {
                        val.type = succe.msg.delete.type;
                      }
                    }
                  }
                });
              }
            });
          }
        }
      }
    });

    ChatService.refreshList.subscribe((suc) => {
      // console.log("--------->------------->" + suc);
      if (suc) {
        // console.log(suc);
        if (suc) {
          if (suc.refresh) {
            if (suc.refresh == "jai") {
              // console.log(ChatService.myChats);
              this.chatNormList = ChatService.myChats;
              if (this.account == 1) {
                this.Users = this.chatNormList;
              }
            } else if (suc.refresh == "jaiano") {
              // console.log(ChatService.myAnoChats);
              this.chatAnonList = ChatService.myAnoChats;
              if (this.account == 2) {
                this.Users = this.chatAnonList;
              }
            }
          }
        }
      }
    });

    // console.log(this.chatService.chatLoadedArr.loadedArr);

    if (window.innerWidth > 700) {
      this.isSmall = false;
    } else {
      this.isSmall = true;
      this.showDivs = "onlyList";
    }

    if (this.isAuth) {
      // this.triggerGetRoster();
      if (this.chatService.chatLoadedArr.loadedArr.length == 2) {
        this.isLoading = false;
      }
    }

    // setTimeout(()=>{

    this.isLoading = false;
    this.chatNormList = ChatService.myChats;
    this.chatAnonList = ChatService.myAnoChats;

    // console.log(this.chatNormList);

    // },3000)

    // this.reportServ.multiPurposeSubj.subscribe((suc:any)=>{
    //   console.log(suc)
    //   if(suc){
    //     if(suc.chatLoad){
    //       if(this.chatService.chatLoadedArr.loadedArr.length==2){
    //         this.isLoading = false
    //       }
    //     }
    //   }
    // })
  }

  account = 1;

  //localStorage.getItem('jid')

  clickedTab(dat) {
    if (dat) {
      if (dat == this.account) {
        return;
      } else {
        this.account = dat;
        this.chatService.account = this.account;
        this.chatpersondata = undefined;
        this.chatService.activeJid = "";
        if (this.account == 1) {
          this.chatNormList = ChatService.myChats;
          this.Users = this.chatNormList;
        } else {
          this.chatAnonList = ChatService.myAnoChats;
          this.Users = this.chatAnonList;
        }
      }
    }
  }

  clickedLogin() {
    this.clickedLoginBool = true;
    this.spaarkService.showLoginScreen.next(true);
  }

  clickedLoginBool = false;

  isAuth =
    localStorage.getItem("iJAIa") == environment.ijaiaahut ? true : false;

  chatSpecificAction(eve) {
    if (eve) {
      // console.log(eve);
      if (eve.type) {
        if (eve.type == "gotolist") {
          if (this.isSmall == true && this.showDivs == "onlychat") {
            this.showDivs = "onlyList";
          }
        } else if (eve.type == "deletefromparentmsg") {
          this.deletefromparentmsg(eve.action);
        } else if (eve.type == "forwardmessage") {
          this.forwardMsg(eve);
        } else if (eve.type == "forwardMob") {
          // this.forwardMsg(eve)
        }
      }
    }
  }

  forwardMsg(eve) {
    // console.log(eve);
    this.gotoforwardMsg(eve.action.payload.m);
  }

  theMessage = undefined;
  theMessage2 = undefined;
  checklistArray = [];
  forwardingSet = undefined;
  jidSet = undefined;
  inForward = { bool: false, forwardarray: [] };
  noContactsInChats = false;

  gotoforwardMsg(msg) {
    // console.log('cct',msg)
    this.theMessage = _.cloneDeep(msg);
    this.theMessage2 = _.cloneDeep(msg);
    this.checklistArray = [];
    this.forwardingSet = new Set([]);
    this.jidSet = new Set([]);
    var len = this.Users.length;
    for (var x; x < len; x++) this.checklistArray.push(false);

    this.computeForwardList().then((val) => {
      // console.log(val);
      if (val.length == 0) {
        this.spaarkService.somethingWentWrong(
          "No contacts in your forward list !"
        );
      } else {
        this.inForward.bool = true;
        this.inForward.forwardarray = val;
        this.multiinput.inForward = this.inForward.bool;
        // console.log(this.multiinput);
        this.noContactsInChats = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  adduserForward(user) {
    // console.log(user);
    this.forwardListt.push(user.jid);
    this.Users.forEach((val, ind) => {
      if (val.jid == user.jid) {
        this.checklistArray[ind] = true;
        this.forwardingSet.add(ind);
      }
    });
    this.jidSet.add(user.jid);
    // console.log(this.forwardListt);
    // console.log(this.jidSet);
  }

  forwardMsgtoUsers() {
    let currentTime = Date.now() * 1000;
    var type;
    var content;
    this.inForward.bool = false;
    this.multiinput.inForward = this.inForward.bool;
    type = this.theMessage.type;
    if (this.theMessage.type == "text") {
      (type = "chat"), (content = this.theMessage.text);
    } else {
      content = this.theMessage.src;
    }

    if (this.theMessage) {
      if (this.theMessage.type) {
        if (this.theMessage.type == "text") {
          this.theMessage.type = "chat";
          this.theMessage.content = this.theMessage.text;
        } else {
        }
      }

      if (this.theMessage.unique) {
        this.theMessage.unique = new Date().getTime() * 1000;
      } else {
        this.theMessage.unique = new Date().getTime() * 1000;
        // console.log(this.theMessage);
      }
    }
    var pin = [...this.jidSet];
    pin.forEach((item) => {
      // console.log(item);
      this.theMessage.to = item;
      if (this.account == 1) {
        this.theMessage.from = this.chatService.cookieJid;
      } else if (this.account == 2) {
        this.theMessage.from = this.chatService.cookieJidAno;
      }
      var msgString = JSON.stringify(this.theMessage);
      // console.log(item);

      this.chatService.forwardMessage(
        this.account,
        item,
        msgString,
        currentTime
      );
    });
    this.inForward.bool = false;
    // console.log(this.jidSet);

    var pin = [...this.jidSet];
    // console.log(pin);

    pin.forEach((item, ind) => {
      // console.log(item);
      var mm = { ...this.theMessage2 };
      var dd = new Date();
      mm.UID = dd.getTime() * 1000;
      mm.date = dd;
      mm.to = item;
      mm.unique = currentTime;
      if (this.account == 1) {
        // mm.from = localStorage.getItem('jid');
        mm.from = this.chatService.cookieJid;
        // var ind;
        //   ChatService.myChats.forEach( (user,index)=>{
        //       if(user.jid==item)
        //       {
        //           ind = index;
        //       }
        //   })
        //   ChatService.myChats[ind].msg.push(mm)
        ChatService.myChats.forEach((user, ii) => {
          // console.log(user);
          // console.log(item);
          if (user.jid == item) {
            user.msg.push(mm);
            let gun = ChatService.myChats.splice(ii, 1);
            let listt = _.cloneDeep(ChatService.myChats);
            // console.log(gun);
            listt.unshift(gun[0]);
            // console.log(listt);
            ChatService.myChats = listt;
            // console.log(ChatService.myChats);
            this.Users = [...ChatService.myChats];
          }
        });
      } else {
        mm.from = this.chatService.cookieJidAno;
        _.map(ChatService.myAnoChats, (user, ii) => {
          if (user.jid == item) {
            user.msg.push(mm);
            let gun = ChatService.myAnoChats.splice(ii, 1);
            let listt = _.cloneDeep(ChatService.myAnoChats);
            listt.unshift(gun[0]);
            ChatService.myAnoChats = listt;
            this.Users = [...ChatService.myAnoChats];
          }
        });
      }
    });

    // this.activeusersservice.somethingWentWrong('Message Forwarded Successfully')
  }

  forwardListt = [];
  multiinput = { inForward: this.inForward.bool };
  removeuserForward(user) {
    this.Users.forEach((val, ind) => {
      if (val.jid == user.jid) {
        this.checklistArray[ind] = false;
        this.forwardingSet.delete(ind);
      }
    });
    this.jidSet.delete(user.jid);
    // console.log(this.forwardListt);
    // console.log(this.jidSet);
    //console.log(this.forwardingSet)
  }

  async computeForwardList() {
    let jaiForList = [];
    console.log(this.activeJid);
    this.Users.forEach((val, ind) => {
      if (
        val.chatExit == false &&
        val.chatExitMe == false &&
        val.blocked == false &&
        val.blockedMe == false &&
        val.jid != this.activeJid
      ) {
        jaiForList.push({ chat: val, isTicked: false });
      }
    });

    return jaiForList;
  }

  deletefromparentmsg(msg) {
    _.map(this.Users, (us) => {
      if (us.jid == this.activeJid) {
        // console.log(us);

        _.map(us.msg, (mss, ind) => {
          if (mss) {
            // console.log(mss)
            if (mss.unique) {
              if (mss.unique == msg.unique) {
                // console.log(us.msg);
                us.msg.splice(ind, 1);
                // console.log(us.msg);
                this.chatpersondata = us;

                // this.msgsInput = us.msg;
                // console.log(this.msgsInput)
              }
            }
          }
        });
      }
    });
  }

  isSmall = false;

  clickedList(eve) {
    // console.log(eve);
    this.activeJid = eve.chatitem.jid;
    // console.log(this.isSmall);
    // console.log(this.showDivs);
    if (this.isSmall == true) {
      if (this.showDivs == "onlyList") {
        this.showDivs = "onlychat";
        if (eve.chatitem) {
          this.chatpersondata = eve.chatitem;
        }
      }
    } else {
      if (eve) {
        if (eve.chatitem) {
          this.chatpersondata = eve.chatitem;
        }
      }
    }
  }
  chatpersondata = undefined;
  handlemultioutputfromchatlist(event) {
    // console.log(event);
    if (event) {
      if (event.forward) {
        if (event.isForwardAdd == true) {
          this.adduserForward(event.chatperson.chat);
        } else {
          this.removeuserForward(event.chatperson.chat);
        }
      } else if (event.forwardclicked) {
        this.forwardMsgtoUsers();
      }
    }
  }

  moveBack() {
    if (this.inForward.bool) {
      this.inForward.bool = false;
    } else {
      this.location.back();
    }
  }
  goToRequests() {
    this.spaarkService.fromChat = true;
    this.router.navigateByUrl("/home/requests");
  }

  checkTabIndex(event) {
    // console.log(event);

    this.spaarkService.currentFeatureSubj.next(event);
    this.spaarkService.featName = event;
    this.router.navigateByUrl("home/feed");
  }
}
