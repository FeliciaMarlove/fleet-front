import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {Inspection} from '../../../shared/models/inspection.model';
import {InspectionService} from '../../../core/http-services/inspection.service';

@Component({
  selector: 'app-inspections-list',
  templateUrl: './inspections-list.component.html',
  styleUrls: ['./inspections-list.component.scss']
})
export class InspectionsListComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['view'];
  public colNames: string[] = [''];
  public dataSource = new MatTableDataSource<Inspection>();
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  public title = 'Car inspections';

  constructor(
    private inspectionService: InspectionService
  ) { }

  ngOnInit() {
    this.initInspectionsList();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Initiate the inspections list with all inspections
   */
  private initInspectionsList() {
    this.inspectionService.getAllInspections().subscribe(
      inspections => {
        console.log(inspections);
        this.dataSource.data = inspections;
      }
    );
  }

  public doOpenInspectionDetail(inspection: any) {
    console.log(inspection);
  }
}
