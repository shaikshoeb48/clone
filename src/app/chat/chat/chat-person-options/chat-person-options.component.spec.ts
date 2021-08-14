import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPersonOptionsComponent } from './chat-person-options.component';

describe('ChatPersonOptionsComponent', () => {
  let component: ChatPersonOptionsComponent;
  let fixture: ComponentFixture<ChatPersonOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatPersonOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatPersonOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
