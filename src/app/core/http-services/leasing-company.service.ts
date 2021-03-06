import { Injectable } from '@angular/core';
import {Conf} from '../../shared/utils/conf';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LeasingCompany} from '../../shared/models/leasing-company.model';

const URI = Conf.SERVER_URL + '/api/leasing/';

@Injectable({
  providedIn: 'root'
})
export class LeasingCompanyService {

  constructor(
    private http: HttpClient
  ) { }

  getLeasingCompany(id: number): Observable<LeasingCompany> {
    return this.http.get<LeasingCompany>(URI + id);
  }

  getLeasingCompanies(filter: string, option: string): Observable<LeasingCompany[]> {
    return this.http.get<LeasingCompany[]>(URI + filter + '/' + option);
  }

  createLeasingCompany(leasingCompany: LeasingCompany): Observable<LeasingCompany> {
    return this.http.post<LeasingCompany>(URI, leasingCompany, Conf.httpOptions);
  }

  updateLeasingCompany(leasingCompany: LeasingCompany): Observable<LeasingCompany> {
    return this.http.put<LeasingCompany>(URI, leasingCompany, Conf.httpOptions);
  }

  deleteLeasingCompany(id: number): Observable<string> {
    return this.http.delete<string>(URI + id);
  }
}
