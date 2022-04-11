import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryListContentComponent } from './story-list-content.component';

describe('StoryListContentComponent', () => {
  let component: StoryListContentComponent;
  let fixture: ComponentFixture<StoryListContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoryListContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryListContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
