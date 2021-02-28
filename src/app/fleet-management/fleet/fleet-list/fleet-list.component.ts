import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {Car} from '../../../shared/models/car.model';
import {CarService} from '../../../core/http-services/car.service';
import {StaffMemberService} from '../../../core/http-services/staff-member.service';
import {PaginationListCreatorUtil} from '../../../shared/utils/pagination-list-creator.util';

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
  public paginationChoices: number[] = [10];
  public currentFilterName = 'active';
  public currentFilterParam = '';
  private availableFilters = [
    {name: 'all', method: this.carService.getAllCars()},
    {name: 'archived', method: this.carService.getAllCarsArchived()},
    {name: 'active', method: this.carService.getAllCarsActive()}
  ];

  constructor(
    private carService: CarService,
    private staffService: StaffMemberService
  ) {
  }

  ngOnInit() {
    this.initCarsList();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Initiate the list of cars according to current filter
   */
  private initCarsList() {
    if (this.currentFilterName === 'brand') {
      this.carService.getAllCarsByBrand(this.currentFilterParam).subscribe(cars =>
        this.assignCarList(cars));
    } else if (this.currentFilterName === 'fuel') {
      this.carService.getAllCarsByFuel(this.currentFilterParam).subscribe(cars => this.assignCarList(cars));
    } else {
      this.availableFilters.find(filter => filter.name === this.currentFilterName).method.subscribe(cars => {
        this.assignCarList(cars);
      });
    }
  }

  /**
   * Assign cars list to the Data source
   * Create pagination according to list size and add Staff member to each Car in the list
   * @param cars The list of cars to display
   */
  private assignCarList(cars) {
    this.paginationChoices = PaginationListCreatorUtil.setPaginationList(cars);
    this.getCarOwner(cars);
    this.dataSource.data = cars;
  }

  /**
   * Assign staff member to each car in the list
   * @param cars The list of cars
   */
  private getCarOwner(cars: Car[]) {
    for (const car of cars) {
      this.staffService.getStaffMember(car.staffMemberId).subscribe(staffMember => {
        car.staffMember = staffMember;
      });
    }
  }

  public doOpenCarDetail(car: Car) {
    console.log(car);
  }

  private filter(filter: string, param: string) {
    if (filter !== this.currentFilterName) {
      this.currentFilterName = filter;
      this.currentFilterParam = param;
      this.initCarsList();
    }
  }
}
