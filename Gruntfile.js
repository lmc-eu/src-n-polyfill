module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            files: ['src/**/*.js'],
            tasks: ['browserify']
        },
        browserify: {
            main: {
                files: {
                    'src-n-polyfill.js': [
                        'components/src-n-parse/index.js',
                        'src/responsiveImage.js',
                        'src/index.js'
                    ]
                },
                options: {
                    transform: [
                        'debowerify', 'deamdify'
                    ]
                }
            },
            options: {

            }
        },
        uglify: {
          options: {
            report: 'gzip'
          },
          my_target: {
            files: {
            'src-n-polyfill.min.js': ['src-n-polyfill.js']
            }
          }
        }
    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['browserify', 'uglify']);
};