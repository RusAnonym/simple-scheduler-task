import { ITask } from "./../types/tasks";
import { startInterval, startTimeout } from "./settings";
import * as TasksAPI from "./api/tasks";

const settings = {
	startInterval,
	startTimeout,
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

export { config, tasks, settings, TasksAPI };
