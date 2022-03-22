import { FormGroup, ValidationErrors } from "@angular/forms";

export function validateDates(formGroup: FormGroup): ValidationErrors | null {
    const startDate: string = formGroup.controls["startdate"].value;
    console.log(startDate);

    //poslji to ISO obliko na bazo:
    //if (startDate) {const cekiram = new Date(startDate).toISOString();
    //   console.log(cekiram);}

    const endDate: string = formGroup.controls["enddate"].value;

    if (startDate !== null && endDate !== null) {
        if (startDate.length > 0 || endDate.length > 0) {
            if ((new Date(startDate).getTime() > new Date(endDate).getTime())) {
                console.log("wtf");
                return {
                    datesNotGood: true,
                };
            }
        }
    }
    return null;


}