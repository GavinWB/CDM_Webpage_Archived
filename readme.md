# Setup
Install back-end dependencies
```
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
