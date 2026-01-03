import { Component } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { PatientNoticeService } from '../../core/patient-notice/patient-notice.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-notice-list',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './notice-list.component.html',
})
export class NoticeListComponent {

  constructor(private noticeService: PatientNoticeService) { }

  columns = [
    { key: 'title', label: 'Title' },
    { key: 'message', label: 'Message' },
    { key: 'priority', label: 'Priority' },
    { key: 'createdAt', label: 'Created On' },
  ];

  fetchNotices = async (params: any) => {
    return await firstValueFrom(
      this.noticeService.getAllNotices(params)
    );
  };

  getUpdateRoute(row: any): string {
    return `/notices/edit/${row._id}`;
  }

}
