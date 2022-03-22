import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SprintFormPageComponent } from "./sprint-form-page.component";

describe("SprintFormPageComponent", () => {
    let component: SprintFormPageComponent;
    let fixture: ComponentFixture<SprintFormPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ SprintFormPageComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SprintFormPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
