import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryListHeaderComponent } from './story-list-header.component';

describe('StoryListHeaderComponent', () => {
  let component: StoryListHeaderComponent;
  let fixture: ComponentFixture<StoryListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoryListHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
