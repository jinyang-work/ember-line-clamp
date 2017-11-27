# Contributing to Ember Line Clamp

Hi there! Thanks for your interest in Ember Line Clamp. This guide will help you get started contributing. 

## Project Structure

Ember Line Clamp is an ember addon for truncating text to specified number of lines with "show more"/"show less" capability.

- `addon`: All addon code goes here. 
  - `components`: All JS for ember component. 
  - `templates`: All handlebars for ember component. 
- `app`: Component exports go here. 
  - `components`: Exporting the JS from addon directory. 
  - `styles`: All styles for the compoment.
- `config`: Ember environment configs.
- `test`: End-to-end tests

## Developing locally

First, fork the repo to your GitHub account. Then clone your fork to your local 
machine and make a new branch for your feature/bug/patch etc. It's a good idea to not develop directly on master so you can get updates.

```
git clone https://github.com/<YOUR_GITHUB_USERNAME>/ember-line-clamp.git
cd ember-line-clamp
git checkout -B <my-branch>
npm install
```

## Running

- `ember serve`
- Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

- `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
- `ember test`
- `ember test --server`

## Building

- `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

### Commands

TBD - Will be integrating template linting, stylelint, eslint and prettier on precommit

### Updating your fork

When you want to pull down changes to your fork enter the following into your terminal:

```bash
git checkout master
git pull origin master
git checkout <my-branch>
git rebase master
```

## Why wasn't my PR merged?

I will do my best to write out my reasoning before closing a PR, but 80% of the time it falls under one of these...

- You did not read this document
- Your code breaks an internal application (I will be transparent about this)
- Your code conflicts with some future plans (I will be transparent about this too)
- You've said something inappropriate or have broken the Code of Conduct

## Getting help

Tweet / DM [@luistorres1423](https://twitter.com/luistorres1423)
