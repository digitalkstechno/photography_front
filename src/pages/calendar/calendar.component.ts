import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ApiService } from '../../core/http/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  template: `
    <div class="calendar-page container">
      <div class="card-premium card-header-black mb-5">
        <div class="header-inner">
          <div class="title-group">
            <h1 class="text-white">Shoot Schedule</h1>
            <p class="text-muted-light">Real-time booking and studio availability overview</p>
          </div>
          <div class="legend">
            <div class="legend-item"><span class="dot confirmed"></span> Confirmed</div>
            <div class="legend-item"><span class="dot pending"></span> Pending</div>
            <div class="legend-item"><span class="dot completed"></span> Completed</div>
          </div>
        </div>
      </div>

      <div class="main-layout">
        <div class="calendar-container card-premium">
          <full-calendar [options]="calendarOptions"></full-calendar>
        </div>

        <div class="side-panel card-premium" *ngIf="selectedEvent">
            <div class="panel-header">
                <h3>Event Details</h3>
                <button class="btn-close" (click)="selectedEvent = null">×</button>
            </div>
            <div class="panel-body">
                <p class="event-title-premium">{{ selectedEvent.title }}</p>
                <div class="info-row">
                    <span class="label">Start</span>
                    <span class="value">{{ selectedEvent.start | date:'fullDate' }}</span>
                </div>
                <div class="info-row">
                    <span class="label">End</span>
                    <span class="value">{{ selectedEvent.end | date:'fullDate' }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Status</span>
                    <span class="value badge" [class]="'badge-' + selectedEvent.extendedProps?.status?.toLowerCase()">{{ selectedEvent.extendedProps?.status }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Location</span>
                    <span class="value">{{ selectedEvent.extendedProps?.location || 'N/A' }}</span>
                </div>
                <hr class="divider" />
                <button class="btn-premium btn-primary w-100 mt-4" (click)="goToEvent(selectedEvent.extendedProps?.eventId)">View Event</button>
            </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-page { height: 100%; display: flex; flex-direction: column; }
    .mb-5 { margin-bottom: 24px; }
    .legend { display: flex; gap: 16px; }
    .legend-item { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.5px; }
    .dot { width: 7px; height: 7px; border-radius: 50%; }
    .dot.confirmed { background: var(--success); }
    .dot.pending { background: #eab308; }
    .dot.completed { background: #3b82f6; }

    .main-layout { display: flex; gap: 24px; flex: 1; min-height: 0; }
    .calendar-container { flex: 1; padding: 20px; height: 100%; }

    .side-panel { width: 300px; padding: 24px; animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); border-left: 3px solid var(--primary); }
    .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .panel-header h3 { margin: 0; font-size: 16px; font-weight: 800; letter-spacing: -0.5px; }
    .btn-close { background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-light); }

    .event-title-premium { font-size: 17px; font-weight: 800; color: var(--primary); margin-bottom: 20px; letter-spacing: -0.5px; line-height: 1.3; }
    .info-row { display: flex; flex-direction: column; gap: 3px; margin-bottom: 16px; }
    .info-row .label { font-size: 10px; font-weight: 800; color: var(--text-light); text-transform: uppercase; letter-spacing: 1px; }
    .info-row .value { font-size: 13.5px; font-weight: 600; color: var(--text-main); }

    .divider { border: 0; border-top: 2px solid var(--bg-app); margin: 20px 0; }
    .w-100 { width: 100%; }

    ::ng-deep .fc { --fc-button-bg-color: #ffffff; --fc-button-text-color: #000; --fc-button-border-color: #e4e4e7; --fc-button-hover-bg-color: #f4f4f5; --fc-button-active-bg-color: #000; --fc-button-active-text-color: #fff; }
    ::ng-deep .fc .fc-toolbar-title { font-size: 1.25rem; font-weight: 800; letter-spacing: -0.5px; }
    ::ng-deep .fc .fc-col-header-cell-cushion { font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--text-muted); padding: 10px 0; }
    ::ng-deep .fc .fc-daygrid-day-number { font-weight: 800; font-size: 13px; padding: 6px; }

    @keyframes slideIn {
      from { transform: translateX(40px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventClick: this.handleEventClick.bind(this),
    datesSet: this.handleDatesSet.bind(this),
    height: '100%'
  };

  events: EventInput[] = [];
  selectedEvent: any = null;

  colors: any = {
    CONFIRMED: '#22c55e',
    PENDING: '#eab308',
    COMPLETED: '#3b82f6',
    CANCELLED: '#ef4444'
  };

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit() {}

  handleDatesSet(arg: any) {
    this.loadEvents(arg.startStr, arg.endStr);
  }

  loadEvents(start: string, end: string) {
    this.api.get<any>(`/calendar/events`, { start, end }).subscribe(res => {
      const data = res?.data || res;
      const events = Array.isArray(data) ? data : [];

      this.events = events.map((ev: any) => ({
        id: ev._id,
        start: ev.startDate,
        end: ev.endDate,
        title: `📸 ${ev.eventType} — ${ev.customer?.name || 'Unknown'}`,
        backgroundColor: this.colors[ev.status] || '#9ca3af',
        borderColor: this.colors[ev.status] || '#9ca3af',
        extendedProps: {
          eventId: ev._id,
          status: ev.status,
          location: ev.location,
          customerName: ev.customer?.name
        }
      }));

      this.calendarOptions = { ...this.calendarOptions, events: this.events };
    });
  }

  handleEventClick(arg: any) {
    this.selectedEvent = {
      title: arg.event.title,
      start: arg.event.start,
      end: arg.event.end,
      extendedProps: arg.event.extendedProps
    };
  }

  goToEvent(id: string) {
    this.router.navigate(['/bookings', id]);
  }
}
