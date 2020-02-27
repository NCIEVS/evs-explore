import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from './../../service/notification.service';
import { Subscription } from 'rxjs';
import { Message, MessageService } from 'primeng/primeng';

// Component for displaying notifications
// This component is rendered in the top level app component
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  stickNotification: Boolean = true;
  private subscription: Subscription = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private messageService: MessageService
  ) { }

  // Subscribe on initialization
  ngOnInit() {

    this.notificationService.getNotificationChangeSubject()
      .subscribe(notification => {
        if (notification != null) {
          this.messageService.add(
            {
              severity: notification.severity,
              summary: notification.summary,
              detail: notification.detail,
              sticky: notification.sticky,
              closable: notification.closable
            }
          );

        }
      });
  }

  // Unubscribe on destruction
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
