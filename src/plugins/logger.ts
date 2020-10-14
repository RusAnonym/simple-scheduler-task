import { EventEmitter } from "events";
const Events = new EventEmitter();

const logger = {
	text: (text: string) => {
		return Events.emit("logs", text);
	},
	error: (error: object) => {
		return Events.emit("errors", error);
	},
	success: (task: object) => {
		return Events.emit("executions", task);
	},
};

export { logger };
