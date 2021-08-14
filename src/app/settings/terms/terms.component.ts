import { SpaarksService } from './../../spaarks.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  constructor(private spaarks: SpaarksService) {
    this.isMobileVersion = this.spaarks.isMobileVersion;
    this.spaarks.noAuthRequired = true;
  }
  isMobileVersion;
  ngOnInit(): void {
  }
  ngOnDestroy(){
    console.log("aaaaaaaaaa");
    this.spaarks.checkforLocation();

  }
}
