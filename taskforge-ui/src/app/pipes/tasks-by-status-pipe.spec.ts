import { TasksByStatusPipe } from './tasks-by-status-pipe';

describe('TasksByStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new TasksByStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
