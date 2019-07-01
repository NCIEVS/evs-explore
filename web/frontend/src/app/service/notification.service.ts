import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { Message } from 'primeng/api';

export type Severities = 'success' | 'info' | 'warn' | 'error';

@Injectable()
export class NotificationService {
  private notificationChange = new BehaviorSubject<Object>(null) ;

  notify(message: Message) {
    this.notificationChange.next(message);
  }

  getNotificationChangeSubject(): Observable<any> {
    return this.notificationChange.asObservable();
}

}

