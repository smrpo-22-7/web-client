import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "friendlyDate"
})
export class FriendlyDatePipe implements PipeTransform {
    
    transform(value: Date | string): string {
        if (typeof value === "string") {
            value = new Date(value);
        }
        const seconds = Math.floor((new Date().getTime() - value.getTime()) / 1000);
        let interval = seconds / 31536000;
    
        if (interval > 1) {
            return Math.floor(interval) + " years ago";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + " months ago";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + " days ago";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + " hours ago";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";
    }
    
}
