import { SpaarksService } from "../../spaarks.service";
import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-tickets",
  templateUrl: "./tickets.component.html",
  styleUrls: ["./tickets.component.scss"],
})
export class TicketsComponent implements OnInit {
  constructor(private spaarksService: SpaarksService, private router: Router) {}

  @Output("openPreviousQuery") openPreviousQuery = new EventEmitter()
  @Input("appticket") ticketarr;
  previousChatScreen = false;
  showTickets = false;
  funn = new Date();
  ticketId;
  tickets;
  tSubject;
  content;

  ngOnInit(): void {
    // this.spaarksService.getTickets().subscribe((succ) => {
    //   console.log(succ);
    //   this.tickets = succ;
    
    // });
  }

  moveBack() {
    this.previousChatScreen = false;
    this.showTickets = !this.showTickets;
  }

  currentTicket = null;
  ticketSub = "";
  openTickets(eve, currentTicket) {
    this.showTickets = !this.showTickets;
    this.ticketId = eve;
    this.currentTicket = currentTicket;
    this.ticketSub = currentTicket.subject;
    this.previousChatScreen = true;
    this.openPreviousQuery.emit(true);
    this.router.navigate(["settings/ticket/" + currentTicket.ticketId]);
  }

  outputFromInput(event) {
    console.log(event);

    this.spaarksService
      .sendReplies(this.ticketId, event.content, event.images)
      .subscribe((succ) => {
        console.log(succ);

        this.spaarksService.getTickets().subscribe((succ1) => {
          console.log(succ1);
          this.ticketarr = succ1;
          this.ticketarr.forEach((val, ind) => {
            if (val.ticketId == this.currentTicket.ticketId) {
              this.currentTicket = val;
            }
          });
        });
      });
  }

  isTicketOpen = true;

  messages = [
    {
      pullTo: "left",
      type: "text",
      message:
        "Hi, son, how are you doing? Today, my father and I went to buy a car, bought a cool car.",
      time: Date.now(),
    },
    {
      pullTo: "right",
      type: "text",
      message: "Oh! Cool Send me photo)",
      time: Date.now(),
    },
    {
      pullTo: "left",
      type: "text",
      message: "Hi, son bought a cool car.",
      time: Date.now(),
    },
    {
      pullTo: "right",
      type: "image",
      message: "../../../assets/fubuki.webp",
      time: Date.now(),
    },
    {
      pullTo: "left",
      type: "text",
      message: "Today, my father and I went to buy a car, bought a cool car.",
      time: Date.now(),
    },
    {
      pullTo: "right",
      type: "text",
      message:
        "Hi, son, how are you doing? Today, my father and I went to buy a car, bought a cool car.",
      time: Date.now(),
    },
    {
      pullTo: "left",
      type: "text",
      message:
        "Hi, son, how are you doing? Today, my father and I went to buy a car, bought a cool car.",
      time: Date.now(),
    },
    {
      pullTo: "right",
      type: "text",
      message:
        "Hi, son, how are you doing? Today, my father and I went to buy a car, bought a cool car.",
      time: Date.now(),
    },
    {
      pullTo: "left",
      type: "text",
      message:
        "Hi, son, how are you doing? Today, my father and I went to buy a car, bought a cool car.",
      time: Date.now(),
    },
  ];
}
