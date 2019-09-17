# Shopify SBM

[![Developed by ON Lab](http://on-lab.com/developed-by-on-lab.svg?v=3)](http://on-lab.com)

Shopify SBM is a tool that will speed up the dev process using Slate when following our adaptation of [Git Successful Branching Model](https://nvie.com/posts/a-successful-git-branching-model/) for Shopify.

We also love it because we don't have to remember to change the SLATE_THEME_ID and end up pushing code to a theme we're not supposed to. This adds an extra layer of security to our workflow.

# ⓵ Installation

## Install using NPM
Run `npm install -g https://github.com/nicolasalliaume/on-shopify-sbm` to install globally.

If installing locally, use `$ ./node_modules/.bin/shopify-sbm` to run commands.

## Install from source code
Clone this repo with `git clone https://github.com/nicolasalliaume/on-shopify-sbm` and run `$ ./index.js`

# ⓶ Configure authentication to a Shopify store
In order to run the commands, you need to have a .env file with DOMAIN, KEY and PASSWORD variables pointing to a private app on your Shopify store either:
* in the same directory you're running the command from, or
* provide a path to the .env file using `--env <file>`.

For more information on creating a private app and getting those variables' values, see [this readme](https://github.com/nicolasalliaume/on-shopify-cli#-configure-authentication-to-a-shopify-store).


# Operations supported (_so far_)
Right now, the this tool supports:

## Setting the theme ID

Run `shopify-sbm set` to update the .env variable SLATE_THEME_ID to point to the theme that matches the curren gir branch you're on.

For example, if you're working on a branch called `feature/contact-page`, the tool will look up a theme called *feature/contact-page* or *... - feature/contact-page* and set SLATE_THEME_ID to the ID of that theme.

🤓 #protip: Add `shopify-sbm set && ` to the _start_, _watch_ and _deploy_ scripts in your package.json file, before `slate-tools ...`. That way it will automatically point to the correct theme when you start your work.

```json
...
"scripts": {
    "start": "shopify-sbm set && slate-tools start",
    "watch": "shopify-sbm set && slate-tools start --skipFirstDeploy",
    "deploy": "shopify-sbm set && slate-tools build && slate-tools deploy",
    ...
},
...
```

## Initializing a store

Before you start, make sure you have your terminal open inside the Shopify project and that you have initialized a git repo with a master branch. If you haven't commited any code yet, go ahead and create an initial commit before moving on.

Run `shopify-sbm init -d <domain> -k <key> -p <password>`, where
-   domain is your shopify domain (*.myshopify.com)
-   key is a private app key
-   password is a private app password

This will:
-   create a master theme (empty) on Shopify if no theme called *master* exists already
-   create a dev theme (also empty) on Shopify if no theme called *dev* exists already
-   a file called `.env.sbm` with the domain, key and password used to authenticate when running the other SBM commands
-   a git branch called `dev` if it doesn't exist already. This branch will be checked out by the command.

If you don't know how to create a private app and get the key and password, see [here](https://github.com/nicolasalliaume/on-shopify-cli#create-a-private-app).

## Creating a new branch/theme

Run `shopify-sbm branch <branch name>` to create a new git branch with the given name and also a new theme to track that branch.

For example, if you're about to start working on a new feature called _"newsletter modal"_, run `shopify-sbm branch feature/newsletter-modal` to create a new branch from `dev`, and a new theme called `feature/newsletter-modal` as a duplicate of the _dev_ theme.

## Cheatsheet

For a good'ol cheatsheet, see [ON Lab's Shopify Development Cheatsheet](https://onlab-tmp-bucket.s3-us-west-2.amazonaws.com/ON+Lab+-+Shopify+Development+Cheatsheet+.pdf).

--------

[![ON Lab](http://on-lab.com/on-lab.jpg)](http://on-lab.com)
