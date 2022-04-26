import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ProjectStoriesPageComponent } from "./project-stories-page.component";

describe("ProjectStoriesPageComponent", () => {
    let component: ProjectStoriesPageComponent;
    let fixture: ComponentFixture<ProjectStoriesPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ProjectStoriesPageComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectStoriesPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
