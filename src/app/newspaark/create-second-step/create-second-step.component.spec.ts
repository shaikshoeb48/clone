import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSecondStepComponent } from './create-second-step.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('CreateSecondStepComponent', () => {
  let component: CreateSecondStepComponent;
  let fixture: ComponentFixture<CreateSecondStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSecondStepComponent ],
      imports:[RouterTestingModule, HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSecondStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
 
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
