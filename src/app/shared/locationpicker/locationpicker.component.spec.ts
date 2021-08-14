import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationpickerComponent } from './locationpicker.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('LocationpickerComponent', () => {
  let component: LocationpickerComponent;
  let fixture: ComponentFixture<LocationpickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationpickerComponent ],
      imports:[RouterTestingModule, HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationpickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
