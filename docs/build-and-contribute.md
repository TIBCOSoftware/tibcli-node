## Build and contribute
### Build from source
You can build your own installer of the plugin by downloading the source from this repository and following a few easy steps:
```bash
# clone this repository
$ git clone https://github.com/TIBCOSoftware/tibcli-node

# create a tgz
$ cd tibcli-node
npm pack
```

### Running unit tests
If you make changes, please be sure to update the test cases in `/test/test.js` or add your own test file and make sure the tests are completing successfully before sending a pull request.

### Linting
This project uses the Google style guide for JavaScript with some notable exceptions:
* The linebreak style check is turned off
* Switch colon spacing is turned off
* Max line length is turned off

To run the the linter and see if your code conforms to the standards execute `npm run-script linter`