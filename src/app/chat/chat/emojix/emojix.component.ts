//***********************************************************************************************
// Organization    : OSOS Pvt Ltd
// Name            : emojix.Component.ts
// Created         : Jun 16 2020
//-----------------------------------------------------------------------------------------------
//
// What It Does - Lets a user to pick an emoji in the message input
//
// Program Description- In this we are iterating over an array of emojis and them performing an action on click.
//
// Frequency - everytime a user clicks on an emoji.
//
// How It Works- When user clicks on emoji we send an @Ouput event emitter to its parent (msginput.component.ts)
//
//-----------------------------------------------------------------------------------------------
// Inputs                      Access Type   |         Description
//    -                             -                        Not Applicable
//-----------------------------------------------------------------------------------------------
// Outputs                 Access Type    Description
//    -                             -                        Not Applicable
//-----------------------------------------------------------------------------------------------
// Component Inputs                      from component   | to component |        Description
//    -                             -                        Not Applicable
//-----------------------------------------------------------------------------------------------
// Component Outputs                      to Component   |         Description
//        emoji                       msgInput.component.ts     Sends emoji to msginput.component.ts
//***********************************************************************************************
//************************************************************************************************
// Revision Author            Date      Change                                       					
// Number                                                                       					
//  V1.0    Jai Sai Chand      16/06/2020  Intial FrameWork					
//  

import { Component, OnInit,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-emojix',
  templateUrl: './emojix.component.html',
  styleUrls: ['./emojix.component.css']
})
export class EmojixComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    for(let em = 0 ;em<this.emoji.length;em++)
   { 
     for(let i=this.emoji[em].start;i<=this.emoji[em].end;i++) this.smiley.push( "&#"+i); 
  } 
  
 }
  @Output() Emoji = new EventEmitter();

  smiley = [];
   emoji = [
      {start:128512 , end : 128567},
     {start:128577 , end : 128580},
      {start:129296 , end : 129301 },
      { start: 129312 , end : 129327 }
     ] 
     emojiClicked( i )
     { this.Emoji.emit(i); }
  
}
