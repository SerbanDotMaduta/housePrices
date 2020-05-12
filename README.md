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
docker tag serbanmad/houseprice:latest houseprice:latest

Download this file:
https://github.com/SerbanDotMaduta/housePrices/blob/master/docker-compose.yml
You can create a file named docker-compose.yml and copy+paste contents.

Run this command in the directory where docker-compose.yml is located:
docker-compose up

Access application in your web browser at:
http://localhost:3001
