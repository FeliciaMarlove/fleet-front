import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Brand} from '../../../../shared/enums/brand.enum';
import {FuelType} from '../../../../shared/enums/fuel-type.enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-fleet-filter-dialog',
  templateUrl: './fleet-filter-dialog.component.html',
  styleUrls: ['./fleet-filter-dialog.component.scss']
})
export class FleetFilterDialogComponent implements OnInit {
  public form: FormGroup;
  public filtersList: {key: string, value: string}[] = [];
  public brandEnum = Brand;
  public fuelEnum = FuelType;

  constructor(
    private matDialogRef: MatDialogRef<FleetFilterDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {list: object, current: string, option: string}
  ) { }

  ngOnInit() {
    this.initList();
    this.initForm();
  }

  /**
   * Make a list of key:value filters from the plain JSON object
   */
  private initList() {
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
        filter: [this.data.current],
        option: [this.data.option]
    });
  }

}
