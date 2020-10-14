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
	isInterval: boolean;
	source: Function;
}

export interface InputTask {
	type: string;
	params: any;
	inform: boolean;
	isInterval: boolean;
	plannedTime?: number;
	intervalTimer?: number;
	intervalTriggers?: number;
	code: Function;
}

export interface SchedulerConfig {
	type: string;
	work: boolean;
	interval: any;
	intervalMS: number;
	reservedType: string;
	scheduledTasks: Array<SchedulerTask>;
}
