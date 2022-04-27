import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourRowComponent } from './hour-row.component';

describe('HourRowComponent', () => {
  let component: HourRowComponent;
  let fixture: ComponentFixture<HourRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HourRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HourRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
