import { ISchedulerLogDone, ISchedulerLogError } from "./logs";

export type TSchedulerTaskStatus = "await" | "process" | "pause" | "done";

interface ISchedulerInputTaskInterval {
	is: boolean;
	time: number;
	isNextExecutionAfterDone: boolean;
	remainingTriggers: number;
}

export interface ISchedulerInputTask {
	plannedTime: number;
	type: string;
	params: Record<string, unknown>;
	isInform: boolean;
	isHidden: boolean;
	cron: string | null;
	interval: ISchedulerInputTaskInterval;
	source(): Promise<unknown> | unknown;
	onDone: ((log: ISchedulerLogDone) => unknown) | null;
	onError: ((log: ISchedulerLogError) => unknown) | null;
}

interface ISchedulerTaskInfoInterval extends ISchedulerInputTaskInterval {
	isInfinity: boolean;
	triggeringQuantity: number;
}

export interface ISchedulerTaskInfo extends ISchedulerInputTask {
	id: string;
	status: TSchedulerTaskStatus;
	timeout: NodeJS.Timer | null;
	created: Date;
	interval: ISchedulerTaskInfoInterval;
}

export interface IParseTask {
	id: string;
	type: string;
	params: Record<string, unknown>;
	status: TSchedulerTaskStatus;
	isInform: boolean;
	isInterval: boolean;
	intervalData?: {
		infinityInterval: boolean;
		triggeringQuantity: number;
		remainingTriggers: number;
		isNextExecutionAfterDone: boolean;
	};
	created: Date;
	nextExecute: Date;
	source(): Promise<unknown> | unknown;
}
