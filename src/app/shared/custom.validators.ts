import { AbstractControl } from "@angular/forms";

export class CustomValidators{

    /*
    Using javascript closure concept to make this validator function return another function.
    We pass domain name as parameter of outer function and make use of it in inner function

    Function to serve as custom validator to validate user email domain against the domain we have specified,
    return key value pair if validation error found, else return null
    */
    static emailDomain(domainName: string){
        return (control: AbstractControl): {[key: string]: any} | null => {
        if(control.value === "")
        {
            return null; // nothing to validate, so no error to display
        }
        const email: string = control.value;
        
        const domain = email.substring(email.lastIndexOf('@') + 1); // there could be multiple @ sympbol is email so we will start from the last occurance of @ symbol
        if(domain.toLowerCase() === domainName.toLowerCase()){
            return null; // return null when matched, means no validation error
        }
        else{
            return { 'emailDomain': true}; // validation error
        }
        };
    }

    /*
    Function to serve as custom validator to validate if email and confirm email have the same email specified
    return key value pair if validation error found, else return null
    */
    static matchEmail(group: AbstractControl): {[key: string]: any} | null {
        const emailControl = group.get('email');
        const confirmEmailControl = group.get('confirmEmail');

        // emailControl?.pristine: the user hasn't typed anything then return null
        if(emailControl && confirmEmailControl && emailControl.value === confirmEmailControl.value || emailControl?.pristine) {
            return null; // return null when matched, means no validation error
        }
        else{
            return { 'emailMismatch': true}; // validation error
        }
    }



}