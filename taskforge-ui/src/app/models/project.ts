export interface Project {
    id: number;
    name: string;
    description: string;
    ownerId: number;
    ownderName: string;
    taskCount: number;
    createAt: string;
}

export interface CreateProjectRequest {
    name: string;
    description: string;
}