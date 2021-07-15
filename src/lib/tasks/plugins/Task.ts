import { SchedulerTask } from "../core";

import { IInputTask } from "../../../types/tasks";

class Task {
	private task: SchedulerTask;

	constructor(params: IInputTask) {
		let { plannedTime = 0, intervalTimer = 0 } = params;
		const {
			type = "missing",
			inform = false,
			isInterval = false,
			intervalTriggers = Infinity,
			isNextExecutionAfterDone = false,
			onDone = null,
			onError = null,
			source,
		} = params;

		if (isInterval && plannedTime === 0 && intervalTimer > 0) {
			plannedTime = Number(new Date()) + intervalTimer;
		}

		if (
			!source ||
			(!isInterval && intervalTimer === 0 && plannedTime === 0) ||
			new Date(plannedTime).toString() === "Invalid Date"
		) {
			throw new Error("One of the required parameters is missing or incorrect");
		}

		if (isInterval && intervalTimer === 0) {
			intervalTimer = Number(plannedTime) - Date.now();
		}

		this.task = new SchedulerTask({
			plannedTime: Number(plannedTime),
			type,
			params: params.params || {},
			isHidden: false,
			isInform: inform,
			source,
			onDone,
			onError,
			interval: {
				is: isInterval,
				time: intervalTimer,
				remainingTriggers: intervalTriggers,
				isNextExecutionAfterDone,
			},
		});
	}
}

export default Task;
