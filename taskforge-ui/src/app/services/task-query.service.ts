import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, map, mergeMap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ProjectService } from './project.service';
import { TaskService } from './task.service';
import { Task } from '../models/task';

@Injectable({
    providedIn: 'root'
})
export class TaskQueryService {
    constructor(
        private projectService: ProjectService,
        private taskService: TaskService
    ) {}

    getAllProjectTasks(): Observable<Task[]> {
        return this.projectService.getProjects().pipe(
            map(projects => projects.map(projects => projects.id)),
            map(projectIds => {
                if (projectIds.length === 0) {
                    return of([] as Task[]);
                }

                const taskRequests = projectIds.map(projectId =>
                    this.taskService.getTasksByProjectId(projectId).pipe(
                        catchError(() => of([] as Task[]))
                    )
                );

                return forkJoin(taskRequests).pipe(
                    map(taskGroups => taskGroups.flat())
                );
            }),
            // flatten Observable<Observable<Task[]>>
            mergeMap(taskResults => taskResults)
        );
    }

    getRecentTasks(limit = 10): Observable<Task[]> {
        return this.getAllProjectTasks().pipe(
            map(tasks =>
            [...tasks]
            .sort((a, b) => this.sortNewestFirst(a, b))
            .slice(0, limit)
            )
        );
    }

    getInProgressTasks(): Observable<Task[]> {
        return this.getAllProjectTasks().pipe(
            map(tasks => 
            [...tasks]
            .filter(task => task.status === 'IN_PROGRESS')
            .sort((a, b) => this.sortNewestFirst(a, b))
            )
        );
    }

    getRecentTasksFrom(tasks: Task[], limit?: number): Task[] {
        const sortedTasks = [...tasks].sort((a, b) => this.sortNewestFirst(a, b));
        return limit ? sortedTasks.slice(0, limit) : sortedTasks;
    }

    getInProgressTasksFrom(tasks: Task[]): Task[] {
        return this.getRecentTasksFrom(
            tasks.filter(task => task.status === 'IN_PROGRESS')
        );
    }

    private sortNewestFirst(a: Task, b: Task): number {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
}