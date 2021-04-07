import { ITask, IParseTask } from "./../../types/tasks";
import { tasks } from "../core";
import { parseTask } from "../tasks";
import * as userTypes from "./types";

import Task from "./classes/Task";
import Interval from "./classes/Interval";
import Timeout from "./classes/Timeout";

/**
 * @module Tasks
 * @description Methods for interacting with tasks
 * @example
 * const scheduler = require(`simple-scheduler-task`);
 */

/**
 * This is a function that adds a new task, analogous to new Task
 * @param {Object} params {@link inputTask}
 */
function add(params: userTypes.inputTask): string {
	return new Task(params).ID;
}

/**
 * Allows you to get a list of all scheduled tasks
 * @example
 * scheduler.task.getAllTasks(); // => Array with all tasks
 */
function getAllTasks(): IParseTask[] {
	return tasks.filter((task) => task.hidden !== true).map(parseTask);
}

/**
 * Allows you to get the task by its ID
 * @param {taskId} - ID of task
 */
function getTaskByID(taskId: string): IParseTask {
	const task = tasks.find((x) => x.id === taskId);
	if (!task) {
		throw new Error(`No task with this ID was found`);
	} else {
		return parseTask(task);
	}
}

/**
 * @param {Object} params - Set of parameters to filter tasks
 * @param {string} params.type - Type of task
 * @param {Object} params.params - Additional parameters, to search tasks
 */
function getFilterTasks(params: {
	type?: string;
	params?: Record<string, unknown>;
}): IParseTask[] {
	let findTasks: ITask[] = [];
	if (params.type) {
		findTasks = tasks.filter((x) => x.type === params.type);
	}
	findTasks.length === 0 ? (findTasks = tasks) : null;
	if (params.params) {
		findTasks.filter((x) => x.params === params.params);
	}
	return findTasks.map(parseTask);
}

export {
	Task,
	Interval,
	Timeout,
	add,
	getTaskByID,
	getAllTasks,
	getFilterTasks,
};
