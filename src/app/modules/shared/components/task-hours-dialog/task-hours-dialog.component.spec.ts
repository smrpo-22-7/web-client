import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskHoursDialogComponent } from './task-hours-dialog.component';

describe('TaskHoursDialogComponent', () => {
  let component: TaskHoursDialogComponent;
  let fixture: ComponentFixture<TaskHoursDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskHoursDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskHoursDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
