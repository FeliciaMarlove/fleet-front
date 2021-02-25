import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {Car} from '../../../shared/models/car.model';
import {CarService} from '../../../core/http-services/car.service';

@Component({
  selector: 'app-fleet-list',
  templateUrl: './fleet-list.component.html',
  styleUrls: ['./fleet-list.component.scss']
})
export class FleetListComponent implements OnInit, AfterViewInit {
  public displayedColums: string[] = [];
  public dataSource = new MatTableDataSource<Car>();
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  public title = 'Fleet';

  constructor(
    private carService: CarService
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
      this.dataSource.data = cars;
    },
      error => console.log(error)
    );
  }
}
