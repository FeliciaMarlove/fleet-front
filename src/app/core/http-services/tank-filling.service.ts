import { Injectable } from '@angular/core';
import {Conf} from '../../shared/utils/conf';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TankFilling} from '../../shared/models/tank-filling.model';
import {DatePipe} from '@angular/common';

const URI = Conf.SERVER_URL + '/api/fillup/';

@Injectable({
  providedIn: 'root'
})
export class TankFillingService {

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) { }

  getFillUp(id: number): Observable<TankFilling> {
    return this.http.get<TankFilling>(URI + id);
  }

  getFillUps(filter: string, option: Date): Observable<TankFilling[]> {
    return this.http.get<TankFilling[]>(URI + filter + '/' + this.datePipe.transform(option, 'yyyy-MM-dd'));
  }

  createFillUp(tankFilling: TankFilling): Observable<TankFilling> {
    const dateStart = new Date(tankFilling.dateTimeFilling);
    dateStart.setUTCDate(dateStart.getDate());
    tankFilling.dateTimeFilling = dateStart;
    return this.http.post<TankFilling>(URI, tankFilling, Conf.httpOptions);
  }

  updateFillUp(tankFilling: TankFilling): Observable<TankFilling> {
    const dateStart = new Date(tankFilling.dateTimeFilling);
    dateStart.setUTCDate(dateStart.getDate());
    tankFilling.dateTimeFilling = dateStart;
    return this.http.put<TankFilling>(URI + 'correction', tankFilling, Conf.httpOptions);
  }
}
