export interface ITask {
	plannedTime: number;
	id: string;
	type: string;
	hidden: boolean;
	params: Record<string, any>;
	status: string;
	isInterval: boolean;
	backup: boolean;
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

export interface IParseTask {
	id: string;
	type: string;
	params: Record<string, any>;
	status: string;
	inform: boolean;
	isInterval: boolean;
	source: Function;
}
