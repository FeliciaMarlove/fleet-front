import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'app-inspection-filter-dialog',
  templateUrl: './inspection-filter-dialog.component.html',
  styleUrls: ['./inspection-filter-dialog.component.scss']
})
export class InspectionFilterDialogComponent implements OnInit {
  public form: FormGroup;
  public filtersList: {key: string, value: string}[] = [];
  public title = 'Filter list';
  public formIsValid = false;
  public maxDate = new Date();

  constructor(
    public matDialogRef: MatDialogRef<InspectionFilterDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {list: object, current: string, option: string}
  ) { }

  ngOnInit() {
    this.initFiltersList();
    this.initForm();
  }

  /**
   * Make a list of key:value filters from the plain JSON object
   */
  private initFiltersList() {
    Object.entries(this.data.list).forEach(
      ([key, value]) => {
        this.filtersList.push({key, value});
      }
    );
  }

  /**
   * Initialize the form
   */
  private initForm() {
    this.form = this.formBuilder.group({
      filter: [this.data.current, Validators.required],
      option: [this.data.option]
    });
  }

  public updateSelection($event: MatSelectChange) {
    // reset selection for 'From date' option if main selection is changed
    this.form.controls.option.setValue(null);
    if ($event.value !== 'DATE_ABOVE') {
      this.formIsValid = true;
    } else {
      this.formIsValid = false;
    }
  }

  public doFilter() {
      this.matDialogRef.close(this.form.value);
  }
}
