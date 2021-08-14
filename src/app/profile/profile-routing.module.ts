import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserprofileComponent } from "./userprofile/userprofile.component";

import { SellerProfContainerComponent } from "./seller-prof-container/seller-prof-container.component";
import { BookmarksComponent } from "./bookmarks/bookmarks.component";
import { ProfileContainerComponent } from "./profile-container/profile-container.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: ProfileContainerComponent,
  },
  { path: "seller/:id", component: SellerProfContainerComponent },
  { path: "bookmarks", component: BookmarksComponent },
  { path: ":id", component: ProfileContainerComponent },

  { path: "profile", component: ProfileContainerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRouting {}
