import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPersonListComponent } from './chat-person-list.component';

describe('ChatPersonListComponent', () => {
  let component: ChatPersonListComponent;
  let fixture: ComponentFixture<ChatPersonListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatPersonListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatPersonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
