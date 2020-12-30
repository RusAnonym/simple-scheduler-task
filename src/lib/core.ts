import { ITask } from "./../types/tasks";
import { startInterval } from "./settings";
import * as TasksAPI from "./api/tasks";

const settings = {
	startInterval,
};

let config: {
	mode: "timeout" | "interval" | "not_work";
	interval: NodeJS.Timer | null;
	intervalMS: number;
} = {
	mode: "not_work",
	interval: null,
	intervalMS: 1000,
};

let tasks: ITask[] = [];

const Task = TasksAPI.Task;

export { config, tasks, settings, Task };
