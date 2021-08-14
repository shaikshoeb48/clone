import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { SpaarksService } from "../../spaarks.service";
import { Router, ActivatedRoute, NavigationStart } from "@angular/router";
import { AllpurposeserviceService } from "../../allpurposeservice.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-create-second-step",
  templateUrl: "./create-second-step.component.html",
  styleUrls: ["./create-second-step.component.scss"],
})
export class CreateSecondStepComponent implements OnInit {
  constructor(
    private spaarksservice: SpaarksService,
    private http: HttpClient,
    private allPurposeService: AllpurposeserviceService,
    private router: Router,
    private Route: ActivatedRoute,
    private allPurp: AllpurposeserviceService
  ) {
    this.routingEvent = router.events.subscribe((event) => {
      // alert(this.stepPosition)
      console.log(event);
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger == "popstate") {
          this.spaarksservice.isClickedFromAnnounce = false;
          return;
        }
        if (!this.confirmExit()) {
          console.log("Already reached");
          const currentRoute = this.router.routerState;
          this.router.navigateByUrl(currentRoute.snapshot.url, {
            skipLocationChange: true,
          });
        }
      }
    });
  }

  ngOnInit(): void {
    this.spaarksservice.quickSpaarkSubj.subscribe((succ) => {
      console.log(succ);
      if (succ == "QuikcSpaarkCreated") {
        //alert('QuikcSpaarkCreated');
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

    //Taking id from the url(route params)
    this.Route.params.subscribe((suc) => {
      //Assigning the question, category
      console.log(suc);
      if (suc.id == "Make-Friends") {
        // this.stepPosition = 'four';
        this.checkLoginToCreate();
        this.spaarksservice.CreateSpaarkSteps.Cat = "Make-Friends";
        this.createTimeline = {
          feature: "Make-Friends",
          cat: undefined,
          subcat: undefined,
          questionno: "2",
        };
        this.spaarksservice.createTimeline = this.createTimeline;
      } else if (suc.id == "Announce-Something" || suc.id == "Others") {
        // this.stepPosition = 'four'
        this.spaarksservice.CreateSpaarkSteps.Cat = "Announce-Something";
        this.checkLoginToCreate();
        this.createTimeline = {
          feature: "Announce-Something",
          cat: undefined,
          subcat: undefined,
          questionno: "1",
        };
        this.spaarksservice.createTimeline = this.createTimeline;
      } else if (suc.id == "I-give-a-Service") {
        console.log("....");
        let catToExclude = [];
        this.allPurp.questions.data.forEach((val, ind) => {
          if (val.questionNo == this.questionno) {
            catToExclude = val.excluding;
          }
        });
        this.dynamicDetailsCategory = this.dynamicDetailsCategory.filter(
          (catt) => {
            return !catToExclude.includes(catt.categoryId);
          }
        );
        this.stepPosition = "two";
        this.spaarksservice.CreateSpaarkSteps.Cat = "I-give-a-Service";
        this.spaarksservice.CreateSpaarkSteps.StepState = "two";
        this.createTimeline = {
          feature: "I give a Service",
          cat: undefined,
          subcat: undefined,
          questionno: "3",
        };
        this.spaarksservice.createTimeline = this.createTimeline;
      } else if (suc.id == "I-have-Something-to-Sell") {
        console.log("I-have-Something-to-Sell");
        let catToExclude = [];
        this.allPurp.questions.data.forEach((val, ind) => {
          if (val.questionNo == this.questionno) {
            catToExclude = val.excluding;
          }
        });
        // this.dynamicDetailsCategory = this.dynamicDetailsCategory.filter((catt) => {
        //   return !catToExclude.includes(catt.categoryId)
        // })
        // this.dynamicDetailsCategory = this.dynamicDetailsCategory.slice(0, 4)
        this.stepPosition = "two";
        this.spaarksservice.CreateSpaarkSteps.Cat = "I-have-Something-to-Sell";
        this.spaarksservice.CreateSpaarkSteps.StepState = "two";
        this.createTimeline = {
          feature: "I-have-Something-to-Sell",
          cat: undefined,
          subcat: undefined,
          questionno: "4",
        };
        this.spaarksservice.createTimeline = this.createTimeline;
      } else if (suc.id == "I-need-a-Service") {
        // console.log('I-need-a-Service')
        let catToExclude = [];
        this.allPurp.questions.data.forEach((val, ind) => {
          if (val.questionNo == this.questionno) {
            catToExclude = val.excluding;
            console.log("I-need-a-Service", catToExclude);
          }
        });

        this.dynamicDetailsCategory = this.dynamicDetailsCategory.filter(
          (catt) => {
            return !catToExclude.includes(catt.categoryId);
          }
        );
        // this.dynamicDetailsCategory = this.dynamicDetailsCategory.slice(0, 4)

        //Making step position to two, in this we show the user the list of categories
        this.stepPosition = "two";
        this.spaarksservice.CreateSpaarkSteps.Cat = "I-need-a-Service";
        this.spaarksservice.CreateSpaarkSteps.StepState = "two";
        this.createTimeline = {
          feature: "I-need-a-Service",
          cat: undefined,
          subcat: undefined,
          questionno: "5",
        };
        this.spaarksservice.createTimeline = this.createTimeline;
      } else if (suc.id == "I-Want-a-Job") {
        this.createTimeline = {
          feature: "I-Want-a-Job",
          cat: undefined,
          subcat: undefined,
          questionno: "7",
          skilled: "false",
        };
        this.spaarksservice.createTimeline = this.createTimeline;
        this.stepPosition = "postajob";
        this.spaarksservice.CreateSpaarkSteps.StepState = "postajob";
        let catToExclude = [];
        this.allPurp.questions.data.forEach((val, ind) => {
          if (val.questionNo == this.questionno) {
            catToExclude = val.excluding;
          }
        });
        this.dynamicDetailsCategory = this.dynamicDetailsCategory.filter(
          (catt) => {
            return !catToExclude.includes(catt.categoryId);
          }
        );

        this.spaarksservice.CreateSpaarkSteps.Cat = "I-Want-a-job";
      } else if (suc.id == "Post-a-Job") {
        this.createTimeline = {
          feature: "Post-a-Job",
          cat: undefined,
          subcat: undefined,
          questionno: "6",
        };
        this.spaarksservice.createTimeline = this.createTimeline;
        // this.dynamicDetailsCategory = this.dynamicDetailsCategory.slice(0, 4)
        let catToExclude = [];
        this.allPurp.questions.data.forEach((val, ind) => {
          if (val.questionNo == this.questionno) {
            catToExclude = val.excluding;
          }
        });
        // this.dynamicDetailsCategory = this.dynamicDetailsCategory.filter((catt) => {
        //   return !catToExclude.includes(catt.categoryId)
        // })

        this.stepPosition = "two";
        this.spaarksservice.CreateSpaarkSteps.Cat = "postajob";
      } else {
        console.log(suc.id);
        // this.checkLoginToCreate();
        // this.spaarksservice.CreateSpaarkSteps.Cat="Others";
        // this.createTimeline= {feature:'Make-Friends',cat:undefined,subcat:undefined,questionno:'2'};
        // this.spaarksservice.createTimeline = this.createTimeline
        // this.stepPosition = 'two'
      }
      console.log(this.spaarksservice.CreateSpaarkSteps.Cat);
      console.log(this.spaarksservice.CreateSpaarkSteps.StepState);
    });

    if (
      this.spaarksservice.selectedCreate.selectedQuestion == "" ||
      this.spaarksservice.selectedCreate.featureSelected == ""
    ) {
      this.router.navigateByUrl("home/newspaark");
    } else {
      this.pickedQuestion = this.spaarksservice.selectedCreate.selectedQuestion;
    }

    //     this.spaarksservice.currentStepState = 'two';
    // this.stepPosition=this.spaarksservice.CreateSpaarkSteps.StepState;
    this.spaarksservice.previousSubj.subscribe((succ: any) => {
      console.log(succ);
      if (succ == "BackToSubCat") {
        this.stepPosition = "three";
      }

      if (succ == "BackToCat") {
        this.clickedPreviousSubCat();
      }

      if (succ == "BackToFirstPage") {
        this.stepPosition = "four";
      }

      if (succ == "skilled") {
        if (this.createTimeline.subcat) {
          this.stepPosition = "three";
        } else if (this.createTimeline.cat) {
          this.stepPosition = "two";
        } else {
          this.stepPosition = "postajob";
        }
      }
    });

    if (this.spaarksservice.quickSpaarkClicked == true) {
      var i = 0;
      //alert('Starting Stepper Because of Quick Spaark');
      this.startStepper(
        this.spaarksservice.selectedCreate.selectedSubCategory,
        i,
        this.spaarksservice.selectedCreate.selectedCategory
      );
      // alert('Helloooooooooooooooooooooooooooo');
    }

    // this.spaarksservice.quickSpaarkSubj.subscribe(succ=>{
    // console.log(succ);
    // if(succ=='startStepper'){
    //     if(this.spaarksservice.quickSpaarkClicked){
    //       var i=0
    //       this.startStepper(this.spaarksservice.selectedCreate.selectedSubCategory,i,this.spaarksservice.selectedCreate.selectedCategory)
    //     alert('Helloo');
    //     }
    //   }

    // });
  }

  questionno = this.spaarksservice.selectedCreate.questionNo;
  routingEvent;
  createTimeline;
  loginToCreate = false;
  showLogin = false;

  // changedSelectedVal(values,eve){
  //   console.log(values);
  //   console.log(eve)
  //   if(values=='opt1'){

  //       this.option1val = eve;

  //   }else if(values=='opt2'){
  //     this.option2val = eve;
  //   }

  // }

  radioValue = "forExperienced";

  skilled = "false";

  dummyPost = this.spaarksservice.dummySpaarksPost[0];
  pickedQuestion;
  stepPosition = "two";

  dynamicDetailsCategory = this.allPurp.categories.sort((first, sec) => {
    var a = first.category.toUpperCase();
    var b = sec.category.toUpperCase();
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  selectedDynamicSubcategories = [];
  catImg = "../../../assets/testingMedia/sample_03.jpg";

  listofsearches = [];
  listofPosts;
  content = "";
  @Output("showCat") showCat = new EventEmitter();

  marketDetails = [
    {
      id: "1",
      categoryName: "Freelancers",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      id: "2",
      categoryName: "Routine Services",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      id: "3",
      categoryName: "Food and related",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      id: "4",
      categoryName: "Workers",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      id: "5",
      categoryName: "Consultants",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      id: "6",
      categoryName: "Farm Produce",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      id: "7",
      categoryName: "Resell or Give away",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      id: "8",
      categoryName: "Beauty",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      id: "9",
      categoryName: "IT",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      id: "10",
      categoryName: "Care",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      id: "11",
      categoryName: "Travel",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      id: "12",
      categoryName: "Real Estate and Rentals",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      id: "13",
      categoryName: "Stores",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      id: "14",
      categoryName: "Small Scale Entrepreneurs",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
    {
      id: "15",
      categoryName: "Others",
      catImg: "../../../assets/testingMedia/sample_03.jpg",
    },
  ];

  lisfofSub = [
    {
      id: "1",
      categoryName: "Freelancers/Coaches/Tutors",
      subCategory: [
        "Photographer",
        "Music/Dance Tutor",
        "Lifestyle Coach",
        "Tutors",
        "Content Writers",
        "Digital Marketing",
        "Music Troops",
        "Cooking Classes",
        "Sports Coach",
        "Performing Arts",
      ],
    },
    {
      id: "2",
      categoryName: "Routine Services",
      subCategory: [
        "Garbage Collector",
        "Raddiwala",
        "Electrician",
        "Locksmith",
        "Cobbler",
        "Carpenter",
        "Plumber",
        "Painter",
        "Bag & Related Repair",
        "Dhobi/Dry cleaner",
        "Gardener/Nursery",
      ],
    },
    {
      id: "3",
      categoryName: "Food and related",
      subCategory: [
        "Fruits/Vegetables",
        "Juice Corner",
        "Panwala/Tea-stall",
        "Street Food",
        "Gol-gappe/Chaat",
        "Bakery",
        "Tiffin",
        "Catering",
      ],
    },
    {
      id: "4",
      categoryName: "Workers/Helpers",
      subCategory: [
        "Maid/Cook",
        "Driver/Car Washer",
        "Miscellaneous Helper",
        "Miscellaneous Helper",
        "Office Assistant",
        "Security/ Guard Service",
        "Daily Wage Labour",
        "Waiters/Bearers",
      ],
    },
    {
      id: "5",
      categoryName: "Consultants",
      subCategory: [
        "Legal Consultant",
        "CA/Tax Consultant",
        "Astrologer/Tarot",
        "Career Counsellor",
        "Interior Designer",
        "Event/Wedding Planner",
      ],
    },
    {
      id: "6",
      categoryName: "Farm Produce",
      subCategory: [
        "Organic Produce",
        "Grains/Pulses",
        "Fruits/Vegetables",
        "Milk and milk products",
        "Flowers",
        "Poultry/Meat/Fish",
        "Spices/Herbs",
        "Exotic products",
      ],
    },
    {
      id: "7",
      categoryName: "Resell or Give away",
      subCategory: [
        "Car/Bike",
        "Children’s",
        "Books",
        "Appliances/Furniture",
        "Others/Miscellaneous",
        "Food/Clothes/Utensils",
        "IT and Hardware",
      ],
    },
    {
      id: "8",
      categoryName: "Beauty and Fitness",
      subCategory: [
        "Stylist",
        "Home Service Beautician",
        "Masseurs/Massage",
        "Parlour/Hairdressers",
        "Dietician/Nutritionist",
        "Fitness/Yoga",
      ],
    },
    {
      id: "9",
      categoryName: "IT",
      subCategory: [
        "IT Security",
        "Computer/Mobile Repair",
        "Broadband/Internet",
        "Animators/Developers",
        "IT related Professionals",
        "Computer Training/related",
      ],
    },
    {
      id: "10",
      categoryName: "Care and Paramedic",
      subCategory: [
        "Nurse and Paramedic",
        "Baby Sitter/Pet Sitter",
        "Pharmacy",
        "Vet",
        "Physiotherapist",
        "Post Delivery Care-taker",
      ],
    },
    {
      id: "11",
      categoryName: "Transport related",
      subCategory: [
        "Rickshaw/Autorickshaw",
        "Hire Vehicle",
        "Taxi- Sharing/Single",
        "Mechanic",
      ],
    },
    {
      id: "12",
      categoryName: "Real Estate and Rentals",
      subCategory: [
        "House on Rent",
        "Roommates/Flatmates",
        "Domestic Items on Rent",
        "Beddings on Rent",
      ],
    },
    {
      id: "13",
      categoryName: "Stores",
      subCategory: [
        "Dhabas",
        "General Stores",
        "Small Eating Joints",
        "Sweet Shops",
      ],
    },
    {
      id: "14",
      categoryName: "Small Scale Entrepreneurs",
      subCategory: ["Jewellery Making", "Handicrafts", "Tailor/Boutique"],
    },
    { id: "15", categoryName: "Others", subCategory: ["Any Other"] },
  ];
  selectedArr = this.spaarksservice.selectedCreate;
  listshowArr = [];

  changedRadio(val, eve) {
    if (eve.value == "forExperienced" && val == "forExperienced") {
      this.radioValue = "forExperienced";
      this.skilled = "true";
      this.spaarksservice.createTimeline.questionno = "3";
      console.log("experienced");
    } else {
      this.radioValue = "forNew";
      this.skilled = "false";
      console.log("non exp");
    }
  }

  checkLoginToCreate() {
    if (this.spaarksservice.authData.isAuthenticated == true) {
      this.stepPosition = "four";
    } else {
      this.spaarksservice.triggerLogin();
      return;
    }
  }

  clickedLogin() {
    this.showLogin = true;
  }

  skipPresent(eve) {
    console.log(eve);
    if (eve == "fromCat") {
      this.createTimeline.cat = null;
      this.spaarksservice.createTimeline = this.createTimeline;
      // this.stepPosition = 'four';
      this.checkLoginToCreate();
      this.spaarksservice.CreateSpaarkSteps.firstSkip = true;
      this.spaarksservice.selectedCreate.selectedCategory = "";
      this.spaarksservice.selectedCreate.selectedSubCategory = "";
    } else if (eve == "fromSubCat") {
      if (this.spaarksservice.selectedCreate.selectedQuestion == "3") {
        this.createTimeline.subcat = "seller";
      } else
        this.createTimeline.subcat = this.spaarksservice.selectedCreate.selectedCategory;
      this.spaarksservice.createTimeline = this.createTimeline;
      // this.stepPosition = 'four'
      this.checkLoginToCreate();
      this.spaarksservice.CreateSpaarkSteps.secondSkip = true;
      if (this.spaarksservice.selectedCreate.selectedQuestion == "3") {
        this.spaarksservice.selectedCreate.selectedSubCategory = "seller";
      } else
        this.spaarksservice.selectedCreate.selectedSubCategory = this.spaarksservice.selectedCreate.selectedCategory;
    }
  }

  clickedCat(cat) {
    this.content = "";
    console.log(cat);
    console.log(this.createTimeline);
    this.createTimeline.cat = cat._id;
    this.createTimeline.subcat = null;
    this.spaarksservice.createTimeline = this.createTimeline;
    if (cat.isTag == true) {
      this.spaarksservice.selectedCreate.selectedCategory = cat.category;
      this.spaarksservice.selectedCreate.categoryId = cat.categoryId;
      this.spaarksservice.selectedCreate.subCategoryId = cat.subCategoryId;
      this.spaarksservice.selectedCreate.selectedSubCategory = cat.category;
      // this.stepPosition = 'four';
      this.checkLoginToCreate();
    } else {
      this.spaarksservice.selectedCreate.selectedCategory = cat.category;
      //Dont update the selected category here, instead update both the category and subcategory while picking subcategory
      this.spaarksservice.selectedCreate.categoryId = cat.categoryId;
      this.spaarksservice.selectedCreate.subCategoryId = cat.subCategoryId;
      this.listshowArr = cat.subCategory.sort((first, sec) => {
        var a = first.subCategory.toUpperCase();
        var b = sec.subCategory.toUpperCase();
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });

      console.log(this.listshowArr);

      this.stepPosition = "three";
      this.spaarksservice.CreateSpaarkSteps.StepState = this.stepPosition;
      this.spaarksservice.CreateSpaarkSteps.firstSkip = false;
      this.selectedArr = this.spaarksservice.selectedCreate;
    }

    this.spaarksservice.CreateSpaarkSteps.Cat = cat.category;
    this.spaarksservice.CreateSpaarkSteps.subCat = cat.subCategoryId;
    this.spaarksservice.CreateSpaarkSteps.isTag = cat.isTag;
    this.spaarksservice.selectedCreate.content = "";
    console.log(this.spaarksservice.CreateSpaarkSteps.Cat);
    console.log(this.spaarksservice.CreateSpaarkSteps.subCat);
    console.log(this.spaarksservice.CreateSpaarkSteps.isTag);
  }

  goToForm() {
    console.log(this.radioValue);

    if (this.radioValue == "forExperienced") {
      console.log("For expeerienced");
      this.stepPosition = "two";
      this.spaarksservice.createTimeline.skilled = this.skilled;
      this.skilled = "true";
      this.spaarksservice.createTimeline.questionNo = "3";
      this.pickedQuestion = "I give a Service";
      this.spaarksservice.createSpaarksMain.pageone = "I-give-a-Service";
      this.spaarksservice.selectedCreate.selectedQuestion = "I give a Service";
      this.spaarksservice.selectedCreate.questionNo = "3";
      //this.spaarksservice.selectedCreate. questionNo="3"
      this.spaarksservice.CreateSpaarkSteps.StepState = "two";
      this.spaarksservice.CreateSpaarkSteps.Cat = "I-give-a-Service";
      this.router.navigateByUrl(
        "newspaark/create/" + "I-give-a-Service".split(" ").join("-")
      );
    } else if (this.radioValue == "forNew") {
      console.log("For new");
      this.stepPosition = "four";
      this.spaarksservice.createTimeline.skilled = this.skilled;
      this.skilled = "false";
    }
  }

  startStepper(subCat, i, cat) {
    console.log(subCat);
    console.log(cat);

    // this.spaarksservice.selectedCreate.selectedCategory = cat.categoryName;
    if (subCat.subCategory) {
      this.spaarksservice.selectedCreate.selectedSubCategory =
        subCat.subCategory;
    } else {
      this.spaarksservice.selectedCreate.selectedSubCategory = subCat;
    }
    // this.stepPosition = 'four';
    this.checkLoginToCreate();
    if (cat.categoryName) {
      this.spaarksservice.CreateSpaarkSteps.Cat = cat.categoryName;
    } else {
      this.spaarksservice.CreateSpaarkSteps.Cat = cat;
    }
    this.spaarksservice.CreateSpaarkSteps.subCat = subCat;

    console.log(this.spaarksservice.CreateSpaarkSteps.Cat);
    console.log(this.spaarksservice.CreateSpaarkSteps.subCat);
    this.spaarksservice.CreateSpaarkSteps.secondSkip = false;
    this.createTimeline.subcat = subCat._id;
    this.spaarksservice.createTimeline = this.createTimeline;
  }

  clickedPreviousCat() {
    this.content = "";
    if (this.createTimeline.questionno == "7") {
      this.createTimeline = {
        feature: "Want-a-Job",
        cat: undefined,
        subcat: undefined,
        questionno: "7",
        skilled: "false",
      };
      this.spaarksservice.createTimeline = this.createTimeline;
      this.stepPosition = "postajob";
      this.spaarksservice.CreateSpaarkSteps.StepState = "postajob";
    } else {
      var tempData = this.spaarksservice.selectedCreate;
      this.spaarksservice.selectedCreate = {...this.spaarksservice.defaultCreate};
      // console.log(this.spaarksservice.selectedCreate);
      this.listshowArr = [];
      this.router.navigateByUrl("newspaark");
    }
  }

  clickedPrevFromPostajob() {
    this.router.navigateByUrl("newspaark");
  }

  clickedPreviousSubCat() {
    if (!this.confirmExit()) return;
    var tempData = this.spaarksservice.selectedCreate;
    console.log(this.spaarksservice.defaultCreate);
    this.spaarksservice.selectedCreate = {...this.spaarksservice.defaultCreate};
    this.spaarksservice.selectedCreate.selectedQuestion =
      tempData.selectedQuestion;
    this.spaarksservice.selectedCreate.featureSelected =
      tempData.featureSelected;
    this.spaarksservice.selectedCreate.questionNo = tempData.questionNo;
    console.log(this.spaarksservice.selectedCreate);
    console.log(this.spaarksservice.defaultCreate);
    this.stepPosition = "two";
  }

  clickedSearch() {
    //  this.allPurposeService.triggerModal.next({ type: 'searchModal', modal: true })
    // this.spaarksservice.quickSpaarkClicked = true;
    //   console.log(this.spaarksservice.quickSpaarkClicked);
    //   this.spaarksservice.selectedCreate.selectedCategory = data.category;
    //   this.spaarksservice.selectedCreate.selectedSubCategory = data.subCategory;
    //   this.spaarksservice.selectedCreate.questionNo = data.questionNo;
    //   this.spaarksservice.quickSpaarkSubj.next('startStepper');
  }

  pressedkey(eve) {
    console.log(eve);
    if (this.content) {
      if (this.content.length == 0) {
        this.listofsearches = [];
        console.log("no searches");
        return;
      }
    }

    this.http
      .get("https://staging-api.ososweb.com/search/" + this.content)
      .subscribe((succe: any) => {
        console.log(succe);
        this.listofsearches = succe.categories;
        this.listofPosts = succe.posts;
      });
  }

  selectedClick(eve) {
    console.log(eve);
    //this.spaarksservice.quickSpaarkClicked = true;
    console.log(this.spaarksservice.quickSpaarkClicked);
    //alert(this.spaarksservice.quickSpaarkClicked);
    this.spaarksservice.selectedCreate.selectedCategory = eve.category;
    this.spaarksservice.selectedCreate.selectedSubCategory =
      eve.subCategoryFinal;
    this.spaarksservice.selectedCreate.questionNo = "3";
    this.spaarksservice.selectedCreate.categoryId = eve.categoryId;
    this.spaarksservice.selectedCreate.subCategoryId = eve.categoryId;
    if (this.spaarksservice.quickSpaarkClicked) {
      this.spaarksservice.quickSpaarkSubj.next("startStepper");
    }

    var i = 0;
    this.startStepper(
      this.spaarksservice.selectedCreate.selectedSubCategory,
      i,
      this.spaarksservice.selectedCreate.selectedCategory
    );
    // this.clickedCat(eve);
    //   let arrays = []
    //   try {
    //       if (localStorage.getItem('searchedArr')) {
    //           arrays = JSON.parse(localStorage.getItem('searchedArr'))
    //       }else{
    //           arrays=[]
    //       }
    //   } catch{ }
    //   let gun=[] ;
    // if(arrays.length>0){
    //   arrays.forEach((val,ind)=>{
    //       if(val.subCategoryId){
    //           if(val.preview==eve.preview){
    //               gun.push(eve)
    //           }
    //       }
    //   })
    // }else{
    //   //gun.push(eve);
    // }

    //   if(gun){
    //       if(gun.length==0){

    //           arrays = [eve, ...arrays]
    //           localStorage.setItem('searchedCat', JSON.stringify(eve));

    //           this.spaarksservice.currentSearchedCat = eve;
    //           this.spaarksservice.searchedCatArr = arrays;
    //           console.log((this.spaarksservice.searchedCatArr));

    //           localStorage.setItem('searchedArr', JSON.stringify(arrays))
    //           this.showCat.emit(eve);
    //       }
    //   }
  }

  confirmExit(): Boolean {
    if (this.spaarksservice.isClickedFromAnnounce) {
      return true;
    }
    if (this.stepPosition == "two") {
      return true;
    }
    if (
      this.spaarksservice.selectedCreate.content == "" &&
      this.spaarksservice.selectedCreate.fileAr.length == 0 &&
      this.spaarksservice.selectedCreate.imageList.length == 0
    )
      return true;
    var des = window.confirm("Are you sure, you want to discard this Spaark?");
    return des;
  }

  ngOnDestroy() {
    this.routingEvent.unsubscribe();
  }
}
