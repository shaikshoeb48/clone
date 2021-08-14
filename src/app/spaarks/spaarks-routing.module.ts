import { RequestWrapperComponent } from "./request-wrapper/request-wrapper.component";
import { AllRequestsComponent } from "./../shared/all-requests/all-requests.component";
import { ChatRequestContainerComponent } from "./chat-request-container/chat-request-container.component";
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ViewRoott } from "./viewroot/viewroot.component";
import { MainView } from "./mainview/mainview.component";
import { Languagee } from "./language/language.component";
import { PreferencesComponent } from "./preferences/preferences.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { CreateSecondGuardService } from "../createsecond-guard.service";
import { LocationpickerComponent } from "../shared/locationpicker/locationpicker.component";
import { GetstartedgaurdService } from "../getstartedgaurd.service";
import { NotifItemComponent } from './notif-item/notif-item.component';
import { NotificationComponent } from './notification/notification.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "spaark",
        component: MainView,
        children: [{ path: "share/:id", component: MainView }],
      },
      //   { path: 'home/', redirectTo: 'home/feed', pathMatch: 'full' },
      { path: "feed", component: MainView },
      { path: "getstarted", component: LandingPageComponent },
      { path: "language", component: Languagee },
      { path: "preferences", component: PreferencesComponent },
      { path: "chatrequest", component: ChatRequestContainerComponent },
      {path: "notification", component:NotificationComponent},
      // {
      //   path: 'newspaark', component: CreateLayoutComponent, children: [
      //     { path: '', pathMatch: 'full', component: CreateFirstStepComponent },
      //     { path: 'create/:id', component: CreateSecondStepComponent, zanActivate: [CreateSecondGuardService] },
      //     { path: 'create', pathMatch: 'full', redirectTo: '/newspaark' }]
      // // },
      // { path: 'seller/:id', component: SellerProfContainerComponent },
      { path: "picklocation", component: LocationpickerComponent },
      { path: "profile/:id", outlet: "profileoutlet", component: ViewRoott },
      { path: "spaark/:id", component: ViewRoott },
      // { path: 'maps', outlet: 'mapsspaarks', component: ViewRoott },
      { path: "requestWrapper", component: RequestWrapperComponent },
      // { path: 'login', outlet: 'loginspaark', component: ViewRoott },
      // { path: 'nearby/:keyword', component: SearchComponent },
      { path: "requests", component: AllRequestsComponent },

      {
        path: "**",
        redirectTo: "getstarted",
        pathMatch: "full",
        canActivate: [GetstartedgaurdService],
      },
    ],
  },

  {
    path: "**",
    pathMatch: "full",
    redirectTo: "getstarted",
    canActivate: [GetstartedgaurdService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpaarksRouting {}
