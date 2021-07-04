import { ITask } from "./../types/tasks";

class ArrayUtils {
	public insert(inputArray: ITask[], index: number, element: ITask): void {
		inputArray.splice(index, 0, element);
		return;
	}

	public move(inputArray: ITask[], from: number, to: number): void {
		const startIndex = from < 0 ? inputArray.length + from : from;
		if (startIndex >= 0 && startIndex < inputArray.length) {
			const endIndex = to < 0 ? inputArray.length + to : to;
			const [item] = inputArray.splice(from, 1);
			inputArray.splice(endIndex, 0, item);
		}
		return;
	}
}

class SchedulerUtils {
	public array = new ArrayUtils();
}

export default SchedulerUtils;
