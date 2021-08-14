import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRequestContainerComponent } from './chat-request-container.component';

describe('ChatRequestContainerComponent', () => {
  let component: ChatRequestContainerComponent;
  let fixture: ComponentFixture<ChatRequestContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatRequestContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatRequestContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
