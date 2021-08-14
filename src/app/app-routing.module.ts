import { Routes, RouterModule } from "@angular/router";

import { NgModule } from "@angular/core";
import { GetstartedgaurdService } from "./getstartedgaurd.service";
import { LandingPageComponent } from "./spaarks/landing-page/landing-page.component";
import { TermsMobileComponent } from './terms-mobile/terms-mobile.component';
// import { ViewRoott } from './spaarks/viewroot/viewroot.component'

const routes: Routes = [
  {path:'termsmobile',component:TermsMobileComponent},
  {
    path: "home",
    loadChildren: () =>
      import("./spaarks/spaarks.module").then((m) => m.SpaarksModule),
  },
  {
    path: "chat",
    loadChildren: () => import("./chat/chat.module").then((m) => m.ChatModule),
  },
  {
    path: "newspaark",
    loadChildren: () =>
      import("./newspaark/newspaark.module").then((m) => m.NewspaarkModule),
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./profile/profile.module").then((m) => m.ProfileModule),
  },

  {
    path: "settings",
    loadChildren: () =>
      import("./settings/settings.module").then((m) => m.SettingsModule),
  },
  {
    path: "explore",
    loadChildren: () =>
      import("./explore/explore.module").then((m) => m.ExploreModule),
  },
  {
    path: "nearby",
    loadChildren: () =>
      import("./nearby/nearby.module").then((m) => m.NearbyModule),
  },
  {
    path: "",
    pathMatch: "full",
    canActivate: [GetstartedgaurdService],
    component: LandingPageComponent,
  },
  {
    path: "**",
    canActivate: [GetstartedgaurdService],
    pathMatch: "full",
    component: LandingPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingSpaarks {}
