import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TermFormData} from '../model/termFormData.model';

// Service for Terminology Suggestion Form
@Injectable({
  providedIn: 'root'
})
export class TermSuggestionFormService {

  constructor(private http: HttpClient) { }

  // Get the term form
  async getForm(formType: string): Promise<any> {
    try {
      return await this.http.get<any>(encodeURI('/api/v1/suggest/' + formType)).toPromise();
    } catch (error) {
      console.log('An error occurred: ', error);
      alert('An error occurred while fetching data');
      throw error;
    }
  }

  // Submit filled out form.
  async submitForm(formData: TermFormData, captchaToken: any): Promise<any> {
    try {
      const headers: HttpHeaders = new HttpHeaders().set('Captcha-Token', captchaToken);
      const options = { headers };
      return await this.http.post<any>(encodeURI('/api/v1/suggest'), formData, options).toPromise();
    } catch (error) {
      console.log('An error occurred: ', error);
      alert('An error occurred while submitting the form');
      return error;
    }
  }

}
