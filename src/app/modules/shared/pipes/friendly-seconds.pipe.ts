import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "friendlySeconds"
})
export class FriendlySecondsPipe implements PipeTransform {
    
    transform(value: number): string {
        const {hours, minutes, seconds} = this.secondsToTime(value);
        return `${hours > 0 ? this.stringify(hours) + ":" : ""}${this.stringify(minutes)}:${this.stringify(seconds)}`
    }
    
    stringify(value: number): string {
        return value.toString(10).padStart(2, "0");
    }
    
    secondsToTime(secs: number) {
        secs = Math.round(secs);
        const hours = Math.floor(secs / (60 * 60));
        
        const divisor_for_minutes = secs % (60 * 60);
        const minutes = Math.floor(divisor_for_minutes / 60);
        
        const divisor_for_seconds = divisor_for_minutes % 60;
        const seconds = Math.ceil(divisor_for_seconds);
        
        return {
            hours,
            minutes,
            seconds
        };
    }
    
}
