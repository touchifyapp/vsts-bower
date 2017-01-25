"use strict";
var path = require("path");
var tl = require("vsts-task-lib/task");
tl.setResourcePath(path.join(__dirname, "task.json"));
var command = tl.getInput("command", true), bowerFile = tl.getPathInput("bowerjson", true, true), cwd = path.dirname(bowerFile) || ".";
tl.cd(cwd);
var bower = tl.which("bower", false);
tl.debug("checking path: " + bower);
if (!tl.exist(bower)) {
    findBower();
}
else {
    executeBower();
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
        installBower()
            .then(function () { return executeBower(); });
    }
}
function installBower() {
    var tool = tl.tool(tl.which("npm", true));
    tool.arg("install");
    tool.arg("-g");
    tool.arg("bower");
    return tool.exec()
        .then(function () { bower = tl.which("bower", true); })
        .catch(function () {
        tl.setResult(tl.TaskResult.Failed, tl.loc("NpmGlobalNotInPath"));
        throw new Error("NPM_GLOBAL_PREFIX_NOT_IN_PATH");
    });
}
function executeBower(tool) {
    tool = tool || tl.tool(bower);
    tool.arg(command);
    tool.arg("--config.interactive=false");
    tool.arg(tl.getInput("arguments", false));
    return tool.exec()
        .then(function (code) {
        tl.setResult(tl.TaskResult.Succeeded, tl.loc("BowerReturnCode", code));
    })
        .catch(function (err) {
        tl.debug("taskRunner fail");
        tl.setResult(tl.TaskResult.Failed, tl.loc("BowerFailed", err.message));
    });
}
