import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { of } from 'rxjs';
import { Country } from '../common/country';
import { HttpClient } from '@angular/common/http';
import { State } from '../common/state';
@Injectable({
  providedIn: 'root'
})
export class ShopFormService {
  private countriesUrl ='http://localhost:8080/api/countries';
  private statesURl = 'http://localhost:8080/api/states';
  constructor(private httpClient:HttpClient) { }

  getCreditCardMonths(startMonth: number): Observable<number[]>{
    let data: number[] =[];

    //build an array for "Month" dropwdown
    //-loop through 12 number 

    for(let theMonth = startMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }
    return of(data);
  }
  getCountries():Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response=> response._embedded.countries)
    )
  }

  getStates(theCountryCode: string):Observable<State[]>{
    const searchStatesUrl =`${this.statesURl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response=> response._embedded.states)
    )
  }

  getCreditCardYears(): Observable<number[]>{
    let data: number[]=[];
    // build an array for "Year" dropdown list
    //- start at current year and loop for 10 
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }
    return of(data);
  }
}
interface GetResponseCountries{
  _embedded:{
    countries: Country[];
  }
  
}
interface GetResponseStates{
  _embedded:{
    states: Country[];
  }
}