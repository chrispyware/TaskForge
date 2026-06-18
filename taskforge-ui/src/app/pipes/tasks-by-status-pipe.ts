import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../models/task';

@Pipe({
  name: 'tasksByStatus'
})
export class TasksByStatusPipe implements PipeTransform {
  transform(tasks: Task[], status: string): number {
    return tasks.filter(t => t.status === status).length;
  }
}
