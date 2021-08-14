import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatModallComponent } from './chat-modall.component';

describe('ChatModallComponent', () => {
  let component: ChatModallComponent;
  let fixture: ComponentFixture<ChatModallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatModallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatModallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
