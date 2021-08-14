import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpaarksService } from '../../spaarks.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-business-chat',
  templateUrl: './business-chat.component.html',
  styleUrls: ['./business-chat.component.scss']
})
export class BusinessChatComponent implements OnInit {

  constructor(private spraarks: SpaarksService,private activatedrouter: ActivatedRoute, private router: Router,private location: Location) { 
    this.isMobileVersion = this.spraarks.isMobileVersion;
    
  }
  isMobileVersion;
  @ViewChild('content',{static:true}) content:ElementRef;
  currentBusinessTicket;
  ticketId;
  ngOnInit(): void {
    this.ticketId = this.activatedrouter.snapshot.paramMap.get('id');
    console.log("CurrentTicket", this.ticketId);
    this.spraarks.getBusinessTicket(this.ticketId).subscribe(ticket => {
      console.log("CurrentTicketbus", ticket);
      this.currentBusinessTicket = ticket;
    })
    this.spraarks.checkforLocation();
    this.spraarks.sentMessage.subscribe((val)=>{
      try {
        setTimeout(() => {
          this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight
        }, 300)
      } catch (err) {
        console.log(err);
      }
    })
  }


  tickets;
  moveBack() {
    this.location.back();
  }
  outputFromInput(event) {
    console.log(event)

    this.spraarks.sendReplies(this.ticketId, event.content, event.images).subscribe(succ => {
      console.log(succ);
      this.spraarks.somethingWentWrong('Reply to Enquiry sent');
      if(this.spraarks.authData.isAuthenticated){
        this.spraarks.getBusinessQueries().subscribe(succ1 => {
          console.log(succ1);
          this.tickets = succ1;
          this.tickets.forEach((val, ind) => {
            if (val.ticketId == this.currentBusinessTicket.ticketId) {
              this.currentBusinessTicket = val;
            }
          })
        });
      }
     
    })

  }
}
