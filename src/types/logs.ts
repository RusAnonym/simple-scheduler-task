import { IParseTask } from "./tasks";

export type TSchedulerLog = "done" | "error";

export interface ISchedulerLogError {
	task: IParseTask;
	error: Error;
	executionTime: number;
}

export interface ISchedulerLogDone {
	task: IParseTask;
	response: unknown;
	executionTime: number;
}
