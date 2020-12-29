import { ITask } from "./../types/tasks";

let config: {
	mode: "timeout" | "interval";
} = {
	mode: "timeout",
};
let tasks: ITask[] = [];

export { config, tasks };
