import Tasks from "./tasks";
import Utils from "./utils";
import Settings from "./settings";
import Logger from "./logger";

class SchedulerCore {
	public tasks = new Tasks();
	public utils = new Utils();
	public settings = new Settings();
	public logger = new Logger();

	public config: {
		mode: "timeout" | "interval" | "not_work";
		interval: NodeJS.Timer | null;
		intervalMS: number;
	} = {
		mode: "not_work",
		interval: null,
		intervalMS: 1000,
	};
}

export default new SchedulerCore();
