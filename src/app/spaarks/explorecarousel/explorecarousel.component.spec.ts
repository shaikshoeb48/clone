import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorecarouselComponent } from './explorecarousel.component';

describe('ExplorecarouselComponent', () => {
  let component: ExplorecarouselComponent;
  let fixture: ComponentFixture<ExplorecarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorecarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorecarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
