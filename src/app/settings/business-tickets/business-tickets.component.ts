import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { SpaarksService } from '../../spaarks.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-tickets',
  templateUrl: './business-tickets.component.html',
  styleUrls: ['./business-tickets.component.scss']
})
export class BusinessTicketsComponent implements OnInit {


  constructor(private spaarksService: SpaarksService, private router: Router) { }

  // @Input ('BussinesEnq') ShowBussinesEnq=false;
  @Input('businessticket') businessticket;
  @Output('openPreviousQuery') openPreviousQuery = new EventEmitter();
  @Output('clickedquery') clickedquery = new EventEmitter();
  previousChatScreen = true;
  showTickets = false;
  funn = new Date();
  ticketId;
  tickets;
  tSubject;
  content;


  ngOnInit(): void {

    // console.log("business ticket",this.businessticket)

    // this.spaarksService.getTickets().subscribe(succ=>{
    // console.log(succ);
    // this.tickets=succ;
    // })




  }

  openTickets(_id, eve) {
    //alert("eee");
    this.showTickets = !this.showTickets;
    this.previousChatScreen = !this.previousChatScreen;
    this.openPreviousQuery.emit(_id);
    this.clickedquery.emit(eve);
    this.router.navigate(['settings/business/' + _id]);
    // this.spaarksService.getTickets().subscribe(succ=>{

    //   console.log(succ);
    // }
    //   )
    //  this.ShowBussinesEnq=false;

  }
  moveBack() {
    this.previousChatScreen = false;
  }
  isTicketOpen = true;

  messages = [
    { pullTo: 'left', type: 'text', message: 'Hi, son, how are you doing? Today, my father and I went to buy a car, bought a cool car.', time: Date.now() },
    { pullTo: 'right', type: 'text', message: 'Oh! Cool Send me photo)', time: Date.now() },
    { pullTo: 'left', type: 'text', message: 'Hi, son bought a cool car.', time: Date.now() },
    { pullTo: 'right', type: 'image', message: '../../../assets/fubuki.webp', time: Date.now() },
    { pullTo: 'left', type: 'text', message: 'Today, my father and I went to buy a car, bought a cool car.', time: Date.now() },
    { pullTo: 'right', type: 'text', message: 'Hi, son, how are you doing? Today, my father and I went to buy a car, bought a cool car.', time: Date.now() },
    { pullTo: 'left', type: 'text', message: 'Hi, son, how are you doing? Today, my father and I went to buy a car, bought a cool car.', time: Date.now() },
    { pullTo: 'right', type: 'text', message: 'Hi, son, how are you doing? Today, my father and I went to buy a car, bought a cool car.', time: Date.now() },
    { pullTo: 'left', type: 'text', message: 'Hi, son, how are you doing? Today, my father and I went to buy a car, bought a cool car.', time: Date.now() }

  ];


}
