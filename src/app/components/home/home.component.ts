import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { ASSETS_PREFIX } from 'src/main';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [HttpClient],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts:Post[];

  constructor(private http: HttpClient, @Inject(ASSETS_PREFIX)private asset_prefix:string, private svc:PostService) {

  }

  async ngOnInit(){
    this.svc.Posts$.subscribe(data=>this.posts = data);   
  }

}
