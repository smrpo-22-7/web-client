import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEditFormPageComponent } from './project-edit-form-page.component';

describe('ProjectEditFormPageComponent', () => {
  let component: ProjectEditFormPageComponent;
  let fixture: ComponentFixture<ProjectEditFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectEditFormPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEditFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
