import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http:HttpClient) { }
  api_key="d8fb2aa91bb0049c7dd9060234b1b996"

  getInfo(endpoint:string, result?, page?:boolean){
    let paginate=page!=undefined ? `&page=${page}` : ''
   
    const url=`https://api.themoviedb.org/3${endpoint}?api_key=${this.api_key}&language=en-US${paginate}`
    return this.http.get(url).pipe(map(data=>data[result]))
  }

  getDiscover(endpoint, genre,result?){
    const url=`https://api.themoviedb.org/3${endpoint}?api_key=${this.api_key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genre}&with_watch_monetization_types=flatrate`
    return this.http.get(url).pipe(map(data=>data[result]))
  }


}
