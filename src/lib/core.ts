import { ITask } from "./../types/tasks";
import * as TasksAPI from "./api/tasks";
import settings from "./api/settings";
import { logger, Events } from "./api/logger";

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

export { config, tasks, TasksAPI, settings, logger, Events };
