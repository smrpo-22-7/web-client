import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInitialsIconComponent } from './user-initials-icon.component';

describe('UserInitialsIconComponent', () => {
  let component: UserInitialsIconComponent;
  let fixture: ComponentFixture<UserInitialsIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserInitialsIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInitialsIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
