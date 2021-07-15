import Task from "./Task";

import { ISchedulerLogDone, ISchedulerLogError } from "../../../types/logs";

export interface IntervalParams {
	plannedTime?: Date | number;
	type?: string;
	params?: Record<string, unknown>;
	cron?: string;
	isInform?: boolean;
	intervalTimer?: number;
	intervalTriggers?: number;
	isNextExecutionAfterDone?: boolean;
	source(): Promise<unknown> | unknown;
	onDone?(log: ISchedulerLogDone): unknown;
	onError?(log: ISchedulerLogError): unknown;
}

class Interval extends Task {
	constructor(params: IntervalParams);
	constructor(
		func: () => Promise<unknown> | unknown,
		ms: number,
		params?: IntervalParams,
	);
	constructor(
		paramsOrFunction: IntervalParams | (() => Promise<unknown> | unknown),
		ms?: number,
		additionalParams?: IntervalParams,
	) {
		if (typeof paramsOrFunction === "function") {
			super({
				isInterval: true,
				source: paramsOrFunction,
				plannedTime: Date.now() + Number(ms),
				...additionalParams,
			});
		} else {
			super({
				isInterval: true,
				...paramsOrFunction,
			});
		}
	}
}

export default Interval;
