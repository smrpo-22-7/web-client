import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDocsFormPageComponent } from './project-docs-form-page.component';

describe('ProjectDocsFormPageComponent', () => {
  let component: ProjectDocsFormPageComponent;
  let fixture: ComponentFixture<ProjectDocsFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDocsFormPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDocsFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
