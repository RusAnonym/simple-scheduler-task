import { IParseTask } from "./tasks";

export type TSchedulerLog = string;

export interface ISchedulerLogError {
	task: IParseTask;
	error: Error;
	executionTime: number;
}

export interface ISchedulerLogInform {
	task: IParseTask;
	response: unknown;
	executionTime: number;
}
