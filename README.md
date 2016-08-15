# ProphetWeb

This is the frontend aplication of Prophet. 

##Running
ProphetWeb is written in Javascript. You'll need to install [Node.js](https://nodejs.org/en) first.

Verify that Cassandra is installed, and then change the IP and port in the file `data/Connection.js`:

      contactPoints: ['192.168.42.209:9042']

If you're running the application for the first time, run `npm install` to download the NPM dependencies.

Then you'll be able to run the application using `npm start`. 
