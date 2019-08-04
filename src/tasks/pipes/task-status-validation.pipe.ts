import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus, TaskStatusArray } from "../task.model";

export class TaskStatusValidationPipe implements PipeTransform {

  readonly allowedStatuses = TaskStatusArray

  transform(value: any) {
    value = value.toUpperCase()

    if (!this.isStatusValid(value)) throw new BadRequestException(`"${value}" is an invalid status`)
    return value
  }

  private isStatusValid(status: TaskStatus) {
    return this.allowedStatuses.includes(status)
  }
}