import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {LeasingCompanyService} from '../../../core/http-services/leasing-company.service';
import {LeasingCompany} from '../../../shared/models/leasing-company.model';
import {PaginationListCreatorUtil} from '../../../shared/utils/pagination-list-creator.util';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-leasing-companies-list',
  templateUrl: './leasing-companies-list.component.html',
  styleUrls: ['./leasing-companies-list.component.scss']
})
export class LeasingCompaniesListComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['edit', 'lname', 'lcontact', 'lphone', 'lemail', 'lactive'];
  public colNames: string[] = ['', 'Name', 'Contact person', 'Phone', 'Email', 'Active'];
  public dataSource = new MatTableDataSource<LeasingCompany>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public title = 'Leasing companies';
  public paginationChoices: number[] = [10];

  constructor(
    private leasingService: LeasingCompanyService
  ) { }

  ngOnInit() {
    this.initLeasingCompanies();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Initiate the list of all leasing companies
   */
  private initLeasingCompanies() {
    // TODO
    this.leasingService.getLeasingCompanies(null, null).subscribe(
      leasingCompanies => {
        this.paginationChoices = PaginationListCreatorUtil.setPaginationList(leasingCompanies);
        this.dataSource.data = leasingCompanies;
      },
      error => console.log(error)
    );
  }

  doOpenLeasingDetail(leasingCompany: LeasingCompany) {
    console.log(leasingCompany);
  }
}
