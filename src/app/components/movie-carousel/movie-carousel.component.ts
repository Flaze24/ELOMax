import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit , SimpleChanges, Directive, ViewChildren, ElementRef, QueryList, ViewChild } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
declare var $: any;

@Directive({
  selector: '.carousel-item'
})
export class CarouselItemElement {
}

@Component({
  selector: 'app-movie-carousel',
  templateUrl: './movie-carousel.component.html',
  styleUrls: ['./movie-carousel.component.css']
})
export class MovieCarouselComponent implements OnInit, OnChanges,AfterViewInit  {
  @Input() row_info:any=''
  @Input() rowIndex:number
  @Output() set_focus_row=new EventEmitter<any>()
  @Input() activeRow:number

  @ViewChildren(CarouselItemElement, { read: ElementRef }) private itemsElements : QueryList<ElementRef>;
  @ViewChild('carousel') private carousel : ElementRef;

  private player : AnimationPlayer;
  private itemWidth : number;
  timing = '250ms ease-in';


  movies:any[]=[]
  carouselWrapperStyle = {}
  placeholder_movies=10
  activate_placeholder:boolean=true
  activeIndex=-1
  oldIndex=0
  constructor(private movieService:MovieService,  private builder : AnimationBuilder) { }
  private currentSlide = 0;
  showControls = true;

  ngOnInit(): void {
    this.activeIndex=this.rowIndex==this.activeRow ? 0 : -1
    if(this.row_info.id<8){
      this.getInfoRow(this.row_info.endpoint)
    }else{
      this.getDiscoverRow(this.row_info.endpoint, this.row_info.genre)
    }

    
  }



  ngOnChanges(): void {
      if(this.activeRow==this.rowIndex){

        if(this.movies.length>0){
          this.activeIndex=0
          this.activeIndex=this.oldIndex>0 ? this.oldIndex: 0
          this.movies[this.activeIndex].active=true

          // this.prev()
        }
        
      }else{
        this.activeIndex=-1
      }
  }

  next() {
    if( this.activeIndex + 1 === this.movies.length ){
      this.activeIndex = 0;

    }else{
      this.activeIndex = (this.activeIndex + 1) % this.movies.length;

    };
    const offset = this.activeIndex * this.itemWidth;
    this.oldIndex=this.activeIndex
    const myAnimation : AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }

  prev() {
    this.activeIndex=this.activeIndex === 0 ? (this.movies.length-10) % this.movies.length: ((this.activeIndex - 1) + this.movies.length) % this.movies.length
    console.log(this.activeIndex)
    const offset = this.activeIndex * this.itemWidth;
    this.oldIndex=this.activeIndex
    const myAnimation : AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }

  private buildAnimation( offset ) {
    return this.builder.build([
      animate(this.timing, style({ transform: `translateX(-${offset}px)` }))
    ]);
  }

  ngAfterViewInit() {
    this.itemWidth = 330;
    setTimeout(() => {
      this.carouselWrapperStyle = {
        width: `${this.itemWidth*this.movies.length}px`
      }
    }, 1000);

  }




  getInfoRow(endpoint){

      this.movieService.getInfo(endpoint,"results").subscribe(data=>{
        if(data.length>0){
          this.movies=data.map((movie,index)=>{
            let obj={"id":index,"title":this.row_info.type=="movie" ? movie.title: movie.name, "active":index==0 && this.rowIndex==0 ? true: false, "type":this.row_info.type, "movie_id":movie.id, "release_date":this.row_info.type=="movie" ? movie.release_date: movie.first_air_date,"poster":movie.poster_path, "genres":movie.genre_ids,"votes":movie.vote_average}
            return obj
          })
          let extra=data.filter((movie,index)=>index<10).map((movie,index)=>{
            let obj={"id":index+20,"title":this.row_info.type=="movie" ? movie.title: movie.name, "active":false, "type":this.row_info.type, "movie_id":index+20, "release_date":this.row_info.type=="movie" ? movie.release_date: movie.first_air_date,"poster":movie.poster_path, "genres":movie.genre_ids,"votes":movie.vote_average}
            return obj
          })
          this.movies=[...this.movies, ...extra]

          this.activate_placeholder=false
        }

      })


  }

  getDiscoverRow(endpoint, genre){
    this.movieService.getDiscover(endpoint,genre,"results").subscribe(data=>{
      if(data.length>0){
        this.movies=data.map((movie,index)=>{
          if(index==0){
            $("#movie-"+index).focus()
          }
          let obj={"id":index,"title":this.row_info.type=="movie" ? movie.title: movie.name,"active":index==0 && this.rowIndex==0 ? true: false, "movie_id":movie.id, "type":this.row_info.type, "release_date":this.row_info.type=="movie" ? movie.release_date: movie.first_air_date,"poster":movie.poster_path, "genres":movie.genre_ids,"votes":movie.vote_average}
          return obj
        })
        let extra=data.filter((movie,index)=>index<10).map((movie,index)=>{
          if(index==0){
            $("#movie-"+index).focus()
          }
          let obj={"id":index+20,"title":this.row_info.type=="movie" ? movie.title: movie.name,"active":false, "movie_id":index+20, "type":this.row_info.type, "release_date":this.row_info.type=="movie" ? movie.release_date: movie.first_air_date,"poster":movie.poster_path, "genres":movie.genre_ids,"votes":movie.vote_average}
          return obj
        })
        this.movies=[...this.movies, ...extra]

        this.activate_placeholder=false
      }

    })
  }

  changeActive($event){
    let id=$event.id;
    let movie_active=this.movies.find(movie=> movie.active==true && movie.id!=id)
    if(movie_active){
      let index_movie=this.movies.indexOf(movie_active)
      movie_active.active=false
      this.activeIndex=index_movie
      // this.movies[index_movie]=movie_active
    }

  }

  changeFocus($event){
    let code=$event.key
    if(code==37 || code==39){
      this.changeFocusMovies($event, code)
    }else{
      this.changeFocusRow(code)
    }


  }

  changeFocusRow(code){
    this.set_focus_row.emit({'index':this.rowIndex, 'code':code})
  }

  changeFocusMovies($event,code){
    let id=code==39 ? $event.id+1 : $event.id-1
    let index=$event.index
    let next_movie=this.movies.find(movie=> movie.id==id)
    if(next_movie){
      next_movie.active=true
      if(code==39){
        this.next()
      }else{
        this.prev()
      }
      // this.activeIndex=code==39 ? index+1 : index-1

    }
  }

  shiftFocus($event,index){
    console.log($event)
    let code=$event.keyCode || $event.which
    if(code==37 || code==39){
      console.log($("#movie-"+index))
    } 
  }

}
