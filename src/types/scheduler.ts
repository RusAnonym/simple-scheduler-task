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
	emitText(data: string): void {
		this.emit("logs", data);
	}
	emitError(data: SchedulerErrorLog): void {
		this.emit("errors", data);
	}
	emitSuccess(data: SchedulerInformLog): void {
		this.emit("executions", data);
	}
}
