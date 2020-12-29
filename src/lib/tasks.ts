import { ITask } from "./../types/tasks";
import * as utils from "./utils";
import { config, tasks } from "./core";

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
			triggeringQuantity: task.intervalTriggers,
			remainingTriggers: task.intervalTriggers,
		},
	};
	utils.array.insert(tasks, newTaskIndex, newTask);
	return newTaskID;
}

export { create };
