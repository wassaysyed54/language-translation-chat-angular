import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  URL = 'http://localhost:8080/'
  constructor( private http: HttpClient) { }

  public userSingUp( body: User) {
    console.log(body, 'user body')
    return this.http.post(this.URL + 'register', { body });

  }
}
