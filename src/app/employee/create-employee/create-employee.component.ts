import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employeeForm = new FormGroup({
    fullName: new FormControl(),
    email: new FormControl()
  });

  constructor(private formBuilder: FormBuilder) {
    this.createForm();
  }

 createForm(){
  this.employeeForm = this.formBuilder.group({
    fullName: '',
    email: ''
  });
 }

  ngOnInit(): void {
   
  }

  onSubmit(): void {
    console.log(this.employeeForm.touched);
    console.log(this.employeeForm.value);

    console.log(this.employeeForm.controls.fullName.touched);
  }

}
