import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessEnqComponent } from './business-enq.component';

describe('BusinessEnqComponent', () => {
  let component: BusinessEnqComponent;
  let fixture: ComponentFixture<BusinessEnqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessEnqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessEnqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
