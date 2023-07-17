import { NgModule, SecurityContext } from "@angular/core";
import { ArticleComponent } from "./components/article/article.component";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { MarkdownModule } from "ngx-markdown";

@NgModule({
    declarations:[ArticleComponent],
    imports:[RouterModule, CommonModule, HttpClientModule, MarkdownModule,MarkdownModule.forRoot({
        loader: HttpClient,
        sanitize: SecurityContext.NONE,
      })],
    exports:[MarkdownModule, RouterModule, HttpClientModule]
})
export class AppModule{

}