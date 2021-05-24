import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup, AbstractControl, EmailValidator, FormArray } from '@angular/forms';
import { CustomValidators } from  '../../shared/custom.validators';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { IEmployee } from '../IEmployee';
import { ISkill } from '../ISkill';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})

export class CreateEmployeeComponent implements OnInit {

  faWindowClose = faWindowClose;

  employeeForm = this.formBuilder.group({
    fullName: new FormControl(),
    email: new FormControl()
  });

  fullNameLength: number = 0;

  domainWeWantToValidateAgainst: string = "test.com";

  // Contain validation message for each validation for each form control
  // [key: string]: any: defining the type of index/key this object accepts(string in our case) and the type of value it accepts(any in our case)
  validationMessages: { [key: string]: any } =  {
    'fullName' : {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be greater less than 30 characters.',
    },
    'email': {
      'required': 'Email is required',
      'emailDomain': 'Email domain must be ' + this.domainWeWantToValidateAgainst // error message for our created custom validation error
    },
    'confirmEmail': {
      'required': 'Confirm Email is required.'
    },
    'emailGroup': {
      'emailMismatch' : 'Email and Confirm Email do not match.'
    },
    'phone': {
      'required': 'Phone is required.'
    }
  };

  // Will be assigned validation message based on the field which fails validaton and which validation type it fails
  formErrors: { [key: string]: any} = {
  }


   /*
   FormBuilder class provides a syntactic sugar or another way of declaring the formgroup, forcontrol and array instance.
   It must be injected into the class's constructor first to use it elsewere on the form
  */
  constructor(private formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private employeeService: EmployeeService
    ) {
    this.createForm();
  }

  ngOnInit(): void {
    
    this.employeeForm.controls.contactPreference.valueChanges.subscribe((data: string) => {
      this.onContactPreferenceChange(data);
    })
    
    // Subscribing to value change event of form group and performing action on value change
    this.employeeForm.valueChanges.subscribe((value: any) => {
      this.logValidationErrors(this.employeeForm);
    })  

    const empId = Number(this._route.snapshot.paramMap.get('id'));
    this._route.paramMap.subscribe(params => {
      if(empId){
        this.getEmployee(empId);
      }
    });
  }

  getEmployee(id: number){
    this.employeeService.getEmployee(id).subscribe(
      (employee: IEmployee) => this.editEmployee(employee),
      (err: any) => console.log(err)
    );
  }

  editEmployee(employee: IEmployee){
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    })
  }

  addSkillFormGroup(): FormGroup {
    return this.formBuilder.group({
      skillName: ['', Validators.required],
      proficiency: ['', Validators.required],
      experienceInYears: ['', Validators.required]
    })
  }

  addSkillButtonClick(): void{
    (this.employeeForm.get('skills') as FormArray).push(this.addSkillFormGroup());
  }
  
  removeSkillButtonClick(skillGroupIndex: number): void{
    (this.employeeForm.get('skills') as FormArray).removeAt(skillGroupIndex);
  }


 createForm(){
 
  this.employeeForm = this.formBuilder.group({
    fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    contactPreference: ['email'],
    emailGroup: this.formBuilder.group({
      email: ['', [Validators.required, CustomValidators.emailDomain(this.domainWeWantToValidateAgainst)]], // adding custom validator
      confirmEmail: ['', Validators.required]
    }, { validator: CustomValidators.matchEmail} ),
    phone: [''], // will dynamically add validation
    // Creating nested formgroup skills
    skills: this.formBuilder.array([
      this.addSkillFormGroup()
    ])
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
  const emailGroupControl = this.employeeForm.controls.emailGroup;
  const emailControl = emailGroupControl.get('email');
  const confirmEmailControl = emailGroupControl.get('confirmEmail');

  if(selectedValue === 'phone')
  {
    phoneControl.setValidators(Validators.required);
    emailGroupControl.clearValidators();
    if(emailControl != null)  {
      emailControl.clearValidators();
    }
    if(confirmEmailControl != null)  {
      confirmEmailControl.clearValidators();
    }
  }
  else
  {
    phoneControl.clearValidators();
    emailGroupControl.setValidators(CustomValidators.matchEmail);
    if(emailControl != null)  {
      emailControl.setValidators([Validators.required, CustomValidators.emailDomain(this.domainWeWantToValidateAgainst)]);
    }
    if(confirmEmailControl != null)  {
      confirmEmailControl.setValidators(Validators.required);
    }
  }
  // Immediatly call the validate event on the control
  emailGroupControl.updateValueAndValidity();
  if(emailControl != null)  {
    emailControl.updateValueAndValidity();
  }
  if(confirmEmailControl != null)  {
    confirmEmailControl.updateValueAndValidity();
  }
  phoneControl.updateValueAndValidity();
 }

 // Passing employeeForm as default value
 logValidationErrors(group: FormGroup = this.employeeForm): void {
  // loop through each key in the FormGroup
  Object.keys(group.controls).forEach((key: string) => {
    // Get a reference to the control using the FormGroup.get() method
    const abstractFormControl = group.get(key);

    // Clear the existing validation error messages, if any
    this.formErrors[key] = '';
    /*
      Check if the control is not valid and it has either been touched or its value changed and also if the control
      is not empty string, in that case display the validation
      error message for that control only
    */
    if(abstractFormControl && !abstractFormControl.valid && abstractFormControl.touched || abstractFormControl?.dirty
      || abstractFormControl?.value !== '' ){
      // get all the validation message for particular form control that has failed the vaildation(since we are checking valid condition in if)
      const messages =  this.validationMessages[key];
      for(const errorKey in abstractFormControl?.errors)
      {
        /* Get the validation message corresponding to the failed validation type(eg, required, minlength or maxlength.) identified by errorKey, 
        for particular form control(identified by key) and assign it to the error message field against the form control name error field in formErrors.
        The UI will bind to this object to display the validation errors.
        */
        this.formErrors[key] += messages[errorKey] + ' ';
      }
    }

    /* If the abstractFormControl is an instance of FormGroup i.e a nested FormGroup
    then recursively call this same method (logKeyValuePairs) passing it
    the FormGroup so we can get to the form controls in it*/
    if(abstractFormControl instanceof FormGroup && abstractFormControl)
    {
      this.logValidationErrors(abstractFormControl);
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

  onLoadDataClick(): void
  {
    const formArray = this.formBuilder.array([
      new FormControl('John', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('Mike', Validators.required),
    ]);
    const formGroup= this.formBuilder.group([
      new FormControl('John', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('Mike', Validators.required),
    ]);

    console.log(formArray.value);
    console.log(formGroup.value);

    for (const control of formArray.controls)
    {
      if(control instanceof FormControl)
      {
        console.log("It is a form control");
      }
      if(control instanceof FormGroup)
      {
        console.log("It is a form group");
      }
      if(control instanceof FormArray)
      {
        console.log("It is a form array");
      }
    }

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
    // this.logValidationErrors(this.employeeForm);
    // console.log(this.formErrors);
  }

  // getter for skills formarray to be used in html
  get skills(): FormArray{
    return (this.employeeForm.get('skills') as FormArray)
  }

  onSubmit(): void {
    console.log(this.employeeForm.touched);
    console.log(this.employeeForm.value);

    console.log(this.employeeForm.controls.fullName.touched);
    console.log(this.employeeForm.controls.fullName.errors);
  }

}
