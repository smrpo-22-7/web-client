import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WallPostFormComponent } from './wall-post-form.component';

describe('WallPostFormComponent', () => {
  let component: WallPostFormComponent;
  let fixture: ComponentFixture<WallPostFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WallPostFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WallPostFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
