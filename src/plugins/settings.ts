import { config, internal } from "./core";

const settings = {
	setMode: async (mode: "interval" | "timeout"): Promise<true> => {
		if (
			typeof mode !== "string" ||
			(mode.toLowerCase() !== `interval` && mode.toLowerCase() !== `timeout`)
		) {
			throw new Error(`Only 2 modes [interval, timeout]`);
		}
		if (mode.toLowerCase() === `interval`) {
			if (config.type === `interval`) {
				return true;
			} else {
				await internal.clearTimeouts();
				await internal.startInterval();
				config.type = `interval`;
				return true;
			}
		} else {
			if (config.type === `timeout`) {
				return true;
			} else {
				await internal.stopInterval();
				await internal.runTimeouts();
				config.type = `timeout`;
				return true;
			}
		}
	},
	editCheck: async (newInterval: number): Promise<true> => {
		if (
			!Number(newInterval) ||
			Number(newInterval) < 1 ||
			Number(newInterval) === Infinity
		) {
			throw new Error(`Invalid interval`);
		}
		config.intervalMS = Number(newInterval);
		return true;
	},
};

export { settings };
