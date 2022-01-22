const { copyFileSync } = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
async function read_json(filename, branch) {
  const { stdout, stderr } = await exec(`git show ${branch}:${filename}`);
  if (stderr) {
    console.log(stderr);
  }
  return JSON.parse(`${stdout}`);
}

async function main() {
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
