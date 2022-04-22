import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WallPostDetailsComponent } from './wall-post-details.component';

describe('WallPostDetailsComponent', () => {
  let component: WallPostDetailsComponent;
  let fixture: ComponentFixture<WallPostDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WallPostDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WallPostDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
