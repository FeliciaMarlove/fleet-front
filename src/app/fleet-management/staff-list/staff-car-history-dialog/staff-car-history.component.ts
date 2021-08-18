import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Car} from '../../../shared/models/car.model';
import {StaffMember} from '../../../shared/models/staff-member.model';

@Component({
  selector: 'app-staff-car-history',
  templateUrl: './staff-car-history.component.html',
  styleUrls: ['./staff-car-history.component.scss']
})
export class StaffCarHistoryComponent implements OnInit {
  public displayedColumns: string[] = ['plateNumber', 'brand', 'model', 'fuelType', 'startDate', 'endDate', 'freeText', 'km'];
  public colNames: string[] = ['Plate', 'Brand', 'Model', 'Fuel', 'Start', 'End', 'Note', 'Kilometers'];
  public title = 'Cars history for ' + this.data.staffName;
  public dataSource = this.data.cars;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { cars: Car[]; staffName: string },
    public matDialogRef: MatDialogRef<StaffCarHistoryComponent>
  ) { }

  ngOnInit(): void {
  }

}
