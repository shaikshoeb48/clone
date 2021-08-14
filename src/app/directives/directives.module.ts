import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomnavDirDirective } from './bottomnav-dir.directive';
import { ImgHoldDirective } from './img-hold.directive';
import { MainfeedDirDirective } from './mainfeed-dir.directive';
import { TopbarDirDirective } from './topbar-dir.directive';
import { TopmiddleDirDirective } from './topmiddle-dir.directive';



@NgModule({
  declarations: [BottomnavDirDirective,ImgHoldDirective,MainfeedDirDirective,TopbarDirDirective,TopmiddleDirDirective],
  imports: [
    CommonModule
  ],
  exports:[BottomnavDirDirective,ImgHoldDirective,MainfeedDirDirective,TopbarDirDirective,TopmiddleDirDirective]
})
export class DirectivesModule { }
