## gh-msg

A git `commit-msg` hook that integrates with Github issues.

[![NPM](https://nodei.co/npm/gh-msg.png?compact=true)](https://nodei.co/npm/gh-msg/)

### Installation

```bash
npm install -g gh-msg
```

### Usage

Enter the directory with the git repo you wish to add the hook to, and then run:

```bash
gh-msg user/repo
```

Replacing `user/repo` with the appropriate user/organization and repo name. From there, make your changes. 

When committing, put either `GH-1234` or `#1234` (replacing the number with the issue's number) on the first line. Make sure that's the only thing on the first line. Then, `gh-msg` will use the Github API to request the issue's title, and replace your commit message with something like this:

```
Fixes GH-1234 - "Your issue's title here"
```

Anything on subsequent lines will be added to the commit as well.
