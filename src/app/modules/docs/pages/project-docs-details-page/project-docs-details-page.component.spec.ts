import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDocsDetailsPageComponent } from './project-docs-details-page.component';

describe('ProjectDocsDetailsPageComponent', () => {
  let component: ProjectDocsDetailsPageComponent;
  let fixture: ComponentFixture<ProjectDocsDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDocsDetailsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDocsDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
