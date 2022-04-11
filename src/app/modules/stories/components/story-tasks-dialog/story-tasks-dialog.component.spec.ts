import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryTasksDialogComponent } from './story-tasks-dialog.component';

describe('StoryTasksDialogComponent', () => {
  let component: StoryTasksDialogComponent;
  let fixture: ComponentFixture<StoryTasksDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoryTasksDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryTasksDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
