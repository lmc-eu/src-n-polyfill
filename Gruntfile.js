module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            files: ['index.js'],
            tasks: ['browserify']
        },
        browserify: {
            main: {
                files: {
                    'built.js': [
                        'bower_components/src-n-parse/index.js',
                        'src/responsiveImage.js',
                        'src/index.js'
                    ]
                },
                options: {
                    shim:{
                        jquery: { path: './bower_components/jquery/jquery.js', exports: '$' }
                    },
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

