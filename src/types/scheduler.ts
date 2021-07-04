import { EventEmitter } from "events";
import { ITask, IParseTask } from "./tasks";

export interface SchedulerConfig {
	type: string;
	work: boolean;
	interval: unknown;
	intervalMS: number;
	reservedType: string;
	scheduledTasks: Array<ITask>;
}

export interface SchedulerInformLog {
	task: IParseTask;
	response: unknown;
	executionTime: number;
}

export interface SchedulerErrorLog {
	task: IParseTask;
	error: Error;
	executionTime: number;
}

export declare interface Logger {
	on(event: "logs", listener: (data: string) => void): this;
	on(event: "errors", listener: (data: SchedulerErrorLog) => void): this;
	on(event: "executions", listener: (data: SchedulerInformLog) => void): this;
}

export class Logger extends EventEmitter {
	public emitText(data: string): boolean {
		return this.emit("logs", data);
	}
	public emitError(data: SchedulerErrorLog): boolean {
		return this.emit("errors", data);
	}
	public emitSuccess(data: SchedulerInformLog): boolean {
		return this.emit("executions", data);
	}
}
