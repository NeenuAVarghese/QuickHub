# QuickHub

###Prerequisites
Before installing the application, we need to setup a basic environment to get
started. Below is the list of required preinstalled software:
1. NodeJS and npm
2. Git
3. Mongodb
The above can be satisfied quite easily using the predefined vagrant node-box provided
in this course. Additionally, an internet connection is needed to download the
application from GitHub.
Active Internet connection is required for the application to work as the application
fetches required information from GitHub

###Installation
1. In the /home/vagrant folder type the following command:
mkdir -p ./mongodb/data
2. Clone application from github
git clone https://github.com/NeenuAVarghese/QuickHub.git
3. Install the node dependencies modules required
cd QuickHub/
npm install

###Running the application
This application is designed to run on port 3000. It also uses mongo dB service. Both of
these are initiated in the Procfile made for this application. In order for the application
to work, it’s necessary to ensure that port 3000 is free, also there should be no running
instances of mongo db. Mongo dB service runs on port 27017 by default. It’s necessary
that the port should be free.
Following steps can be used to start the application:
1. Start the server
  foreman start -f Procfile
2. If all the above conditions are fulfilled, application will start successfully on port
 3000 and an instance of the mongo dB service will also be started on port 27017 . 



Latest version of node required for github-trend library. 
(http://askubuntu.com/questions/426750/how-can-i-update-my-nodejs-to-the-latest-version):
1. `sudo npm cache clean -f`
2. `sudo npm install -g n`
3. `sudo n stable`
4. `sudo ln -sf /usr/local/n/versions/node/<VERSION>/bin/node /usr/bin/node`
