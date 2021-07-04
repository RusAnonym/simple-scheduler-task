/**
 * Set of parameters to create a task {@link IInputTask}
 * @see IInputTask
 */

export interface IInputTask {
	/**
	 * The time when the task should be completed
	 * @default new Date()
	 */
	plannedTime?: Date | number;
	/**
	 * Type of task, does not influence unknownthing, but you can use it to get the list of tasks with the selected type
	 * @default missing
	 */
	type?: string;
	/**
	 * Additional parameters, to search tasks
	 * <br/>
	 * Only the types number, string, Date are available
	 * @default {}
	 * @example
	 * {
	 * 	"string": "Hello",
	 * 	"number": 50,
	 * 	"date": new Date()
	 * }
	 */
	params?: Record<string, number | string | Date>;
	/**
	 * Informing about finish/error after task execution
	 * @default false
	 */
	inform?: boolean;
	/**
	 * Whether the task is an interval
	 * @default false
	 */
	isInterval?: boolean;
	/**
	 * The interval interval in ms
	 * @default plannedTime-currentDate
	 */
	intervalTimer?: number;
	/**
	 * The number of times the interval will be triggered before it should end
	 * @default 0
	 */
	intervalTriggers?: number;
	/**
	 * Function to be executed
	 */
	source: () => Promise<unknown> | unknown;
}

/**
 * Task Structure ({@link IParseTask})
 * @see IParseTask
 */
export interface IParseTask {
	/**
	 * Unique task identifier
	 */
	id: string;
	/**
	 * Type of task
	 */
	type: string;
	/**
	 * Set of task parameters
	 */
	params: Record<string, unknown>;
	/**
	 * Current task status
	 */
	status: string;
	/**
	 * Informing about finish/error after task execution
	 */
	inform: boolean;
	/**
	 * This is the interval
	 */
	isInterval: boolean;
	/**
	 * Interval data, available only if isInterval = true
	 */
	intervalData?: {
		/**
		 * Endless interval
		 */
		infinityInterval: boolean;
		/**
		 * Number of interval triggers
		 */
		triggeringQuantity: number;
		/**
		 * Remaining actuations
		 */
		remainingTriggers: number;
	};
	/**
	 * Next task execution
	 */
	nextExecute: Date;
	/**
	 * The function the task should perform
	 */
	source: () => Promise<unknown> | unknown;
}

/**
 * Structure of the error log ({@link IErrorLog})
 * @see IErrorLog
 */
export interface IErrorLog {
	/**
	 * Task structure ({@link ParseTask})
	 */
	task: IParseTask;
	/**
	 * Error structure
	 */
	error: Error;
	/**
	 * The number of milliseconds spent on the function
	 */
	executionTime: number;
}

/**
 * Structure of the task log ({@link ISuccessLog})
 * @see ISuccessLog
 */
export interface ISuccessLog {
	/**
	 * Task structure ({@link ParseTask})
	 */
	task: IParseTask;
	/**
	 * The value returned by the executed function
	 */
	response: unknown;
	/**
	 * The number of milliseconds spent on the function
	 */
	executionTime: number;
}
