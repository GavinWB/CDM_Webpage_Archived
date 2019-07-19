# Setup
## Flask backend
Install back-end dependencies
```
cd flask
virtualenv venv
source venv/bin/activate
pip install -r requirement.txt
```
Init db (currently we are not using any migration method)
```
python
>>> from app import *
>>> db.create_all()
>>> quit()
```
Run the server
```
python app.py
```
## Angular frontend
Install node dependencies
```
cd angular
npm install
```
And then serve via localhost
```
ng serve --open
```
