# adapt

A planning tool for using diabetes-related open source projects.

## Contributing

The first step is cloning the repo:

```
$ git clone --recursive https://github.com/use-adapt/adapt.git
```

You need the [Yarn](https://yarnpkg.com/) package manager to build the project. Once you
have it installed,

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

[adapt_website]: https://use-adapt.github.io/
[website_repo]: https://github.com/use-adapt/use-adapt.github.io/

