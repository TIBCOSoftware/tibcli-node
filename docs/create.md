## create
Creating code from scratch can be a difficult task, so this command helps you to create a skeleton Node.js app in the current directory.

### options
* `--appname <name>` The name of the app (**required**)
* `--appversion <version>` The version of the app (**required**)
* `--use-git` Initialize an empty git repo
* `--use-github` Create a new GitHub repo

### examples
```
tibcli-node --appname myapp --appversion 1.0.0
```
This example will create a new app in the current directory called _myapp_ with version number _1.0.0_.


```
tibcli-node --appname myapp --appversion 1.0.0 --use-git
```
This example will create a new app in the current directory called _myapp_ with version number _1.0.0_ and will initialize a new git repo as well.