import { SchedulerTask } from "../core";

import { IInputTask } from "../../../types/tasks";

class Task {
	private task: SchedulerTask;

	constructor(params: IInputTask) {
		let { plannedTime = 0 } = params;
		const {
			type = "missing",
			inform = false,
			isInterval = false,
			intervalTimer = 0,
			intervalTriggers = Infinity,
			isNextExecutionAfterDone = false,
			source,
		} = params;

		if (
			(!isInterval && !plannedTime) ||
			!source ||
			new Date(plannedTime).toString() === "Invalid Date"
		) {
			throw new Error("One of the required parameters is missing or incorrect");
		}

		if (isInterval && plannedTime === 0) {
			plannedTime = Number(new Date()) + intervalTimer;
		}

		this.task = new SchedulerTask({
			plannedTime: Number(plannedTime),
			type,
			params: params.params || {},
			isHidden: false,
			isInform: inform,
			source,
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
