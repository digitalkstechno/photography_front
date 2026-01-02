import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { FormField } from '../../shared/dynamic-form/form.types';
import { PatientNoticeService } from '../../core/patient-notice/patient-notice.service';

@Component({
  selector: 'app-notice',
  standalone: true,
  providers: [PatientNoticeService], // ✅ explicit provider
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: 'notice.component.html',
})
export class CreatePatientNoticeComponent {

  submitLabel = 'Send Notice';

  model: any = {
    patientId: '',
    title: '',
    message: ''
  };

  fields: FormField[] = [
    {
      key: 'title',
      label: 'Title',
      type: 'text',
      class: 'input',
      wrapperClass: 'col-6'
    },
    {
      key: 'message',
      label: 'Message',
      type: 'textarea',
      required: true,
      class: 'textarea',
      wrapperClass: 'col-12'
    }
  ];

  constructor(
    private service: PatientNoticeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Optional: auto-fill patientId from route
    const patientId = this.route.snapshot.paramMap.get('patientId');
    if (patientId) this.model.patientId = patientId;
  }

  submitNotice = async (data: any) => {
    await this.service.createNotice(data).toPromise();
    this.router.navigate(['/admin/patients', data.patientId, 'notices']);
  };
}
