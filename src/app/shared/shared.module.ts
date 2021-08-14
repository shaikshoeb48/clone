import { NotifItemComponent } from './../spaarks/notif-item/notif-item.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { AllRequestsComponent } from "./all-requests/all-requests.component";
import { Leftnav } from "./leftnav/leftnav.component";
import { RequestsComponent } from "./requests/requests.component";
import { RightFeed } from "./rightfeed/rightfeed.component";
import { TopbarComponent } from "./topbar/topbar.component";
import { SpaarkscardComponent } from "./spaarkscard/spaarkscard.component";
import { SpaarkspillComponent } from "./spaarkspill/spaarkspill.component";
import { CommentscontainerComponent } from "./commentscontainer/commentscontainer.component";
import { CommentitemComponent } from "./commentitem/commentitem.component";
import { RepliescontainerComponent } from "./repliescontainer/repliescontainer.component";
import { RepliesitemComponent } from "./repliesitem/repliesitem.component";
import { BottomNavBarComponent } from "./bottom-nav-bar/bottom-nav-bar.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MsgItemComponent } from "./msg-item/msg-item.component";
import { ContentHilightPipe } from "./content-hilight.pipe";
import { SliceNamePipe } from "./slice-name.pipe";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule } from "@angular/router";
import { LocationpickerComponent } from "./locationpicker/locationpicker.component";
import { LoginComponent } from "./login/login.component";
import { QrcodeComponent } from "./login/qrcode/qrcode.component";
import { CategoryBoxComponent } from "./category-box/category-box.component";
import { SubCategoryComponent } from "./sub-category/sub-category.component";
import { VariableselectboxComponent } from "./variableselectbox/variableselectbox.component";
import { MatRadioModule } from "@angular/material/radio";
import { MarketCatComponent } from "./market-cat/market-cat.component";
import { ImagesContainerComponent } from "./images-container/images-container.component";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { DistancePipePipe } from "./distance-pipe.pipe";
import { FeatureTextPipe } from "../feature-text.pipe";
import { UrlifyPipe } from "../urlify.pipe";
import { ShortNumberPipe } from "../short-number.pipe";
import { SpaarksmodalComponent } from "./spaarksmodal/spaarksmodal.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { InViewportModule } from "ng-in-viewport";
import { NgOtpInputModule } from "ng-otp-input";
import { RatingsComponent } from "./ratings/ratings.component";
import { ChatPersonItemComponent } from "../chat/chat/chat-person-item/chat-person-item.component";
import { SpaarksModule } from "../spaarks/spaarks.module";
import { ChatModule } from "../chat/chat.module";
import { ExplorecarouselComponent } from "../spaarks/explorecarousel/explorecarousel.component";
import { StarRatingModule } from "angular-star-rating";
import { BarRatingModule } from "ngx-bar-rating";
import { ExploreModule } from "../explore/explore.module";
import { TopbarmobileComponent } from "./topbarmobile/topbarmobile.component";
import { MatSliderModule } from "@angular/material/slider";
import {MatTabsModule} from '@angular/material/tabs';
//import {GreatDirectiveModule} from 'great-ngform'

@NgModule({
  declarations: [
    AllRequestsComponent,
    Leftnav,
    RequestsComponent,
    RightFeed,
    TopbarComponent,
    SpaarkscardComponent,
    SpaarkspillComponent,
    CommentscontainerComponent,
    CommentitemComponent,
    RepliescontainerComponent,
    RepliesitemComponent,
    BottomNavBarComponent,
    MsgItemComponent,
    ContentHilightPipe,
    SliceNamePipe,
    LoginComponent,
    LocationpickerComponent,
    QrcodeComponent,
    DistancePipePipe,
    CategoryBoxComponent,
    SubCategoryComponent,
    VariableselectboxComponent,
    MarketCatComponent,
    ImagesContainerComponent,
    FeatureTextPipe,
    UrlifyPipe,
    ShortNumberPipe,
    SpaarksmodalComponent,
    RatingsComponent,
    ExplorecarouselComponent,
    TopbarmobileComponent,
    NotifItemComponent
    
  ],
  exports: [
    AllRequestsComponent,
    Leftnav,
    RequestsComponent,
    RightFeed,
    TopbarComponent,
    TopbarmobileComponent,
    SpaarkscardComponent,
    SpaarkspillComponent,
    CommentscontainerComponent,
    CommentitemComponent,
    RepliescontainerComponent,
    RepliesitemComponent,
    BottomNavBarComponent,
    MsgItemComponent,
    ContentHilightPipe,
    SliceNamePipe,
    LoginComponent,
    LocationpickerComponent,
    CategoryBoxComponent,
    SubCategoryComponent,
    VariableselectboxComponent,
    MatRadioModule,
    MarketCatComponent,
    ImagesContainerComponent,
    MatMenuModule,
    CarouselModule,
    DistancePipePipe,
    FeatureTextPipe,
    UrlifyPipe,
    ShortNumberPipe,
    SpaarksmodalComponent,
    RatingsComponent,
    ExplorecarouselComponent,
    NotifItemComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    FormsModule,
    CommonModule,
    MatMenuModule,
    RouterModule,
    MatRadioModule,
    MatSliderModule,
    CarouselModule,
    MatAutocompleteModule,
    InViewportModule,
    NgOtpInputModule,
    BarRatingModule,
    MatTabsModule,
    
    StarRatingModule.forRoot(),
    //GreatDirectiveModule,
  ],
  entryComponents: [ChatPersonItemComponent],
  bootstrap: [ChatPersonItemComponent],
})
export class SharedModule {}
