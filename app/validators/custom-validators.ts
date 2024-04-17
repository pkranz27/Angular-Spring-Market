import { FormControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
    //whitespace validation
    static notOnlyWhitespace(control: FormControl): ValidationErrors{
        // checking if the string has only white space 

        if((control.value != null) && (control.value.trim().length === 0)){
             // invalid, return errror object
             return{'notOnlyWhiteSpace': true};
        }
        else{
            // if valid, return null
            return null;
        }
    }
}
