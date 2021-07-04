import { EventEmitter } from "events";
import { ITask, IParseTask } from "./tasks";

export interface ISchedulerConfig {
	type: string;
	work: boolean;
	interval: unknown;
	intervalMS: number;
	reservedType: string;
	scheduledTasks: Array<ITask>;
}

export interface ISchedulerInformLog {
	task: IParseTask;
	response: unknown;
	executionTime: number;
}

export interface ISchedulerErrorLog {
	task: IParseTask;
	error: Error;
	executionTime: number;
}

export declare interface Logger {
	on(event: "logs", listener: (data: string) => void): this;
	on(event: "errors", listener: (data: ISchedulerErrorLog) => void): this;
	on(event: "executions", listener: (data: ISchedulerInformLog) => void): this;
}

export class Logger extends EventEmitter {
	public emitText(data: string): boolean {
		return this.emit("logs", data);
	}
	public emitError(data: ISchedulerErrorLog): boolean {
		return this.emit("errors", data);
	}
	public emitSuccess(data: ISchedulerInformLog): boolean {
		return this.emit("executions", data);
	}
}
