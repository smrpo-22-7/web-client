import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "friendlyTime"
})
export class FriendlyTimePipe implements PipeTransform {
    
    transform(value: number): string {
        if (value <= 0) {
            return `0h`;
        }
        const decimal = (value % 1) * 60;
        const integer = Math.trunc(value);
        return `${integer > 0 ? integer + 'h ' : ''}${decimal > 0 ? decimal + 'min' : ''}`
    }
    
    
    
}
