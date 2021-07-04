/* eslint-disable no-unsafe-finally */
import { performance } from "perf_hooks";

import { IParseTask, ITask } from "./../types/tasks";

import core from "./core";

class SchedulerTasks {
	private allowedWords = `defbca123456890`.split("");

	public list: ITask[] = [];

	public create(task: {
		plannedTime: number;
		type: string;
		params: Record<string, unknown>;
		inform: boolean;
		isInterval: boolean;
		intervalTimer: number;
		intervalTriggers: number;
		service: boolean;
		source: () => void;
	}): string {
		task.service === true
			? (task.type = "scheduler_service_" + task.type)
			: null;
		let newTaskIndex = this.list.findIndex(
			(x) => x.plannedTime >= task.plannedTime,
		);

		newTaskIndex === -1 ? (newTaskIndex = this.list.length) : null;

		const newTaskID = this.generateID();
		const newTask: ITask = {
			plannedTime: task.plannedTime,
			id: newTaskID,
			type: task.type,
			hidden: task.service,
			params: task.params,
			status: "await",
			isInterval: task.isInterval,
			service: {
				timeoutID: null,
				create: Number(new Date()),
				intervalTime: task.intervalTimer,
				source: task.source,
				inform: task.inform,
				infinityInterval: task.intervalTriggers === Infinity,
				triggeringQuantity: 0,
				remainingTriggers: task.intervalTriggers,
			},
		};
		if (core.config.mode === "timeout") {
			newTask.service.timeoutID = setTimeout(() => {
				this.execute(newTask);
			}, task.plannedTime - Number(new Date()));
		}
		core.utils.array.insert(this.list, newTaskIndex, newTask);
		return newTaskID;
	}

	public parse(taskData: ITask): IParseTask {
		const output: IParseTask = {
			id: taskData.id,
			type: taskData.type,
			params: taskData.params,
			status: taskData.status,
			inform: taskData.service.inform,
			isInterval: taskData.isInterval,
			nextExecute: new Date(taskData.plannedTime),
			created: new Date(taskData.service.create),
			source: taskData.service.source,
		};
		if (taskData.isInterval) {
			output.intervalData = {
				infinityInterval: taskData.service.infinityInterval,
				triggeringQuantity: taskData.service.triggeringQuantity,
				remainingTriggers: taskData.service.remainingTriggers,
			};
		}
		return output;
	}

	public remove(taskData: ITask): true {
		const index = this.list.indexOf(taskData);
		this.list.splice(index, 1);
		return true;
	}

	public async execute(taskData: ITask): Promise<boolean> {
		const task = taskData;
		const currentDate = new Date();
		if (!task) {
			return false;
		} else {
			task.status = "works";
			task.plannedTime = Number(currentDate) + task.service.intervalTime;
			const startExecute = performance.now();
			try {
				const response = await task.service.source();
				if (task.service.inform) {
					const endExecute = performance.now();
					++task.service.triggeringQuantity;
					--task.service.remainingTriggers;
					task.status =
						task.isInterval && task.service.remainingTriggers !== 0
							? "await"
							: "executed";
					core.logger.success({
						task: this.parse(task),
						response: response,
						executionTime: endExecute - startExecute,
					});
				}
			} catch (error) {
				if (task.service.inform) {
					const endExecute = performance.now();
					++task.service.triggeringQuantity;
					--task.service.remainingTriggers;
					task.status =
						task.isInterval && task.service.remainingTriggers !== 0
							? "await"
							: "executed";
					core.logger.error({
						task: this.parse(task),
						error: error,
						executionTime: endExecute - startExecute,
					});
				}
			} finally {
				if (task.isInterval) {
					if (task.service.infinityInterval === false) {
						if (task.service.remainingTriggers === 0) {
							this.remove(task);
							return true;
						}
					}
					if (task.service.inform !== true) {
						task.status = "await";
					}
					++task.service.triggeringQuantity;
					if (core.config.mode === "timeout") {
						taskData.service.timeoutID = setTimeout(() => {
							this.execute(taskData);
						}, task.plannedTime - Number(currentDate));
					} else {
						const taskIndex = this.list.findIndex((x) => x.id === taskData.id);
						let newTaskIndex = this.list.findIndex(
							(x) => x.plannedTime >= task.plannedTime && x.id !== task.id,
						);
						newTaskIndex + 1 !== this.list.length && newTaskIndex > 0
							? --newTaskIndex
							: null;
						core.utils.array.move(this.list, taskIndex, newTaskIndex);
					}
				} else {
					this.remove(task);
					return true;
				}
			}
		}

		return true;
	}

	private generateID(): string {
		let ID = "";
		for (let i = 0; i < 16; ++i) {
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
