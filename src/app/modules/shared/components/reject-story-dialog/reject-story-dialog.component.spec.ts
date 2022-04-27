import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectStoryDialogComponent } from './reject-story-dialog.component';

describe('RejectStoryDialogComponent', () => {
  let component: RejectStoryDialogComponent;
  let fixture: ComponentFixture<RejectStoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectStoryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectStoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
