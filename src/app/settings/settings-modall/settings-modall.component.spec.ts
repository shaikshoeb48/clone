import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsModallComponent } from './settings-modall.component';

describe('SettingsModallComponent', () => {
  let component: SettingsModallComponent;
  let fixture: ComponentFixture<SettingsModallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsModallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsModallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
