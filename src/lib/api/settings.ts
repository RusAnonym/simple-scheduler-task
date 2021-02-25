import * as settings from "../settings";

/**
 * @module Settings
 * @description Scheduler settings
 * @example
 * const scheduler = require(`simple-scheduler-task`);
 */

/**
 * Includes task scheduling with one interval
 * @example
 * scheduler.settings.useInterval(); // => true
 */
function useInterval(): boolean {
	return settings.startInterval();
}

/**
 * Enables task scheduling with a separate timeout for each task
 * @example
 * scheduler.settings.useTimeouts(); // => true
 */
function useTimeouts(): boolean {
	return settings.startTimeout();
}

export default { useInterval, useTimeouts };
