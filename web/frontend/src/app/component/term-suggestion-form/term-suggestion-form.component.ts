import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TermSuggestionFormService} from '../../service/term-suggestion-form.service';
import {ChangeDetectionStrategy} from '@angular/compiler';
import {TermFormData} from '../../model/termFormData.model';
import {ConfigurationService} from 'src/app/service/configuration.service';
import {LoaderService} from 'src/app/service/loader.service';
import {ActivatedRoute, Router} from '@angular/router';

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

// interface for toggling between forms
interface FormSelection {
  id: string;
  name: string;
}

//  Helper class for setting the UIState of the term form to manage variables easier
class UIState {
  isFormLoaded: boolean;
  termFormData: FormData;
  termFormGroup: FormGroup;
  forms: Array<FormSelection>;
  selectedTermForm: string;

  constructor(
    private fb: FormBuilder,
  ) {
    this.isFormLoaded = false;
    this.forms = [
      {id: 'ncit-form', name: 'NCIT Form'},
      {id: 'cdisc-form', name: 'CDISC Form'},
    ];
    this.termFormData = {
      formName: '',
      formType: '',
      recipientEmail: '',
      sections: []
    };
    this.termFormGroup = fb.group({});
    this.selectedTermForm = undefined;
  }
}

// Terminology Suggestion Form Component
@Component({
  selector: 'app-term-suggestion-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './term-suggestion-form.component.html',
  styleUrls: ['./term-suggestion-form.component.css']
})
export class TermSuggestionFormComponent implements OnInit {
  // Field reference for form controls
  private formFields: { [key: string]: Field } = {};
  // Object to store error messages for easier retrieval
  private errorMessages: { [key: string]: string } = {};
  // Form Data model for storing the sections and fields of the forms
  private formData: FormData;
  // Form Group controls
  private formGroup: FormGroup = this.fb.group({});

  // Store list of forms we can toggle between
  private forms = [
    {id: 'ncit-form', name: 'NCIT Form'},
    {id: 'cdisc-form', name: 'CDISC Form'},
  ];

  // set a default form
  private selectedForm = this.forms[0].id;

  // UI State
  uiState: UIState;

  constructor(
    private fb: FormBuilder,
    private formService: TermSuggestionFormService,
    private cdr: ChangeDetectorRef,
    private configService: ConfigurationService,
    private loaderService: LoaderService,
    private router: Router, // inject the router service
    private route: ActivatedRoute // inject the ActivatedRoute service
  ) {
    this.uiState = new UIState(fb);
    // initialize the termFormData to an empty form.
    this.clearTermFormData();
  }

  // Sets the uiState to the initial state
  clearTermFormData() {
    this.uiState = new UIState(this.fb);
    this.formGroup = this.fb.group({}); // initialize to an empty group
  }

  // Load the form, if no formId is present, load default
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const formId = params['formId'];
      if (formId) {
        // if the formId parameter is present, load that form
        this.loadForm(formId).catch(e => {
          console.error('Error loading form:', e);
        });
      } else {
        // If the formId param is not present, load the default form
        this.loadForm(this.selectedForm).catch(e => {
          console.error('Error loading default form:', e);
        });
      }
    });
  }

  // Change the form with the dropdown
  async onFormChange(formId: string): Promise<void> {
    this.loaderService.showLoader();
    await this.router.navigate(['/termform'], {queryParams: {formId}});
    this.loaderService.hideLoader();
  }

  // load the form based on the formType selected. Handle the validation checks.
  async loadForm(formType: string): Promise<void> {
    console.log('Loading form ', formType);
    this.clearTermFormData();
    this.formData = await this.formService.getForm(formType);

    for (const section of this.formData.sections) {
      // create a section Form Group to control inputs
      const sectionGroup = this.fb.group({});
      for (const field of section.fields) {
        // create an array to hold the validators for the field
        let validators = [];
        // Add the validators based on the validations property
        validators = this.getValidators(validators, field);
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
      this.formGroup.addControl(
        section.name,
        sectionGroup
      );
    }
    this.selectedForm = formType;
    this.displayLoadedForm();
    this.cdr.detectChanges();
  }

  // Set the UI state to hold our loaded data and display the loaded form
  displayLoadedForm() {
    this.uiState.termFormGroup = this.formGroup;
    this.uiState.termFormData = this.formData;
    this.uiState.forms = this.forms;
    this.uiState.selectedTermForm = this.selectedForm;
    this.uiState.isFormLoaded = true;
  }

  // When submit is clicked, build the terFormData to populate our model form submission and call submitForm api
  async onSubmit() {
    if (this.formGroup.valid) {
      console.log('Submitted Form Details: ', JSON.stringify(this.formGroup.value));
      // create the termFormData that is filled out
      const submittedFormData: TermFormData = {
        formName: this.formData.formType,
        recipientEmail: 'agarcia@westcoastinformatics.com', // TODO: update to pull from form
        businessEmail: this.formGroup.get('contact.email').value,
        subject: 'Placeholder text',
        body: this.formGroup.value
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
    Object.keys(this.formGroup.controls).forEach(key => {
      // get section controls
      const sectionControl = this.formGroup.controls[key];
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

  getValidators(validators: any[], field: Field): any[] {
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
    return validators;
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

  // Get the maxLength field.validations validator value
  getMaxLength(field: Field): number {
    const validation = field.validations?.find(v => v.validator === 'maxlength');
    return validation ? validation.value : null;
  }

  // Determine if the validation errors should be displayed for a field
  shouldDisplayValidationError(section: Section, field: Field): boolean {
    const sectionControl = this.uiState.termFormGroup.get(section.name);
    const fieldControl = sectionControl.get(field.name);
    return fieldControl.errors && fieldControl.touched;
  }
}
