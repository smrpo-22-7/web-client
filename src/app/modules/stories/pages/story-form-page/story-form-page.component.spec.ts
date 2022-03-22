import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StoryFormPageComponent } from "./story-form-page.component";

describe("StoryFormPageComponent", () => {
    let component: StoryFormPageComponent;
    let fixture: ComponentFixture<StoryFormPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ StoryFormPageComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StoryFormPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
