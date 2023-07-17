import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { RouterModule, Routes, provideRouter, withComponentInputBinding } from '@angular/router';
import { HomeComponent } from './app/components/home/home.component';
import { AboutComponent } from './app/components/about/about.component';
import { ArticleComponent } from './app/components/article/article.component';
import {  importProvidersFrom } from '@angular/core';
import {  HttpClientModule } from '@angular/common/http';
import { AppModule } from './app/app.module';



const routes: Routes = [
  { path:'', component:HomeComponent, pathMatch:'full'},
  { path:'about', component:AboutComponent},
  { path:'article/:id', component: ArticleComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(HttpClientModule, RouterModule, AppModule),
    { provide: 'ASSETS_PREFIX', useValue:'learn-with-sonu-website'}
  ]
})
  .catch(err => console.error(err));
