import { TaskStatus, TaskStatusArray } from "../task.model";
import { IsOptional, IsIn, IsNotEmpty } from "class-validator";

export class GetTasksFilterDto {
  @IsOptional()
  @IsIn(TaskStatusArray)
  status: TaskStatus

  @IsOptional()
  @IsNotEmpty()
  search: string
}
