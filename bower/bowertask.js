"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var tl = require("vsts-task-lib/task");
tl.setResourcePath(path.join(__dirname, "task.json"));
var command = tl.getInput("command", true), bowerFile = tl.getPathInput("bowerjson", true, true), cwd = path.dirname(bowerFile) || ".";
tl.cd(cwd);
var bower = findGlobalBower();
if (bower) {
    executeBower();
}
else {
    findBower();
}
function findBower() {
    tl.debug("not found global installed bower, try to find bower locally.");
    var bowerRuntime = tl.getInput("bowerRuntime", true);
    bowerRuntime = path.resolve(cwd, bowerRuntime);
    tl.debug("check path : " + bowerRuntime);
    if (tl.exist(bowerRuntime)) {
        var tool = tl.tool(tl.which("node", true));
        tool.arg(bowerRuntime);
        return executeBower(tool);
    }
    else {
        tl.debug("not found locally installed bower, trying to install bower globally.");
        return installBower()
            .then(function () { return executeBower(); });
    }
}
function installBower() {
    var tool = tl.tool(tl.which("npm", true));
    tool.arg("install");
    tool.arg("-g");
    tool.arg("bower");
    return tool.exec().then(function () {
        bower = findGlobalBower();
        if (!bower) {
            tl.setResult(tl.TaskResult.Failed, tl.loc("NpmGlobalNotInPath"));
            throw new Error("NPM_GLOBAL_PREFIX_NOT_IN_PATH");
        }
    });
}
function executeBower(tool) {
    tool = tool || tl.tool(bower);
    tool.arg(command);
    tool.arg("--config.interactive=false");
    if (process.platform === "linux" && isRoot()) {
        tool.arg("--allow-root");
    }
    tool.arg(tl.getInput("arguments", false));
    return tool.exec()
        .then(function (code) {
        tl.setResult(tl.TaskResult.Succeeded, tl.loc("BowerReturnCode", code));
    })
        .catch(function (err) {
        tl.debug("Bower execution failed");
        tl.setResult(tl.TaskResult.Failed, tl.loc("BowerFailed", err.message));
    });
}
function findGlobalBower() {
    var bowerPath = tl.which("bower", false);
    tl.debug("checking path: " + bowerPath);
    if (tl.exist(bowerPath)) {
        return bowerPath;
    }
    var globalPrefix = getNPMPrefix(), isWin = process.platform.indexOf("win") === 0;
    bowerPath = path.join(globalPrefix, "bower" + (isWin ? ".cmd" : ""));
    tl.debug("checking path: " + bowerPath);
    if (tl.exist(bowerPath)) {
        return bowerPath;
    }
}
function getNPMPrefix() {
    if (getNPMPrefix["value"]) {
        return getNPMPrefix["value"];
    }
    var tool = tl.tool(tl.which("npm", true));
    tool.arg("prefix");
    tool.arg("-g");
    return (getNPMPrefix["value"] = tool.execSync().stdout.trim());
}
function isRoot() {
    return !!process.getuid && process.getuid() === 0;
}
