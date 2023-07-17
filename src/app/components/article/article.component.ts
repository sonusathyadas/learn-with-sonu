import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ASSETS_PREFIX } from 'src/main';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})
export class ArticleComponent {

  markdownFilePath:string;

  constructor( private http:HttpClient, private route:ActivatedRoute, @Inject(ASSETS_PREFIX)private asset_prefix:string) 
  {
   }

  async ngOnInit() {
    let id = this.route.snapshot.params['id'];
    
    let response = this.http.get(`${this.asset_prefix}/assets/markdown-sources.json`);
    let data:any = await firstValueFrom(response);    
    let item = (data.sources as any[]).find(p=>p.id==id);    
    this.markdownFilePath = `${this.asset_prefix}/assets/markdown/${item.path}`;
  }
}
