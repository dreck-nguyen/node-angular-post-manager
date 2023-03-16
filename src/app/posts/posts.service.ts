import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'

import { HttpClient } from '@angular/common/http'
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) { }

  getPosts() {
    // return [...this.posts];
    this.httpClient.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          }
        })
      }))
      .subscribe(
        (transformedPosts) => {
          this.posts = transformedPosts
          this.postsUpdated.next([...this.posts])
        }
      )
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  deletePost(postId: string) {
    this.httpClient.delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        console.log('Deleted!');
        const updatedPost = this.posts.filter(post => post.id !== postId)
        this.posts = updatedPost;
        this.postsUpdated.next([...this.posts])
      })
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.httpClient
      .post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe(
        (responseData) => {
          const id = responseData.postId
          post.id = id
          this.posts.push(post);
          this.postsUpdated.next([...this.posts]);
        }
      );
  }
}
