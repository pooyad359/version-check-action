/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 81:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const { copyFileSync } = __nccwpck_require__(147);
const util = __nccwpck_require__(837);
const exec = util.promisify((__nccwpck_require__(81).exec));
async function read_json(filename, branch) {
  const { stdout, stderr } = await exec(`git show ${branch}:${filename}`);
  if (stderr) {
    console.log(stderr);
  }
  return JSON.parse(`${stdout}`);
}

async function main() {
  const { stdout, stderr } = await exec(
    "git fetch --no-tags --prune --depth=1 origin +refs/heads/*:refs/remotes/origin/*"
  );
  if (stderr) {
    console.log(stderr);
  } else {
    console.log(stdout);
  }
  const package_current = await read_json("package.json", "HEAD");
  var package_master;
  try {
    package_master = await read_json("package.json", "origin/master");
  } catch (error) {
    package_master = await read_json("package.json", "origin/main");
  }
  const master_version = package_master.version.split(".").map((x) => +x);
  const current_version = package_current.version.split(".").map((x) => +x);
  if (current_version > master_version) {
    console.log(
      `Version number is updated from ${package_master.version} to ${package_current.version}`
    );
  } else {
    throw RangeError(
      `The new version (${package_current.version}) must be higher than current version (${package_master.version})`
    );
  }
}
main();

})();

module.exports = __webpack_exports__;
/******/ })()
;