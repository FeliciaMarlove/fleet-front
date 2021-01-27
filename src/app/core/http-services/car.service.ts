import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Conf} from '../../shared/utils/conf';
import {Observable} from 'rxjs';
import {Car} from '../../shared/models/car.model';

const URI = Conf.SERVER_URL + '/api/car/';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(
    private http: HttpClient
  ) { }

  getCar(id: string): Observable<Car> {
    return this.http.get<Car>(URI + id);
  }

  getAllCars(): Observable<Car[]> {
    return this.http.get<Car[]>(URI);
  }

  getAllCarsActive(): Observable<Car[]> {
    return this.http.get<Car[]>(URI + 'active');
  }

  getAllCarsArchived(): Observable<Car[]> {
    return this.http.get<Car[]>(URI + 'archived');
  }

  createCar(car: Car): Observable<Car> {
    return this.http.post<Car>(URI, car, Conf.httpOptions);
  }

  updateCar(car: Car): Observable<Car> {
    return this.http.put<Car>(URI, car, Conf.httpOptions);
  }

  getAllCarsByBrand(brand: string): Observable<Car[]> {
    return this.http.get<Car[]>(URI + 'brand/' + brand);
  }

  getAllCarsByFuel(fuel: string): Observable<Car[]> {
    return this.http.get<Car[]>(URI + 'fuel/' + fuel);
  }
}
