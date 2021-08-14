import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPersonSpecificComponent } from './chat-person-specific.component';
import { MatMenuModule } from '@angular/material/menu';

describe('ChatPersonSpecificComponent', () => {
  let component: ChatPersonSpecificComponent;
  let fixture: ComponentFixture<ChatPersonSpecificComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChatPersonSpecificComponent],
      imports: [MatMenuModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatPersonSpecificComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
