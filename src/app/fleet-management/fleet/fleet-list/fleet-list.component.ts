import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {Car} from '../../../shared/models/car.model';
import {CarService} from '../../../core/http-services/car.service';
import {StaffMemberService} from '../../../core/http-services/staff-member.service';

@Component({
  selector: 'app-fleet-list',
  templateUrl: './fleet-list.component.html',
  styleUrls: ['./fleet-list.component.scss']
})
export class FleetListComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['view', 'cplate', 'cbrand', 'cmodel', 'cfuel', 'cstaff'];
  public colNames: string[] = ['', 'Plate', 'Brand', 'Model', 'Fuel', 'Owner'];
  public dataSource = new MatTableDataSource<Car>();
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  public title = 'Fleet';

  constructor(
    private carService: CarService,
    private staffService: StaffMemberService
  ) { }

  ngOnInit() {
    this.initActiveCarsList();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Initiate the list of cars with active cars only
   */
  private initActiveCarsList() {
    this.carService.getAllCarsActive().subscribe( cars => {
        this.getCarOwner(cars);
        this.dataSource.data = cars;
    },
      error => console.log(error)
    );
  }

  /**
   * Assign staff member to each car in the list
   * @param cars The list of cars
   */
  private getCarOwner(cars: Car[]) {
    for (const car of cars) {
      this.staffService.getStaffMember(car.staffMemberId).subscribe( staffMember => {
        car.staffMember = staffMember;
      });
    }
  }

  public doOpenCarDetail(car: Car) {
    console.log(car);
  }
}
