import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TermSuggestionFormService } from '../../service/term-suggestion-form.service';
import { ChangeDetectionStrategy } from '@angular/compiler';

// interface for core form structure
interface FormData {
  formName: string;
  formType: string;
  recipientEmail: string;
  sections: Section[];

}

// interface for the sections of the form
interface Section {
  name: string;
  label: string;
  instructions?: Instruction[];
  fields: Field[];
}

// interface for instruction parts
interface Instruction {
  text: string;
  link?: string;
}

// interface for the fields of the form
interface Field {
  name: string;
  label?: string;
  type?: string;
  value: string;
  placeholder?: string;
  multiple?: boolean,
  readonly?: boolean;
  validations?: Validation[];
}


// interface for the validators
interface Validation {
  name: string;
  validator: string;
  message: string;
}

// Terminology Suggestion Form Component
@Component({
  selector: 'app-term-suggestion-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './term-suggestion-form.component.html',
  styleUrls: ['./term-suggestion-form.component.css']
})
export class TermSuggestionFormComponent implements OnInit {
  termFormData: FormData;
  dynamicTermForm: FormGroup = this.fb.group({}); // initialize to an empty group

  constructor(
    private fb: FormBuilder,
    private formService: TermSuggestionFormService, 
    private cdr: ChangeDetectorRef,
) {
  // initialize the termFormData to an empty form.
    this.termFormData = {
      formName: '',
      formType: '',
      recipientEmail: '',
      sections: []
    }
  }

  // Load NCIT form by default
  ngOnInit(): void {
    this.loadForm('cdisc-form');
  }

  // load the form based on the formType selected. Handle the validation checks.
  async loadForm(formType: string): Promise<void> {
    this.termFormData = await this.formService.getForm(formType);

    for (const section of this.termFormData.sections) {
      const validatorsToAdd = [];
      for (const field of section.fields) {
        // load the fields 
        this.dynamicTermForm.addControl(
          field.name, 
          this.fb.control(field.value)
        )
      }
      this.dynamicTermForm.addControl(
        section.name,
        this.fb.group(section.label)
      )
    }
    this.cdr.detectChanges();
  }
  onSubmit() {
    if (this.dynamicTermForm.valid) {
      this.formService.submitForm(this.dynamicTermForm.value).subscribe(
        response => {

        }, 
        error => {

        }
      )
    } 
  }
}
