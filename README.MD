INSTALLATION
------------

1. Clone or download the repository.

2. On the command line terminal `cd` into the downloaded folder.

3. Run `npm install` from the downloaded folder to install the dependencies.

4. Import the mysql dump file located inside the directory `PROJECT_FOLDER/schema` into your mysql installation to create the database and tables.

5. Configure the environment variables using a `.env` file to populate the process.env parameters specified in the file `PROJECT_FOLDDER/lib/connection.js`

6. Install Redis using this [guide](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04) if it is not installed on your computer. Redis is required for the job queue to work.

7. Ensure that port 3000 is available or you may change the port at `PROJECT_FOLDER/index.js`

8. Run `npm start` to start the server.

9. Visit http://localhost:3000 on your browser and you will be redirected to the testing page.




NOTE
----

1. The test script that runs the tests is located at `PROJECT_FOLDER/public/test.js` and it is injected into the test.html page found in the same folder.

2. During the test run and after the first user is created, the creation of the second user replaces the cookie credentials of the first user. Therefore, whatever requests are sent after the second user is created will be sent using the cookie credentials of the second user.

3. The job queue relies on redis to work. Redis must be installed.