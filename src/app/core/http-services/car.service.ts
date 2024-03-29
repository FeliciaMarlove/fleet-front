import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Conf} from '../../shared/utils/conf';
import {Observable} from 'rxjs';
import {Car} from '../../shared/models/car.model';

const URI = Conf.SERVER_URL + '/api/car/';

@Injectable({
  providedIn: 'root',
})
export class CarService {

  constructor(
    private http: HttpClient
  ) { }

  getCar(id: string): Observable<Car> {
    return this.http.get<Car>(URI + id);
  }

  getCars(filter: string, option: string): Observable<Car[]> {
    return this.http.get<Car[]>(URI + filter + '/' + option);
  }

  createCar(car: Car): Observable<Car> {
    const dateStart = new Date(car.startDate);
    dateStart.setUTCDate(dateStart.getDate());
    car.startDate = dateStart;
    if (car.endDate) {
      const dateEnd = new Date(car.endDate);
      dateEnd.setUTCDate(dateEnd.getDate());
      car.endDate = dateEnd;
    }
    return this.http.post<Car>(URI, car, Conf.httpOptions);
  }

  updateCar(car: Car): Observable<Car> {
    if (car.endDate) {
      const dateEnd = new Date(car.endDate);
      dateEnd.setUTCDate(dateEnd.getDate());
      car.endDate = dateEnd;
    }
    return this.http.put<Car>(URI, car, Conf.httpOptions);
  }
}
