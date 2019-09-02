import { Test } from '@nestjs/testing'
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockUser = { id: 12, username: 'Test user' }

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
})

describe('TasksService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTasksRepository }
      ]
    }).compile()

    tasksService = await module.get<TasksService>(TasksService)
    taskRepository = await module.get<TaskRepository>(TaskRepository)
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue')
      expect(taskRepository.getTasks).not.toHaveBeenCalled()
      const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Some search query' }
      const result = await tasksService.getTasks(filters, mockUser)
      expect(taskRepository.getTasks).toHaveBeenCalled()
      expect(result).toEqual('someValue')
    });
  });

  describe('getTaskById', () => {
    it('calls tasksRepository.findOne() and successfully retrieve and return the task', async () => {
      const mockTask = { title: 'Test task', description: 'Test desc' }
      taskRepository.findOne.mockResolvedValue(mockTask)

      const result = await tasksService.getTaskById(1, mockUser)
      expect(result).toEqual(mockTask)

      expect(taskRepository.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: mockUser.id } })
    });

    it('throws an error as task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null)
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException)
    });
  });

  describe('createTask', () => {
    it('calls taskRepository.create() and returns the result', async () => {
      const createTasksDto = { title: 'Test task', description: 'Test desc' }
      const mockResult = { ...createTasksDto, status: TaskStatus.OPEN }
      taskRepository.createTask.mockResolvedValue(mockResult)

      expect(taskRepository.createTask).not.toHaveBeenCalled()
      const result = await tasksService.createTask(createTasksDto, mockUser)
      expect(taskRepository.createTask).toHaveBeenCalledWith(createTasksDto, mockUser)
      expect(result).toEqual(mockResult)
    });
  });

  describe('deleteTask', () => {
    it('call taskRepository.deleteTask() to delete a task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 })

      expect(taskRepository.delete).not.toHaveBeenCalled()
      await tasksService.deleteTask(1, mockUser)
      expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id })
    });

    it('throws an error as task could not be found', () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 })
      expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException)
    });
  });

  describe('updateTaskStatus', () => {
    it('update a task status', async () => {
      const mockTask = { title: 'Test task', description: 'Test desc', status: TaskStatus.OPEN }
      const mockStatus = TaskStatus.DONE
      const save = jest.fn().mockResolvedValue({ ...mockTask, status: mockStatus })
      tasksService.getTaskById = jest.fn().mockResolvedValue({ ...mockTask, save })

      expect(tasksService.getTaskById).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      const result = await tasksService.updateTaskStatus(1, mockStatus, mockUser)
      expect(tasksService.getTaskById).toHaveBeenCalled()
      expect(save).toHaveBeenCalled()

      expect(result).toEqual({ ...mockTask, status: mockStatus })
    });
  });

});