import { Injectable } from '@angular/core';
import {Conf} from '../../shared/utils/conf';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Inspection} from '../../shared/models/inspection.model';

const URI = Conf.SERVER_URL + '/api/inspection/';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {

  constructor(
    private http: HttpClient
  ) { }

  getInspection(id: number): Observable<Inspection> {
    return this.http.get<Inspection>(URI + id);
  }

  getInspections(filter: string, option: string): Observable<Inspection[]> {
    return this.http.get<Inspection[]>(URI + filter + '/' + option);
  }

  createInspection(inspection: Inspection): Observable<Inspection> {
    return this.http.post<Inspection>(URI, inspection, Conf.httpOptions);
  }

  updateInspection(inspection: Inspection): Observable<Inspection> {
    return this.http.put<Inspection>(URI, inspection, Conf.httpOptions);
  }
}
