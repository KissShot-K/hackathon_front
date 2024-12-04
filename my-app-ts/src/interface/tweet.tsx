export interface Tweet {
    id: number;
    content: string;
    likes_count: number;
    
}

export interface Reply {
    id: number;
    content: string;
    likes_count: number;
}

export interface ParentTweet {
    id: number;
    content: string;}
