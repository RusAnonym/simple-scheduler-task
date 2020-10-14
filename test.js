const scheduler = require(`./lib/cjs/main.js`);

scheduler.events.on(`logs`, async (data) => {
	console.log(data);
});

scheduler.events.on(`errors`, async (data) => {
	console.log(data);
});

scheduler.events.on(`executions`, async (data) => {
	console.log(data);
});

(async function () {
	console.log(await scheduler.settings.editCheckInterval("s"));

	let plannedTime = new Date(Number(new Date()) + 10000);
	console.log();
	await scheduler.tasks.add({
		plannedTime: plannedTime,
		inform: true,
		code: async function () {
			console.log(scheduler.core.config);
			return "response";
		},
	});
})();
