import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InventoryService {  
  // inventoryItems: any = [];
  url = "http://localhost:3000/items";
  email = sessionStorage.getItem('email');
  options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

  constructor(private HttpClient: HttpClient) { }

  getList(): Observable<any> {
        // return this.HttpClient.get("./assets/inventory.json");
        return this.HttpClient.get(this.url);
    }
  // {
  //   return this.inventoryItems;
  // }

  insertItems(data): Observable<any>{
    return this.HttpClient.post(this.url, data, this.options);
  }

  updateItem(data): Observable<any>{
    return this.HttpClient.put(this.url, data, this.options)
  }

  removeItem(id): Observable<any>{
    return this.HttpClient.delete(this.url, id);
  }

  editInternalTagValue(id): Observable<any>{        
    let editRes = this.HttpClient.get(this.url +'/'+id)
    return editRes
  }
}
