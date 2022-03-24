import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintRowComponent } from './sprint-row.component';

describe('SprintRowComponent', () => {
  let component: SprintRowComponent;
  let fixture: ComponentFixture<SprintRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SprintRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
