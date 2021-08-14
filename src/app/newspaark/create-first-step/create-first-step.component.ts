import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { SpaarksService } from "../../spaarks.service";
import { Router, ActivatedRoute } from "@angular/router";
import { __core_private_testing_placeholder__ } from "@angular/core/testing";
import { AllpurposeserviceService } from "src/app/allpurposeservice.service";

@Component({
  selector: "app-create-first-step",
  templateUrl: "./create-first-step.component.html",
  styleUrls: ["./create-first-step.component.scss"],
})
export class CreateFirstStepComponent implements OnInit {

  constructor(
    private spaarksservice: SpaarksService,
    private router: Router,
    private allpurpose: AllpurposeserviceService,
    private route: ActivatedRoute
  ) {
    this.isAuthed = this.spaarksservice.authData.isAuthenticated;
  }
  isAuthed;

  isClickedAnonymous = false;
  prevData = [];
  showPreviousCat = false;
  quickspaarkdata = null;
  questionsFinal = {
    data: [
      {
        catTxt: "I give a Service",
        questionNo: "3",
        catImg: "q3.png",
        catDesc: "Maid, Driver, Plumber, Tuition, Freelancer etc.",
        excluding: [],
      },
      {
        catTxt: "I have Something to Sell",
        questionNo: "4",
        catImg: "q4.png",
        catDesc: "Fruits/Vegetables, Handicrafts, Homemade, Agri Mall etc.",
        excluding: [
          "C4",
          "C5",
          "C7",
          "C9",
          "C011",
          "C012",
          "C013",
          "C018",
          "C019",
          "C020",
          "C023",
          "C024",
        ],
      },
      {
        catTxt: "Make Friends",
        questionNo: "2",
        catImg: "q2.png",
        catDesc: "Say Hello, Connect to a Stranger, Find a Date.",
        excluding: [],
      },
      {
        catTxt: "Announce Something",
        questionNo: "1",
        catImg: "q1.png",
        catDesc: "Public Announcements, Events, Festivals, Launch, Party.",
        excluding: [],
      },
      {
        catTxt: "Post a Job",
        questionNo: "6",
        catImg: "q6.png",
        catDesc: "Labour, Assistant, Professional etc.",
        excluding: ["C5", "C018", "C020", "C019", "C024"],
      },
      {
        catTxt: "I Want a Job",
        questionNo: "7",
        catImg: "q7.png",
        catDesc: "Skilled, Not Skilled, Part Time etc.",
        excluding: [],
      },
      {
        catTxt: "I need a Service",
        questionNo: "5",
        catImg: "q5.png",
        catDesc: "Stylist, Electrician,Dhobi, Gardener, Repair etc.",
        excluding: [],
      },
      {
        catTxt: "Others",
        questionNo: "8",
        catImg: "q8.png",
        catDesc: "Health Emergency, Ask for Help, Lost or Found etc.",
        excluding: [],
      },
    ],
  };

  marketTab = [
    {
      catTxt: "I give a Service",
      catImg: "q3.png",
      catDesc:
        "Maid, Driver, Cook, Tuition, Consultant, Freelancer, Tailor, Watchman, Donate etc.",
    },
    {
      catTxt: "I have Something to Sell",
      catImg: "q4.png",
      catDesc:
        "Fruits/Vegetables, Handicrafts, Florist, Homemade, Agri Mall etc.",
    },
    {
      catTxt: "Make Friends",
      catImg: "q2.png",
      catDesc:
        "Say Hello, Connect to a Stranger, Find a Date, Make Introduction.",
    },
    {
      catTxt: "Announce Something",
      catImg: "../../../assets/testingMedia/sample_05.jpeg",
      catDesc:
        " Public Announcements, Events, Thoughts, Exhibition,Festival, Prayers, Achievement,Launch, Sale, Party.",
    },
    {
      catTxt: "Post a Job",
      catImg: "../../../assets/testingMedia/download.jpeg",
      catDesc: "Labour, Helper, Assistant, Manager, Professional etc.",
    },
    {
      catTxt: "I Want a Job",
      catImg: "../../../assets/testingMedia/download.jpeg",
      catDesc: "Skilled, Not Skilled, Daily Wage, Any Work, Part Time etc.",
    },
    {
      catTxt: "I need a Service",
      catImg: "../../../assets/testingMedia/2.jpeg",
      catDesc: "Stylist, Electrician,Dhobi, Gardener, Repair, Key Maker etc.",
    },
  ];

  ngOnInit(): void {
    this.spaarksservice.createTimeline = null;
    this.spaarksservice.showName = true;
    this.spaarksservice.showProfilePic = true;
    this.spaarksservice.redirectToNewspark.subscribe((x) => {
      if (x == "greet") {
        if (this.isClickedAnonymous) {
          this.selectedCat(2, "Make Friends", true);
        }
      }
    });

    this.spaarksservice.createFromFeed.subscribe((obj: any) => {
      this.selectedCat(obj.ind, obj.name);
    });
    this.spaarksservice.noPhoneCall = true;
    // this.spaarksservice.
    this.spaarksservice.selectedCreate = {
      ...this.spaarksservice.defaultCreate,
    };
    this.spaarksservice.CreateSpaarkSteps = {
      ...this.spaarksservice.DefaultSpaarkSteps,
    };
    this.spaarksservice.selectedCreate.content = "";

    this.spaarksservice.quickSpaarkSubj.subscribe((succ) => {
      console.log(succ);
      if (succ == "QuikcSpaarkCreated") {
        this.spaarksservice.selectedCreate = {
          ...this.spaarksservice.defaultCreate,
        };
        this.spaarksservice.CreateSpaarkSteps = {
          ...this.spaarksservice.DefaultSpaarkSteps,
        };
        this.spaarksservice.selectedCreate.content = "";
        this.spaarksservice.quickSpaarkClicked = false;
      }
    });

    if (this.isAuthed) {
      this.spaarksservice.getPreviousCat().subscribe((succ: any) => {
        console.log(succ);
        succ.data.forEach((val, ind) => {
          // console.log(val);
          if (val) {
            if (val.category != "" && val.subCategory != "") {
              this.prevData.push(val);
            }
          }
        });
        // this.prevData = succ.message;
        if (this.prevData.length > 0) {
          this.showPreviousCat = true;
        }

        this.prevData = this.prevData.reverse();
        console.log(this.prevData);
      });
    }
  }

  ngAfterContentInit(): void {
    var action = this.route.snapshot.paramMap.get("action");
    if (action) {
      this.selectedCat(2, "Make Friends", true);
    }
    this.isClickedAnonymous = true;
  }

  selectedCat(i, txt, isAnonymous = false) {
    this.spaarksservice.createTimeline = null;
    console.log(i, txt);
    if (this.quickspaarkdata) {
      //Checking if the user has clicked quick spaark
      console.log(this.quickspaarkdata);
      //Overriding category and subcategory
      this.spaarksservice.selectedCreate.selectedCategory = this.quickspaarkdata.category;
      this.spaarksservice.selectedCreate.selectedSubCategory = this.quickspaarkdata.subCategory;
    }

    this.spaarksservice.selectedCreate = {
      ...this.spaarksservice.defaultCreate,
    };
    this.spaarksservice.selectedCreate.selectedSubCategory = "";
    this.spaarksservice.CreateSpaarkSteps = {
      ...this.spaarksservice.DefaultSpaarkSteps,
    };
    this.spaarksservice.selectedCreate.content = "";

    console.log(this.spaarksservice.selectedCreate);
    console.log(this.spaarksservice.CreateSpaarkSteps);
    this.spaarksservice.createSpaarksMain.pageone = txt;
    if (
      txt.includes("Announce") ||
      txt.includes("Friends") ||
      txt.includes("give") ||
      txt.includes("Sell") ||
      txt.includes("Post") ||
      txt.includes("Want") ||
      txt.includes("need") ||
      txt.includes("Others")
    ) {
      if (this.spaarksservice.authData.isAuthenticated == false) {
        this.spaarksservice.triggerLogin();

        return;
      }
    }

    if (txt.includes("Announce")) {
      this.spaarksservice.selectedCreate.featureSelected = "showtime";
      this.spaarksservice.selectedCreate.questionNo = "1";
    } else if (txt.includes("Friends")) {
      this.spaarksservice.selectedCreate.featureSelected = "greet";
      this.spaarksservice.selectedCreate.questionNo = "2";

      this.spaarksservice.selectedCreate.isAnonymous = isAnonymous;
      this.spaarksservice.selectedCreate.location = false;
    } else if (txt.includes("Others")) {
      this.spaarksservice.selectedCreate.featureSelected = "showtime";
      this.spaarksservice.selectedCreate.questionNo = "8";

    } else {
      this.spaarksservice.selectedCreate.featureSelected = "market";
      if (txt.includes("give")) {
        this.spaarksservice.selectedCreate.questionNo = "3";
      } else if (txt.includes("need")) {
        this.spaarksservice.selectedCreate.questionNo = "5";
      } else if (txt.includes("Want")) {
        this.spaarksservice.selectedCreate.questionNo = "7";
      } else if (txt.includes("Post")) {
        this.spaarksservice.selectedCreate.questionNo = "6";
      } else if (txt.includes("Sell")) {
        this.spaarksservice.selectedCreate.questionNo = "4";
      } else if (txt.includes("Others")) {
        this.spaarksservice.selectedCreate.questionNo = "8";

      }
    }
    this.spaarksservice.selectedCreate.selectedQuestion = txt;

    //Navigating user to the route, home/newspaark/create/i-offer-a-service
    //by splitting the spaces and join with -
    this.router.navigateByUrl("newspaark/create/" + txt.split(" ").join("-"));

    // this.spaarksservice.allPurposeSubject.next({action:'firststep',index:i,text:txt})
  }

  //Executes when a user clicks on quick spaark
  quickSpaark(data) {
    console.log(data);
    //Saving the quick spaark data into a variable to access it in another function
    this.quickspaarkdata = data;
    //alert('QuickSpaark')
    // return;
    this.questionsFinal.data.forEach((val, ind) => {
      if (val) {
        if (val.questionNo == data.questionNo) {
          console.log(val);
          this.selectedCat(2, val.catTxt);
        }
      }
    });

    this.spaarksservice.quickSpaarkClicked = true;
    console.log(this.spaarksservice.quickSpaarkClicked);
    this.spaarksservice.selectedCreate.selectedCategory = data.category;
    this.spaarksservice.selectedCreate.selectedSubCategory = data.subCategory;
    this.spaarksservice.selectedCreate.questionNo = data.questionNo;
    if (data.categoryId) {
      this.spaarksservice.selectedCreate.categoryId = data.categoryId;
    }
    if (data.subCategoryId) {
      this.spaarksservice.selectedCreate.subCategoryId = data.subCategoryId;
    }
    this.spaarksservice.quickSpaarkSubj.next("startStepper");
  }
}
