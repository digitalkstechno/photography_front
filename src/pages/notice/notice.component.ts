import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { FormField } from '../../shared/dynamic-form/form.types';
import { PatientNoticeService } from '../../core/patient-notice/patient-notice.service';

@Component({
  selector: 'app-notice',
  standalone: true,
  providers: [PatientNoticeService], // keep as-is
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: 'notice.component.html',
})
export class CreatePatientNoticeComponent implements OnInit {

  submitLabel = 'Send Notice';
  isEdit = false;
  noticeId: string | null = null;

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
  ) { }

  async ngOnInit() {
    // ✔ existing behavior (patientId from route)
    const patientId = this.route.snapshot.paramMap.get('patientId');
    if (patientId) this.model.patientId = patientId;

    // ✅ NEW: detect edit mode
    this.noticeId = this.route.snapshot.paramMap.get('id');
    if (this.noticeId) {
      this.isEdit = true;
      this.submitLabel = 'Update Notice';

      // prefill notice
      const notice = await firstValueFrom(
        this.service.getNoticeById(this.noticeId)
      );

      this.model = {
        patientId: notice.patientId,
        title: notice.title,
        message: notice.message
      };
    }
  }

  // ✅ SAME submit fn → create OR update
  submitNotice = async (data: any) => {
    if (this.isEdit && this.noticeId) {
      // UPDATE
      await firstValueFrom(
        this.service.updateNotice(this.noticeId, {
          title: data.title,
          message: data.message
        })
      );
    } else {
      // CREATE (unchanged)
      await firstValueFrom(
        this.service.createNotice(data)
      );
    }

    // navigate back
    this.router.navigate(['/admin/patients', data.patientId, 'notices']);
  };
}
