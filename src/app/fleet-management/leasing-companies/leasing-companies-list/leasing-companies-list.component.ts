import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {LeasingCompanyService} from '../../../core/http-services/leasing-company.service';
import {LeasingCompany} from '../../../shared/models/leasing-company.model';
import {PaginationListCreatorUtil} from '../../../shared/utils/pagination-list-creator.util';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {FleetFilterDialogComponent} from '../../fleet/fleet-list/fleet-filter-dialog/fleet-filter-dialog.component';
import {FiltersListsService} from '../../../shared/utils/filters-lists.service';

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
  public filter: string = null;
  public filterList: object;
  public option: string = null;
  private defaultFilter: string;
  private readonly iAm = 'leasing';

  constructor(
    private leasingService: LeasingCompanyService,
    private dialog: MatDialog,
    private filtersListsService: FiltersListsService
  ) { }

  ngOnInit() {
    this.initAvailableFiltersList();
    this.initDefaultFilter();
    this.initLeasingCompanies();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Initialize the list of available filters on a key:value base
   * First filter of the list will be used as default filter when entering the view
   */
  private initAvailableFiltersList() {
    this.filterList = this.filtersListsService.getFiltersList(this.iAm);
  }

  /**
   * Initialize the default filter with the key of the first filter in the available filters list
   * Assign default filter value to filter
   */
  private initDefaultFilter() {
    if (this.filterList) {
      this.defaultFilter = String(Object.entries(this.filterList).slice(0, 1)[0][1]);
      this.filter = this.defaultFilter;
    }
  }

  /**
   * Open dialog to choose filtering criteria, passing the available filters list and the current filter to the dialog
   * Get result after closing the dialog and filter accordingly the list
   */
  public doOpenFilterDialog() {
    this.dialog.open(FleetFilterDialogComponent, {
        width: '320px',
        height: '350px',
        data: {list: this.filterList, current: this.filter},
      }
    ).afterClosed().subscribe(filter => {
      if (filter) {
        this.filter = filter.filter;
        this.initLeasingCompanies();
      }
    });
  }

  /**
   * Initiate the list of all leasing companies
   */
  private initLeasingCompanies() {
    this.leasingService.getLeasingCompanies(this.filter, null).subscribe(
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
