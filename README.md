# 🎵 MyMusic Player

![Angular](https://img.shields.io/badge/Angular-17.3-DD0031.svg?style=flat&logo=angular)
![Material Design](https://img.shields.io/badge/Material-Design-blue.svg?style=flat&logo=material-design)
![License](https://img.shields.io/badge/license-MIT-green.svg)

> A modern, responsive, and feature-rich music player application built with Angular 17 and Angular Material.

## 📖 Description

MyMusic Player is a web-based audio streaming interface designed to provide a seamless listening experience. Built with the latest Angular 17 features including Standalone Components and Server-Side Rendering (SSR), it offers a clean, material design-inspired UI with comprehensive theme support.

**Why this project?**
This project serves as a robust example of a modern Angular application architecture, demonstrating best practices in state management, component composition, and responsive design without relying on a complex backend infrastructure initially.

### ✨ Key Features

*   **Responsive Material UI:** A polished interface that works seamlessly across desktop and mobile devices.
*   **Dark/Light Mode:** Fully integrated theming system with persistence and automatic system preference detection.
*   **Smart Search:** Real-time search functionality for songs, albums, and artists with instant feedback.
*   **Library Management:** Organize your music with dedicated views for Playlists, Artists, and Albums.
*   **Mock Data Integration:** Fully functional prototype powered by a comprehensive mock data service, allowing for immediate testing and demonstration.

## 📚 Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Development](#-development)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Installation

### Prerequisites

*   **Node.js:** v18.13.0 or higher
*   **npm:** v8.0.0 or higher
*   **Angular CLI:** v17.3.0 or higher (`npm install -g @angular/cli`)

### Steps

1.  **Clone the repository**
    ```bash
    git clone https://github.com/LazzouziYoussefEtu/Musicplayer.git
    cd Musicplayer
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Verify Installation**
    Run the build command to ensure everything is set up correctly:
    ```bash
    npm run build
    ```

## ⚡ Quick Start

To start the development server and view the application:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Common Usage

*   **Toggle Theme:** Click the moon/sun icon in the top right header to switch between Dark and Light modes.
*   **Search:** Use the search bar in the header to find songs (e.g., try "Luna", "Cosmic").
*   **Navigation:** Use the sidebar to browse Home, Library, or Playlists.
*   **Settings:** Access user settings via the profile menu or sidebar to configure preferences.

## 📂 Project Structure

```
src/
├── app/
│   ├── core/           # Singleton services, models, guards
│   │   ├── models/     # Data interfaces (Song, Album, Artist)
│   │   └── services/   # Data and State logic (Music, Player, Theme)
│   ├── layout/         # Structural components (Header)
│   ├── pages/          # Route views (Home, Library, Settings)
│   └── shared/         # Reusable UI components (Player, Sidebar, Cards)
├── assets/             # Static assets
└── styles.scss         # Global styles and Material Theme definition
```

## ⚙️ Configuration

The application uses standard Angular configuration files.

*   **`angular.json`**: Workspace configuration, build paths, and style imports.
*   **`src/environments/`**: (Setup for future environment-specific variables like API endpoints).
*   **`src/app/core/services/mock-data.ts`**: Currently serves as the data source. Edit this file to add or modify the initial music library content.

## 🛠 Development

### Build

To build the project for production (artifacts will be stored in `dist/`):

```bash
npm run build
```

### Server-Side Rendering (SSR)

To serve the application with SSR:

```bash
npm run serve:ssr:Musicplayer
```

### Code Scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## 🧪 Testing

### Unit Tests

Run the unit tests via [Karma](https://karma-runner.github.io):

```bash
npm test
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors & Acknowledgments

*   **Lazzouzi Youssef** - *Initial Work*

Built with ❤️ using [Angular](https://angular.io/) and [Angular Material](https://material.angular.io/).