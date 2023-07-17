import { Component, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, firstValueFrom, map } from 'rxjs';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})
export class ArticleComponent {

  markdownFilePath:string;

  constructor( private http:HttpClient, private route:ActivatedRoute) { }

  async ngOnInit() {
    let id = this.route.snapshot.params['id'];
    
    let response = this.http.get('/learn-with-sonu/assets/markdown-sources.json');
    let data:any = await firstValueFrom(response);    
    let item = (data.sources as any[]).find(p=>p.id==id);    
    this.markdownFilePath = `/learn-with-sonu/assets/markdown/${item.path}`;
  }
}
