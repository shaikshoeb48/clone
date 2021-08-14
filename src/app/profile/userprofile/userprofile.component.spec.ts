import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserprofileComponent } from './userprofile.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { SpaarksService } from '../../spaarks.service';

fdescribe('UserprofileComponent', () => {
  let component: UserprofileComponent;
  let fixture: ComponentFixture<UserprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserprofileComponent],
      imports: [RouterTestingModule, HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should use the isAuthenticated from the service", () => {
    const spaark = fixture.debugElement.injector.get(SpaarksService);
    fixture.detectChanges();
    expect(spaark.authData.isAuthenticated).toEqual(component.isAuthed);
  });
});
