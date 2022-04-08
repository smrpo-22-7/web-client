import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "prettifyArray"
})
export class PrettifyArrayPipe implements PipeTransform {
    
    transform(value: any[]): string {
        return value.map(elem => {
            const strElem = String(elem);
            return strElem.charAt(0).toUpperCase() + strElem.slice(1);
        }).join(", ");
    }
    
}
