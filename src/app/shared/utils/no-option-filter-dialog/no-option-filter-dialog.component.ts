import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

/**
 * Generic filter dialog for lists that don't contain filters requiring an option
 */

@Component({
  selector: 'app-no-option-filter-dialog',
  templateUrl: './no-option-filter-dialog.component.html',
  styleUrls: ['./no-option-filter-dialog.component.scss']
})
export class NoOptionFilterDialogComponent implements OnInit {
  public form: FormGroup;
  public filtersList: {key: string, value: string}[] = [];
  public title = 'Filter list';

  constructor(
    public matDialogRef: MatDialogRef<NoOptionFilterDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {list: object, current: string}
  ) { }

  ngOnInit(): void {
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
    });
  }

  public doFilter() {
    this.matDialogRef.close(this.form.value);
  }
}
