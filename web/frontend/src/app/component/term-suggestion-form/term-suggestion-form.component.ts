import {Component, ViewChild, ChangeDetectorRef, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TermSuggestionFormService} from '../../service/term-suggestion-form.service';
import {TermFormData} from '../../model/termFormData.model';
import {ConfigurationService} from 'src/app/service/configuration.service';
import {LoaderService} from 'src/app/service/loader.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ReCaptcha2Component} from 'ngx-captcha';
import {MessageService} from 'primeng/api';


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
  // Form Group controls with recaptcha
  private formGroup: FormGroup = this.fb.group({
    recaptcha: ['', Validators.required]
  });
  // captcha view child
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;
  recaptchaSiteKey: string;

  // Captcha success event
  private captchaSuccessEvent: any;

  // Captcha expired status
  protected isCaptchaExpired = false;

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
    // inject the router service
    private router: Router,
    // inject the ActivatedRoute service
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) {
    this.uiState = new UIState(fb);
    // initialize the termFormData to an empty form.
    this.clearTermFormData();
  }

  // Sets the uiState to an initial state
  clearTermFormData() {
    this.uiState = new UIState(this.fb);
    // initialize to an group only containing recaptcha
    this.formGroup = this.fb.group({
      recaptcha: ['', Validators.required]
    });
  }

  // Load the form, if no formId is present, load default
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const formId = params['formId'];
      if (formId) {
        // if the formId parameter is present, load that form
        this.onloadForm(formId).catch(e => {
          console.error('Error loading form:', e);
        });
      } else {
        // If the formId param is not present, load the default form
        this.onloadForm(this.selectedForm).catch(e => {
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
  async onloadForm(formType: string): Promise<void> {
    console.log('Loading form ', formType);
    this.clearTermFormData();
    const response = await this.formService.getForm(formType);

    // get the recaptcha site key from the response
    this.recaptchaSiteKey = response.recaptchaSiteKey;

    // create a formData instance of the response
    this.formData = response;

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
          this.fb.control(field.value, validators),
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
    // Check our captcha was completed successfully
    if (!this.captchaSuccessEvent) {
      console.log('ERROR: Captcha not completed successfully');
      return;
    }

    // create the termFormData from the filled out form
    let submittedFormData: TermFormData;
    let submittedSubject = '';

    // set the subject based on the submitted form
    if (this.formData.formType === 'CDISC') {
      submittedSubject = 'Term Suggestion for CDISC Terminology: ';
    } else if (this.formData.formType === 'NCIT') {
      submittedSubject = 'Term Suggestion: ';
    }
    // populate the submittedFormData
    submittedFormData = {
      formName: this.formData.formType,
      recipientEmail: this.formData.recipientEmail,
      businessEmail: this.formGroup.get('contact.email').value,
      subject: submittedSubject + this.formGroup.get('termInfo.term').value,
      body: this.formGroup.value,
    };
    console.log('Sending Form Data: ', JSON.stringify(submittedFormData));
    // show the spinner
    this.loaderService.showLoader();
    // send our form with the captcha token
    try {
      await this.formService.submitForm(submittedFormData, this.captchaSuccessEvent);
    } catch (error) {
      await this.router.navigate(['/error']);
    } finally {
      // hide the spinner
      this.loaderService.hideLoader();
      // clear the form (except for readonly fields)
      this.onClear();
    }
  }

  // clear the form, except for read only fields
  onClear() {
    if (this.uiState.termFormGroup && this.uiState.termFormGroup.controls) {
      Object.keys(this.uiState.termFormGroup.controls).forEach(key => {
        // get section controls
        const sectionControl = this.uiState.termFormGroup.controls[key];
        // Recaptcha doesn't have controls, so skip it
        if (key === 'recaptcha') {
          return;
        }
        Object.keys(sectionControl['controls']).forEach(sectionKey => {
          const fieldControl = sectionControl['controls'][sectionKey];
          const field = this.formFields[sectionKey];
          if (fieldControl && !field.readonly) {
            fieldControl.reset();
          }
        });
      });
    }
    this.captchaElem.resetCaptcha();
  }

  // set the captcha event
  onCaptchaSuccess(event: string) {
    this.captchaSuccessEvent = event;
    this.isCaptchaExpired = false;
    console.log('Captcha Event: ' + JSON.stringify(this.captchaSuccessEvent));
  }

  // Set the captcha status
  onCaptchaExpired() {
    this.isCaptchaExpired = true;
  }

  // get the validators from the form group
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

  // Calculate the character count and show the maxlength for a field
  displayMaxLengthCount(section: Section, field: Field): string {
    if (!section || !field) {
      return '';
    }
    if (this.uiState.termFormGroup.get(section.name).get(field.name).value === null) {
      return '';
    }
    const count = this.uiState.termFormGroup.get(section.name).get(field.name).value.length;
    return count.toString() + ' / ' + this.getMaxLength(field).toString();
  }

  // Determine if the validation errors should be displayed for a field
  shouldDisplayValidationError(section: Section, field: Field): boolean {
    const sectionControl = this.uiState.termFormGroup.get(section.name);
    const fieldControl = sectionControl.get(field.name);
    return fieldControl.errors && fieldControl.touched;
  }

  // Get the formGroup
  public getFormGroup(): FormGroup<any> {
    return this.formGroup;
  }
}
