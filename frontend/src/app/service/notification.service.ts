import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';
// import { Message } from 'primeng/api';
export interface Message {
    severity?: string;
    summary?: string;
    detail?: string;
    id?: any;
    key?: string;
    life?: number;
    sticky?: boolean;
    closable?: boolean;
    data?: any;
    icon?: string;
    contentStyleClass?: string;
    styleClass?: string;
}
export type Severities = 'success' | 'info' | 'warn' | 'error';

// Service for notifying listeners of messages
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

