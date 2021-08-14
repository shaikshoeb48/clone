import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllpurposelistComponent } from './allpurposelist.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('AllpurposelistComponent', () => {
  let component: AllpurposelistComponent;
  let fixture: ComponentFixture<AllpurposelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllpurposelistComponent ],
      imports:[RouterTestingModule, HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllpurposelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
