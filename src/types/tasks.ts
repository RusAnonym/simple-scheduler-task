export type TSchedulerTaskStatus = "await" | "process" | "pause" | "done";

// export interface ISchedulerInputTask {
// 	plannedTime?: Date | number;
// 	type?: string;
// 	params?: Record<string, unknown>;
// 	inform?: boolean;
// 	intervalTimer?: number;
// 	intervalTriggers?: number;
// 	isInterval?: boolean;
// 	source(): Promise<unknown> | unknown;
// }

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
	interval: ISchedulerInputTaskInterval;
	source(): Promise<unknown> | unknown;
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
