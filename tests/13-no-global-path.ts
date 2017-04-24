import * as ma from "vsts-task-lib/mock-answer";
import * as tmrm from "vsts-task-lib/mock-run";
import * as path from "path";

const
    IS_WIN = process.platform.indexOf("win") === 0,
    TASK_PATH = path.join(__dirname, "..", "bower", "bowertask.js"),

    RUNTIME_PATH = "node_modules/bower/bin/bower",
    RUNTIME_PATH_ABS = path.join(__dirname, "..", "..", RUNTIME_PATH),
    
    NPM_GLOBAL_PREFIX = "/npm/global/prefix",
    NPM_GLOBAL_BOWER = path.join(NPM_GLOBAL_PREFIX, "bower" + (IS_WIN ? ".cmd" : "")),
    
    tmr = new tmrm.TaskMockRunner(TASK_PATH);

tmr.setInput("command", "install");
tmr.setInput("bowerjson", "bower.json");
tmr.setInput("bowerRuntime", RUNTIME_PATH);

tmr.setAnswers({
    which: {
        "bower": "/bin/bower",
        "npm": "/bin/npm",
    },
    exist: {
        "/bin/bower": false,
        [RUNTIME_PATH_ABS]: false,
        [NPM_GLOBAL_BOWER]: false
    },
    checkPath: {
        "bower.json": true,
        "/bin/npm": true
    },
    exec: {
        "/bin/npm prefix -g": {
            code: 0,
            stdout: NPM_GLOBAL_PREFIX
        },

        "/bin/npm install -g bower": {
            code: 0,
            stdout: "[MOCK] NPM installation done!"
        },

        "/bin/bower install --config.interactive=false": {
            code: 0,
            stdout: "[MOCK] Bower installation done!"
        }
    }
});

tmr.run();