import { EventEmitter } from "events";

export interface SchedulerInputTask {
	type?: string;
	params?: any;
	inform?: boolean;
	isInterval?: boolean;
	plannedTime?: number | Date;
	intervalTimer?: number;
	intervalTriggers?: number;
	code: Function;
}

export interface SchedulerTask {
	plannedTime: number;
	id: string;
	type: string;
	params: any;
	status: string;
	isInterval: boolean;
	service: {
		timeoutID: any;
		create: number;
		intervalTime: number;
		source: Function;
		inform: boolean;
		triggeringQuantity: number;
		remainingTriggers: number;
	};
}

export interface SchedulerParseTask {
	id: string;
	type: string;
	params: any;
	status: string;
	inform: boolean;
	isInterval: boolean;
	source: Function;	
}

export interface SchedulerBackupTask {
	plannedTime: number;
	id: string;
	type: string;
	params: any;
	status: string;
	isInterval: boolean;
	service: {
		timeoutID: any;
		create: number;
		intervalTime: number;
		inform: boolean;
		triggeringQuantity: number;
		remainingTriggers: number;
		endlessInterval: boolean;
	};
}

export interface SchedulerConfig {
	type: string;
	work: boolean;
	interval: any;
	intervalMS: number;
	backupFolder: string;
	reservedType: string;
	scheduledTasks: Array<SchedulerTask>;
}

export interface SchedulerInformLog {
	task: SchedulerParseTask;
	response: any;
	executionTime: number;
}

export interface SchedulerErrorLog {
	task: SchedulerParseTask;
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
