import { Injectable } from '@angular/core';
import {Conf} from '../../shared/utils/conf';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TankFilling} from '../../shared/models/tank-filling.model';

const URI = Conf.SERVER_URL + '/api/fillup';

@Injectable({
  providedIn: 'root'
})
export class TankFillingService {

  constructor(
    private http: HttpClient
  ) { }

  getFillUp(id: number): Observable<TankFilling> {
    return this.http.get<TankFilling>(URI + id);
  }

  getAllFillUps(): Observable<TankFilling[]> {
    return this.http.get<TankFilling[]>(URI);
  }

  getAllFillUpsWithDiscrepancy(): Observable<TankFilling[]> {
    return this.http.get<TankFilling[]>(URI + 'discrepancies');
  }

  createFillUp(tankFilling: TankFilling): Observable<TankFilling> {
    return this.http.post<TankFilling>(URI, tankFilling, Conf.httpOptions);
  }

  updateFillUp(tankFilling: TankFilling): Observable<TankFilling> {
    return this.http.put<TankFilling>(URI + 'correction', tankFilling, Conf.httpOptions);
  }
}
