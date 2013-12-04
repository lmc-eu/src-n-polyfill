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
                        'src/responsiveImage.js',
                        'src/index.js'
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
          main: {
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
