import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ASSETS_PREFIX } from 'src/main';
import { Inject} from '@angular/core';
import { PostService } from './services/post.service';
import { Post } from './models/post';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone:true,
  imports:[RouterModule, CommonModule, HttpClientModule]
})
export class AppComponent implements OnInit {
  
  title = 'Sonu Sathyadas';
  assets_prefix = "";

  constructor(@Inject(ASSETS_PREFIX)private asset_prefix:string, private svc:PostService){
    this.assets_prefix = asset_prefix;
  }

  async ngOnInit(){
    await this.svc.loadData();
  }

}
