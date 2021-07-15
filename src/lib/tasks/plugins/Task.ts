import { IParseTask } from "./../../../types/tasks";
import { SchedulerTask } from "../core";

import { InputTask } from "../../../types/tasks";
import { ISchedulerLogDone, ISchedulerLogError } from "../../../types/logs";

class Task {
	private task: SchedulerTask;

	constructor(params: InputTask) {
		let { plannedTime = 0, intervalTimer = 0 } = params;
		const {
			type = "missing",
			inform = false,
			isInterval = false,
			intervalTriggers = Infinity,
			isNextExecutionAfterDone = false,
			onDone = null,
			onError = null,
			source,
		} = params;

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

		if (isInterval && intervalTimer === 0) {
			intervalTimer = Number(plannedTime) - Date.now();
		}

		this.task = new SchedulerTask({
			plannedTime: Number(plannedTime),
			type,
			params: params.params || {},
			isHidden: false,
			isInform: inform,
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

	public set nextExecute(date: number | Date) {
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
