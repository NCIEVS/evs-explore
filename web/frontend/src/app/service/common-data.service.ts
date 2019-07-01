import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CommonDataService {

  private dataSource = new BehaviorSubject({});
  currentMessage = this.dataSource.asObservable();

  constructor() { console.log('error');}

  changeMessage(data: any) {
    this.dataSource.next(data);
  }
}
