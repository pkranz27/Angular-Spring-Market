import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  constructor(private router:Router){}

  // Imlpmenets a search function for a findBy Spring backend using JPA
  doSearch(value:String):void{
    console.log(`value=${value}`);
    this.router.navigateByUrl(`/search/${value}`);
  }
}
