import { ITask } from "./../types/tasks";
import * as TasksAPI from "./api/tasks";
import settings from "./api/settings";
import { logger, Events } from "./api/logger";

const config: {
	mode: "timeout" | "interval" | "not_work";
	interval: NodeJS.Timer | null;
	intervalMS: number;
} = {
	mode: "not_work",
	interval: null,
	intervalMS: 1000,
};

const tasks: ITask[] = [];

(function startScheduler() {
	settings.useInterval();
})();

export { config, tasks, TasksAPI, settings, logger, Events };
