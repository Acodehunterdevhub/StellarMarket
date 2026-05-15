# Contributing to StellarMarket

Welcome to the StellarMarket community! We're excited that you're interested in contributing to our mission of building Africa's first decentralized marketplace for crypto and mobile money.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Community](#community)

## Code of Conduct

We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) v2.1. Please read and adhere to this code when participating in our community.

## How to Contribute

There are many ways to contribute to StellarMarket:

- **Report bugs** and suggest improvements in our [issue tracker](https://github.com/stellarmarket/stellarmarket/issues)
- **Fix bugs** and implement features by submitting pull requests
- **Improve documentation**, including tutorials and guides
- **Help translate** the platform into African languages
- **Test the application** and provide feedback
- **Share knowledge** by writing blog posts or giving talks about StellarMarket

## Development Setup

### Prerequisites

- Node.js v16+ (LTS recommended)
- npm v8+
- Git
- Docker (optional, for local development environment)

### Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Run tests: `npm test`
7. Commit your changes following our [commit guidelines](#commit-guidelines)
8. Push to your fork: `git push origin feature/your-feature-name`
9. Open a Pull Request against the `main` branch

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for our commit messages. This helps us generate changelogs and understand the purpose of each commit.

Format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

Common types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Other changes that don't modify src or test files

Example:

```
feat(payment): add USDC on Stellar integration

Implement Stellar SDK to handle USDC payments for marketplace transactions.

Closes #123
```

## Pull Request Process

1. Ensure your PR addresses a single concern
2. Include tests for new functionality
3. Update documentation if applicable
4. Follow our coding standards (see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md))
5. Reference any related issues in the PR description
6. Our maintainers will review your PR and may request changes

## Issue Reporting

When reporting an issue, please include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Environment information (OS, browser, node version)
- Screenshots or videos if helpful

## Community

Join our community to connect with other contributors:

- **Discord**: [discord.gg/stellarmarket](https://discord.gg/stellarmarket)
- **Telegram**: [@StellarMarketOfficial](https://t.me/StellarMarketOfficial)
- **Email**: hello@stellarmarket.africa

Thank you for contributing to StellarMarket!

---

*StellarMarket is building the future of African commerce — where every transaction is fast, fair, and financially inclusive.*