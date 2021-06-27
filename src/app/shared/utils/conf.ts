import {HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export class Conf {
  public static SERVER_URL = `${environment.APIEndpoint}`;
  public static httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
}
