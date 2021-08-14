import { NgModule } from "@angular/core";
import { BusinessChatComponent } from "./business-chat/business-chat.component";
import { BusinessEnqComponent } from "./business-enq/business-enq.component";
import { BusinessTicketsComponent } from "./business-tickets/business-tickets.component";
import { ConnectWithUsComponent } from "./connect-with-us/connect-with-us.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { FaqsComponent } from "./faqs/faqs.component";

import { SettingsComponent } from "./settings/settings.component";
import { TermsComponent } from "./terms/terms.component";
import { TicketChatComponent } from "./ticket-chat/ticket-chat.component";
import { TicketsComponent } from "./tickets/tickets.component";
import { CommonModule } from "@angular/common";
import { SettingsRouting } from "./settings-routing.module";
import { FormsModule } from "@angular/forms";
import { MsgInputComponent } from "./msg-input/msg-input.component";
import { SharedModule } from "../shared/shared.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SettingsModallComponent } from "./settings-modall/settings-modall.component";
import { DirectivesModule } from "../directives/directives.module";
import { RewardsComponent } from "./rewards/rewards.component";
import { MatButtonToggleModule, MatButtonToggleGroup } from "@angular/material/button-toggle";
// import { MainfeedDirDirective } from '../mainfeed-dir.directive';

@NgModule({
  declarations: [
    BusinessChatComponent,
    BusinessEnqComponent,
    BusinessTicketsComponent,
    ConnectWithUsComponent,
    ContactUsComponent,
    FaqsComponent,
    SettingsComponent,
    TermsComponent,
    TicketChatComponent,
    TicketsComponent,
    MsgInputComponent,
    SettingsModallComponent,
    RewardsComponent,
  ],
  imports: [
    CommonModule,
    SettingsRouting,
    FormsModule,
    SharedModule,
    NgbModule,
    DirectivesModule,
    MatButtonToggleModule,
  ],
})
export class SettingsModule {}
