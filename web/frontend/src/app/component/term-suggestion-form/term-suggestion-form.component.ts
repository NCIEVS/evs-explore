import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TermSuggestionFormService} from '../../service/term-suggestion-form.service';
import {ChangeDetectionStrategy} from '@angular/compiler';
import {TermFormData} from '../../model/termFormData.model'

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

// interface for instruction parts
interface Instruction {
  text: string;
  link?: string;
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
  formFields: { [key: string]: Field } = {}; // Field reference for form controls

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
    };
  }

  // Load NCIT form by default
  ngOnInit(): void {
    this.loadForm('ncit-form');
  }

  // load the form based on the formType selected. Handle the validation checks.
  async loadForm(formType: string): Promise<void> {
    this.termFormData = await this.formService.getForm(formType);

    for (const section of this.termFormData.sections) {
      // create a section Form Group to control inputs
      const sectionGroup = this.fb.group({});

      for (const field of section.fields) {
        // add the field control to the section form group
        sectionGroup.addControl(
          field.name,
          this.fb.control(field.value)
        );
        // store the field object
        this.formFields[field.name] = field;
      }
      // add section form group controls to our dynamic term form group
      this.dynamicTermForm.addControl(
        section.name,
        sectionGroup
      );
    }
    this.cdr.detectChanges();
  }

  // When submit is clicked, build the terFormData to populate our model form submission and call submitForm api
  onSubmit() {
    if (this.dynamicTermForm.valid) {
      console.log('Submitted Form Details: ' + JSON.stringify(this.dynamicTermForm.value));
      // create the termFormData that is filled out
      const submittedFormData: TermFormData = {
        formName: this.termFormData.formType,
        recipientEmail: 'agarcia@westcoastinformatics.com', // TODO: update to pull from form
        businessEmail: this.dynamicTermForm.get('contact.email').value,
        subject: 'Placeholder text',
        body: this.dynamicTermForm.value
      };
      this.formService.submitForm(submittedFormData);
    }
  }

  // clear the form when the clear button is clicked, except for read only fields
  onClear() {
    Object.keys(this.dynamicTermForm.controls).forEach(key => {
      // get section controls
      const sectionControl = this.dynamicTermForm.controls[key];
      Object.keys(sectionControl["controls"]).forEach(key => {
        const fieldControl = sectionControl["controls"][key];
        const field = this.formFields[key];
        if (fieldControl && !field.readonly) {
          console.log()
          fieldControl.reset();
        }
      });
    });
  }
}
