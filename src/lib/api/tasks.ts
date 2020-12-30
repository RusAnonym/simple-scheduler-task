/**
 * @module Tasks
 * @description Методы для взаимодействия с задачами
 */

import { create } from "../tasks";

/**
 * @class
 * @classdesc Это конструктор для задач
 */
class Task {
	/**
	 * @param {Object} params - Набор параметров для создания задачи
	 * @param {Date | number} params.plannedTime - Время когда должна выполниться задача
	 * @param {string} params.type - Тип задачи, ни на что не влияет, но можно использовать для получения списка задач с выбранным типом
	 * @param {Object} params.params - Дополнительные параметры, для поиска задач
	 * @param {boolean} params.inform - Информирование о завершении/ошибке после выполнения задачи
	 * @param {boolean} params.isInterval - Является ли данная задача интервалом
	 * @param {number} params.intervalTimer - Промежуток выполнения интервала в ms
	 * @param {number} params.intervalTriggers - Количество срабатываний интервала, после чего он должен завершиться
	 * @param {boolean} params.boolean - Сохранять ли эту задачу в автоматическом режиме
	 */
	constructor(params: {
		plannedTime: Date | number;
		type: string;
		params: Record<string, any>;
		inform: boolean;
		isInterval: boolean;
		intervalTimer?: number;
		intervalTriggers?: number;
		backup: boolean;
		source: () => void;
	}) {
		const {
			plannedTime,
			type = "missing",
			inform = false,
			isInterval = false,
			intervalTimer = Number(plannedTime) - Number(new Date()),
			intervalTriggers = 0,
			backup = false,
			source,
		} = params;

		if (
			!plannedTime ||
			!source ||
			new Date(plannedTime).toString() === "Invalid Date"
		) {
			throw new Error("One of the required parameters is missing or incorrect");
		}

		return create({
			plannedTime: Number(plannedTime),
			type: type,
			params: params.params || {},
			inform: inform,
			isInterval: isInterval,
			intervalTimer: intervalTimer,
			intervalTriggers: intervalTriggers,
			backup: backup,
			service: false,
			source: source,
		});
	}
}

export { Task };
