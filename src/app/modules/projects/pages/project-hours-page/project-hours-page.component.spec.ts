import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectHoursPageComponent } from './project-hours-page.component';

describe('ProjectHoursPageComponent', () => {
  let component: ProjectHoursPageComponent;
  let fixture: ComponentFixture<ProjectHoursPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectHoursPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectHoursPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
