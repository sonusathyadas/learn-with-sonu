
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Post } from '../models/post';
import { ASSETS_PREFIX } from 'src/main';
import {firstValueFrom} from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PostService {

    private postsSubject:BehaviorSubject<Post[]>;
    private postsData:Array<Post>;

    constructor(private http: HttpClient, @Inject(ASSETS_PREFIX)private asset_prefix:string) {
        this.postsSubject = new BehaviorSubject<Post[]>(this.postsData);
    }

    public get Posts$(){
        return this.postsSubject.asObservable();
    }


    async loadData(){
        let response = this.http.get(`${this.asset_prefix}/assets/markdown-sources.json`);
        let data: any = await firstValueFrom(response);
        this.postsData =  (data.sources as Array<Post>).sort((val1: Post, val2: Post) => {
            return new Date(val2.postedDate).getTime() - new Date(val1.postedDate).getTime()
        })
        this.postsSubject.next(this.postsData);
    }
}