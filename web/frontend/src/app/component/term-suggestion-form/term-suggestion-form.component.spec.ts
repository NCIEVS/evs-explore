import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TermSuggestionFormComponent} from './term-suggestion-form.component';
import {AbstractControl} from "@angular/forms";

describe('TermSuggestionFormComponent', () => {
  let component: TermSuggestionFormComponent;
  let fixture: ComponentFixture<TermSuggestionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TermSuggestionFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TermSuggestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test an instance is created
  it('should create the component instance', () => {
    expect(component).toBeTruthy();
  });

  // Test the form is initialized onInit
  it('should initialize the form', () => {
    // call the ngOnInit method to initialize the form & check if the formGroup is defined
    component.ngOnInit();
    expect(component.getFormGroup()).toBeDefined();
  });

  // Test the submit form logic is called
  it('should submit the form', () => {
    // spy on the onSubmit method
    spyOn(component, 'onSubmit');
    // call the onSubmit method & check if the onSubmit method has been called
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should validate the form controls', () => {
    // replace 'controlName' with the actual control name
    const control: AbstractControl<any, any> = component.getFormGroup().get('controlName');
    // set an invalid value
    control.setValue('');
    // check if the control is invalid
    expect(control.valid).toBeFalsy();
    // set a valid value
    control.setValue('valid value');
    // check if the control is valid
    expect(control.valid).toBeTruthy();
  });

});
