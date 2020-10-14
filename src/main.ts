"use strict";
import { performance } from "perf_hooks";
import * as core from "./plugins/core";

(async function SchedulerTaskStart() {
	let start = performance.now();
	core.config.reservedType += await core.internal.getRandomTaskID();
	await core.internal.addTaskToCheckCompletedTask();
	await core.internal.startInterval();
	core.logger.text(`Start in ${(start - performance.now()).toFixed(2)}ms`);
	return 0;
})();

export { core };
