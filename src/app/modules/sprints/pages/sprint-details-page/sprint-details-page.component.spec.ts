import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintDetailsPageComponent } from './sprint-details-page.component';

describe('SprintDetailsPageComponent', () => {
  let component: SprintDetailsPageComponent;
  let fixture: ComponentFixture<SprintDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SprintDetailsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
