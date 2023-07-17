import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RouterLink, RouterModule } from '@angular/router';

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

  constructor(private http: HttpClient) {

  }

  async ngOnInit(){
    let response = this.http.get('/learn-with-sonu/assets/markdown-sources.json');
    let data:any = await firstValueFrom(response);
    this.sources = data.sources;
    
  }

}
