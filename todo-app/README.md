# ✅ ToDo App — Vue 3 + Quasar

![License](https://img.shields.io/badge/license-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Vue](https://img.shields.io/badge/Vue-3.4-4fc08d)
![Quasar](https://img.shields.io/badge/Quasar-2.14-1976d2)
![Pinia](https://img.shields.io/badge/Pinia-2.1-ffd859)
![Vitest](https://img.shields.io/badge/tested_with-Vitest-6e9f18)
![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-222)

Учебное SPA-приложение для управления списком задач, созданное в рамках курса «Современные архитектурные решения». Проект охватывает полный цикл фронтенд-разработки: от инициализации и типизации до тестирования, CI/CD и деплоя.

---

## 🚀 Возможности

- Создание, редактирование (переключение статуса) и удаление задач
- Фильтрация по статусу: все / активные / выполненные
- Поиск по названию в реальном времени
- Плавные анимации появления элементов (Quasar transitions)
- Аутентификация (mock) с перенаправлением и защитой маршрутов
- Сохранение всех данных между сессиями (localStorage)
- Тёмная и светлая тема, переключаемая пользователем
- Адаптивная вёрстка на Quasar-компонентах
- Полная типизация (TypeScript strict mode)
- Валидация ввода с помощью Zod
- Централизованная обработка ошибок
- Компонентные и юнит-тесты (Vitest + Vue Test Utils)
- Автоматический деплой на GitHub Pages через Actions

---

## 🧰 Технологический стек

| Категория | Инструменты |
|-----------|-------------|
| **Framework** | Vue 3 (Composition API, `<script setup>`) |
| **UI-библиотека** | Quasar Framework (layout, формы, диалоги, темизация) |
| **Язык** | TypeScript (strict, utility types, discriminated unions) |
| **State management** | Pinia (модульные store, интеграция с localStorage) |
| **Маршрутизация** | Vue Router 4 (guards, meta, lazy loading, breadcrumbs) |
| **HTTP-клиент** | Axios (interceptors, retry, cache) |
| **Валидация** | Zod (схемы, асинхронная проверка) |
| **Тестирование** | Vitest + @vue/test-utils + happy-dom |
| **Mock API** | JSON Server + кастомные middleware (JWT, CORS, задержки) |
| **CI/CD** | GitHub Actions (lint → typecheck → tests → deploy) |

---

## 📁 Структура проекта

```
Frontend2/
├── mock/                  # Локальный mock-сервер (только для dev)
│   ├── db.json
│   ├── routes.json
│   ├── middlewares/
│   │   └── auth.js
│   └── server.js
├── public/                # Статические файлы и SEO
├── src/
│   ├── boot/              # Точки инициализации (api, error-handler)
│   ├── components/        # TodoForm, TodoItem, TodoList, AppBreadcrumbs
│   ├── composables/       # useLocalStorage, useTodoFilter, useValidation, useAsync
│   ├── layouts/           # MainLayout, AuthLayout
│   ├── pages/             # IndexPage, LoginPage, SettingsPage, NotFoundPage
│   ├── router/            # Маршруты, guards
│   ├── services/          # apiClient, authService, todoService, userService
│   ├── stores/            # todoStore, userStore, uiStore
│   ├── types/             # Все интерфейсы и типы
│   └── utils/             # Валидация, обработка ошибок, formHelpers
├── tests/                 # Тесты
│   ├── unit/
│   └── components/
├── .github/workflows/     # CI и deploy
├── quasar.config.ts
├── vitest.config.ts
└── ...
```

---

## ⚙️ Предварительные требования

- Node.js ≥ 18
- npm ≥ 9
- (опционально) глобально установленный Quasar CLI: `npm i -g @quasar/cli`

---

## 🔧 Установка и запуск

### 1. Клонирование репозитория
```bash
git clone https://github.com/SSamsons/Frontend2.git
cd Frontend2
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Запуск mock-сервера (необходим для API)
```bash
cd mock
npm install
cd ..
npm run mock
```
Mock-сервер будет доступен на `http://localhost:3001`.

### 4. Запуск приложения в dev-режиме
Откройте второй терминал:
```bash
npm run dev
```
Приложение откроется на `http://localhost:9000` и будет проксировать запросы `/api` на mock-сервер.

**Тестовые учётные данные:**
- Логин: `user@test.com`, пароль: `123456`
- Логин: `admin@test.com`, пароль: `admin123`

---

## 📜 Доступные скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера с hot-reload |
| `npm run mock` | Запуск локального API |
| `npm run build` | Production-сборка в `dist/spa` |
| `npm run build:analyze` | Анализ размера бандла |
| `npm run typecheck` | Проверка TypeScript без эмиссии |
| `npm run lint` | ESLint проверка кода |
| `npm run test` | Запуск всех тестов |
| `npm run test:coverage` | Тесты с покрытием |

---

## 🚢 Деплой на GitHub Pages

### Шаг 1. Залить код на GitHub

```bash
git add .
git commit -m "Prepare for GitHub Pages"
git push origin main
```

### Шаг 2. Включить GitHub Pages

1. Открой репозиторий: https://github.com/SSamsons/FrontendLabs2
2. Перейди в **Settings → Pages**
3. В блоке **Build and deployment** выбери:
   - **Source:** **GitHub Actions** (не «Deploy from a branch»!)
4. Сохранять ничего не нужно — достаточно выбрать источник

### Шаг 3. Дождаться деплоя

1. Открой вкладку **Actions** в репозитории
2. После push в `main` запустится workflow **Deploy to GitHub Pages**
3. Когда job станет зелёным, сайт будет доступен по адресу:

   **https://ssamsons.github.io/FrontendLabs2/**

> Имя в URL всегда совпадает с именем репозитория на GitHub (регистр важен).

### Пустая страница?

Чаще всего причина — в **Settings → Pages** выбран источник **Deploy from a branch** (ветка `main`, папка `/`). Тогда GitHub отдаёт исходный `index.html` без JavaScript — страница белая.

**Решение:** выбери источник **GitHub Actions**, запушь изменения в `main` и дождись зелёного workflow **Deploy to GitHub Pages**.

Открой сайт по адресу `https://<твой-логин>.github.io/<имя-репозитория>/` (например `/FrontendLabs2/`).

> На GitHub Pages нет mock API. Логин и задачи через `/api` работают только локально (`npm run mock` + `npm run dev`). На проде приложение откроется, но авторизация без бэкенда не сработает.

---

## ✅ Тестирование

Используется **Vitest** с компонентными тестами и утилитами Vue Test Utils.

```bash
npm run test
```

Структура тестов:
- `tests/unit/composables/` — useTodoFilter, useValidation
- `tests/unit/stores/` — todoStore
- `tests/unit/utils/` — validation, errorHandling
- `tests/components/` — TodoItem, TodoForm, TodoList

Текущее покрытие — ≥ 80% строк и веток.