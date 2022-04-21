import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
    selector: "[numbersOnly]"
})
export class NumbersOnlyDirective {
    @Input()
    public numbersOnly: boolean = true;
    
    private navigationKeys: Array<string> = ["Backspace", "Delete", "Tab"]; //Add keys as per requirement
    
    constructor(private elemRef: ElementRef) {
    
    }
    
    @HostListener("keydown", ["$event"])
    private onKeyDown(e: KeyboardEvent) {
        if (
            // Allow: Delete, Backspace, Tab, Escape, Enter, etc
            this.navigationKeys.indexOf(e.key) > -1 ||
            (e.key === "a" && e.ctrlKey) || // Allow: Ctrl+A
            (e.key === "c" && e.ctrlKey) || // Allow: Ctrl+C
            (e.key === "v" && e.ctrlKey) || // Allow: Ctrl+V
            (e.key === "x" && e.ctrlKey) || // Allow: Ctrl+X
            (e.key === "a" && e.metaKey) || // Cmd+A (Mac)
            (e.key === "c" && e.metaKey) || // Cmd+C (Mac)
            (e.key === "v" && e.metaKey) || // Cmd+V (Mac)
            (e.key === "x" && e.metaKey) // Cmd+X (Mac)
        ) {
            return;  // let it happen, don't do anything
        }
        // Ensure that it is a number and stop the keypress
        if (e.key === " " || isNaN(Number(e.key))) {
            e.preventDefault();
        }
    }
}
