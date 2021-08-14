import { ChatRouting } from "./chat-routing.module";
import { NgModule } from "@angular/core";
import { ChatContainerComponent } from "./chat-container/chat-container.component";
import { ChatPersonItemComponent } from "./chat/chat-person-item/chat-person-item.component";
import { ChatPersonListComponent } from "./chat/chat-person-list/chat-person-list.component";
import { ChatPersonOptionsComponent } from "./chat/chat-person-options/chat-person-options.component";
import { ChatSpecificContainerComponent } from "./chat/chat-specific-container/chat-specific-container.component";
import { EmojixComponent } from "./chat/emojix/emojix.component";
import { MessagesComponent } from "./chat/messages/messages.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatExpansionModule } from "@angular/material/expansion";
import { ChatPersonSpecificComponent } from "./chat/chat-person-specific/chat-person-specific.component";
import { ChatModallComponent } from "./chat-modall/chat-modall.component";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { TimeformatPipe } from "./timeformat.pipe";
import { RightFeed } from "../shared/rightfeed/rightfeed.component";

import { fromEventPattern } from 'rxjs';
import { DirectivesModule } from '../directives/directives.module';
@NgModule({
  declarations: [
    ChatContainerComponent,
    ChatPersonItemComponent,
    ChatPersonListComponent,
    ChatPersonSpecificComponent,
    ChatPersonOptionsComponent,
    ChatSpecificContainerComponent,
    EmojixComponent,
    MessagesComponent,
    ChatModallComponent,
    TimeformatPipe,

  ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    SharedModule,
    MatExpansionModule,
    ChatRouting,
    MatBottomSheetModule,
    DirectivesModule
  ],
  exports: [ChatPersonItemComponent],
  entryComponents: [RightFeed],
  bootstrap: [RightFeed],
})
export class ChatModule {}
