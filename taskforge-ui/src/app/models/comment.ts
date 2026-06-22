export interface Comment {
    id: number;
    body: string;
    authorId: number;
    authorName: string;
    taskId: number;
    createdAt: string;
}

export interface CreateCommentRequest {
    body: string;
}