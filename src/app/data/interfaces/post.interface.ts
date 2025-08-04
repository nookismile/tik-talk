import { Profile } from './profile.interface'

// Dto - data transfer object - обьект, который передается с бэка, между сервисами и т.д.
export interface PostCreateDto {
    title: string,
    content: string,
    authorId: number
}

export interface Post {
    id: number,
    title: string,
    communityId: number,
    content: string,
    author: Profile,
    images: string[],
    createdAt: string,
    updatedAt: string,
    likes: number,
    comments: PostComment[]
}

export interface PostComment {
    id: number,
    text: string,
    author: {
        id: number,
        username: string,
        avatarUrl: string,
        subscribersAmount: number
    },
    postId: number,
    commentId: number,
    createdAt: string,
    updatedAt: string
}

export interface CommentCreateDto {
    text: string,
    authorId: number,
    postId: number
}