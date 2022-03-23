import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonLandingComponent } from './anon-landing.component';

describe('AnonLandingComponent', () => {
  let component: AnonLandingComponent;
  let fixture: ComponentFixture<AnonLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnonLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
