import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { FormField } from '../../shared/dynamic-form/form.types';
import { UserService } from '../../core/user/user.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './add-user.component.html'
})
export class AddUserComponent {

  submitLabel = 'Create User';

  // ✅ SAFE DEFAULT MODEL
  model: any = {
    name: '',
    email: '',
    role: 'USER'
  };

  fields: FormField[] = [
    {
      key: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      class: 'input',
      wrapperClass: 'col-6'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      class: 'input',
      wrapperClass: 'col-6'
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { label: 'User', value: 'USER' },
        { label: 'Doctor', value: 'DOCTOR' },
        { label: 'Staff', value: 'STAFF' }
      ],
      class: 'select',
      wrapperClass: 'col-4'
    }
  ];

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  submitUser = async (data: any) => {
    // await firstValueFrom(
    //   this.userService.createUser(data)
    // );

    this.router.navigate(['/admin/users']);
  };
}
