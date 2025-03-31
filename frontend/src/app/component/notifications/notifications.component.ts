import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from './../../service/notification.service';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';

// Component for displaying notifications
// This component is rendered in the top level app component
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  stickNotification: Boolean = true;
  link: string;
  private subscription: Subscription = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private messageService: MessageService
  ) { }

  // Subscribe on initialization
  ngOnInit() {
    this.notificationService
      .getNotificationChangeSubject()
      .subscribe((notification) => {
        if (notification != null) {
          this.link =
            '<a href="https://datascience.cancer.gov/about/application-support" target="_blank">Please contact the NCI helpdesk</a>';
          this.messageService.add({
            key: 'tc',
            severity: notification.severity,
            summary: notification.summary,
            detail: notification.detail,
            sticky: notification.sticky,
            closable: notification.closable,
          });
        }
      });
  }

  // Unubscribe on destruction
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
