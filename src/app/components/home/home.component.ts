import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ASSETS_PREFIX } from 'src/main';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [HttpClient],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sources:any[];

  constructor(private http: HttpClient, @Inject(ASSETS_PREFIX)private asset_prefix:string) {

  }

  async ngOnInit(){
    let response = this.http.get(`${this.asset_prefix}/assets/markdown-sources.json`);
    let data:any = await firstValueFrom(response);
    this.sources = (data.sources as Array<Post>).sort((val1:Post, val2:Post)=> {
      return new Date(val2.postedDate).getTime() - new Date(val1.postedDate).getTime()
    })
    
  }

}
