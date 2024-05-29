import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TermSuggestionFormService} from '../../service/term-suggestion-form.service';
import {ChangeDetectionStrategy} from '@angular/compiler';
import {TermFormData} from '../../model/termFormData.model'
import {ConfigurationService} from 'src/app/service/configuration.service';
import {LoaderService} from 'src/app/service/loader.service';

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
  options?: string[];
  placeholder?: string;
  multiple?: boolean;
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
  value: number;
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
  errorMessages: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private formService: TermSuggestionFormService,
    private cdr: ChangeDetectorRef,
    private configService: ConfigurationService,
    private loaderService: LoaderService
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
    console.log('Loading default form');
    this.loadForm('cdisc-form');
  }

  // load the form based on the formType selected. Handle the validation checks.
  async loadForm(formType: string): Promise<void> {
    console.log('Loading form ', formType);
    this.termFormData = await this.formService.getForm(formType);

    for (const section of this.termFormData.sections) {
      // create a section Form Group to control inputs
      const sectionGroup = this.fb.group({});

      for (const field of section.fields) {
        // create an array to hold the validators for the field
        const validators = [];
        // Add the validators based on the validations property
        if (field.validations) {
          for (const validation of field.validations) {
            if (validation.validator === 'required') {
              validators.push(Validators.required);
            } else if (validation.validator === 'email') {
              validators.push(Validators.email);
            } else if (validation.validator === 'maxlength') {
              validators.push(Validators.maxLength(validation.value));
            }
          }
        }
        // add the field control to the section form group
        sectionGroup.addControl(
          field.name,
          this.fb.control(field.value, validators)
        );

        // Subscribe to valueChanges and statusChanges of the form control to show all error messages
        const formControl = sectionGroup.get(field.name);
        formControl.valueChanges.subscribe(() => {
          this.errorMessages[field.name] = this.getErrorMessage(formControl, field);
        });
        formControl.statusChanges.subscribe(() => {
          this.errorMessages[field.name] = this.getErrorMessage(formControl, field);
        });

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
  async onSubmit() {
    if (this.dynamicTermForm.valid) {
      console.log('Submitted Form Details: ', JSON.stringify(this.dynamicTermForm.value));
      // create the termFormData that is filled out
      const submittedFormData: TermFormData = {
        formName: this.termFormData.formType,
        recipientEmail: 'agarcia@westcoastinformatics.com', // TODO: update to pull from form
        businessEmail: this.dynamicTermForm.get('contact.email').value,
        subject: 'Placeholder text',
        body: this.dynamicTermForm.value
      };
      console.log('Form Data: ', JSON.stringify(submittedFormData));
      // show the spinner
      this.loaderService.showLoader();
      try {
        this.formService.submitForm(submittedFormData);
      } catch (error) {
        console.log('An error occurred:', error);
      } finally {
        // hide the spinner
        this.loaderService.hideLoader();
      }
    }
  }

  // clear the form when the clear button is clicked, except for read only fields
  onClear() {
    Object.keys(this.dynamicTermForm.controls).forEach(key => {
      // get section controls
      const sectionControl = this.dynamicTermForm.controls[key];
      Object.keys(sectionControl['controls']).forEach(sectionKey => {
        const fieldControl = sectionControl['controls'][sectionKey];
        const field = this.formFields[sectionKey];
        if (fieldControl && !field.readonly) {
          console.log();
          fieldControl.reset();
        }
      });
    });
  }

  // get the error message text from the form and display when validation isn't fulfilled
  getErrorMessage(control, field): string {
    let errorMessages = '';
    if (control.hasError('required')) {
      const validation = field.validations.find(v => v.validator === 'required');
      errorMessages += validation ? validation.message : '';
    } else if (control.hasError('email')) {
      const validation = field.validations.find(v => v.validator === 'email');
      errorMessages += validation ? ' ' + validation.message : '';
    } else if (control.hasError('maxlength')) {
      const validation = field.validations.find(v => v.validator === 'maxlength');
      errorMessages += validation ? ' ' + validation.message : '';
    }
    return errorMessages.trim();
  }

  // Determine if a field is required
  isRequired(field: Field): boolean {
    return field.validations?.some(validation => validation.validator === 'required');
  }

  getMaxLength(field: Field): number {
    const validation = field.validations?.find(v => v.validator === 'maxlength');
    return validation ? validation.value : null;
  }
}
