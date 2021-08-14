import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessChatComponent } from './business-chat.component';

describe('BusinessChatComponent', () => {
  let component: BusinessChatComponent;
  let fixture: ComponentFixture<BusinessChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
