/* eslint-disable no-unsafe-finally */
import { performance } from "perf_hooks";

import scheduler from "../core";

import { ISchedulerTaskInfo, IParseTask } from "./../../types/tasks";

class SchedulerTask {
	public _task: ISchedulerTaskInfo;

	constructor(task: ISchedulerTaskInfo) {
		this._task = task;
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
			if (this._task.isInform) {
				if (
					this._task.interval.is &&
					this._task.interval.remainingTriggers > 0
				) {
					this._task.status = "await";
				} else {
					this._task.status = "done";
				}

				scheduler.logger.emit("done", {
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
			if (this._task.isInform) {
				if (
					this._task.interval.is &&
					this._task.interval.remainingTriggers > 0
				) {
					this._task.status = "await";
				} else {
					this._task.status = "done";
				}
			}
			if (this._task.isInform) {
				if (
					this._task.interval.is &&
					this._task.interval.remainingTriggers > 0
				) {
					this._task.status = "await";
				} else {
					this._task.status = "done";
				}

				scheduler.logger.emit("error", {
					error,
					executionTime: endExecute - startExecute,
					task: this.info,
				});
			}
		} finally {
			if (this._task.interval.is) {
				if (!this._task.interval.isInfinity) {
					if (this._task.interval.remainingTriggers <= 0) {
						this.remove();
						return;
					}
				}
				if (!this._task.isInform) {
					this._task.status = "await";
					++this._task.interval.triggeringQuantity;
				}
				if (scheduler.config.mode === "timeout") {
					this._task.timeout = setTimeout(() => {
						this.execute();
					}, this._task.plannedTime - Date.now());
				} else {
					const taskIndex = scheduler.tasks.list.findIndex(
						(x) => x._task.id === this._task.id,
					);
					let newTaskIndex = scheduler.tasks.list.findIndex(
						(x) =>
							x._task.plannedTime >= this._task.plannedTime &&
							x._task.id !== this._task.id,
					);
					newTaskIndex + 1 !== scheduler.tasks.list.length && newTaskIndex > 0
						? --newTaskIndex
						: null;
					scheduler.tasks.move(taskIndex, newTaskIndex);
				}
			} else {
				this.remove();
				return;
			}
		}
		return;
	}

	public remove(): void {
		const index = scheduler.tasks.list.indexOf(this);
		scheduler.tasks.list.splice(index, 1);
		return;
	}

	public get info(): IParseTask {
		return {
			id: this._task.id,
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
		if (!this.list.find((x) => x._task.id === ID)) {
			return ID;
		} else {
			return this.generateID();
		}
	}
}

export default SchedulerTasks;

export { SchedulerTask };
