import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ApiService } from '../../core/http/api.service';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule],
  template: `
    <div class="calendar-page container">
      <div class="card-premium glass-header mb-5">
        <div class="header-inner">
          <div class="title-group">
            <h1 class="gradient-text">Studio Schedule</h1>
            <p class="subtitle">Search and manage all photography bookings in one place</p>
          </div>

          <div class="search-actions">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input 
                type="text" 
                [(ngModel)]="searchTerm" 
                (ngModelChange)="searchSubject$.next($event)"
                placeholder="Search Client or Booking ID..." 
                class="search-input"
              />
            </div>
            
            <div class="legend-premium">
              <div class="legend-item"><span class="dot confirmed"></span> Confirmed</div>
              <div class="legend-item"><span class="dot pending"></span> Pending</div>
              <div class="legend-item"><span class="dot completed"></span> Completed</div>
            </div>
          </div>
        </div>
      </div>

      <div class="main-layout">
        <div class="calendar-container card-premium">
          <full-calendar #calendar [options]="calendarOptions"></full-calendar>
        </div>

        <div class="side-panel card-premium" *ngIf="selectedEvent" [class.active]="selectedEvent">
            <div class="panel-header">
                <h3>Booking Intelligence</h3>
                <button class="btn-close" (click)="selectedEvent = null">×</button>
            </div>
            <div class="panel-body">
                <p class="event-title-premium">{{ selectedEvent.title }}</p>
                
                <div class="status-indicator">
                    <span class="badge-dot" [style.background]="colors[selectedEvent.extendedProps?.status]"></span>
                    <span class="status-text">{{ selectedEvent.extendedProps?.status }}</span>
                </div>

                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="icon">📅</span>
                        <div class="vals">
                            <span class="label">Date Range</span>
                            <span class="value">{{ selectedEvent.start | date:'MMM d' }} - {{ selectedEvent.end | date:'MMM d, y' }}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <span class="icon">📍</span>
                        <div class="vals">
                            <span class="label">Venue / Location</span>
                            <span class="value">{{ selectedEvent.extendedProps?.location || 'Not Specified' }}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <span class="icon">👤</span>
                        <div class="vals">
                            <span class="label">Primary Customer</span>
                            <span class="value">{{ selectedEvent.extendedProps?.customerName || 'Guest' }}</span>
                        </div>
                    </div>
                </div>

                <div class="panel-cta">
                    <button class="btn-primary-pro w-100" (click)="goToEvent(selectedEvent.extendedProps?.eventId)">
                        Go to Booking Details →
                    </button>
                    <button class="btn-outline w-100 mt-2" (click)="selectedEvent = null">Close Overlay</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-page { height: 100vh; display: flex; flex-direction: column; padding: 20px; background: #f8fafc; }
    
    .glass-header { 
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 30px;
      border-radius: 24px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.04);
    }
    
    .header-inner { display: flex; justify-content: space-between; align-items: center; }
    .gradient-text { 
      font-size: 2.2rem; 
      font-weight: 900; 
      background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0;
      letter-spacing: -1.5px;
    }
    .subtitle { color: #64748b; font-size: 0.95rem; margin-top: 5px; font-weight: 500; }

    .search-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }
    
    .search-box {
      position: relative;
      background: #f1f5f9;
      padding: 10px 16px;
      border-radius: 12px;
      width: 320px;
      border: 1px solid #e2e8f0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .search-box:focus-within { background: #fff; border-color: var(--primary); box-shadow: 0 4px 20px rgba(79, 70, 229, 0.1); }
    .search-icon { margin-right: 8px; opacity: 0.5; }
    .search-input { border: none; background: transparent; width: 85%; font-weight: 600; outline: none; font-size: 0.875rem; }

    .legend-premium { display: flex; gap: 20px; }
    .legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
    .dot { width: 8px; height: 8px; border-radius: 2px; }
    .dot.confirmed { background: #10b981; }
    .dot.pending { background: #f59e0b; }
    .dot.completed { background: #3b82f6; }

    .main-layout { display: flex; gap: 24px; flex: 1; min-height: 0; }
    .calendar-container { flex: 1; padding: 25px; border-radius: 24px; }

    .side-panel { width: 360px; padding: 0; overflow: hidden; border-radius: 24px; border: none; box-shadow: 0 20px 50px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
    .panel-header { padding: 24px; background: #1e293b; color: white; display: flex; justify-content: space-between; align-items: center; }
    .panel-header h3 { margin: 0; font-size: 0.95rem; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; opacity: 0.8; }
    .btn-close { background: rgba(255,255,255,0.1); border: none; width: 32px; height: 32px; border-radius: 8px; color: white; cursor: pointer; transition: 0.2s; }
    .btn-close:hover { background: rgba(255,255,255,0.2); }

    .panel-body { padding: 30px; flex: 1; display: flex; flex-direction: column; }
    .event-title-premium { font-size: 1.4rem; font-weight: 900; color: #1e293b; margin-bottom: 8px; line-height: 1.2; letter-spacing: -0.5px; }
    
    .status-indicator { display: flex; align-items: center; gap: 8px; margin-bottom: 30px; }
    .badge-dot { width: 10px; height: 10px; border-radius: 50%; }
    .status-text { font-size: 0.8125rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; }

    .detail-grid { display: flex; flex-direction: column; gap: 24px; margin-bottom: 40px; }
    .detail-item { display: flex; gap: 16px; align-items: flex-start; }
    .detail-item .icon { width: 40px; height: 40px; background: #f1f5f9; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
    .detail-item .vals { display: flex; flex-direction: column; gap: 2px; }
    .detail-item .label { font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .detail-item .value { font-size: 0.95rem; font-weight: 700; color: #334155; }

    .panel-cta { margin-top: auto; }

    ::ng-deep .fc { 
      --fc-border-color: #f1f5f9;
      --fc-daygrid-event-dot-width: 8px;
    }
    ::ng-deep .fc .fc-toolbar-title { font-size: 1.5rem; font-weight: 900; letter-spacing: -0.8px; color: #1e293b; }
    ::ng-deep .fc .fc-button-primary { 
      background: #fff; 
      border: 1px solid #e2e8f0; 
      color: #475569; 
      font-weight: 700; 
      padding: 8px 16px;
      font-size: 0.8125rem;
      border-radius: 10px;
      transition: 0.2s;
    }
    ::ng-deep .fc .fc-button-primary:hover { background: #f8fafc; border-color: #cbd5e1; color: #1e293b; }
    ::ng-deep .fc .fc-button-active { background: #1e293b !important; color: #fff !important; border-color: #1e293b !important; }
    
    ::ng-deep .fc-day-today { background: rgba(79, 70, 229, 0.03) !important; }

    @keyframes slideIn {
      from { transform: translateX(100px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

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
  searchTerm: string = '';
  searchSubject$ = new Subject<string>();

  colors: any = {
    CONFIRMED: '#10b981',
    PENDING: '#f59e0b',
    COMPLETED: '#3b82f6',
    CANCELLED: '#ef4444'
  };

  constructor(
    private api: ApiService,
    private router: Router
  ) {
    // Implement debounced search
    this.searchSubject$.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => {
      this.handleSearch(term);
    });
  }

  ngOnInit() {}

  handleDatesSet(arg: any) {
    this.loadEvents(arg.startStr, arg.endStr, this.searchTerm);
  }

  handleSearch(term: string) {
    const calendarApi = this.calendarComponent.getApi();
    const view = calendarApi.view;
    
    // Refresh events for the current view with the search term
    this.loadEvents(view.activeStart.toISOString(), view.activeEnd.toISOString(), term);
  }

  loadEvents(start: string, end: string, search: string = "") {
    this.api.get<any>(`/calendar/events`, { start, end, search }).subscribe(res => {
      const data = res?.data || res;
      const rawEvents = Array.isArray(data) ? data : [];

      this.events = rawEvents.map((ev: any) => ({
        id: ev._id,
        start: ev.startDate,
        end: ev.endDate,
        title: `${ev.title || 'Booking'} — ${ev.customer?.name || 'Guest'}`,
        backgroundColor: this.colors[ev.status] || '#94a3b8',
        borderColor: 'transparent',
        classNames: ['premium-event'],
        extendedProps: {
          eventId: ev._id,
          status: ev.status,
          location: ev.location,
          customerName: ev.customer?.name
        }
      }));

      this.calendarOptions = { ...this.calendarOptions, events: this.events };

      // If we searched and found results, and it's a specific term, navigate to the first one
      if (search && this.events.length > 0) {
        const firstEvent = this.events[0];
        if (firstEvent.start) {
            const calendarApi = this.calendarComponent.getApi();
            calendarApi.gotoDate(firstEvent.start as string);
        }
      }
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
    this.router.navigate(['/admin/bookings/edit', id]);
  }
}
