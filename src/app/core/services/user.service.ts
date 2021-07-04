import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";
import { JsonApiService } from "src/app/core/services/json-api.service";
import { Observable } from 'rxjs';


const defaultUser = {
  username: "Guest"
}
@Injectable()
export class UserService {
  org_location = location.origin.split(":");
  url = this.org_location[0]+":"+this.org_location[1];
  apiURL = this.url+":8100";
  licenseURL = this.url+":8280";
  // licenseURL = "http://192.168.1.115:8280";
  webSockURL = "http://192.168.1.126:8100/socket"

  // apiURL: "http://127.0.0.1:8100";
  // licenseURL: 'http://127.0.0.1:8280';

  // apiURL;
  // licenseURL;
  // webSockURL;

  public user$ = new BehaviorSubject({...defaultUser});

  constructor(private jsonApiService: JsonApiService) {

    // let apiUrl = window.location.href.split(':');                                  
    // this.apiURL =apiUrl[0]+':'+apiUrl[1]+':8100'; 
                                 
    // this.licenseURL =apiUrl[0]+':'+apiUrl[1]+':8280';
                                
    // this.webSockURL =apiUrl[0]+':'+apiUrl[1]+':8100/socket';

    this.jsonApiService.fetch("/user/login-info.json").subscribe(this.user$)
  }

   getLoginInfo():Observable<any> {
    return this.jsonApiService.fetch('/user/login-info.json')
    //   .do((user)=>{
    //     this.userInfo = user;
    //   this.user.next(user)
    // })
  }

  public logout(){
    this.user$.next({...defaultUser})
  }

}
