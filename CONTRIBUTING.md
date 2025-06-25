# Contributing to SocialCraft

Thank you for your interest in contributing to SocialCraft! This document outlines the guidelines and processes for contributing to our project.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Development Environment](#development-environment)
- [Coding Standards](#coding-standards)
- [Component Development](#component-development)
- [State Management](#state-management)
- [Styling Guidelines](#styling-guidelines)
- [Backend Development](#backend-development)
- [Pull Request Process](#pull-request-process)
- [Code Quality](#code-quality)
- [Testing](#testing)
- [Security](#security)
- [Code of Conduct](#code-of-conduct)

## Tech Stack

SocialCraft is built using:

- **Frontend**: SvelteKit 5 with Svelte 5 Runes
- **Styling**: Tailwind CSS v4 with custom theming
- **UI Components**: Shadcn-Svelte with custom adaptations
- **Runtime**: Bun
- **Backend**: Node.js with AWS SDK v3
- **Database**: PostgreSQL with Prisma ORM
- **AI/ML**: AWS Bedrock (Stable Diffusion XL)
- **Storage**: AWS S3
- **Content Moderation**: AWS Rekognition

## Development Environment

### Prerequisites

- Node.js 18+ (LTS recommended)
- Bun 1.0+
- AWS CLI (for backend development)
- PostgreSQL 14+

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/socialcraft.git
   cd socialcraft
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Update the .env file with your configuration
   ```

4. Start the development server:
   ```bash
   bun run dev
   ```

## Coding Standards

### TypeScript

- All code must be written in TypeScript
- Enable strict mode in `tsconfig.json`
- Use explicit type annotations for function parameters and return types
- Avoid using `any` type - prefer `unknown` with type guards

### Svelte 5 with Runes

- Use Svelte 5's new Runes API for reactivity
- Declare reactive state with `$state`:
  ```typescript
  let count = $state(0);
  ```
- Use `$derived` for computed values:
  ```typescript
  let doubled = $derived(count * 2);
  ```
- Use `$effect` for side effects:
  ```typescript
  $effect(() => {
    console.log(`Count is now ${count}`);
  });
  ```
- Use `$props` for component props:
  ```typescript
  let { greeting = 'Hello!' } = $props();
  ```

### File Structure

- Follow the SvelteKit file-based routing convention
- Place components in `src/lib/components`
- Use kebab-case for component file names
- Group related components in feature-based directories

## Component Development

### Shadcn-Svelte Components

When adding new UI components:

1. Install the base component:
   ```bash
   bunx shadcn-svelte@latest add [component-name]
   ```

2. Customize the component in `src/lib/components/ui`
3. Export the component from `src/lib/components/index.ts`

### Component Guidelines

- Keep components small and focused on a single responsibility
- Use TypeScript interfaces for component props
- Document component props with JSDoc comments
- Include ARIA attributes for accessibility
- Add Storybook stories for visual testing

## State Management

- Use Svelte 5 Runes for local component state
- For global state, consider using Svelte stores or context API
- Keep state as close to where it's used as possible
- Use immutable patterns when updating state

## Styling Guidelines

### Tailwind CSS v4

- Use utility classes for styling components
- Create reusable component variants using `@apply` in CSS
- Define custom theme values in `tailwind.config.js`
- Use CSS variables for dynamic theming

### Custom Styles

- Place global styles in `src/app.css`
- Use CSS modules for component-specific styles
- Follow BEM naming convention for custom CSS classes

## Backend Development

### AWS Integration

- Use the AWS SDK v3 for all AWS services
- Store AWS credentials in environment variables
- Implement proper error handling and logging
- Follow the principle of least privilege for IAM roles

### Database

- Use Prisma for database access
- Write migrations for schema changes
- Include seed data for development
- Add indexes for frequently queried fields

## Pull Request Process

1. Fork the repository and create your branch from `main`
2. Make your changes following the coding standards
3. Add tests for new features
4. Update documentation as needed
5. Run the test suite and ensure all tests pass
6. Submit a pull request with a clear description of changes

## Code Quality

- Run the linter before committing:
  ```bash
  bun run lint
  ```
- Format your code using Prettier:
  ```bash
  bun run format
  ```
- Fix all TypeScript errors before submitting a PR
- Keep functions small and focused
- Write self-documenting code with meaningful variable names

## Testing

- Write unit tests for all new features
- Use `@testing-library/svelte` for component testing
- Add integration tests for critical user flows
- Run the test suite before pushing changes:
  ```bash
  bun test
  ```

## Security

- Never commit sensitive information to version control
- Use environment variables for configuration
- Sanitize all user inputs
- Implement proper authentication and authorization
- Follow security best practices for AWS services

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Getting Help

If you have questions or need help, please open an issue in the repository.
