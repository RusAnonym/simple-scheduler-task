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
	console.log(
		await scheduler.tasks.add({
			inform: true,
			isInterval: true,
			intervalTimer: 3600000,
			code: async function () {
				console.log(`Test ${new Date()}`);
			},
		}),
	);
	scheduler.tasks.getAll().then((res) => console.log(res));
})();
