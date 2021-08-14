import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SpaarksService } from "../../spaarks.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-bookmarks",
  templateUrl: "./bookmarks.component.html",
  styleUrls: ["./bookmarks.component.scss"],
})
export class BookmarksComponent implements OnInit {
  constructor(
    private router: Router,
    private spaark: SpaarksService,
    private loc: Location
  ) {
    this.isMobileVersion = this.spaark.isMobileVersion;
  }

  selectedTab: string = "spaarks";
  bookmarkedPosts;
  bookmarkedUsers;
  isbookmarked = false;
  isAuthed = this.spaark.authData.isAuthenticated;
  isMobileVersion;
  showLogin = false;
  isClickedToggle = false;

  ngOnInit(): void {
    if (this.isAuthed) {
      this.spaark.getBookmarks().subscribe((succes: any) => {
        console.log(succes);
        this.bookmarkedPosts = succes.posts;
        this.bookmarkedUsers = succes.users;
        console.log(this.bookmarkedPosts);
        console.log(this.bookmarkedUsers);
      });
    }

    this.spaark.showLoginScreen.subscribe((bool) => {
      this.showLogin = bool;
    });

    this.spaark.removebookmarkPost.subscribe((x) => {
      this.bookmarkedPosts.forEach((val, ind) => {
        if (val == x) {
          this.bookmarkedPosts.splice(ind, 1);
        }
      });
    });
    console.log(this.bookmarkedPosts);
  }

  checkTabIndex(event) {
    console.log(event);

    this.spaark.currentFeatureSubj.next(event);
    this.spaark.featName = event;
    this.router.navigateByUrl("home/feed");
  }

  clickedLogin() {
    this.showLogin = true;
    this.spaark.showLoginScreen.next(true);
  }

  toggleBookmark(postId) {
    this.isClickedToggle = true;
    console.log("Called first");
    let indd = null;

    this.bookmarkedUsers.forEach((val, ind) => {
      if (val) {
        if (val._id == postId) {
          indd = ind;
        }
      }
    });
    if (indd != null) {
      this.spaark.removeUserBookmark(postId).subscribe((data) => {
        this.bookmarkedUsers.splice(indd, 1);
        this.spaark.somethingWentWrong("Bookmark removed");
      });
    }
  }

  takeToProfile(item) {
    if (this.isClickedToggle) {
      this.isClickedToggle = false;
      return;
    }
    console.log("Called second");
    this.router.navigateByUrl("profile/seller/" + item._id);
  }

  clickedBack() {
    this.loc.back();
  }
}
