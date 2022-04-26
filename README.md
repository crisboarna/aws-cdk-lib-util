<div align="center">
<h1>aws-cdk-lib-util</h1>
<h2>
<a href="https://github.com/crisboarna/aws-cdk-lib-util/actions/workflows/merge_main.yaml">
  <img src="https://github.com/crisboarna/aws-cdk-lib-util/actions/workflows/merge_main.yaml/badge.svg">
</a>
<a href="https://snyk.io/test/github/crisboarna/aws-cdk-lib-util">
  <img src="https://snyk.io/test/github/crisboarna/aws-cdk-lib-util/badge.svg?targetFile=package.json">
</a>
<a href="https://codecov.io/gh/crisboarna/aws-cdk-lib-util">
  <img src="https://img.shields.io/codecov/c/github/crisboarna/aws-cdk-lib-util.svg">
</a>
<a href="https://www.npmjs.com/package/aws-cdk-lib-util">
  <img src="https://img.shields.io/npm/v/aws-cdk-lib-util.svg">
</a>
<a href="http://opensource.org/licenses/MIT">
  <img src="https://img.shields.io/github/license/crisboarna/aws-cdk-lib-util">
</a>
<a href="https://github.com/semantic-release/semantic-release">
  <img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)">
</a>
<a href="http://commitizen.github.io/cz-cli/">
  <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)">
</a>
<img src="https://badges.frapsoft.com/os/v1/open-source.svg?v=103">
<a href="https://github.com/crisboarna/aws-cdk-lib-util">
  <img src="https://img.shields.io/github/stars/crisboarna/aws-cdk-lib-util.svg">
</a>
<a href="https://github.com/crisboarna/aws-cdk-lib-util">
  <img src="https://img.shields.io/github/issues/crisboarna/aws-cdk-lib-util.svg">
</a>
<a href="https://github.com/crisboarna">
  <img src="https://img.shields.io/badge/made%20by-crisboarna-blue.svg" >
</a>
<a href="https://github.com/crisboarna/aws-cdk-lib-util/pulls">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat">
</a>
<img src="./packages/docs/static/img/readme-logo.png" width="100%">
</h2>
<h6>*Disclaimer: This is a community project not affiliated with AWS.</h6>
</div>

# Documentation
Documentation can be found [here](https://crisboarna.github.io/aws-cdk-lib-util)

# Example usage
[Example stack](https://github.com/crisboarna/react-cv/tree/main/apps/infra/src/lib/web/WebStack.ts)

# Table of Contents

* [Installation](#installation)
* [Description](#description)
  * [Parameter naming](#parameter-naming)
* [Setup](#setup)
* [Development](#development)
  * [Linting](#linting)
  * [Testing](#testing)
* [How To Contribute](#how-to-contribute)
  * [Bots used](#bots-used)
* [License](#license)


# Description
Utility library for writing `AWS CDK` code in `Typescript` or `NodeJS` that provides several benefits:
1. Built-in guidelines/best practices to maintaining clear structure to your `AWS Cloudformation` resources in usage and naming convention.
2. Cleanup your `CDK` stack by reducing lines of code needed to add or import select resource types.

Most utility functions force adherence to naming convetion of type:
`projectName`-`component identifier`-`stack environment`
such as `MyProject-Lambda-API-DEV`

This enforcement starts from requiring `projectName` prefix and `stackEnv` suffix for most components, but it also extends for some to more advanced requirements. 

I found these naming conventions to greatly improve the navigation and comprehension of the resource available, as we all know, a consistent naming convention 
reduces the mental load and speeds up our comprehension and processing of what resources are deployed and how they interconnect.

# Installation
With `yarn`
```shell
yarn add aws-cdk-lib-util
```

or with `npm`
```shell
npm install aws-cdk-lib-util
```

# Setup
Import
```typescript
import { CDKCustomResourceUtil, SSMUtil, etc... } from 'aws-cdk-lib-util';
```

# Development
## Linting
```shell
yarn lint
```

## Testing
```shell
yarn test
```
`jest` is used for as the testing framework.


Testing coverage is enforced via the `jest.config.js` to 100% across the board.

# How to Contribute

1. Clone repo and create a new branch:
```shell
git checkout https://github.com/crisboarna/aws-cdk-lib-util -b name_for_new_branch`.
````
2. Make changes and test
3. Submit Pull Request with comprehensive description of changes

## Bots used
To facilitate development the following bots are integrated into the repository:
1. [Request Info](https://github.com/behaviorbot/request-info)
2. [Semantic Pull Requests](https://github.com/apps/semantic-pull-requests)
2. [Welcome](https://github.com/apps/welcome)
3. [Snyk](https://github.com/marketplace/snyk)
4. [Todo](https://github.com/apps/todo)

## License
[![CC0](https://licensebuttons.net/p/zero/1.0/88x31.png)](https://creativecommons.org/publicdomain/zero/1.0/)

Full license details can be found in [LICENSE.md](./LICENSE.md)
