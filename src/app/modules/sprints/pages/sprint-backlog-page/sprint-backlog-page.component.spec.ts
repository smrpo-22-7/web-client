import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintBacklogPageComponent } from './sprint-backlog-page.component';

describe('SprintBacklogPageComponent', () => {
  let component: SprintBacklogPageComponent;
  let fixture: ComponentFixture<SprintBacklogPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SprintBacklogPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintBacklogPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
