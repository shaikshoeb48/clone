import { SpaarksService } from 'src/app/spaarks.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { merge, fromEvent, Observer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.spaarkService.hideCarousel.next();
    return
  }
  title = 'spaarksweb';
  showModal = false;
  showCookie:boolean;
  noNetworkConnection = false;
constructor(private spaarkService: SpaarksService ,private route: Router){}
  ngOnInit() {

    try {
      if (localStorage.getItem('cookieAccess')) {
        let val = localStorage.getItem('cookieAccess');
  
        if (val == 'true') {
          this.showCookie = false;
          return;
        }else if( this.route.url.includes('home')){
          this.showCookie = true;
          return;
        }
        
      }
    } catch{

    }

    this.createOnline$().subscribe((isOnline) => {
      if (isOnline) {
        // console.log('You are online');
        this.noNetworkConnection = false;
      } else {
        this.noNetworkConnection = true;

      }
    });
  }
  clickedCookieOk() {
    localStorage.setItem('cookieAccess', 'true');
    this.showCookie = false;
  }


  createOnline$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }

  clickedOk() {
    localStorage.setItem('cookieAccess', 'true');
    this.showCookie = false;
  }
}
