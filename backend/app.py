#!/usr/bin/python3
"""module init"""

from course_hub import app, jwt
from os import getenv
from flask import jsonify, send_from_directory
from flask_cors import CORS
from flasgger import Swagger
from models import storage
from course_hub.user import user_views
from course_hub.course import course_views
from course_hub.auth import auth_views
from utils import sess_manager
from course_hub.instructor import instructor_views
from course_hub.student import student_views
from course_hub.enrollment import enrollment_views
from utils.file_service import get_upload_dir
import logging

CORS(app)
#cors = CORS(app, resources={r"/*": {"origins": "*"}})
#registering bluebrints
app.register_blueprint(user_views)
app.register_blueprint(auth_views)
app.register_blueprint(course_views)
app.register_blueprint(instructor_views)
app.register_blueprint(student_views)
app.register_blueprint(enrollment_views)

jwt.init_app(app)
app.logger.setLevel(logging.INFO)
# load user
@jwt.user_lookup_loader
def user_lookup_callback(_jwt_headers, jwt_data):
    identity = jwt_data.get("sub")

    return storage.getUserById(identity)


@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_data):
    return jsonify({"message": "Token has expired", "error": "expired"}), 464

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return (
        jsonify(
            {"message": "Signature verification failed", "error": "invalid"}
        ),
        401,
    )

@jwt.unauthorized_loader
def missing_token_callback(error):
    return (
        jsonify(
            {
                "message": "Request doesnt contain valid token",
                "error": "authorization_header",
            }
        ),
        401,
    )

@jwt.token_in_blocklist_loader
def token_in_blocklist_callback(jwt_header,jwt_data):
    jti = jwt_data.get('jti')

    token = storage.getTokenByJti(jti)

    return token is not None


@app.after_request
def after_request_callback( response ):
    storage.close()
    sess_manager.close()
    # print(sess_manager.session_status())
    return response

@app.teardown_appcontext
def teardown_appcontext(exception=None):
    storage.close()
    sess_manager.close()

@app.route('/images/<path:filename>')
def serve_image(filename):
    directory = get_upload_dir()
    return send_from_directory(directory, filename)


@app.errorhandler(403)
def unauthorized(err):
    return jsonify({'message': 'not authorized'}), 403

@app.errorhandler(401)
def unauthenticated(err):
    return jsonify({'message': 'not authenticated'}), 401

@app.errorhandler(404)
def not_found(err):
    """handler for 404 errors that returns a JSON-formatted"""
    return jsonify({"error": "Not found"}), 404

Swagger(app)

if __name__ == '__main__':
    host = getenv('CH_API_HOST', '0.0.0.0')
    port = getenv('CH_API_PORT', '5000')
    app.url_map.strict_slashes = False
    app.run(host=host, port=int(port), threaded=True)
