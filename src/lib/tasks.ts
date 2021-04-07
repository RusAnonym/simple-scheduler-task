/* eslint-disable no-unsafe-finally */

import { ITask, IParseTask } from "./../types/tasks";
import * as utils from "./utils";
import { config, tasks } from "./core";
import { performance } from "perf_hooks";
import { logger } from "./api/logger";

const create = (task: {
	plannedTime: number;
	type: string;
	params: Record<string, unknown>;
	inform: boolean;
	isInterval: boolean;
	intervalTimer: number;
	intervalTriggers: number;
	service: boolean;
	source: () => void;
}): string => {
	task.service === true ? (task.type = "scheduler_service_" + task.type) : null;
	let newTaskIndex = tasks.findIndex((x) => x.plannedTime >= task.plannedTime);

	newTaskIndex === -1 ? (newTaskIndex = tasks.length) : null;

	const newTaskID = utils.generateID();
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
	if (config.mode === "timeout") {
		newTask.service.timeoutID = setTimeout(() => {
			execute(newTask);
		}, task.plannedTime - Number(new Date()));
	}
	utils.array.insert(tasks, newTaskIndex, newTask);
	return newTaskID;
};

const parseTask = (taskData: ITask): IParseTask => {
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
};

const remove = (taskData: ITask): true => {
	const index = tasks.indexOf(taskData);
	tasks.splice(index, 1);
	return true;
};

const execute = async (taskData: ITask): Promise<boolean> => {
	const task = taskData;
	const currentDate = new Date();
	if (!task) {
		return false;
	} else {
		task.status = "works";
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
				logger.success({
					task: parseTask(task),
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
				logger.error({
					task: parseTask(task),
					error: error,
					executionTime: endExecute - startExecute,
				});
			}
		} finally {
			if (task.isInterval) {
				if (task.service.infinityInterval === false) {
					if (task.service.remainingTriggers === 0) {
						remove(task);
						return true;
					}
				}
				if (task.service.inform !== true) {
					task.status = "await";
				}
				task.plannedTime = Number(currentDate) + task.service.intervalTime;
				++task.service.triggeringQuantity;
				if (config.mode === "timeout") {
					taskData.service.timeoutID = setTimeout(() => {
						execute(taskData);
					}, task.plannedTime - Number(currentDate));
				} else {
					const taskIndex = tasks.findIndex((x) => x.id === taskData.id);
					let newTaskIndex = tasks.findIndex(
						(x) => x.plannedTime >= task.plannedTime && x.id !== task.id,
					);
					newTaskIndex + 1 !== tasks.length && newTaskIndex > 0
						? --newTaskIndex
						: null;
					utils.array.move(tasks, taskIndex, newTaskIndex);
				}
			} else {
				remove(task);
				return true;
			}
		}
	}

	return true;
};

export { create, execute, parseTask, remove };
