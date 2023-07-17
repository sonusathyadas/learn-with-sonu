import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ASSETS_PREFIX } from 'src/main';
import { Inject} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone:true,
  imports:[RouterModule, CommonModule, HttpClientModule]
})
export class AppComponent {
  
  title = 'Sonu Sathyadas';
  assets_prefix = "";

  constructor(@Inject(ASSETS_PREFIX)private asset_prefix:string){
    this.assets_prefix = asset_prefix;
  }

}
