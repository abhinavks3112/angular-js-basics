import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

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
  }

  onSubmit(): void {
    console.log(this.employeeForm.touched);
    console.log(this.employeeForm.value);

    console.log(this.employeeForm.controls.fullName.touched);
    console.log(this.employeeForm.controls.fullName.errors);
  }

}
