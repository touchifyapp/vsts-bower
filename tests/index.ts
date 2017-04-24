import * as path from "path";
import * as assert from "assert";
import * as ttm from "vsts-task-lib/mock-test";

describe("Bower Task", () => {

    describe("Base", () => {
        
        it("should invoke bower if globally available", function (done: MochaDone) {
            this.timeout(5000);

            const 
                tr = new ttm.MockTestRunner(path.join(__dirname, "10-simple-inputs.js"));

            tr.run();

            assert(tr.succeeded, "should have succeeded");

            assert.equal(tr.invokedToolCount, 1, "should have called global bower");
            assert.equal(tr.warningIssues.length, 0, "should have no warnings");
            assert.equal(tr.errorIssues.length, 0, "should have no errors");

            assert(tr.stdout.indexOf("[MOCK] Bower installation done!") >= 0, "bower stdout");
            assert(!tr.stderr, "bower stderr should be empty");

            done();
        });

        it("should call specified bower runtime if not found globally", function (done: MochaDone) {
            this.timeout(5000);

            const 
                tr = new ttm.MockTestRunner(path.join(__dirname, "11-custom-runtime.js"));

            tr.run();

            assert(tr.succeeded, "should have succeeded");

            assert.equal(tr.invokedToolCount, 2, "should have called local bower");
            assert.equal(tr.warningIssues.length, 0, "should have no warnings");
            assert.equal(tr.errorIssues.length, 0, "should have no errors");

            assert(tr.stdout.indexOf("not found global installed bower") >= 0, "global bower not found");
            assert(tr.stdout.indexOf("[MOCK] Bower installation done!") >= 0, "bower stdout");
            assert(!tr.stderr, "bower stderr should be empty");

            done();
        });

        it("should install bower globally if not found globally nor locally", function (done: MochaDone) {
            this.timeout(5000);

            const 
                tr = new ttm.MockTestRunner(path.join(__dirname, "12-install-global.js"));

            tr.run();

            assert(!tr.succeeded, "should have failed"); //succeded ! Because we cannot set moch exists false then true

            assert.equal(tr.invokedToolCount, 2, "should have called npm and bower");
            assert.equal(tr.warningIssues.length, 0, "should have no warnings");
            assert.equal(tr.errorIssues.length, 1, "should have one error");

            assert(tr.stdout.indexOf("not found global installed bower") >= 0, "global bower not found");
            assert(tr.stdout.indexOf("not found locally installed bower") >= 0, "local bower not found");
            assert(tr.stdout.indexOf("[MOCK] NPM installation done!") >= 0, " NPM stdout");

            assert(!tr.stderr, "bower stderr should be empty");

            done();
        });

        it("should explain if global NPM prefix not in PATH", function (done: MochaDone) {
            this.timeout(5000);

            const 
                tr = new ttm.MockTestRunner(path.join(__dirname, "13-no-global-path.js"));

            tr.run();

            assert(!tr.succeeded, "should have failed");

            assert.equal(tr.invokedToolCount, 2, "should have called npm");
            assert.equal(tr.warningIssues.length, 0, "should have no warnings");

            assert(tr.errorIssues.length > 0, "should have errors");
            assert.equal(tr.errorIssues[0], "loc_mock_NpmGlobalNotInPath", "should explain how to add NPM global prefix to PATH");

            assert(tr.stdout.indexOf("not found global installed bower") >= 0, "global bower not found");
            assert(tr.stdout.indexOf("not found locally installed bower") >= 0, "local bower not found");
            assert(tr.stdout.indexOf("[MOCK] NPM installation done!") >= 0, " NPM stdout");

            assert(!tr.stderr, "bower stderr should be empty");

            done();
        });

        it("should find bower in `npm prefix -g` if not in path", function (done: MochaDone) {
            this.timeout(5000);

            const 
                tr = new ttm.MockTestRunner(path.join(__dirname, "14-find-in-npm-prefix.js"));

            tr.run();

            assert(tr.succeeded, "should have succeeded");

            assert.equal(tr.invokedToolCount, 2, "should have called npm and bower");
            assert.equal(tr.warningIssues.length, 0, "should have no warnings");
            assert.equal(tr.errorIssues.length, 0, "should have no errors");

            assert(tr.stdout.indexOf("[MOCK] Bower installation done!") >= 0, "bower stdout");

            assert(!tr.stderr, "bower stderr should be empty");

            done();
        });

    });

    describe("Configuration", () => {

        it("should fail if no command is provided", function (done: MochaDone) {
            this.timeout(5000);

            const
                tr = new ttm.MockTestRunner(path.join(__dirname, "20-no-command.js"));

            tr.run();

            assert(!tr.succeeded, "should have failed");

            assert.equal(tr.invokedToolCount, 0, "should not have called bower");
            assert.equal(tr.warningIssues.length, 0, "should have no warnings");

            assert(tr.errorIssues.length > 0, "should have errors issue");
            assert(tr.errorIssues[0].indexOf("Input required: command") > 0, "should notify required input");

            done();
        });

        it("should fail if no bowerjson input does not exists", function (done: MochaDone) {
            this.timeout(5000);

            const
                tr = new ttm.MockTestRunner(path.join(__dirname, "21-no-bowerjson.js"));

            tr.run();

            assert(!tr.succeeded, "should have failed");

            assert.equal(tr.invokedToolCount, 0, "should not have called bower");
            assert.equal(tr.warningIssues.length, 0, "should have no warnings");

            assert(tr.errorIssues.length > 0, "should have errors issue");
            assert(tr.errorIssues[0].indexOf("Not found bower.json") > 0, "should notify required input");

            done();
        });

        it("should add arguments to command if provided", function (done: MochaDone) {
            this.timeout(5000);

            const
                tr = new ttm.MockTestRunner(path.join(__dirname, "22-arguments.js"));

            tr.run();

            assert(tr.succeeded, "should have succeeded");

            assert.equal(tr.invokedToolCount, 1, "should have called bower");
            assert.equal(tr.warningIssues.length, 0, "should have no warnings");
            assert.equal(tr.errorIssues.length, 0, "should have no issues");

            assert(tr.stdout.indexOf("[MOCK] Bower installation with arguments done!") >= 0, "bower stdout");

            done();
        });

    });

});