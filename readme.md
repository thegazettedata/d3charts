#Responsive D3.js charts

This is our working directory of responsive [D3.js](http://d3js.org/) charts.

These charts are built using [Backbone.js](https://github.com/jashkenas/backbone). A big thanks to the [Chicago Tribune News App](http://blog.apps.chicagotribune.com/) team for their [inspiration](http://blog.apps.chicagotribune.com/2014/03/07/responsive-charts-with-d3-and-backbone/) in building responsive D3.js charts with Backbone.

##Installation
First you need to make sure a few things are installed on your computer. If you are using a Mac, do the following:

Make sure you have [Homebrew](http://brew.sh/) installed:

	ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

Install node via Homebrew:	
	
	brew install node

If you are using a Windows machine, download Node [here](https://nodejs.org/download/).

Install npm dependencies:
	
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

If you are iFraming the chart on a page, the iFrame.html file within the base folder includes CSS and JS to make the chart responsive.

The iFrame you should use looks like:

```html
<div id="iframe-responsive-container" data-height="320px" data-600-height="220px">
	<iframe id="iframe-responsive" src="http://files.gazlab.com/content-host/c3charts/projects/cr-shootings/index.html#chart-homicides" scrolling=no frameborder="0" width="100%"></iframe>
</div>
```

The date-height attribute of "iframe-responsive-container" is the default height of the iFramed chart. The "data-600-height" attribute sets the height of the chart to 220px at screen sizes that are 600px wide or lower.

You can add as many "breakpoints" as you want. For instance, if you want the height of the chart to be 400px tall at screen sizes of 700px, you're code would look like so:

```html
<div id="iframe-responsive-container" data-height="320px" data-700-height="250px">
	<iframe id="iframe-responsive" src="http://files.gazlab.com/content-host/c3charts/projects/cr-shootings/index.html#chart-homicides" scrolling=no frameborder="0" width="100%"></iframe>
</div>
```

You can also use both:

```html
<div id="iframe-responsive-container" data-height="320px" data-600-height="220px" data-700-height="250px">
	<iframe id="iframe-responsive" src="http://files.gazlab.com/content-host/c3charts/projects/cr-shootings/index.html#chart-homicides" scrolling=no frameborder="0" width="100%"></iframe>
</div>
```

It is important to note that if you are going to use multiple media queries, you put the lowest pixel amounts first within the markup. So for instance, do this:

```html
<div class="iframe-responsive-container chart" data-height="650px" data-400-height="750px" data-550-height="700px">
```

And not this:
```html
<div class="iframe-responsive-container chart" data-height="650px" data-550-height="700px" data-400-height="750px">
```

Because our CMS strips out attributes, which are very important, we must [lazy load](https://github.com/emn178/jquery-lazyload-any) the embed like so:

```html
<div class="lazyload"><!--
<div id="iframe-responsive-container" data-height="320px" data-700-height="250px" data-600-height="220px">
	<iframe id="iframe-responsive" src="http://files.gazlab.com/content-host/c3charts/projects/cr-shootings/index.html#chart-homicides" scrolling=no frameborder="0" width="100%"></iframe>
</div>
--></div>
```

You can also add a header and about text like so: 

```html
<div id="chart-homicides-container" class="chart-container">
	<h3>Homicides: 2004 - 2014</h3>
	<div class="lazyload"><!--
		<div class="iframe-responsive-container chart" data-height="250px" data-600-height="200px">
		<iframe src="http://files.gazlab.com/content-host/c3charts/projects/cr-shootings/index.html#chart-homicides" scrolling=no frameborder="0" width="100%"></iframe>
		</div>
	--></div>
	<p><strong>About:</strong> Shown are the number of victims as a result of homicide.  In 2006, police recorded five incidents with six victims, including a double homicide. This year, policed recorded six incidents with eight victims.</p>
</div>
```
NOTE: You must include "scrolling:no" in the iframe for this solution to work on iPhones. The code that makes these responsive iframes work is found here: [http://thegazette.com/js/article-embeds.js](http://thegazette.com/js/article-embeds.js). Find the "findResponsiveIframes()" for the code.