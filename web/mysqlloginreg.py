from flask import Flask, jsonify, request, json
from flask_mysqldb import MySQL
from datetime import datetime
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token)
from pickle import load
import pandas as pd
import numpy as np
import pdb

app = Flask(__name__)

model = load(open('../ai/model.pkl', 'rb'))
scaler = load(open('../ai/scaler.pkl', 'rb'))

app.config['MYSQL_USER'] = 'admin'
app.config['MYSQL_PASSWORD'] = 'admin'
app.config['MYSQL_DB'] = 'housePricesDB'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
app.config['JWT_SECRET_KEY'] = 'secret'

mysql = MySQL(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

CORS(app)

@app.route('/users/register', methods=['POST'])
def register():
    cur = mysql.connection.cursor()
    first_name = request.get_json()['first_name']
    last_name = request.get_json()['last_name']
    email = request.get_json()['email']
    password = bcrypt.generate_password_hash(request.get_json()['password']).decode('utf-8')
    created = datetime.utcnow()
	
    cur.execute("INSERT INTO users (first_name, last_name, email, password, created) VALUES ('" + 
		str(first_name) + "', '" + 
		str(last_name) + "', '" + 
		str(email) + "', '" + 
		str(password) + "', '" + 
		str(created) + "')")
    mysql.connection.commit()
	
    result = {
		'first_name' : first_name,
		'last_name' : last_name,
		'email' : email,
		'password' : password,
		'created' : created
	}

    return jsonify({'result' : result})
	

@app.route('/users/login', methods=['POST'])
def login():
    cur = mysql.connection.cursor()
    email = request.get_json()['email']
    password = request.get_json()['password']
    result = ""
	
    cur.execute("SELECT * FROM users where email = '" + str(email) + "'")
    rv = cur.fetchone()
    
    if rv == None:
        return jsonify({"error":"Invalid username and password"})

    if bcrypt.check_password_hash(rv['password'], password):
        access_token = create_access_token(identity = {'first_name': rv['first_name'],'last_name': rv['last_name'],'email': rv['email']})
        result = access_token
    else:
        result = jsonify({"error":"Invalid username and password"})
    
    return result

@app.route('/users/history', methods=['POST'])
def history():
    cur = mysql.connection.cursor()
    email = request.get_json()['email']
	
    cur.execute("SELECT * FROM userHistory where email = '" + str(email) + "'")
    rv = cur.fetchall()
    
    return jsonify(rv)

@app.route('/users/clearHist', methods=['POST'])
def clearHist():
    cur = mysql.connection.cursor()
    email = request.get_json()['email']

    cur.execute("DELETE FROM userHistory where email = '" + str(email) + "'")
    mysql.connection.commit()
    
    return "Deleted"


@app.route('/users/predict', methods=['POST'])
def predict():
    cur = mysql.connection.cursor()
    print(request.get_json())
    totalGroundAreaOrig = request.get_json()["totalGroundArea"]
    lotAreaOrig = request.get_json()['lotArea']
    lotFrontage = request.get_json()['lotFrontage']
    bedrooms = request.get_json()['bedroomNumber']
    baths = request.get_json()['bathroomNumber']
    email = request.get_json()['email']

    lotArea = np.log1p(float(lotAreaOrig))
    totalGroundArea = np.log1p(float(totalGroundAreaOrig))
    d = {
         'LotArea' : [lotArea], 'GrLivArea':[totalGroundArea], 'BecdroomAbvGr':[bedrooms],
         'TotalBath':[baths], 'LotFrontage':[lotFrontage]
        }   
    sampleDataFrame = pd.DataFrame(data=d)
    sampleDataFrameTransformed = scaler.transform(sampleDataFrame)
    pred = model.predict(sampleDataFrameTransformed)
    prediction = np.expm1(pred)
    price = str(round(prediction[0], 2))
    print("Prediction:" + price)
    
    # Insert into history database
    cur.execute("INSERT INTO userHistory (email, livingArea, lotArea, lotFrontage, bedrooms, baths, price) VALUES ('" + 
    str(email) + "', '" + 
    str(totalGroundAreaOrig) + "', '" + 
    str(lotAreaOrig) + "', '" + 
    str(lotFrontage) + "', '" + 
    str(bedrooms) + "', '" + 
    str(baths) + "', '" + 
    str(price) + "')")
    mysql.connection.commit()

    return jsonify({"prediction":price})

if __name__ == '__main__':
    app.run(host= '0.0.0.0', debug=True)