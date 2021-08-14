import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPersonItemComponent } from './chat-person-item.component';

describe('ChatPersonItemComponent', () => {
  let component: ChatPersonItemComponent;
  let fixture: ComponentFixture<ChatPersonItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatPersonItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatPersonItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
