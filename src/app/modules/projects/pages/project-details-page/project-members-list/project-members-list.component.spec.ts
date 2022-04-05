import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMembersListComponent } from './project-members-list.component';

describe('ProjectMembersListComponent', () => {
  let component: ProjectMembersListComponent;
  let fixture: ComponentFixture<ProjectMembersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectMembersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMembersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
