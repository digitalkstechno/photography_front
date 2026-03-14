import { Component } from '@angular/core';
import { TableComponent } from '../../shared/table/table.component';
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './reports.component.html',
})
export class ReportsComponent {

  columns = [
    { key: 'id', label: 'Report ID' },
    { key: 'title', label: 'Title' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created At' },
  ];

  fetchReports = async (params: any) => {
    console.log('Reports params:', params);

    // Simulated server response
    return {
      data: [
        {
          id: 'RPT-001',
          title: 'Monthly Revenue',
          status: 'Completed',
          createdAt: '2025-01-10',
        },
        {
          id: 'RPT-002',
          title: 'User Growth',
          status: 'Pending',
          createdAt: '2025-01-12',
        },
      ],
      total: 12,
    };
  };
}
