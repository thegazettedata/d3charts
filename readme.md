#Responsive D3.js charts

This is our working directory of [D3.js](http://d3js.org/) charts.

We use Grunt to create new projects and test projects. First, make sure [Grunt](http://gruntjs.com/) is installed by running:

	npm install

This will install all of Grunt's dependencies. To create a new project, run: 

	grunt new --folder=name_of_folder_here --template=bar 

The "folder" parameter is equal to the name of the new folder you want to create. All new projects get put into the "projects" folder.

The "template" parameter represents the type of chart you want to create. We have several options built in:

- bar
-

To delete a folder out of the projects folder, run:

	grunt delete --folder=name_of_folder_here

BE CAREFUL when running this command. To run the task without actually deleting the folder you enter, add the "no-write" option to the Grunt clean command within Gruntfile.js. More inforomation can be found [here](https://github.com/gruntjs/grunt-contrib-clean#no-write).

These charts are built using [Backbone.js](https://github.com/jashkenas/backbone). A big thanks to the [Chicago Tribune News App](http://blog.apps.chicagotribune.com/) team for their [inspiration](http://blog.apps.chicagotribune.com/2014/03/07/responsive-charts-with-d3-and-backbone/) in building responsive D3.js charts with Backbone.

	