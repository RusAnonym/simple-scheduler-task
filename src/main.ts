import core from "./lib/core";

import Settings from "./lib/api/settings";
import tasks from "./lib/api/tasks";
import events from "./lib/api/logger";

core.settings.useInterval();

class Scheduler {
	/**
	 * Scheduler settings
	 */
	public settings = new Settings();

	/**
	 * Tasks API
	 */
	public tasks = tasks;

	/**
	 * Events API
	 */
	public events = events.Events;
}

export default new Scheduler();

export const Task = tasks.Task;
export const Timeout = tasks.Timeout;
export const Interval = tasks.Interval;
