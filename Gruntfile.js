'use strict';

module.exports = function (grunt) {
    // Load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Our parameters, which are set when grunt command is ran
    // Bar chart, line chart, etc
    var template = grunt.option('template');
    // Name of project folder
    var folder = grunt.option('folder');

    // Initialize grunt
    grunt.initConfig({
    	// Copy files
        copy: {
            // Copy our base files
            base: {
                files: [
                    // Copy base directory
                    {
                        expand: true,
                        cwd: 'templates/_base',
                        src: '**',
                        dest: 'projects/' + folder
                    },
                    // Copy template specific directory
                    {
                        expand: true,
                        cwd: 'templates/' + template + '_chart',
                        src: '**',
                        dest: 'projects/' + folder
                    }
                ]
            }
		},
		// Delete files
		clean: {
            project: {
                src: ['projects/' + folder + '/**']
            }
        }
	});

	// Create empty files
    grunt.registerTask('emptyFiles', 'Creates empty files', function() {
    	grunt.file.write('projects/' + folder + '/js/script.js', '');
    });
	
	// Create new project
    grunt.registerTask('new', [
        'copy:base',
        'emptyFiles'
    ]);

    // Delete a project
    grunt.registerTask('delete', [
        'clean:project'
    ]);


};