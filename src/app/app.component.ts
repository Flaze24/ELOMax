import { Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'elo-max';
  activeRowIndex=0

  moviewRow=[
    { "id":1,
      "section":"Popular Movies",
      "description":"The Hottest New Movies Waiting for You",
      "endpoint":"/movie/popular",
      "active":true,
      "type":"movie",
      "genre":null
    },
    { 
      "id":2,
      "section":"Top Rated Movies",
      "description":"The Best Movies Chosen by the People",
      "endpoint":"/movie/top_rated",
      "active":false,
      "type":"movie",
      "genre":null
    },
    { 
      "id":3,
      "section":"Upcoming Movies",
      "description":"Movies You Can't Wait to See",
      "endpoint":"/movie/upcoming",
      "active":false,
      "type":"movie",
      "genre":null
    },
    {
      "id":4,
      "section":"Trending Movies",
      "description":"Take a Look at the Movies Causing the Biggest Buzz",
      "endpoint":"/trending/movie/week",
      "type":"movie",
      "active":false,
      "genre":null
    },
    {
      "id":5,
      "section":"Popular TV Shows",
      "description": "Hottest shows to binge right now",
      "endpoint":"/tv/popular",
      "type":"tv",
      "active":false,
      "genre":null,

    },
    {
      "id":6,
      "section":"Top Rated TV Show",
      "description": "Best shows to watch",
      "endpoint":"/tv/top_rated",
      "active":false,
      "type":"tv",
      "genre":null,
    },
    {
      "id":7,
      "section":"Trending TV shows",
      "description": "Get a look at what's trending",
      "endpoint":"/trending/tv/week",
      "active":false,
      "type":"tv",
      "genre":null,
    },
    {
      "id":8,
      "section":"Action Movies",
      "description": "Get the adrenaline pumping",
      "endpoint":"/discover/movie",
      "active":false,
      "type":"movie",
      "genre":"28",
    },
    {
      "id":9,
      "section":"Animated Movies",
      "description": "Fun for the whole family",
      "endpoint":"/discover/movie",
      "active":false,
      "type":"movie",
      "genre":"16",
    },
    {
      "id":10,
      "section":"Horror Night",
      "description": "Don't look under the bed",
      "endpoint":"/discover/movie",
      "active":false,
      "type":"movie",
      "genre":"27",
    },
    {
      "id":9,
      "section":"Comedy Gold",
      "description": "Have a laugh",
      "endpoint":"/discover/movie",
      "active":false,
      "type":"movie",
      "genre":"35",
    },
    {
      "id":10,
      "section":"Crime Shows",
      "description": "Release the detective in you",
      "endpoint":"/discover/tv",
      "active":false,
      "type":"tv",
      "genre":"80",
    },
    {
      "id":11,
      "section":"Documentaries",
      "description": "Always a good day to learn something new",
      "endpoint":"/discover/tv",
      "active":false,
      "type":"tv",
      "genre":"99",
    },
    {
      "id":12,
      "section":"Kids' Show",
      "description": "For the children in the house",
      "endpoint":"/discover/tv",
      "active":false,
      "type":"tv",
      "genre":"10762",
    },
  ]

  changeFocusRow($event){
    let code=$event.code
    console.log($event)
    let child_index=$event.index
    this.activeRowIndex=code==38 ? child_index-1 : child_index+1
    let  position = $("#row-"+this.activeRowIndex).offset().top;
    $("html, body").animate({
      scrollTop: position-40
  }, 100);
    // $('body,html').animate({ scrollTop: $('body').height() }, 100);

  }
}
