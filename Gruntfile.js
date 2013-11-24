module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            files: ['src/**/*.js'],
            tasks: ['browserify']
        },
        browserify: {
            main: {
                files: {
                    'built.js': [
                        'src/shim-jquery.js',
                        'bower_components/src-n-parse/index.js',
                        'src/responsiveImage.js',
                        'src/index.js'
                    ]
                },
                options: {
                    alias: [
                        'src/shim-jquery.js:jquery'
                    ],
                    transform: [
                        'debowerify', 'deamdify'
                    ]
                }
            },
            options: {

            }
        }
    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['browserify']);
};

