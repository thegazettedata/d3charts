#Responsive D3.js charts

This is our working directory of responsive [D3.js](http://d3js.org/) charts.

These charts are built using [Backbone.js](https://github.com/jashkenas/backbone). A big thanks to the [Chicago Tribune News App](http://blog.apps.chicagotribune.com/) team for their [inspiration](http://blog.apps.chicagotribune.com/2014/03/07/responsive-charts-with-d3-and-backbone/) in building responsive D3.js charts with Backbone.

##Installation
First you need to make sure a few things are installed on your computer. If you are using a Mac, do the following:

Make sure you have [Homebrew](http://brew.sh/) installed:

	ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

Install [Node](https://nodejs.org/) via Homebrew:	
	
	brew install node

If you are using a Windows machine, download Node [here](https://nodejs.org/download/).

Install [npm](https://www.npmjs.com/) dependencies:
	
	npm install

We use [Grunt](http://gruntjs.com/) to create new projects and test projects. So make sure it is installed by running:
	
	sudo npm install -g grunt-cli

If you're one Windows machine and are using a PowerShell console, you may want to need add the following [here](https://github.com/gruntjs/grunt/issues/774#issuecomment-58268520)

##Create new project
Dependencies for Grunt are put into package.json. If any new dependencies are put in there, you need to install them by running:
	
	npm install

Then to create a new project, run: 

	grunt new --folder=name_of_folder_here --template=bar 

The "folder" parameter is equal to the name of the new folder you want to create. All new projects get put into the "projects" folder.

The "template" parameter represents the type of chart you want to create. We have a couple of options now:

* bar
* horizontal_bar
* line

More will be added later.

##Delete project
To delete a folder out of the projects folder, run:

	grunt delete --folder=name_of_folder_here

BE CAREFUL when running this command. To run the task without actually deleting the folder you enter, add the "no-write" option to the Grunt clean command within Gruntfile.js.

More inforomation can be found [here](https://github.com/gruntjs/grunt-contrib-clean#no-write).

##Deploy to FTP server
When you are done with your chart, you can deploy it to our FTP server with one command.

	grunt deploy --folder=name_of_project_here

##Push to Github
Here's some basic Github commands that you'll need to run to push your projects to Github. First, pull down all changes that have been made to the directory by other people onto your local machine:

	git pull

Then see what you have changed on your local machine:
	
	git status

If you have added files, run:

	git add .
	
If you have added and removed files, run:

	git add --all

Commit any changes you've made:

	git commit -m "message goeshere"

Finally, push all the changes on your local machine to Github:

	git push

Before pushing to Github, make sure to add a link to the chart in [urls.md](https://github.com/GazetteKCRGdata/d3charts/blob/master/urls.md)
	
##Iframing charts into stories

We at The Gazette use [pym.js](https://github.com/nprapps/pym.js/) to iframe the charts into articles and make them responsive. Here's an example of a chart embed:

```html
<div class="center">
<h3 style="margin-bottom: 0px;">Miles of trails built in Cedar Rapids by year</h3>
<div id="cr-bike-trails"> </div>
<script type="text/javascript">// <![CDATA[
var pymParent = new pym.Parent('cr-bike-trails','http://files.gazlab.com/content-host/d3charts/projects/cr-bike-trails/index.html', {});
// ]]></script>
<p class="embed-subhead">* This chart shows how many miles of trails have been built in Cedar Rapids for every year since 1975. After going decades without building any trails, the city has built several miles worth of trails every year since 1999.</p>
</div>
```