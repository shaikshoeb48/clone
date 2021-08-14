import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-spaarkspill',
  templateUrl: './spaarkspill.component.html',
  styleUrls: ['./spaarkspill.component.scss']
})
export class SpaarkspillComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Input('inputText') inputText="crimson";
  @Input('inputtextcolor') inputtextcolor="white";
  @Input('inputWidth') inputWidth="null";
  @Input('inputColor') inputColour="#ea4161";

}
