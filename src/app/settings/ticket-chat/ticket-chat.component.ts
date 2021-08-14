import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { SpaarksService } from "../../spaarks.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-ticket-chat",
  templateUrl: "./ticket-chat.component.html",
  styleUrls: ["./ticket-chat.component.scss"],
})
export class TicketChatComponent implements OnInit {
  constructor(
    private spraarks: SpaarksService,
    private activatedrouter: ActivatedRoute,
    private router: Router
    ) {

      this.isMobileVersion = this.spraarks.isMobileVersion;



    }
  currentTicket = undefined;
  ticketId;
  isMobileVersion;
  @ViewChild("content", { static: true }) content: ElementRef;

  ngOnInit(): void {
    this.ticketId = this.activatedrouter.snapshot.paramMap.get("id");
    console.log("CurrentTicket", this.ticketId);
    this.spraarks.getTicket(this.ticketId).subscribe((ticket) => {
      this.currentTicket = ticket;
      console.log("CurrentTicket", this.currentTicket);
      setTimeout(() => {
        this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
      }, 300);
    });
    this.spraarks.checkforLocation();

    this.spraarks.sentMessage.subscribe((val) => {
      try {
        setTimeout(() => {
          this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
        }, 300);
      } catch (err) {
        console.log(err);
      }
    });
  }
  tickets;
  moveBack() {
    this.router.navigate(["/settings/help"]);
  }
  outputFromInput(event) {
    console.log(event);

    this.spraarks
      .sendReplies(this.ticketId, event.content, event.images)
      .subscribe((succ) => {
        console.log(succ);

        this.spraarks.getTickets().subscribe((succ1) => {
          console.log(succ1);
          this.tickets = succ1;
          this.tickets.forEach((val, ind) => {
            if (val.ticketId == this.currentTicket.ticketId) {
              this.currentTicket = val;
              console.log("CurrentTicket", this.currentTicket);
            }
          });
        });
      });
  }
}
