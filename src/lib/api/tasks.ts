import { IParseTask } from "./../../types/tasks";
/**
 * @module Tasks
 * @description Methods for interacting with tasks
 */

import { tasks } from "../core";
import { create, parseTask } from "../tasks";

/**
 * @class
 * @classdesc This is a task constructor
 */
class Task {
	/**
	 * @param {Object} params - The set of parameters to create the task
	 * @param {Date | number} params.plannedTime - The time when the task should be completed
	 * @param {string} params.type - Type of task, does not influence anything, but you can use it to get the list of tasks with the selected type
	 * @param {Object} params.params - Additional parameters, to search tasks
	 * @param {boolean} params.inform - Informing about finish/error after task execution
	 * @param {boolean} params.isInterval - Whether the task is an interval
	 * @param {number} params.intervalTimer - The interval interval in ms
	 * @param {number} params.intervalTriggers - The number of times the interval will be triggered before it should end
	 * @param {boolean} params.boolean - Whether to save this task in automatic mode
	 */
	constructor(params: {
		plannedTime: Date | number;
		type: string;
		params: Record<string, any>;
		inform: boolean;
		isInterval: boolean;
		intervalTimer?: number;
		intervalTriggers?: number;
		backup: boolean;
		source: () => void;
	}) {
		const {
			plannedTime,
			type = "missing",
			inform = false,
			isInterval = false,
			intervalTimer = Number(plannedTime) - Number(new Date()),
			intervalTriggers = 0,
			backup = false,
			source,
		} = params;

		if (
			!plannedTime ||
			!source ||
			new Date(plannedTime).toString() === "Invalid Date"
		) {
			throw new Error("One of the required parameters is missing or incorrect");
		}

		return create({
			plannedTime: Number(plannedTime),
			type: type,
			params: params.params || {},
			inform: inform,
			isInterval: isInterval,
			intervalTimer: intervalTimer,
			intervalTriggers: intervalTriggers,
			backup: backup,
			service: false,
			source: source,
		});
	}
}

/**
 * Allows you to get a list of all scheduled tasks
 */
function getAllTasks(): IParseTask[] {
	return tasks.filter((task) => task.hidden !== true).map(parseTask);
}

/**
 * Allows you to get the task by its ID
 */
function getTaskByID(taskId: string): IParseTask {
	let task = tasks.find((x) => x.id === taskId);
	if (!task) {
		throw new Error(`No task with this ID was found`);
	} else {
		return parseTask(task);
	}
}

export { Task, getAllTasks };
