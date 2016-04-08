import * as path from "path";
import * as tl from "vsts-task-lib/task";
import { ToolRunner } from "vsts-task-lib/toolrunner";

tl.setResourcePath(path.join(__dirname, "task.json"));

const 
    bowerFile = tl.getPathInput("bowerjson", true, true),
    cwd = path.dirname(bowerFile) || ".";

tl.cd(cwd);

let bower = tl.which("bower", false);

tl.debug(`checking path: ${bower}`);
if(!tl.exist(bower)) {
	findBower();
}
else {
	executeBower();
}

function findBower() {
    tl.debug("not found global installed bower, try to find bower locally.");	
	
	let bowerRuntime = tl.getInput("bowerRuntime", true);
	bowerRuntime = path.resolve(cwd, bowerRuntime);
	
	tl.debug("check path : " + bowerRuntime);
	if(tl.exist(bowerRuntime)) {
	    const tool = tl.createToolRunner(tl.which("node", true));	
	    tool.pathArg(bowerRuntime);
        
        return executeBower(tool);
	}
    else {
        tl.debug("not found locally installed bower, trying to install bower locally.");
    
        installBower()
            .then(() => executeBower());
    }
}

function installBower() {
	const tool = tl.createToolRunner(tl.which("npm", true));
    tool.arg("install");
    tool.arg("-g");
    tool.arg("bower");
    
    return tool.exec()
        .then(() => { bower = tl.which("bower", true); });
}

function executeBower(tool?: ToolRunner) {
    tool = tool || tl.createToolRunner(bower);
    tool.arg(tl.getInput("command", false));

    tool.arg("--config.interactive=false");
    tool.arg(tl.getInput("arguments", false));

    return tool.exec()
        .then((code) => {
            tl.setResult(tl.TaskResult.Succeeded, tl.loc("BowerReturnCode", code));
        })
        .catch((err) => {
            tl.debug("taskRunner fail");
            tl.setResult(tl.TaskResult.Failed, tl.loc("BowerFailed", err.message));
        });
}