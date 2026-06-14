export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string;
    projectId: number;
    projectName: string;
    assignedToId: number;
    assigneeName: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskRequest {
    title: string;
    description?: string;
    projectId: number;
    assignedToId?: number;
    priority: string;
    dueDate?: string;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    assignedToId?: number;
    dueDate?: string;
}

export interface UpdateTaskStatusRequest {
    status: string;
}