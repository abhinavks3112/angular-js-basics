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
    email: [''],
    // Creating nested formgroup skills
    skills: this.formBuilder.group({
      skillName: [''],
      proficiency: ['beginner'],
      experienceInYears: ['']
    })
  });

 // Subscribing to value change event of form group and performing action on value change
 this.employeeForm.valueChanges.subscribe((value: any) => {
  return console.log(JSON.stringify(value));
 })  

//   // Subscribing to value change event of form control and performing action on value change
//   this.employeeForm.controls.fullName.valueChanges.subscribe((value: string) => {
//     return this.fullNameLength = value.length;
//   })

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

    this.employeeForm.patchValue({
      fullName: "Jack",
      email: "Jack@abcdomain.com",
      skills: {
        skillName: "C#",
        proficiency: "advanced",
        experienceInYears: "6"
      } 
    })

    this.logKeyValuePairs(this.employeeForm);
  }

  onSubmit(): void {
    console.log(this.employeeForm.touched);
    console.log(this.employeeForm.value);

    console.log(this.employeeForm.controls.fullName.touched);
    console.log(this.employeeForm.controls.fullName.errors);
  }

}
