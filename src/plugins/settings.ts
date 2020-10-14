import { config, internal } from "./core";

const settings = {
	setMode: async (mode: string) => {
		if (
			!String(mode) ||
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
	editCheckInterval: async (newInterval: number) => {
		if (!Number(newInterval) || Number(newInterval) < 1) {
			throw new Error(`Invalid interval`);
		}
		config.intervalMS = Number(newInterval);
		return true;
	},
};

export { settings };
