import { Pipe, PipeTransform } from "@angular/core";
import { capitalize } from "@utils";

@Pipe({
    name: "prettifyArray"
})
export class PrettifyArrayPipe implements PipeTransform {
    
    transform(value: any[]): string {
        return value.map(elem => {
            const strElem = String(elem);
            return capitalize(strElem);
        }).join(", ");
    }
    
}
