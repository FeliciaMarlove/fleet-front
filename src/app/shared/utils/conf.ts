import {HttpHeaders} from '@angular/common/http';

export class Conf {
  public static SERVER_URL = 'http://localhost:8080';
  public static httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
}
