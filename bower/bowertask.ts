import * as path from "path";
import * as tl from "vsts-task-lib/task";
import { ToolRunner } from "vsts-task-lib/toolrunner";

tl.setResourcePath(path.join(__dirname, "task.json"));

const
    command = tl.getInput("command", true),
    bowerFile = tl.getPathInput("bowerjson", true, true),
    cwd = path.dirname(bowerFile) || ".";

tl.cd(cwd);

let bower = findGlobalBower();

if (bower) {
    executeBower();
}
else {
    findBower();
}

function findBower(): Promise<void> {
    tl.debug("not found global installed bower, try to find bower locally.");

    let bowerRuntime = tl.getInput("bowerRuntime", true);
    bowerRuntime = path.resolve(cwd, bowerRuntime);

    tl.debug("check path : " + bowerRuntime);
    if (tl.exist(bowerRuntime)) {
        const tool = tl.tool(tl.which("node", true));
        tool.arg(bowerRuntime);

        return executeBower(tool);
    }
    else {
        tl.debug("not found locally installed bower, trying to install bower globally.");

        return installBower()
            .then(() => executeBower());
    }
}

function installBower(): Promise<void> {
    const tool = tl.tool(tl.which("npm", true));
    tool.arg("install");
    tool.arg("-g");
    tool.arg("bower");

    return tool.exec().then(() => {
        bower = findGlobalBower();
        if (!bower) {
            tl.setResult(tl.TaskResult.Failed, tl.loc("NpmGlobalNotInPath"));
            throw new Error("NPM_GLOBAL_PREFIX_NOT_IN_PATH");
        }
    });
}

function executeBower(tool?: ToolRunner): Promise<void> {
    tool = tool || tl.tool(bower);
    tool.arg(command);

    tool.arg("--config.interactive=false");

    if (process.platform === "linux" && isRoot()) {
        tool.arg("--allow-root");
    }

    tool.arg(tl.getInput("arguments", false));

    return tool.exec()
        .then((code) => {
            tl.setResult(tl.TaskResult.Succeeded, tl.loc("BowerReturnCode", code));
        })
        .catch((err) => {
            tl.debug("Bower execution failed");
            tl.setResult(tl.TaskResult.Failed, tl.loc("BowerFailed", err.message));
        });
}

function findGlobalBower(): string {
    let bowerPath = tl.which("bower", false);

    tl.debug(`checking path: ${bowerPath}`);
    if (tl.exist(bowerPath)) {
        return bowerPath;
    }

    const
        globalPrefix = getNPMPrefix(),
        isWin = process.platform.indexOf("win") === 0;

    bowerPath = path.join(globalPrefix, "bower" + (isWin ? ".cmd" : ""));

    tl.debug(`checking path: ${bowerPath}`);
    if (tl.exist(bowerPath)) {
        return bowerPath;
    }
}

function getNPMPrefix(): string {
    if (getNPMPrefix["value"]) {
        return getNPMPrefix["value"];
    }

    const tool = tl.tool(tl.which("npm", true));
    tool.arg("prefix");
    tool.arg("-g");

    return (getNPMPrefix["value"] = tool.execSync().stdout.trim());
}

function isRoot(): boolean {
    return !!process.getuid && process.getuid() === 0;
}
