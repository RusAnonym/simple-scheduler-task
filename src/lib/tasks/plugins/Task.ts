import cronParser from "cron-parser";

import { SchedulerTask } from "../core";

import { IParseTask } from "./../../../types/tasks";
import { ISchedulerLogDone, ISchedulerLogError } from "../../../types/logs";

export interface TaskParams {
	plannedTime?: Date | number;
	type?: string;
	params?: Record<string, unknown>;
	isInform?: boolean;
	intervalTimer?: number;
	intervalTriggers?: number;
	isInterval?: boolean;
	isNextExecutionAfterDone?: boolean;
	cron?: string;
	source(): Promise<unknown> | unknown;
	onDone?(log: ISchedulerLogDone): unknown;
	onError?(log: ISchedulerLogError): unknown;
}

class Task {
	private task: SchedulerTask;

	constructor(params: TaskParams) {
		let { plannedTime = 0, intervalTimer = 0 } = params;
		const {
			type = "missing",
			isInform = false,
			isInterval = false,
			intervalTriggers = Infinity,
			isNextExecutionAfterDone = false,
			cron = null,
			onDone = null,
			onError = null,
			source,
		} = params;

		if (cron && plannedTime === 0) {
			try {
				const interval = cronParser.parseExpression(cron);
				plannedTime = Number(interval.next().toDate());
			} catch (error) {
				throw new Error("CRON expression is invalid");
			}
		}

		if (isInterval && plannedTime === 0 && intervalTimer > 0) {
			plannedTime = Number(new Date()) + intervalTimer;
		}

		if (
			!source ||
			(!isInterval && intervalTimer === 0 && plannedTime === 0) ||
			new Date(plannedTime).toString() === "Invalid Date"
		) {
			throw new Error("One of the required parameters is missing or incorrect");
		}

		if (isInterval && intervalTimer === 0 && !cron) {
			intervalTimer = Number(plannedTime) - Date.now();
		}

		this.task = new SchedulerTask({
			plannedTime: Number(plannedTime),
			type,
			params: params.params || {},
			isHidden: false,
			isInform,
			cron,
			source,
			onDone,
			onError,
			interval: {
				is: isInterval,
				time: intervalTimer,
				remainingTriggers: intervalTriggers,
				isNextExecutionAfterDone,
			},
		});
	}

	public cancel(): void {
		this.task.remove();
	}

	public pause(): void {
		this.task._task.status = "pause";
	}

	public unpause(): void {
		this.task._task.status = "await";
	}

	public execute(): Promise<void> {
		return this.task.execute();
	}

	public get info(): IParseTask {
		return this.task.info;
	}

	public get nextExecute(): Date {
		return new Date(this.task.plannedTime);
	}

	public set nextExecute(date: Date) {
		this.task._task.plannedTime = Number(date);
	}

	public get isInform(): boolean {
		return this.task._task.isInform;
	}

	public set isInform(status: boolean) {
		this.task._task.isInform = status;
	}

	public set onDone(callback: (log: ISchedulerLogDone) => unknown) {
		this.task.onDoneHandler = callback;
	}

	public set onError(callback: (log: ISchedulerLogError) => unknown) {
		this.task.onErrorHandler = callback;
	}
}

export default Task;
