module.exports = function(grunt) {
    //配置参数
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';',
                stripBanners: true,
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: [
                    "src/goodow-main.js",
                    "src/**/*.js"
                ],
                dest: "goodjs-ui.js"
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'goodjs-ui.js',
                dest:'goodjs-ui.min.js'
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            compress: {
                files: {
                    'assets/css/default.css': [
                        "css/global.css",
                        "css/pops.css",
                        "css/index.css"
                    ]
                }
            }
        }
    });

    //载入concat和uglify插件，分别对于合并和压缩
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    //注册任务
    grunt.registerTask('default', ['concat', 'uglify']);
}
