import { ConnectWithUsComponent } from "./connect-with-us/connect-with-us.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SettingsComponent } from "./settings/settings.component";
import { FaqsComponent } from "./faqs/faqs.component";
import { TermsComponent } from "./terms/terms.component";
import { BusinessEnqComponent } from "./business-enq/business-enq.component";
import { BusinessChatComponent } from "./business-chat/business-chat.component";
import { TicketChatComponent } from "./ticket-chat/ticket-chat.component";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { RewardsComponent } from "./rewards/rewards.component";

const routes: Routes = [
  { path: "", pathMatch: "full", component: SettingsComponent },
  { path: "faqs", component: FaqsComponent },
  { path: "rewards", component: RewardsComponent },
  { path: "terms", component: TermsComponent },
  { path: "bussinessEnq", component: BusinessEnqComponent },
  { path: "business/:id", component: BusinessChatComponent },
  { path: "ticket/:id", component: TicketChatComponent },
  { path: "help", component: ContactUsComponent },
  { path: "connectwithus", component: ConnectWithUsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes), MatBottomSheetModule],
  exports: [RouterModule],
})
export class SettingsRouting {}
