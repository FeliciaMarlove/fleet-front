import {Injectable} from '@angular/core';
import {Conf} from '../../shared/utils/conf';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Inspection} from '../../shared/models/inspection.model';
import {DatePipe} from '@angular/common';

const URI = Conf.SERVER_URL + '/api/inspection/';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {

  constructor(
    private http: HttpClient,
    public datePipe: DatePipe
  ) {
  }

  getInspection(id: number): Observable<Inspection> {
    return this.http.get<Inspection>(URI + id);
  }

  getInspections(filter: string, option: Date): Observable<Inspection[]> {
    return this.http.get<Inspection[]>(URI + filter + '/' + this.datePipe.transform(option, 'yyyy-MM-dd'));
  }

  createInspection(inspection: Inspection): Observable<Inspection> {
    const dateStart = new Date(inspection.inspectionDate);
    dateStart.setUTCDate(dateStart.getDate());
    inspection.inspectionDate = dateStart;
    const dateEnd = new Date(inspection.sentDate);
    dateEnd.setUTCDate(dateEnd.getDate());
    inspection.sentDate = dateEnd;
    return this.http.post<Inspection>(URI, inspection, Conf.httpOptions);
  }
}
