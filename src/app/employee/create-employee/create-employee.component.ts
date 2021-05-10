import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employeeForm = this.formBuilder.group({
    fullName: new FormControl(),
    email: new FormControl()
  });

  fullNameLength: number = 0;

  // Contain validation message for each validation for each form control
  // [key: string]: any: defining the type of index/key this object accepts(string in our case) and the type of value it accepts(any in our case)
  validationMessages: { [key: string]: any } =  {
    'fullName' : {
      'required': 'Full Name is required',
      'minlength': 'Full Name must be greater than 2 characters',
      'maxlength': 'Full Name must be greater less than 30 characters',
    },
    'email': {
      'required': 'Email is required'
    },
    'phone': {
      'required': 'Phone is required'
    },
    'skillName': {
      'required': 'Skill Name is required'
    },
    'experienceInYears': {
      'required': 'Experience (In Years) is required'
    },
    'proficiency': {
      'required': 'Proficiency is required'
    }
  };

  // Will be assigned validation message based on the field which fails validaton and which validation type it fails
  formErrors: { [key: string]: any} = {
    'fullName' : '',
    'email': '',
    'phone': '',
    'skillName': '',
    'experienceInYears': '',
    'proficiency': ''
  }


   /*
   FormBuilder class provides a syntactic sugar or another way of declaring the formgroup, forcontrol and array instance.
   It must be injected into the class's constructor first to use it elsewere on the form
  */
  constructor(private formBuilder: FormBuilder) {
    this.createForm();
  }

 createForm(){
 
  this.employeeForm = this.formBuilder.group({
    fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    contactPreference: ['email'],
    email: ['', Validators.required],
    phone: [''], // will dynamically add validation
    // Creating nested formgroup skills
    skills: this.formBuilder.group({
      skillName: ['', Validators.required],
      proficiency: ['', Validators.required],
      experienceInYears: ['', Validators.required]
    })
  });

 // Subscribing to value change event of form group and performing action on value change
//  this.employeeForm.valueChanges.subscribe((value: any) => {
//   console.log(JSON.stringify(value));
//  })  

//   // Subscribing to value change event of form control and performing action on value change
//   this.employeeForm.controls.fullName.valueChanges.subscribe((value: string) => {
//     return this.fullNameLength = value.length;
//   })

 }

 /*
 Based on the contact preference, dynamically add the validation to the selected contact mode and remove the validator from the not selected one
 */
 onContactPreferenceChange(selectedValue: string) {
  const phoneControl = this.employeeForm.controls.phone;
  const emailControl = this.employeeForm.controls.email;
  if(selectedValue === 'phone')
  {
    phoneControl.setValidators(Validators.required);
    emailControl.clearValidators();
  }
  else
  {
    phoneControl.clearValidators();
    emailControl.setValidators(Validators.required);
  }
  // Immediatly call the validate event on the control
  emailControl.updateValueAndValidity();
  phoneControl.updateValueAndValidity();
 }


 // Passing employeeForm as default value
 logValidationErrors(group: FormGroup = this.employeeForm): void {
  // loop through each key in the FormGroup
  Object.keys(group.controls).forEach((key: string) => {
    // Get a reference to the control using the FormGroup.get() method
    const abstractFormControl = group.get(key);
    /* If the control is an instance of FormGroup i.e a nested FormGroup
    then recursively call this same method (logKeyValuePairs) passing it
    the FormGroup so we can get to the form controls in it*/
    if(abstractFormControl instanceof FormGroup && abstractFormControl)
    {
      this.logValidationErrors(abstractFormControl);
    }
    else 
    {
      // Clear the existing validation error messages, if any
      this.formErrors[key] = '';
      /*
        Check if the control is not valid and it has either been touched or its value changed, in that case display the validation
        error message for that control only
      */
      if(abstractFormControl && !abstractFormControl.valid && abstractFormControl.touched || abstractFormControl?.dirty){
        // get all the validation message for particular form control that has failed the vaildation(since we are checking valid condition in if)
        const messages =  this.validationMessages[key];
        for(const errorKey in abstractFormControl.errors)
        {
          /* Get the validation message corresponding to the failed validation type(eg, required, minlength or maxlength.) identified by errorKey, 
          for particular form control(identified by key) and assign it to the error message field against the form control name error field in formErrors.
          The UI will bind to this object to display the validation errors.
          */
          this.formErrors[key] += messages[errorKey] + ' ';
        }
      }
    }
  });
} 

 logKeyValuePairs(group: FormGroup): void {
    // loop through each key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      // Get a reference to the control using the FormGroup.get() method
      const abstractFormControl = group.get(key);
      /* If the control is an instance of FormGroup i.e a nested FormGroup
      then recursively call this same method (logKeyValuePairs) passing it
      the FormGroup so we can get to the form controls in it*/
      if(abstractFormControl instanceof FormGroup && abstractFormControl)
      {
        this.logKeyValuePairs(abstractFormControl);
        // Disabling the nested form group only
        // abstractFormControl.disable();
      }
      else if(abstractFormControl)
      {
        // If the control is not a FormGroup then we know it's a FormControl
        console.log('Key = '+ key + ", Value = " + abstractFormControl.value );
        // Disabling all the form controls
        abstractFormControl.disable();
      }
    });
  } 

  ngOnInit(): void {
    
  this.employeeForm.controls.contactPreference.valueChanges.subscribe((data: string) => {
    this.onContactPreferenceChange(data);
  })
  
  // Subscribing to value change event of form group and performing action on value change
  this.employeeForm.valueChanges.subscribe((value: any) => {
    this.logValidationErrors(this.employeeForm);
  })  
  }

  onLoadDataClick(): void
  {
    /*
     * when setValue is used then all control values MUST be given, we cannot leave any property out(eg. not giving value for skills will give error) 
     * when patchValue is used then we can update a subset of form controls Or we CAN update all values also
    */
    // this.employeeForm.setValue({
    //   fullName: "Jack",
    //   email: "Jack@abcdomain.com"
    //   /* skills: {
    //     skillName: "C#",
    //     proficiency: "advanced",
    //     experienceInYears: "6"
    //   } */
    // })

    // this.employeeForm.patchValue({
    //   fullName: "Jack",
    //   email: "Jack@abcdomain.com",
    //   skills: {
    //     skillName: "C#",
    //     proficiency: "advanced",
    //     experienceInYears: "6"
    //   } 
    // })

    // this.logKeyValuePairs(this.employeeForm);
    this.logValidationErrors(this.employeeForm);
    console.log(this.formErrors);
  }

  onSubmit(): void {
    console.log(this.employeeForm.touched);
    console.log(this.employeeForm.value);

    console.log(this.employeeForm.controls.fullName.touched);
    console.log(this.employeeForm.controls.fullName.errors);
  }

}
