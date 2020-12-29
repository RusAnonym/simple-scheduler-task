import { tasks } from "./core";

const array = {
	insert: function (inputArray: any[], index: number, element: any) {
		inputArray.splice(index, 0, element);
		return true;
	},
};

function generateID(): string {
	let id = "";
	let idWords = `defbca123456890`.split("");
	for (let i = 0; i < 16; i++) {
		id += idWords[Math.floor(Math.random() * idWords.length)];
	}
	if (!tasks.find((x) => x.id === id)) {
		return id;
	} else {
		return generateID();
	}
}

export { array, generateID };
