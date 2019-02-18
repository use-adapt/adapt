# adapt

[![Build Status](https://travis-ci.org/use-adapt/adapt.svg?branch=master)](https://travis-ci.org/use-adapt/adapt)

A planning tool for using diabetes-related open source projects.

## To Do

### Features
- [ ] Include relevant reading material for projects/configurations
- [ ] Indicate configurations as "preferred"/"substandard"/"discontinued"/"beta"
- [ ] Add requirement info modal
- [ ] Assign approximate costs to each requirement

### Tests
- [ ] Add continuous integration (TravisCI)
- [x] Write unit tests for DependencyValidator class
- [ ] Check to make sure configuration elements/requirements are in sync

### Bugs
- [x] Package install fails

### README
- [ ] Add badges
- [ ] Add logo

### Misc.
- [ ] Standardize Javascript style
- [ ] UI - create two columns for project list
- [ ] Git Hook - yarn deploy on every commit to master
- [ ] Add a description
- [x] Alphabetize everything

## Contributing

The first step is cloning the repo:

```
$ git clone --recursive https://github.com/use-adapt/adapt.git
```

Next, go to [Yarn](https://yarnpkg.com/) package manager and install it. (You'll need this on your computer to build the project.)

Then:

```
$ cd adapt
$ yarn install
$ yarn start
```

These steps will fetch the dependencies for you, install the package, and fire
up your browser for you. You should be good to go!

## Deployment

Currently, the [adapt website][adapt_website] is hosted by Github Pages.
Provided you have push access to the [repository][website_repo] for the site,
you can execute

```
$ yarn deploy
```

from the root of the project. It will create a production build for you and push
it.

## Troubleshooting

You may get an error that suggests you may need the latest npm and node.js. To update yours:

`npm install npm@latest -g`

[adapt_website]: https://use-adapt.github.io/
[website_repo]: https://github.com/use-adapt/use-adapt.github.io/
