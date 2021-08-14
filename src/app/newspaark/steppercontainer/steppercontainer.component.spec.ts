import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SteppercontainerComponent } from './steppercontainer.component';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('SteppercontainerComponent', () => {
  let component: SteppercontainerComponent;
  let fixture: ComponentFixture<SteppercontainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SteppercontainerComponent ],
      imports: [MatStepperModule, BrowserAnimationsModule, RouterTestingModule, HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SteppercontainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
