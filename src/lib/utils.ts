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
	let ID = "";
	const allowedWords = `defbca123456890`.split("");
	for (let i = 0; i < 16; i++) {
		ID += allowedWords[Math.floor(Math.random() * allowedWords.length)];
	}
	if (!tasks.find((x) => x.id === ID)) {
		return ID;
	} else {
		return generateID();
	}
}

export { array, generateID };
