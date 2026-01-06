import { Component, OnInit } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { UserService } from '../../core/user/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  users: any[] = [];
  loading = false;

  // Table column config (example)
  columns = [
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  fetchUsers = (params: any) => {
    return this.userService.getUsers(params).toPromise();
  };

  loadUsers() {
    this.loading = true;

    this.userService.getUsers().subscribe({
      next: (res) => {
        // adjust if your API response is wrapped
        this.users = res;
        console.log(res, "sdfsdf");

        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.loading = false;
      }
    });
    console.log(this.users, "sdfsdf");
  }

  // Optional: delete handler (if table emits event)
  onDelete(userId: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.userService.deleteUser(userId).subscribe(() => {
      this.loadUsers();
    });
  }

  getUpdateRoute(row: any): string {
    return `/admin/users/edit/${row._id}`;
  }

}
