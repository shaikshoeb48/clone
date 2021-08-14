import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreModallComponent } from './explore-modall.component';

describe('ExploreModallComponent', () => {
  let component: ExploreModallComponent;
  let fixture: ComponentFixture<ExploreModallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreModallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreModallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
