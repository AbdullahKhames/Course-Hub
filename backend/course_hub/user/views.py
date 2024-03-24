#!/usr/bin/python3
"""new view for State objects that handles all default RESTFul API actions"""

from flask_jwt_extended import jwt_required
from course_hub.user import user_views
from flask import jsonify, abort, request
from course_hub.user.user_service import UserService
from course_hub.instructor.instructor_service import InstructorService
from models import storage
from models.user import User
from flasgger.utils import swag_from

user_service = UserService()
instructor_service = InstructorService()

@user_views.route('/users', methods=['GET'])
@jwt_required()    
@swag_from('documentation/user/all_users.yml')
def get_users():
    """reterive all users from storage
    """
    return jsonify(list(map(lambda user:
                            user.to_dict(), user_service.get_users(
                                request.args.get("page", 1, type=int),
                                request.args.get("per_page", 3, type=int)
                            ))))


@user_views.route('/users/<user_id>', methods=['GET'])
@jwt_required()
@swag_from('documentation/user/get_user.yml', methods=['GET'])
def get_user(user_id):
    """reterive user by id
    """
    from course_hub import roles
    user = storage.get(User, user_id)
    if user is None:
        abort(404)

    all = eval(request.args.get("all", "false", type=str).capitalize())
    if user.role == 1:
        instructor = storage.get(roles[user.role], user_id)
        instructor_service.get_total_students(instructor)

    if all:
        new_user = storage.get(roles[user.role], user_id)
        if new_user:
            user = new_user

    return jsonify(user.to_dict())


@user_views.route('/users/<user_id>', methods=['DELETE'])
@swag_from('documentation/user/delete_user.yml', methods=['DELETE'])
def delete_users(user_id):
    """delete user by id
    """
    user = storage.get(User, user_id)
    if user is None:
        abort(404)
    user.delete()
    storage.save()
    return jsonify({}), 200



@user_views.route('/users/<user_id>', methods=['PUT'])
@swag_from('documentation/user/put_user.yml', methods=['PUT'])
def update_user(user_id):
    """update user to storage
    """
    user = storage.get(User, user_id)
    if not user:
        abort(404)
    data = request.get_json()
    if not data:
        abort(400, 'Not a JSON')

    for k, v in data.items():
        if k not in ['id', 'created_at', 'updated_at', 'email']:
            setattr(user, k, v)

    user.save()
    return jsonify(user.to_dict())
