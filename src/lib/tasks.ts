import { ITask, IParseTask } from "./../types/tasks";
import * as utils from "./utils";
import { config, tasks } from "./core";
import { performance } from "perf_hooks";
import { logger } from "./logger";

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
			timeoutID:
				config.mode === "timeout"
					? setTimeout(async () => {}, task.plannedTime)
					: null,
			create: Number(new Date()),
			intervalTime: task.intervalTimer,
			source: task.source,
			inform: task.inform,
			infinityInterval: task.intervalTriggers === 0,
			triggeringQuantity: 0,
			remainingTriggers: task.intervalTriggers,
		},
	};
	utils.array.insert(tasks, newTaskIndex, newTask);
	return newTaskID;
}

function parseTask(taskData: ITask): IParseTask {
	return {
		id: taskData.id,
		type: taskData.type,
		params: taskData.params,
		status: taskData.status,
		inform: taskData.service.inform,
		isInterval: taskData.isInterval,
		nextExecute: new Date(taskData.plannedTime),
		source: taskData.service.source,
	};
}

function remove(taskData: ITask) {
	const index = tasks.indexOf(taskData);
	tasks.splice(index, 1);
}

function execute(taskId: string): boolean {
	const task = tasks.find((x) => x.id === taskId);
	if (!task) {
		return false;
	} else {
		task.status = "works";
		if (task.isInterval === true) {
			task.plannedTime = Number(new Date()) + task.service.intervalTime;
		}
		const startExecute = performance.now();
		task.service
			.source()
			.then(async (result: any) => {
				if (task.service.inform) {
					const endExecute = performance.now();
					return logger.success({
						task: parseTask(task),
						response: result,
						executionTime: endExecute - startExecute,
					});
				} else {
					return;
				}
			})
			.catch(async (err: Error) => {
				if (task.service.inform) {
					const endExecute = performance.now();
					return logger.error({
						task: parseTask(task),
						error: err,
						executionTime: endExecute - startExecute,
					});
				} else {
					return;
				}
			});
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
			} else {
				const taskIndex = tasks.findIndex((x) => x.id === taskId);
				let newTaskIndex = tasks.findIndex(
					(x) => x.plannedTime >= task.plannedTime && x.id !== task.id,
				);
				newTaskIndex + 1 !== tasks.length && newTaskIndex > 0
					? newTaskIndex--
					: null;
				utils.array.move(tasks, taskIndex, newTaskIndex);
			}
		}
	}

	return true;
}

export { create };
