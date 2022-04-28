import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "shortString"
})
export class ShortStringPipe implements PipeTransform {
    
    transform(value: string, len: number = 10): string {
        if (value.length > len) {
            return value.substring(0, len) + "...";
        }
        return value;
    }
    
}
