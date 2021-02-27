import { ITask } from "./../types/tasks";
import { tasks } from "./core";

const array = {
	insert: function (inputArray: ITask[], index: number, element: ITask): void {
		inputArray.splice(index, 0, element);
		return;
	},
	move: function (inputArray: ITask[], from: number, to: number): void {
		const startIndex = from < 0 ? inputArray.length + from : from;
		if (startIndex >= 0 && startIndex < inputArray.length) {
			const endIndex = to < 0 ? inputArray.length + to : to;
			const [item] = inputArray.splice(from, 1);
			inputArray.splice(endIndex, 0, item);
		}
		return;
	},
};

const generateID = (): string => {
	let id = "";
	const idWords = `defbca123456890`.split("");
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
