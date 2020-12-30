import { ITask, IParseTask } from "./../types/tasks";
import * as utils from "./utils";
import { config, tasks } from "./core";
import { performance } from "perf_hooks";
import { logger } from "./api/logger";

function create(task: {
	plannedTime: number;
	type: string;
	params: Record<string, any>;
	inform: boolean;
	isInterval: boolean;
	intervalTimer: number;
	intervalTriggers: number;
	backup: boolean;
	service: boolean;
	source: () => void;
}) {
	task.service === true ? (task.type = "scheduler_service_" + task.type) : null;
	let newTaskIndex = tasks.findIndex((x) => x.plannedTime >= task.plannedTime);
	newTaskIndex === -1 ? (newTaskIndex = tasks.length) : null;
	const newTaskID = utils.generateID();
	let newTask: ITask = {
		plannedTime: task.plannedTime,
		id: newTaskID,
		type: task.type,
		hidden: task.service,
		params: task.params,
		status: "await",
		isInterval: task.isInterval,
		backup: task.backup,
		service: {
			timeoutID: null,
			create: Number(new Date()),
			intervalTime: task.intervalTimer,
			source: task.source,
			inform: task.inform,
			infinityInterval: task.intervalTriggers === 0,
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
	console.log(newTask);
	return newTaskID;
}

function parseTask(taskData: ITask): IParseTask {
	let output: IParseTask = {
		id: taskData.id,
		type: taskData.type,
		params: taskData.params,
		status: taskData.status,
		inform: taskData.service.inform,
		isInterval: taskData.isInterval,
		nextExecute: new Date(taskData.plannedTime),
		source: taskData.service.source,
	};
	if (taskData.isInterval) {
		output.intervalData = {
			triggeringQuantity: taskData.service.triggeringQuantity,
			remainingTriggers: taskData.service.remainingTriggers,
		};
	}
	return output;
}

function remove(taskData: ITask) {
	const index = tasks.indexOf(taskData);
	tasks.splice(index, 1);
}

async function execute(taskData: ITask): Promise<boolean> {
	const task = taskData;
	if (!task) {
		return false;
	} else {
		task.status = "works";
		if (task.isInterval === true) {
			task.plannedTime = Number(new Date()) + task.service.intervalTime;
		}
		const startExecute = performance.now();
		try {
			let response = await task.service.source();
			task.status = "executed";
			if (task.service.inform) {
				const endExecute = performance.now();
				logger.success({
					task: parseTask(task),
					response: response,
					executionTime: endExecute - startExecute,
				});
			}
		} catch (error) {
			if (task.service.inform) {
				const endExecute = performance.now();
				logger.error({
					task: parseTask(task),
					error: error,
					executionTime: endExecute - startExecute,
				});
			}
		} finally {
			task.status = "await";
			if (task.isInterval) {
				if (task.service.infinityInterval === false) {
					task.service.remainingTriggers--;
					if (task.service.remainingTriggers === 0) {
						remove(task);
						return true;
					}
				}
				task.service.triggeringQuantity += 1;
				if (config.mode === "timeout") {
					taskData.service.timeoutID = setTimeout(() => {
						execute(taskData);
					}, task.plannedTime - Number(new Date()));
				} else {
					const taskIndex = tasks.findIndex((x) => x.id === taskData.id);
					let newTaskIndex = tasks.findIndex(
						(x) => x.plannedTime >= task.plannedTime && x.id !== task.id,
					);
					newTaskIndex + 1 !== tasks.length && newTaskIndex > 0
						? newTaskIndex--
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
}

export { create, execute, parseTask, remove };
