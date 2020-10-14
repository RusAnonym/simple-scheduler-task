import { InputTask, SchedulerTask } from "./types";
import { internal, config } from "./core";

const tasks = {
	add: async (taskData: InputTask) => {
		const currentTime: number = Number(new Date());
		taskData.type = taskData.type || "missing";
		taskData.params = taskData.params || {};
		taskData.inform = taskData.inform || false;
		taskData.isInterval = taskData.isInterval || false;
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
		if (taskData.params.service && taskData.type !== config.reservedType) {
			throw new Error(`Forbidden to create service tasks`);
		}
		if (!taskData.code || !taskData.plannedTime) {
			throw new Error(`Missed one or more parameters`);
		}
		let tempID = await internal.getRandomTaskID();
		let tempTask: SchedulerTask = {
			plannedTime: taskData.plannedTime,
			id: tempID,
			type: taskData.type,
			params: taskData.params,
			status: `awaiting`,
			isInterval: taskData.isInterval,
			service: {
				timeoutID: null,
				create: currentTime,
				intervalTime: taskData.intervalTimer || 0,
				source: taskData.code,
				inform: taskData.inform,
				triggeringQuantity: 0,
				remainingTriggers: taskData.intervalTriggers || 0,
			},
		};
		if (config.type === `timeout`) {
			tempTask.service.timeoutID = setTimeout(async () => {
				internal;
			}, tempTask.plannedTime - currentTime);
		}
		config.scheduledTasks.push(tempTask);
		return tempID;
	},
	get: async (taskID: string) => {
		let selectTask = config.scheduledTasks.find((x) => x.id === taskID);
		if (!selectTask) {
			return false;
		} else if (selectTask.params.service !== true) {
			return await internal.parseTask(selectTask);
		} else {
			return false;
		}
	},
	getTasks: async () => {
		let tasksList = [];
		for (let i in config.scheduledTasks) {
			if (config.scheduledTasks[i].type !== config.reservedType) {
				tasksList.push(await internal.parseTask(config.scheduledTasks[i]));
			}
		}
		return tasksList;
	},
	delete: async (taskID: string) => {
		let selectTask = config.scheduledTasks.find((x) => x.id === taskID);
		if (!selectTask) {
			return false;
		} else if (selectTask.params.service !== true) {
			return await internal.deleteTaskByID(selectTask.id);
		} else {
			return false;
		}
	},
};

export { tasks };
