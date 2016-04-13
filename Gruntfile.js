"use strict";

module.exports = function (grunt) {
    require("time-grunt")(grunt);
    require("jit-grunt")(grunt, {
        buildcontrol: "grunt-build-control"
    });

    var config = {
        pkg: grunt.file.readJSON("package.json"),
        
        paths: {
            src: "bower",
            build: "dist",
            temp: ".temp"
        }
    };
    
    //#region Typescript
    
    config.ts = {
        options: {
            target: "es5",
            module: "commonjs",
            declaration: false,
            comments: true,
            sourceMap: false,
            disallowbool: true,
            disallowimportmodule: true,
            fast: "never"
        },
        dist: {
            src: ["_references.d.ts", "<%= paths.src %>/**/*.ts"],
            dest: "<%= paths.build %>/<%= paths.src %>"
        }
    };
    
    config.eslint = {
        options: {
            configFile: "eslint.json",
        },

        dist: ["<%= paths.build %>/**/*.js"]
    };
    
    //#endregion

    //#region Clean

    config.clean = {
        dist: "<%= paths.build %>",
        temp: "<%= paths.temp %>"
    };

    //#endregion
    
    //#region Publish
    
    config.buildcontrol = {
        options: {
            commit: true,
            push: true,
            tag: "<%= pkg.version %>",
            remote: "<%= pkg.repository.url %>",
            branch: "release"
        },
        
        dist: {
            options: {
                dir: "<%= paths.build %>",
                message: "Release v<%= pkg.version %>"
            }
        }
    };
    
    grunt.registerTask("vso-create", function () {
        var done = this.async();
        
        grunt.util.spawn(
            {
                cmd: "tfx",
                args: ["extension", "create", "--manifest-globs", "vss-extension.json"],
                opts: {
                    cwd: config.paths.build
                }
            }, 
            function(err, result, code) {
                if (err) {
                    grunt.log.error();
                    grunt.fail.warn(err, code);
                }
                
                if (code !== 0) {
                    grunt.fail.warn(result.stderr || result.stdout, code);
                }
                
                grunt.verbose.writeln(result.stdout);
                grunt.log.ok("dist/Touchify.vso-bower-" + config.pkg.version + ".vsix successfully created !");
                
                done();
            }
        );
    });
    
    //#endregion
    
    //#region Assets
    
    grunt.registerTask("assets", function () {
        copy("screenshots");
        copy("node_modules/vsts-task-lib", "bower/node_modules/vsts-task-lib");
        
        copy("bower/icon.png");
        
        copy("README.md");
        copy("LICENSE");
        copy("icon.png");
        copy("icon-large.png");
    });
    
    grunt.registerTask("version", function () {
        var version = config.pkg.version,
            splitted = version.split(".");
            
        var ext = grunt.file.readJSON("vss-extension.json");
        ext.version = version;
        writeJSON("vss-extension.json", ext);
        
        var task = grunt.file.readJSON("bower/task.json");
        task.version.Major = parseInt(splitted[0], 10);
        task.version.Minor = parseInt(splitted[1], 10);
        task.version.Patch = parseInt(splitted[2], 10);
        writeJSON("bower/task.json", task);
    });
    
    function copy(src, dest) {
        dest = config.paths.build + "/" + (dest || src);
        grunt.file.copy(src, dest);
        grunt.log.ok(dest + " created !");
    }
    
    function writeJSON(dest, obj) {
        dest = config.paths.build + "/" + dest;
        grunt.file.write(dest, JSON.stringify(obj, null, 2));
        grunt.log.ok(dest + " created !");
    }
    
    //#endregion
    
    
    grunt.initConfig(config);

    grunt.registerTask("build", ["clean:dist", "ts:dist", "eslint:dist", "assets", "version", "vso-create"]);
    grunt.registerTask("publish", ["build", "buildcontrol:dist", "vso-publish"]);

    grunt.registerTask("default", ["build"]);
};