import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSprintsListPageComponent } from './project-sprints-list-page.component';

describe('ProjectSprintsListPageComponent', () => {
  let component: ProjectSprintsListPageComponent;
  let fixture: ComponentFixture<ProjectSprintsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectSprintsListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSprintsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
