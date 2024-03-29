import { Injectable } from '@angular/core';
import {Conf} from '../../shared/utils/conf';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StaffMember} from '../../shared/models/staff-member.model';
import {Car} from '../../shared/models/car.model';

const URI = Conf.SERVER_URL + '/api/staff/';

@Injectable({
  providedIn: 'root'
})
export class StaffMemberService {

  constructor(
    private http: HttpClient
  ) { }

  getStaffMember(id: number): Observable<StaffMember> {
    return this.http.get<StaffMember>(URI + id);
  }

  getStaff(filter: string, option: string): Observable<StaffMember[]> {
    return this.http.get<StaffMember[]>(URI + filter + '/' + option);
  }

  updateStaffMember(staffMember: StaffMember): Observable<StaffMember> {
    return this.http.put<StaffMember>(URI, staffMember, Conf.httpOptions);
  }

  getCarsOfStaffMember(id: number): Observable<Car[]> {
    return this.http.get<Car[]>(URI + id + '/cars');
  }

  getCurrentCarOfStaffMember(id: number): Observable<Car> {
    return this.http.get<Car>(URI + id + '/car');
  }

  setCarOfStaffMember(id: number, carId: string): Observable<Car> {
    return this.http.put<Car>(URI + id + '/car', carId);
  }
}
