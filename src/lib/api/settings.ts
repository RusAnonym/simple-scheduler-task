import core from "../core";

/**
 * @module Settings
 * @description Scheduler settings
 * @example
 * const scheduler = require(`simple-scheduler-task`);
 */

class Settings {
	/**
	 * Includes task scheduling with one interval
	 * @example
	 * scheduler.settings.useInterval(); // => true
	 */
	public useInterval(): boolean {
		return core.settings.useInterval();
	}

	/**
	 * Enables task scheduling with a separate timeout for each task
	 * @example
	 * scheduler.settings.useTimeouts(); // => true
	 */
	public useTimeouts(): boolean {
		return core.settings.useTimeouts();
	}
}

export default new Settings();
