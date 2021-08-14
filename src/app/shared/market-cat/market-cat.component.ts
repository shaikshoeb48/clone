import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-market-cat',
  templateUrl: './market-cat.component.html',
  styleUrls: ['./market-cat.component.scss']
})
export class MarketCatComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Input('cattxt') inputText;
  @Input('catimg') catImg="../../../assets/testingMedia/sample_05.jpeg";
  @Input('fontweight') fontweight = 'none';
  // @Input('city') 

}
