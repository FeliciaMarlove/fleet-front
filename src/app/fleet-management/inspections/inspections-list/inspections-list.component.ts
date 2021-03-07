import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Inspection} from '../../../shared/models/inspection.model';
import {InspectionService} from '../../../core/http-services/inspection.service';
import {PaginationListCreatorUtil} from '../../../shared/utils/pagination-list-creator.util';
import {StaffMemberService} from '../../../core/http-services/staff-member.service';
import {CarService} from '../../../core/http-services/car.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-inspections-list',
  templateUrl: './inspections-list.component.html',
  styleUrls: ['./inspections-list.component.scss']
})
export class InspectionsListComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['view', 'idate', 'iby', 'iplate', 'icar', 'istaff', 'isent'];
  public colNames: string[] = ['', 'Date of inspection', 'Expertised by', 'Plate number', 'Car', 'Staff Member', 'Sent?'];
  public dataSource = new MatTableDataSource<Inspection>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public title = 'Car inspections';
  public paginationChoices: number[] = [10];

  constructor(
    private inspectionService: InspectionService,
    private staffService: StaffMemberService,
    private carService: CarService
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
    // TODO
    this.inspectionService.getInspections(null, null).subscribe(
      inspections => {
        this.assignCarAndStaffMember(inspections);
        this.paginationChoices = PaginationListCreatorUtil.setPaginationList(inspections);
        this.dataSource.data = inspections;
      }
    );
  }

  public doOpenInspectionDetail(inspection: any) {
    console.log(inspection);
  }

  /**
   * Assign car and staff member to each inspection in the list
   * @param inspections The list of inspections
   */
  private assignCarAndStaffMember(inspections: Inspection[]) {
    for (const insp of inspections) {
      this.staffService.getStaffMember(insp.staffMemberId).subscribe(staffMember => {
        insp.staffMember = staffMember;
      });
      this.carService.getCar(insp.plateNumber).subscribe(car => {
        insp.car = car;
      });
    }
  }
}
