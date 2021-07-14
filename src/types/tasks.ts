export type TSchedulerTaskStatus = "await" | "process" | "pause" | "done";

export interface ISchedulerInputTask {
	plannedTime?: Date | number;
	type?: string;
	params?: Record<string, unknown>;
	inform?: boolean;
	intervalTimer?: number;
	intervalTriggers?: number;
	isInterval?: boolean;
	source(): Promise<unknown> | unknown;
}

export interface ISchedulerTaskInfo {
	plannedTime: number;
	id: string;
	type: string;
	params: Record<string, unknown>;
	status: TSchedulerTaskStatus;
	created: Date;
	isInform: boolean;
	isHidden: boolean;
	timeout: NodeJS.Timer | null;
	interval: {
		is: boolean;
		time: number;
		isNextExecutionAfterDone: boolean;
		isInfinity: boolean;
		triggeringQuantity: number;
		remainingTriggers: number;
	};

	source(): Promise<unknown> | unknown;
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
