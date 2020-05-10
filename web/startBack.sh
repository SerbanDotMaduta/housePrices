#!/bin/sh

/etc/init.d/mysql start
cd /housePrice/web
python3 mysqlloginreg.py
