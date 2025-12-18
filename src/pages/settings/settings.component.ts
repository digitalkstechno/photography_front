import { Component } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {

  columns = [
    { key: 'key', label: 'Setting Key' },
    { key: 'value', label: 'Value' },
    {
      key: 'actions',
      label: 'Actions',
      onEdit: (row: any) => this.edit(row),
      onDelete: (row: any) => this.remove(row),
    },
  ];

  fetchSettings = async () => {
    return {
      data: [
        { key: 'site_name', value: 'MyApp' },
        { key: 'maintenance', value: 'false' },
        { key: 'email_enabled', value: 'true' },
      ],
      total: 3,
    };
  };

  edit(row: any) {
    alert('Edit: ' + row.key);
  }

  remove(row: any) {
    if (confirm(`Delete ${row.key}?`)) {
      alert('Deleted: ' + row.key);
    }
  }
}
