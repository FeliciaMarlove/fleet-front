import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LeasingCompany} from '../../../shared/models/leasing-company.model';
import {LeasingCompanyService} from '../../../core/http-services/leasing-company.service';
import {BelgianPhoneNumberPipe} from '../../../shared/pipe/belgian-phone-number.pipe';

@Component({
  selector: 'app-leasing-companies-detail',
  templateUrl: './leasing-companies-detail.component.html',
  styleUrls: ['./leasing-companies-detail.component.scss']
})
export class LeasingCompaniesDetailComponent implements OnInit {
  public form: FormGroup;
  public leasingCompany: LeasingCompany = this.data.leasingCompany;
  public title = this.leasingCompany ? 'Modify' : 'Create';
  // !! negates non-existence => states if it exists (else would assign the object itself if exists)
  public readonly modifying = !!this.leasingCompany;

  constructor(
    public matDialogRef: MatDialogRef<LeasingCompaniesDetailComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { leasingCompany },
    private leasingService: LeasingCompanyService,
    public belgianPhonePipe: BelgianPhoneNumberPipe
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Initialize form either blank (create) or with initial values (modify)
   */
  private initForm() {
    this.form = this.formBuilder.group({
      leasingCompanyName: [this.modifying ? this.leasingCompany.leasingCompanyName : '', Validators.required],
      leasingCompanyContactPerson: [this.modifying ? this.leasingCompany.leasingCompanyContactPerson : ''],
      leasingCompanyPhone: [this.modifying ? this.belgianPhonePipe.transform(this.leasingCompany.leasingCompanyPhone) : ''],
      leasingCompanyEmail: [this.modifying ? this.leasingCompany.leasingCompanyEmail : '', Validators.email],
      active: [this.modifying ? this.leasingCompany.active : true]
    });
  }

  /**
   * Close and call update or create method
   */
  public doClose() {
    if (this.modifying) {
      this.form.addControl('leasingCompanyId', new FormControl(this.leasingCompany.leasingCompanyId));
      this.leasingService.updateLeasingCompany(this.form.value).subscribe( () => {
        this.matDialogRef.close(true);
      });
    } else {
      this.leasingService.createLeasingCompany(this.form.value).subscribe(() => {
        this.matDialogRef.close(true);
      });
    }
  }
}
