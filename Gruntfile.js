module.exports = function(grunt) {
    var reactify = require('reactify');
    require('time-grunt')(grunt);
    // load npmTasks which named with pattern 'grunt-*' and 'grunt-contrib-*'
    require('grunt-task-loader')(grunt, {
        /* see issue https://github.com/yleo77/grunt-task-loader/issues/1 */
        mapping: {
            cachebreaker: 'grunt-cache-breaker'
        }
    });

    // project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /* ========== Tasks ===========*/
        watch: {
            gruntfile: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            },
            livereload: {
                options: { livereload: 35729 },
                files: 'src/**/*'
            },
            html: {
                files: "html/*.html",
                tasks: ['clean:html', 'copy:html']
            },
            sass: {
                files: "scss/**/*.scss",
                tasks: ['cachebreaker:css', 'clean:css', 'sass:dev']
            },
            js: {
                files: "js/**/*.js",
                tasks: ['cachebreaker:js', 'clean:js', 'browserify']
            }
        },
        connect: {
            dev: {
                options: {
                    hostname: 'localhost',
                    port: 9000,
                    open: false,
                    livereload: 35729,
                    base: './src',
                    middleware: function(connect, options, middlewares) {
                        return [connect.static('./src')];
                    }
                }
            }
        },
        clean: {
            html: ['src/*.html'],
            css: ['src/css/**/*.css'],
            js: ['src/js/**/*.js'],
            publish: ['publish']
        },

        copy: {
            html: {
                files: [{
                    expand: true,
                    cwd: 'html',
                    src: ['*.html'],
                    dest: process.argv[2] === 'publish' ? 'publish' : 'src/',
                }]
            },
            js: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['js/**/*.js'],
                    dest: process.argv[2] === 'publish' ? 'publish' : 'dest/',
                }]
            },
        },
        sass: {
            dev: {
                options: {
                    style: 'expanded',
                    sourcemap: 'none',
                    lineNumbers: true
                },
                files: [{
                    expand: true,
                    cwd: 'scss',
                    src: ['*.scss'],
                    dest: 'src/css',
                    ext: '.css',
                }]
            },
            publish: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none',
                    lineNumbers: false
                },
                files: [{
                    expand: true,
                    cwd: 'scss',
                    src: ['*.scss'],
                    dest: 'publish/css',
                    ext: '.css',
                }]
            }
        },
        cachebreaker: {
            /* Break js and css cacheing during development */
            js: {
                options: {
                    match: ['main.js']
                },
                files: {
                    src: ['src/*.html']
                }
            },
            css: {
                options: {
                    match: ['main.css']
                },
                files: {
                    src: ['src/*.html']
                }
            }
        },

        /* minify images for published version
        imagemin: {
            publish: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['images/*.{png,jpg,gif}', 'css/images/*.{gif,png,jpg}'],
                    dest: 'publish/',
                    rename: function(dest, src) {
                        if (src.indexOf('scss') !== -1) {
                            return dest + src.replace('scss/', 'css/');
                        }
                        return dest + src;
                    }
                }]
            }
        }, */
        requirejs: {
            publish: {
                options: {
                    baseUrl: 'src/js',
                    mainConfigFile: 'src/js/main.js',
                    name: 'main',
                    out: 'publish/js/main.js'
                }
            }
        },
        browserify: {
            dist: {
                files: {
                    'src/js/main.js': ['js/main.js']
                },
                options: {
                    banner: '/*\n    author: maple-leaf\n*/',
                    transform: [reactify]
                }
            }
        }
    });

    // grunt task registration
    grunt.registerTask('default', ['clean:html', 'clean:css', 'clean:js', 'connect:dev', 'copy:html', 'cachebreaker', 'sass:dev', 'browserify', 'watch']);
    grunt.registerTask('publish', ['clean:publish', 'copy:html', 'requirejs', 'imagemin', 'copy:font', 'sass:publish']);
};
