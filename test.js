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
	console.log(await scheduler.backup.init());
})();
