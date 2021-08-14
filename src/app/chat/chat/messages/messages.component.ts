import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { ChatService } from '../../../chat.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnChanges {

  constructor(private chat: ChatService) { }
  @Input() account;
  @Input() active = '';
  @Input('multiinput') multiinput = undefined;

  @Output('multipurposeoutput') multipurposeoutput = new EventEmitter();

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  //@ViewChildren('messages') messages: QueryList<any>;

  ngOnChanges(changes: SimpleChanges) {

    console.log(changes)
    if (changes) {
      if (changes.messages) {
        if (changes.messages.currentValue) {
          this.messages = changes.messages.currentValue
        }
      }
      if (changes.multiinput) {
        console.log(changes)
        if (changes.multiinput.currentValue) {
          this.multiinput = changes.multiinput.currentValue
        }
      }
    }
  }


  username = localStorage.getItem('id');

  ngOnInit(): void {

    // this.messages =[
    //   {pullTo:'left',type:'text',message:'Hi, son, how are you doing? Today, my father and I went to buy a car, bought a cool car.',time:Date.now()},
    //   {pullTo:'right',type:'text',message:'Oh! Cool Send me photo)',time:Date.now()},
    //   {pullTo:'left',type:'text',message:'Hi, son bought a cool car.',time:Date.now()},
    //   {pullTo:'right',type:'image',message:'../../../assets/fubuki.webp',time:Date.now()},
    //   {pullTo:'left',type:'text',message:'Today, my father and I went to buy a car, bought a cool car.',time:Date.now()},
    //   {pullTo:'right',type:'text',message:'Hi, son, how are you doing? Today, my father and I went to buy a car, bought a cool car.',time:Date.now()},
    //   {pullTo:'left',type:'text',message:'Hi, son, how are you doing? Today, my father and I went to buy a car, bought a cool car.',time:Date.now()},
    //   {pullTo:'left',type:'image',message:'../../../assets/fubuki.webp',time:Date.now()},
    //   {pullTo:'right',type:'text',message:'Hi, son, how are you doing? Today, my father and I went to buy a car, bought a cool car.',time:Date.now()},
    //   {pullTo:'left',type:'text',message:'Hi, son, how are you doing? Today, my father and I went to buy a car, bought a cool car.',time:Date.now()}

    //  ];
    // this.scrollToBottom();
  }


  ngAfterViewInit() {
    //console.log("view");
    // this.scrollToBottom();
    // this.messages.changes.subscribe(this.scrollToBottom);
  }



  allpurposeOutput(eve) {
    console.log(eve);
    console.log(this.messages);
    if (eve.type == 'deleteforme') {
      console.log(this.messages);
      this.deleteForMe(eve.payload.m, eve.payload.bool)
    }

    if (eve.type == 'forwardmsg') {
      // this.forwardMsg(eve.payload.m)
      this.multipurposeoutput.emit({ type: 'forwardmessage', action: eve })
    }

    if (eve.type == 'copytext') {
      this.copyText(eve.payload.text)
    }

    if (eve.type == 'pauseaudio') {
      // this.pauseaudio(eve.payload.src)
    }

    if (eve.type == 'enlargeimage') {
      // this.enlargeImage(eve.payload.enlarge)
    }

    if (eve.type == 'offlinemsgs') {
      // this.sendOfflineMsgs(eve.payload.m,eve.payload.eve);
    }

  }

  copyText(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    document.execCommand('copy');
    document.body.removeChild(textArea);
    // this._zoneone.run(
    //   (submitMessege)=>{
    //     this._zone.open('Copied to clipboard','ok',{
    //       duration: 2000,
    //     });
    //     //console.log(succ);
    //   }
    // );
    // this.activeUsers.somethingWentWrong('Copied to clipboard');
  }

  deleteForMe(msg, isMe) {
    console.log(msg);

    let jaiDeleteMsg = { deleteforme: isMe, timestamp: msg, xml: msg.msgXml, unique: msg.unique, jid: this.active };
    // if(this.account==1){
    //   jaiDeleteMsg.jid=localStorage.getItem('jid');
    // }else{
    //   jaiDeleteMsg.jid=localStorage.getItem('jidAno');
    // }
    console.log(jaiDeleteMsg);

    this.chat.deleteMessagesXmpp(jaiDeleteMsg, this.account).subscribe((succe) => {
      // console.log(succe);
      console.log(this.messages);
      this.messages.forEach((val, ind) => {
        if (val.UID && isMe == true) {
          if (msg.UID == val.UID) {
            this.multipurposeoutput.emit({ type: 'jaiDeleteMsg', action: jaiDeleteMsg })
            console.log(ind);
            console.log(val);

            // this.deletefromparent.emit(jaiDeleteMsg);
            //this.messages.splice(ind, 1);
            console.log(this.messages);

            //this.chat.sendDeleteUniqueMsg(msg.unique,this.account,this.active,JSON.stringify(isMe));
          }
        } else if (val.UID && isMe == false) {
          if (msg.UID == val.UID) {
            this.messages[ind].type = 'deleteforboths'
            //this.chat.sendDeleteUniqueMsg(msg.unique,this.account,this.active,JSON.stringify(isMe));
          }
        }
      })
    })
  }

  @Input('messages') messages = [];
}
