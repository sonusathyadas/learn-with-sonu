import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ASSETS_PREFIX } from 'src/main';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  assets_prefix:string="";

  constructor( @Inject(ASSETS_PREFIX)private asset_prefix:string){
    this.assets_prefix =asset_prefix;
  }
}
