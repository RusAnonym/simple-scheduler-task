"use strict";
import { performance } from "perf_hooks";
import * as core from "./plugins/core";

(async function SchedulerTaskStart() {
	let start = performance.now();
	core.config.reservedType += await core.internal.getRandomTaskID();
	await core.internal.addTaskToCheckCompletedTask();
	await core.internal.startInterval();
	core.logger.text(`Start in ${(performance.now() - start).toFixed(2)}ms`);
	return 0;
})();

let tasks = core.tasks;
let settings = core.settings;
let events = core.Events;
let backup = core.backup;

export { tasks, settings, events, backup };
