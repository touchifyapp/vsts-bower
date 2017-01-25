import * as ma from "vsts-task-lib/mock-answer";
import * as tmrm from "vsts-task-lib/mock-run";
import * as path from "path";

const
    TASK_PATH = path.join(__dirname, "..", "bower", "bowertask.js"),
    
    tmr = new tmrm.TaskMockRunner(TASK_PATH);

tmr.setInput("bowerjson", "bower.json");

tmr.setAnswers({
    which: {
        "bower": "/bin/bower"
    },
    exist: {
        "/bin/bower": true
    },
    checkPath: {
        "bower.json": true
    },
    exec: {
        "/bin/bower install --config.interactive=false": {
            code: 0,
            stdout: "[MOCK] Bower installation done!"
        }
    }
});

tmr.run();