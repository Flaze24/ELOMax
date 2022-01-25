import { Component, OnInit, Input,  Output,ChangeDetectorRef, EventEmitter, OnChanges} from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
declare var $: any;
@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit, OnChanges{
  @Input() movie:any
  @Input() index:number;
  @Input() parentIndex:number;
  @Input() active:boolean=false
  @Input() activeIndex:number;

  @Output() set_inactive=new EventEmitter<any>()
  @Output() set_focus=new EventEmitter<any>()
  timer
  genres=[]
  constructor(private movieService:MovieService, private cd:ChangeDetectorRef) {


   }

  ngOnInit(): void {

  }

  ngOnChanges(){
    if(this.movie.active){

      
      this.setFocus()

      this.getGenres()
    }
  }


  getGenres(){
    let endpoint=this.movie.type=="movie" ? "/genre/movie/list" : "/genre/tv/list"
    let movie_genres=[]
    this.movieService.getInfo(endpoint,"genres").subscribe(data=>{
      movie_genres=data
      this.genres=this.movie.genres.map(genre=>{
        let ind_genre=movie_genres.find(movie_genre=>movie_genre.id==genre)
        let name=ind_genre.name
        return name
      })
    })

  }

  changeActive(){
    clearTimeout(this.timer)
    this.timer=setTimeout(() => {
      this.getGenres()
      $("#movie-"+this.parentIndex+this.movie.movie_id).focus();
      this.set_inactive.emit({'id':this.movie.id})
    }, 100);

  }

  

  setFocus(){
    setTimeout(() => {
    $("#movie-"+this.parentIndex+this.movie.movie_id).focus();
    }, 100);
  }

  removeFocus(){
    setTimeout(() => {
      $("#movie-"+this.parentIndex+this.movie.movie_id).blur();
    }, 100);
  }

  shiftFocus($event,index){
    
    let code=$event.keyCode || $event.which
    if((this.parentIndex==0 && code==38) || (this.parentIndex==13 && code==40) || (index==0 &&code==37)) return
    this.movie.active=false
    this.removeFocus()
    this.set_focus.emit({"id":this.movie.id, "index":index, "key":code})
  }


}
