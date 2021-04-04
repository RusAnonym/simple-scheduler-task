import * as core from "./lib/core";

import { Interval, Task, Timeout } from "./lib/api/tasks";

/**
 * Scheduler settings
 */
const settings = core.settings;

/**
 * Tasks API
 */
const tasks = core.TasksAPI;

/**
 * Events
 */
const events = core.Events;

export { settings, tasks, events, Task, Timeout, Interval };
