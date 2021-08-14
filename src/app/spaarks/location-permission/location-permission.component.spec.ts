import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationPermissionComponent } from './location-permission.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('LocationPermissionComponent', () => {
  let component: LocationPermissionComponent;
  let fixture: ComponentFixture<LocationPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationPermissionComponent ],
      imports:[RouterTestingModule, HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
