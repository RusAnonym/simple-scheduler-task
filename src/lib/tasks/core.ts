import { ISchedulerLogError, ISchedulerLogDone } from "./../../types/logs";
/* eslint-disable no-unsafe-finally */
import { performance } from "perf_hooks";

import scheduler from "../core";

import {
	ISchedulerTaskInfo,
	IParseTask,
	ISchedulerInputTask,
	TSchedulerTaskStatus,
} from "./../../types/tasks";

class SchedulerTask {
	private _task: ISchedulerTaskInfo;

	public onErrorHandler: ((log: ISchedulerLogError) => unknown) | null;
	public onDoneHandler: ((log: ISchedulerLogDone) => unknown) | null;

	constructor(task: ISchedulerInputTask) {
		const newTask: ISchedulerTaskInfo = {
			...task,
			id: scheduler.tasks.generateID(),
			status: "await",
			timeout:
				scheduler.config.mode === "timeout"
					? setTimeout(() => {
							this.execute();
					  }, task.plannedTime - Date.now())
					: null,
			created: new Date(),
			interval: {
				...task.interval,
				isInfinity:
					task.interval.is && task.interval.remainingTriggers === Infinity,
				triggeringQuantity: 0,
			},
		};
		this._task = newTask;
		this.onDoneHandler = task.onDone || null;
		this.onErrorHandler = task.onError || null;
		scheduler.tasks.list.push(this);
	}

	public async execute(): Promise<void> {
		this._task.status = "process";
		if (
			this._task.interval.is &&
			!this._task.interval.isNextExecutionAfterDone
		) {
			this._task.plannedTime = Date.now() + this._task.interval.time;
		}

		const startExecute = performance.now();
		try {
			const response = await this._task.source();
			const endExecute = performance.now();

			if (this._task.interval.is) {
				++this._task.interval.triggeringQuantity;
				if (!this._task.interval.isInfinity) {
					--this._task.interval.remainingTriggers;
				}
				if (this._task.interval.isNextExecutionAfterDone) {
					this._task.plannedTime = Date.now() + this._task.interval.time;
				}
			}

			if (this._task.interval.is && this._task.interval.remainingTriggers > 0) {
				this._task.status = "await";
			} else {
				this._task.status = "done";
			}

			if (this._task.isInform) {
				scheduler.logger.emit("done", {
					response,
					executionTime: endExecute - startExecute,
					task: this.info,
				});
			}

			if (this.onDoneHandler) {
				this.onDoneHandler({
					response,
					executionTime: endExecute - startExecute,
					task: this.info,
				});
			}
		} catch (error) {
			const endExecute = performance.now();

			if (this._task.interval.is) {
				++this._task.interval.triggeringQuantity;
				if (!this._task.interval.isInfinity) {
					--this._task.interval.remainingTriggers;
				}
				if (this._task.interval.isNextExecutionAfterDone) {
					this._task.plannedTime = Date.now() + this._task.interval.time;
				}
			}

			if (this._task.interval.is && this._task.interval.remainingTriggers > 0) {
				this._task.status = "await";
			} else {
				this._task.status = "done";
			}

			if (this._task.isInform) {
				scheduler.logger.emit("error", {
					error,
					executionTime: endExecute - startExecute,
					task: this.info,
				});
			}

			if (this.onErrorHandler) {
				this.onErrorHandler({
					error,
					executionTime: endExecute - startExecute,
					task: this.info,
				});
			}
		} finally {
			if (this.status === "done") {
				this.remove();
				return;
			}

			if (scheduler.config.mode === "timeout") {
				this._task.timeout = setTimeout(() => {
					this.execute();
				}, this._task.plannedTime - Date.now());
			} else {
				const taskIndex = scheduler.tasks.list.findIndex(
					(x) => x.id === this.id,
				);
				let newTaskIndex = scheduler.tasks.list.findIndex(
					(x) =>
						x._task.plannedTime >= this._task.plannedTime && x.id !== this.id,
				);
				if (
					newTaskIndex + 1 !== scheduler.tasks.list.length &&
					newTaskIndex > 0
				) {
					--newTaskIndex;
				}
				scheduler.tasks.move(taskIndex, newTaskIndex);
			}
		}
		return;
	}

	public remove(): void {
		const index = scheduler.tasks.list.indexOf(this);
		scheduler.tasks.list.splice(index, 1);
		return;
	}

	public clearTimeout(): void {
		if (this._task.timeout !== null) {
			clearTimeout(this._task.timeout);
		}
	}

	public useTimeout(): void {
		if (this._task.timeout === null) {
			this._task.timeout = setTimeout(() => {
				this.execute();
			}, this.plannedTime - Date.now());
		}
	}

	public get id(): string {
		return this._task.id;
	}

	public get plannedTime(): number {
		return this._task.plannedTime;
	}

	public get status(): TSchedulerTaskStatus {
		return this._task.status;
	}

	public get info(): IParseTask {
		return {
			id: this.id,
			type: this._task.type,
			params: this._task.params,
			status: this._task.status,
			nextExecute: new Date(this._task.plannedTime),
			created: this._task.created,
			isInform: this._task.isInform,
			isInterval: this._task.interval.is,
			source: this._task.source,
		};
	}
}

class SchedulerTasks {
	private allowedWords = `defbca123456890`.split("");

	public list: SchedulerTask[] = [];

	public clearTimeouts(): void {
		let i = this.list.length;
		while (i--) {
			this.list[i].clearTimeout();
		}
	}

	public setTimeouts(): void {
		let i = this.list.length;
		while (i--) {
			this.list[i].useTimeout();
		}
	}

	public executeOutdatedTasks(): void {
		const now = Number(new Date());
		const maximalIndex = this.list.findIndex((x) => x.plannedTime > now);
		if (maximalIndex === -1) {
			this.list.map((task) => {
				if (now >= task.plannedTime && task.status === "await") {
					task.execute();
				}
			});
		} else {
			for (let index = 0; index < maximalIndex; ++index) {
				const task = this.list[index];
				if (task.status === "await" && now >= task.plannedTime) {
					task.execute();
				}
			}
		}
		return;
	}

	public sort(): void {
		this.list.sort((a, b) => {
			if (a.plannedTime > b.plannedTime) {
				return 1;
			}
			if (a.plannedTime < b.plannedTime) {
				return -1;
			}
			return 0;
		});
	}

	public insert(index: number, task: SchedulerTask): void {
		this.list.splice(index, 0, task);
		return;
	}

	public move(from: number, to: number): void {
		const startIndex = from < 0 ? this.list.length + from : from;
		if (startIndex >= 0 && startIndex < this.list.length) {
			const endIndex = to < 0 ? this.list.length + to : to;
			const [item] = this.list.splice(from, 1);
			this.insert(endIndex, item);
		}
		return;
	}

	public generateID(): string {
		let ID = "";
		for (let i = 0; i < 16; i++) {
			ID +=
				this.allowedWords[Math.floor(Math.random() * this.allowedWords.length)];
		}
		if (!this.list.find((x) => x.id === ID)) {
			return ID;
		} else {
			return this.generateID();
		}
	}
}

export default SchedulerTasks;

export { SchedulerTask };
