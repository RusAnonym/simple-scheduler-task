# Документация

## Установка

### NPM

Установка через стандартный менеджер пакетов NPM

```shell
npm install simple-scheduler-task
```

### Yarn

Установка через пакетный менеджер Yarn

```shell
yarn add simple-scheduler-task
```

## Инициализация

```js
const scheduler = require("simple-scheduler-task");
```

## Events

Вы можете получать значение которое возвращает планируемая задача, а также получать ошибки происходящие при выполнении задачи при использовании событий.

Более подробно о работе событий: https://nodejs.org/api/events.html

### logs

Сервисные уведомления модуля

#### Использование:

```js
scheduler.events.on(`logs`, async (data) => {
	console.log(data); // => String
});
```

### errors

Уведомления связанные с ошибками при выполнении задач

#### Использование:

```js
scheduler.events.on(`errors`, async (data) => {
	console.log(data); // => Object
});
```

#### Структура уведомления

| Параметр      | Тип    | Описание                                               |
| ------------- | ------ | ------------------------------------------------------ |
| task          | Object | [Задача в которой произошла ошибка](#Структура-задачи) |
| error         | Object | Объект ошибки                                          |
| executionTime | Number | Время выполнения в ms                                  |

### executions

Уведомления связанные с успешным выполнением задач

#### Использование:

```js
scheduler.events.on(`executions`, async (data) => {
	console.log(data); // => Object
});
```

#### Структура уведомления

| Параметр      | Тип    | Описание                                               |
| ------------- | ------ | ------------------------------------------------------ |
| task          | Object | [Задача в которой произошла ошибка](#Структура-задачи) |
| response      | Any    | Значение которая возвращает задача                     |
| executionTime | Number | Время выполнения в ms                                  |

## Tasks

Функции для добавления, удаления, просмотра задач

### add

Добавляет задачу в планировщик

#### Использование

```js
scheduler.tasks.add(taskData); // => Promise<String>
```

#### Структура taskData

| Параметр         | Тип      | Описание                                       | По умолчанию |
| ---------------- | -------- | ---------------------------------------------- | ------------ |
| plannedTime      | Number   | Время в ms когда должна выполниться задача     | null         |
| type             | String   | Тип задачи                                     | missing      |
| params           | Object   | Параметры задачи                               | {}           |
| inform           | Boolean  | Выводить ли в событиях информацию о задаче     | false        |
| isInterval       | Boolean  | Выполнять ли задачу с определённым промежутком | false        |
| intervalTimer    | Boolean  | Промежуток выполнения интервала в ms           | null         |
| intervalTriggers | Number   | Количество срабатываний интервала              | null         |
| intervalTriggers | Function | Функция которую должна выполнить задача        | null         |

#### Примеры

Создание задачи которая должна вывести Hello, world! через 15 секунд

```js
scheduler.tasks.add({
	inform: true, // Выведет в события ответ задачу
	plannedTime: Number(new Date()) + 15000, // Время выполнения задачи
	code: async function () {
		console.log(`Hello, world!`); // Вывод Hello, world!
		return 5; // Значение возвращаемое функцией
	},
}); // Promise<String> (Идентификатор задачи)
```

При таких параметрах [сюда](#executions) придёт событие

```json
{
  "task": {
    "id": "5f8458bfb764ead2",
    "type": "missing",
    "params": {},
    "status": "executed",
    "isInterval": false,
    "source": // Function
  },
  "response": 5,
  "executionTime": 0.9672999978065491
}
```

### get

Получает задачу по её идентификатору

```js
scheduler.tasks.get(taskID); // Promise<Object>
```

Возвращает задачу в [формате](#Структура-задачи)

### getAll

Получает все запланированные задачи

```js
scheduler.tasks.getAll(); // Promise<Array>
```

Возвращает массив с задачами в [формате](#Структура-задачи)

### delete

Удаляет задачу по её идентификатору

```js
scheduler.tasks.delete(taskID); // Promise<Boolean>
```

Возвращает true при успешном удалении задачи

## settings

Класс для работы с настройками

### setMode

Позволяет установить режим работы модуля.

Принимает один из двух параметров, либо timeout, либо interval.

timeout для каждой задачи создаёт отдельный таймаут, а interval создаёт один интервал для всех задач.

```js
scheduler.settings.setMode("timeout"); // Promise<Boolean>
```

Возвращает true при успешной смене режима работы

### editCheck

Изменяет переодичность проверки задач интервалом

```js
scheduler.settings.editCheck(2000); // Promise<Boolean>
```

Приведённый код устанавливает проверку задач каждые 2 секунды

Возвращает true при успешном изменении интервала

## backup

### init

Проверяет наличие папки для бэкапа задач, и если она отсуствует создаёт её.

```js
scheduler.backup.init(); // Promise<Boolean>
```

### save

Сохраняет все задачи

```js
scheduler.backup.save(); // Promise<Boolean>
```

### load

Загружает сохранённые задачи

```js
scheduler.backup.load(); // Promise<Boolean>
```

## Структура задачи

| Параметр   | Тип      | Описание                                       |
| ---------- | -------- | ---------------------------------------------- |
| id         | String   | Идентификатор задачи                           |
| type       | String   | Тип задачи                                     |
| params     | Object   | Параметры задачи                               |
| status     | String   | Статус выполнения задачи                       |
| isInterval | Boolean  | Выполнять ли задачу с определённым промежутком |
| source     | Function | Функция которая должна выполниться             |

В случае если параметр isInterval равен true, возвращается дополнительное поле intervalData

| Параметр           | Тип    | Описание                                     |
| ------------------ | ------ | -------------------------------------------- |
| interval           | Number | Промежуток выполнения интервала              |
| triggeringQuantity | Number | Количество срабатываний интервала            |
| remainingTriggers  | Number | Количество оставшихся срабатываний интервала |
