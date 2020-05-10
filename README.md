# Flask + ReactJS + MySQL Login and Registration
The project has 4 major components:
1.  AI component, located in the ai folder. 
    Contains database, script used for model training, model file and preprocessor file.

2.  Web frontend(ReactJS) located in ./web/src.

3.  Web backend component, a Python Flask application represented by the script ./web/mysqlloginreg.py

4.  MySQL database which is a database called housePricesDB with two tables: users and userHistory.
    It is already set up in the docker container delivered.

## Deployment
Download docker image from https://hub.docker.com/r/serbanmad/houseprice.

Rename docker container:
docker tag serbanmad/houseprice:latest {newName}

Launch backend command: 
docker run -d --net=host --name backend {newName} /housePrice/web/startBack.sh

Launch frontend command: 
docker run -d --net=host --name frontend {newName} /housePrice/web/startFront.sh

Access application in your web browser at:
http://localhost:3000
