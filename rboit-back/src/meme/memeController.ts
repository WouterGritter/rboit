import express from "express";
import request from "request";

export class MemeController {
    async random(req: express.Request, res: express.Response) {
        try{
            const redditData = await fetch('https://www.reddit.com/r/memes.json?sort=top&t=day')
                .then(r => r.json());

            const posts = redditData.data.children;
            const post = posts[Math.floor(Math.random() * posts.length)];
            const imageUrl = post.data.url_overridden_by_dest;

            res.set('Cache-Control', 'no-store');
            request.get(imageUrl).pipe(res);
        }catch(e) {
            res.status(500);
            res.send(e);
        }
    }
}
