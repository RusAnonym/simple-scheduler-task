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

scheduler.events.on(``)(async function () {
	let plannedTime = new Date(Number(new Date()) + 2000);
	// await scheduler.tasks.add({
	// 	plannedTime: plannedTime,
	// 	isInterval: true,
	// 	intervalTimer: 1000,
	// 	code: async function () {
	// 		console.log(`Hello!!!`);
	// 		return "test ${new Date()}";
	// 	},
	// });
	scheduler.backup.run
})();
