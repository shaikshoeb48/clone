import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSpecificContainerComponent } from './chat-specific-container.component';

describe('ChatSpecificContainerComponent', () => {
  let component: ChatSpecificContainerComponent;
  let fixture: ComponentFixture<ChatSpecificContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatSpecificContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatSpecificContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
