module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        src: [
          'client/js/app.js', 
          'client/js/constants.js',
          'client/js/factories/underscore.js',
          'client/js/services/users-svc.js',
          'client/js/controllers/cv-ctrl.js',
          'client/js/controllers/date-ctrl.js',
          'client/js/controllers/list-item-ctrl.js',
        ],
        dest: 'client/js/app.min.js'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify']);
};