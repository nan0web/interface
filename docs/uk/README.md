# @nan0web/interface

Пакет *interface* надає легку абстракцію для створення
інтерактивних інструментів командного рядка. Він включає:

- `CLIInterface` – низькорівневий обгортка вводу‑виводу.
- `InterfaceCore` – диспетчер протоколів.
- `createCLIInterface` – фабріка, що повертає готовий до використання ядро.

|[Статус](https://github.com/nan0web/monorepo/blob/main/system.md#написання-сценаріїв)|Документація|Покриття тестами|Функції|Версія NPM|
|---|---|---|---|---|
|🟢 `98.4%`|🧪 [English 🏴󠁧󠁢󠁥󠁮󠁧󠁿](https://github.com/nan0web/interface/blob/main/README.md)<br/>[Українською 🇺🇦](https://github.com/nan0web/interface/blob/main/docs/uk/README.md)|🟢 `92.3%`|✅ d.ts 📜 system.md 🕹️ playground|—|

## Встановлення

Як встановити за допомогою npm?
```bash
npm install @nan0web/interface
```

Як встановити за допомогою pnpm?
```bash
pnpm add @nan0web/interface
```

Як встановити за допомогою yarn?
```bash
yarn add @nan0web/interface
```

## Основне використання CLIInterface

Клас можна ініціалізувати з власними потоками.

Як створити CLIInterface з підміченими потоками?
```js
import { CLIInterface } from "@nan0web/interface"
const stdin = new Readable({
  read() {
    this.push("example\n")
    this.push(null)
  },
})
const stdout = { writable: true }
const cli = new CLIInterface({ stdin, stdout, logger: console })
```

## Обробка виводу

`output` пересилає повідомлення до вказаного логера.

Як CLIInterface виводить звичайні, попереджувальні та критичні повідомлення?
```js
import { CLIInterface } from "@nan0web/interface"
const cli = new CLIInterface({ logger: console })
cli.output({
  content: ["normal msg"],
  priority: 0,
  meta: {},
  error: null,
})
cli.output({
  content: ["warn msg"],
  priority: 10,
  meta: {},
  error: null,
})
cli.output({
  content: ["fatal msg"],
  priority: 20,
  meta: {},
  error: null,
})
```

## Фабричний помічник

`createCLIInterface` повертає екземпляр `InterfaceCore`, який вже обгортає `CLIInterface`.

Як отримати InterfaceCore через фабрику?
```js
import { createCLIInterface, InterfaceCore } from "@nan0web/interface"
const core = createCLIInterface()
```

## Реєстрація простого протоколу

Показує, як додати протокол до ядра.

Як зареєструвати простий echo‑протокол і обробити ввід?
```js
import { InterfaceCore } from "@nan0web/interface"
class Echo {
  constructor(trigger) {
    this._trigger = trigger
  }
  accepts(msg) {
    return msg.value === this._trigger
  }
  async process(msg) {
    return {
      content: ["echo:", msg.value],
      priority: 0,
      meta: {},
      error: null,
    }
  }
}
const stdin = new Readable({
  read() {
    this.push("ping\n")
    this.push(null)
  },
})
const core = new InterfaceCore(new CLIInterface({ stdin, logger: console }))
core.register(new Echo("ping"))
const status = await core.step()
console.info(status) // ← idle
```

## Огляд API

Пакет експортує наступні символи:

- `createCLIInterface(config)` – фабрика, що повертає готове ядро.
- `CLIInterface` – низькорівнева реалізація вводу‑виводу.
- `InterfaceCore` – менеджер протоколів.

Всі експортовані символи мають бути присутніми.

## Оголошення типів TypeScript

Поле `types` вказує на згенерований файл декларацій.

Використовуються `.d.ts` для автодоповнення.

## Внесок

Як зробити внесок? – [перегляньте тут](./CONTRIBUTING.md)

## Ліцензія

Як застосувати ліцензію ISC? – [перегляньте тут](./LICENSE)
