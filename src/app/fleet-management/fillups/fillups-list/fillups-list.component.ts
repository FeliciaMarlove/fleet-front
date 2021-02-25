import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {TankFilling} from '../../../shared/models/tank-filling.model';
import {TankFillingService} from '../../../core/http-services/tank-filling.service';
import {PaginationListCreatorUtil} from '../../../shared/utils/pagination-list-creator.util';

@Component({
  selector: 'app-fillups',
  templateUrl: './fillups-list.component.html',
  styleUrls: ['./fillups-list.component.scss']
})
export class FillupsListComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['warning-icon', 'fdate', 'fdisctype', ];
  public colNames: string[] = ['', 'Date', 'Discrepancy'];
  public dataSource = new MatTableDataSource<TankFilling>();
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  public title = 'Fuel usage report';
  public paginationChoices: number[] = [10];

  constructor(
    private tankFillingService: TankFillingService
  ) { }

  ngOnInit() {
    this.initFillups();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Initiate the list with all fuel operations
   */
  private initFillups() {
    this.tankFillingService.getAllFillUps().subscribe(
      fillups => {
        this.paginationChoices = PaginationListCreatorUtil.setPaginationList(fillups);
        this.dataSource.data = fillups;
      },
      error => console.log(error)
    );
  }

  public doOpenWarning(fillup: TankFilling) {
    console.log(fillup)
  }
}
