import { SchedulerInputTask, SchedulerParseTask } from "./types";
import { internal, config } from "./core";

const tasks = {
	add: async (taskData: SchedulerInputTask): Promise<string> => {
		const currentTime: number = Number(new Date());
		taskData.type = taskData.type || "missing";
		taskData.params = taskData.params || {};
		taskData.inform = taskData.inform || false;
		taskData.isInterval = taskData.isInterval || false;
		if (taskData.plannedTime) {
			taskData.plannedTime = Number(taskData.plannedTime);
		}
		if (taskData.isInterval) {
			taskData.intervalTriggers = taskData.intervalTriggers || Infinity;
			if (!taskData.plannedTime && taskData.intervalTimer) {
				taskData.plannedTime = currentTime + taskData.intervalTimer;
			} else if (taskData.intervalTimer && taskData.plannedTime) {
				taskData.intervalTimer =
					taskData.intervalTimer || taskData.plannedTime - currentTime;
			}
		} else {
			taskData.isInterval = false;
		}
		if (taskData.params.service || taskData.type === config.reservedType) {
			throw new Error(`Forbidden to create service tasks`);
		}
		if (!taskData.code || !taskData.plannedTime) {
			throw new Error(`Missed one or more parameters`);
		}
		return await internal.addTask(taskData);
	},
	get: async (
		taskID: string | Array<string>,
	): Promise<SchedulerParseTask | boolean> => {
		let selectTask = config.scheduledTasks.find((x) => x.id === taskID);
		if (!selectTask) {
			return false;
		} else if (selectTask.params.service !== true) {
			return await internal.parseTask(selectTask);
		} else {
			return false;
		}
	},
	delete: async (taskID: string): Promise<boolean> => {
		let selectTask = config.scheduledTasks.find((x) => x.id === taskID);
		if (!selectTask) {
			return false;
		} else if (selectTask.params.service !== true) {
			return await internal.deleteTaskByID(selectTask.id);
		} else {
			return false;
		}
	},
	getAll: async (): Promise<Array<SchedulerParseTask>> => {
		let tasksList: Array<SchedulerParseTask> = [];
		for (let i in config.scheduledTasks) {
			if (config.scheduledTasks[i].type !== config.reservedType) {
				tasksList.push(await internal.parseTask(config.scheduledTasks[i]));
			}
		}
		return tasksList;
	},
};

export { tasks };
