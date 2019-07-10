from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
import os
from flask_cors import CORS

app = Flask(__name__)

# Format db path
db_path = os.path.join(os.path.dirname(__file__), "db.sqlite")
db_uri = "sqlite:///{}".format(db_path)

# App configs
app.config["SECRET_KEY"] = "thisisthesecretkey"
app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
CORS(app)
db = SQLAlchemy(app)

# All tables in DB
class User(db.Model):
    id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    username = db.Column(db.String(100), unique = True)
    password = db.Column(db.String(255))

class Robot(db.Model):
    id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    name = db.Column(db.String(255))
    ip = db.Column(db.String(255))
    ownerID = db.Column(db.Integer)
    available = db.Column(db.Boolean)

# Token decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            auth = request.headers["Authorization"]
            if auth.split(" ")[0] == "Bearer":
                token = auth.split(" ")[1]

        if not token:
            return jsonify({"message": "Token is missing!"})

        try:
            data = jwt.decode(token, app.config["SECRET_KEY"])

            current_user = User.query.filter_by(id = data["id"]).first()
        except:
            return jsonify({"message": "Invalid token"}), 401

        return f(current_user, *args, **kwargs)
    return decorated

# Routings
@app.route("/register", methods=["POST"])
def register_user():
    data = request.get_json()

    # Fields existance validation
    if "username" not in data or "password" not in data:
        return make_response("Bad request: missing fields", 401, {"WWW-Authenticate": "Basic realm-'Proper informations required!'"})

    # Fields length validation
    if len(data["username"]) > 100:
        return make_response("Bad request: field length invalid", 401, {"WWW-Authenticate": "Basic realm-'Proper informations required!'"})

    # Check if username already existed
    username_data = User.query.filter_by(username = data["username"]).first()

    if username_data:
        return jsonify({"success": False, "message": "This username has been taken"})

    # If everything is ok, hash the password
    hashed_password = generate_password_hash(data["password"], method = "sha256", salt_length = 8)

    new_user = User(
        username = data["username"],
        password = hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"success": True, "message": "New user created"})

@app.route("/login", methods=["POST"])
def user_login():
    login_data = request.get_json()

    # Fields existance validation
    if "username" not in login_data or "password" not in login_data:
        return make_response("Bad request: missing fields", 401, {"WWW-Authenticate": "Basic realm-'Proper informations required!'"})

    user = User.query.filter_by(username = login_data["username"]).first()

    if not user:
        return jsonify({"success": False, "message": "Wrong username or password"})

    # Compare password
    if check_password_hash(user.password, login_data["password"]):
        token = jwt.encode({
            "id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days = 30)
        }, app.config["SECRET_KEY"])
    return jsonify({"success": True, "username": login_data["username"], "message": "Login success", "token": token.decode("UTF-8")})

    return jsonify({"success": False, "message": "Wrong username or password"})

@app.route("/robots", methods=["GET"])
@token_required
def get_all_robots(current_user):
    robots = Robot.query.all()

    output = []

    for robot in robots:
        robot_data = {}
        robot_data["id"] = robot.id
        robot_data["name"] = robot.name
        robot_data["ip"] = robot.ip
        robot_data["ownerID"] = robot.ownerID
        robot_data["available"] = robot.available

        output.append(robot_data)

    return jsonify({"robots": output})

@app.route("/robot", methods=["GET"])
@token_required
def get_owned_robot(current_user):
    owned_robot = Robot.query.filter_by(ownerID = current_user.id, available = False).first()
    robot_data = {}

    if owned_robot:
        if not owned_robot.available:
            robot_data["id"] = owned_robot.id
            robot_data["name"] = owned_robot.name
            robot_data["ip"] = owned_robot.ip
            robot_data["ownerID"] = owned_robot.ownerID

    return jsonify({"robot": robot_data})

@app.route("/robot/<robot_id>", methods=["POST"])
@token_required
def rent_robot(current_user, robot_id):
    # Check if user own any other robot yet

    # Robot in db own by user
    owned_robot = Robot.query.filter_by(ownerID = current_user.id, available = False).first()
    # The robot the user request
    robot_data = Robot.query.filter_by(id = robot_id).first()

    if owned_robot:
        if owned_robot.id == robot_data.id:
            return jsonify({"success": False, "message": "You already own this robot"})
        else:
            return jsonify({"success": False, "message": "You already own another robot"})

    if not robot_data:
        return jsonify({"success": False, "message": "There is no robot with this id"})

    if not robot_data.available:
        if robot_data.ownerID == current_user.id:
            return jsonify({"success": False, "message": "You already own this robot"})
        else:
            return jsonify({"success": False, "message": "This robot has been owned by other"})

    robot_data.available = False
    robot_data.ownerID = current_user.id
    
    db.session.commit()
    
    return jsonify({"success": True, "message": "Successfully rent robot"})

@app.route("/robot/<robot_id>", methods=["PUT"])
@token_required
def return_robot(current_user, robot_id):
    robot_data = Robot.query.filter_by(id = robot_id).first()

    if not robot_data:
        return jsonify({"success": False, "message": "There is no robot with this id"})

    if robot_data.available:
        return jsonify({"success": False, "message": "This robot is already available"})

    if robot_data.ownerID != current_user.id:
        return jsonify({"success": False, "message": "You do not own this robot"})

    robot_data.available = True

    db.session.commit()

    return jsonify({"success": True, "message": "Successfully return robot"})

# Debugging routes
@app.route("/users", methods=["GET"])
def get_all_users():
    users = User.query.all()

    output = []

    for user in users:
        user_data = {}
        user_data["id"] = user.id
        user_data["username"] = user.username
        user_data["password"] = user.password

        output.append(user_data)

    return jsonify({"users": output})

if __name__ == '__main__':
    app.run(debug=True)
