# TaskFlow - Smart Task Manager

TaskFlow is a lightweight task management web app designed to help users organize daily work, track progress, and stay productive. It includes task creation, priority labels, search and filtering, editing, deletion, completion tracking, and dark mode support.

## Features

- Add new tasks with priority levels
- Mark tasks as complete or pending
- Edit existing tasks
- Delete tasks
- Search tasks by name
- Filter by all, pending, or completed tasks
- View summary statistics for total, pending, and completed tasks
- Dark mode toggle
- Browser local storage persistence so tasks remain saved across refreshes

## Tech Stack

- HTML
- JavaScript
- Tailwind CSS
- LocalStorage for data persistence

## Project Structure

```text
Smart Task Manager/
├── index.html
├── script.js
├── src/
│   ├── input.css
│   └── output.css
├── package.json
├── package-lock.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine

### Installation

1. Clone the repository
2. Open the project folder
3. Install dependencies:

```bash
npm install
```

### Build Tailwind CSS

This project uses Tailwind CLI to generate the stylesheet.

```bash
npm run build:css
```

For live CSS rebuilding during development:

```bash
npm run watch:css
```

### Run the App

Open `index.html` directly in your browser, or serve the project with a local static server if preferred.

Example with Python:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Usage

- Type a task in the input field and select a priority
- Click "Add Task" to create it
- Use the checkbox to mark a task complete
- Use the edit icon to update task text or priority
- Use the delete icon to remove a task
- Search and filter tasks from the control panel

## Notes

Task data is stored in the browser using `localStorage`, so the tasks remain available even after refreshes as long as browser storage is not cleared.

## License

This project is open for personal and educational use.
