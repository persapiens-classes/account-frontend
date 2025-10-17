# Account Frontend

[![License](http://img.shields.io/:license-apache-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)
[![Build Status](https://github.com/persapiens-classes/account-frontend/actions/workflows/deploy.yml/badge.svg)](https://github.com/persapiens-classes/account-frontend/actions)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=persapiens-classes_account-frontend&metric=code_smells)](https://sonarcloud.io/project/issues?issueStatuses=OPEN%2CCONFIRMED&id=persapiens-classes_account-frontend)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=persapiens-classes_account-frontend&metric=coverage)](https://sonarcloud.io/component_measures?id=persapiens-classes_account-frontend&metric=coverage&view=list)

## Overview

This is the pedagogical example app of the discipline [Aplicação com Interfaces Ricas](https://github.com/persapiens-classes/ifrn-ria) - [Tecnologia em Análise e Desenvolvimento de Sistemas - TADS](https://sites.google.com/escolar.ifrn.edu.br/diatinf/cursos/superiores/an%C3%A1lise-e-desenvolvimento-de-sistemas?authuser=0) - [Diretoria Acadêmica de Gestão e Tecnologia da Informação - DIATINF](https://diatinf.ifrn.edu.br/) - [Campus Natal Central - CNAT](https://portal.ifrn.edu.br/campus/natalcentral) - [Instituto Federal do Rio Grande do Norte - IFRN](https://portal.ifrn.edu.br/).

## Features

- Modern single-page application (SPA) for account management
- JWT-based authentication and route guards
- CRUD operations for accounts, categories, owners, and entries
- Responsive UI with PrimeNG components and Tailwind CSS
- Real-time form validation and error handling
- Multiple entry types: Credit, Debit, and Transfer
- Balance tracking and initial value management
- Automated tests with Vitest
- Code quality checks with ESLint, Prettier, Jscpd, and SonarCloud
- Containerized development with DevContainer support

## Technologies

This frontend application is built with Angular and leverages the following technologies:

- **[Angular](https://angular.dev/)** (Framework)
- **[TypeScript](https://www.typescriptlang.org/)** (Language)
- **[PrimeNG](https://primeng.org/)** (UI component library)
- **[PrimeIcons](https://primeng.org/icons)** (Icon library)
- **[Tailwind CSS](https://tailwindcss.com/)** (Utility-first CSS framework)
- **[RxJS](https://rxjs.dev/)** (Reactive programming)
- **[JWT Decode](https://github.com/auth0/jwt-decode)** (JWT token parsing)
- **[Vitest](https://vitest.dev/)** (Unit testing framework)
- **[Happy-DOM](https://github.com/capricorn86/happy-dom)** (DOM implementation for testing)
- **[ESLint](https://eslint.org/)** (Code linting)
- **[Prettier](https://prettier.io/)** (Code formatting)
- **[JSCPD](https://github.com/kucherenko/jscpd)** (Copy-paste detection)
- **[SonarCloud](https://sonarcloud.io/)** (Code quality and coverage)
- **[Angular CLI](https://angular.dev/tools/cli)** (Build tooling)
- **[pnpm](https://pnpm.io/)** (Package manager)
- **[GitHub Actions](https://github.com/features/actions)** (CI/CD)
- **[GitHub Pages](https://pages.github.com/)** (Static site hosting)

## Getting Started

1. Clone the repository
2. Install dependencies
   ```bash
   pnpm install
   ```
3. Start development server
   ```bash
   pnpm ng serve
   ```
   Or run with host binding for DevContainer:
   ```bash
   pnpm ng serve --host 0.0.0.0 --port 4200
   ```
4. Access the application
   - Visit `http://localhost:4200/` for the frontend
   - By default, connects to backend at `http://localhost:8080`
   - For other environments, use configurations:
     ```bash
     pnpm ng serve --configuration=codespace
     pnpm ng serve --configuration=production
     ```

## Development

### Code Scaffolding

Angular CLI includes powerful code scaffolding tools:

```bash
ng generate component component-name
```

### Building

Build for production:

```bash
ng build
```

Or with production configuration and base href for GitHub Pages:

```bash
pnpm run build:prod
```

### Running Tests

Execute unit tests with Vitest:

```bash
pnpm test
```

Run tests with UI:

```bash
pnpm run test:ui
```

Generate coverage report:

```bash
pnpm run test:coverage
```

### Code Quality

Run all quality checks:

```bash
pnpm run quality
```

This includes:

- Format checking with Prettier
- Linting with ESLint
- Test coverage verification
- Copy-paste detection with JSCPD
- SonarQube analysis

## License

This project is licensed under the [Apache License 2.0](LICENSE)

```

```
