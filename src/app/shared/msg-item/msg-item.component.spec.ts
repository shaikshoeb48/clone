import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgItemComponent } from './msg-item.component';

describe('MsgItemComponent', () => {
  let component: MsgItemComponent;
  let fixture: ComponentFixture<MsgItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
