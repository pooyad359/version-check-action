const util = require("util");
const core = require("@actions/core");
const exec = util.promisify(require("child_process").exec);
async function read_json(filename, branch) {
  const { stdout, stderr } = await exec(`git show ${branch}:${filename}`);
  if (stderr) {
    console.log(stderr);
  }
  return JSON.parse(`${stdout}`);
}

async function main() {
  console.log("Environemnt Variables:", process.env);
  const BASE_REF =
    process.env.INPUT_DEFAULT_BRANCH || process.env.GITHUB_BASE_REF;

  const { stdout, stderr } = await exec(
    "git fetch --no-tags --prune --depth=1 origin +refs/heads/*:refs/remotes/origin/*"
  );
  const FILEPATH = process.env.INPUT_JSON_PATH;
  console.log("STDOUT:", stdout);
  console.log("STDERR:", stderr);
  const package_current = await read_json(FILEPATH, "HEAD");
  var package_master;
  package_base = await read_json(FILEPATH, "origin/" + BASE_REF);
  //   try {
  //     package_master = await read_json(FILEPATH, "origin/master");
  //   } catch (error) {
  //     package_master = await read_json(FILEPATH, "origin/main");
  //   }
  const master_version = package_base.version.split(".").map((x) => +x);
  const current_version = package_current.version.split(".").map((x) => +x);
  if (current_version > master_version) {
    console.log(
      `Version number is updated from ${package_base.version} to ${package_current.version}`
    );
  } else {
    core.setFailed(
      `The new version (${package_current.version}) must be higher than the current version (${package_master.version})`
    );
  }
}

main();
