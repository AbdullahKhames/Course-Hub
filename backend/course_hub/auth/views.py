#!/usr/bin/python3
"""new view for State objects that handles all default RESTFul API actions"""
from marshmallow import ValidationError

import os
from course_hub.auth import auth_views
from flask import abort, jsonify, request
from models import storage
from models.TokenBlocklist import TokenBlocklist
from models.student import Student
from models.instructor import Instructor
from models.admin import Admin
from flasgger.utils import swag_from
from bcrypt import checkpw
from .schemas import ActivationSchema, SignUpSchema, SignInSchema
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    jwt_required,
    current_user,
)
from utils.auth_utils import user_required
from course_hub import mail
from flask_mail import Message


current_directory = os.path.dirname(os.path.realpath(__file__))




@auth_views.route('/sign-up', methods=['POST'])
@swag_from(os.path.join(current_directory, 'documentation/auth/sign_up.yml'))
def sign_up():
    from course_hub import roles
    data = request.get_json()
    try:
        new_user = SignUpSchema().load(data)
    except ValidationError as e:
        return jsonify({"validation_error": e.messages}), 422
    new_user.save()
    new_data = role_data(data)
    new_data['id'] = new_user.id
    role = roles[new_user.role](**new_data)
    if new_user.role == 2:
        role.interested = data.get('interestedIn')
    if new_user.role != 0:
        msg = Message('Welcome To Course Hub WebSite', sender = 'techiocean.tech', recipients = [new_user.email])
        msg.body = f"hello there Welcome To Course Hub WebSite here is your activation code {new_user.activation_token}"
        mail.send(msg)
    role.save()
    return jsonify({
        'message': 'user registered successfully please activate via activation_token from email',
        'data': f'{new_user.id}'}), 201


@auth_views.route('/activate', methods=['POST'])
@swag_from(os.path.join(current_directory, 'documentation/auth/activate.yml'))
def activate():
    data = request.get_json()
    try:
        activation = ActivationSchema().load(data)
    except ValidationError as e:
        return jsonify({"validation_error": e.messages}), 422
    
    user = storage.getUserByEmail(activation.get('email'))
    if not user:
        return jsonify({
            'message': 'fail',
            'data': None,
            'error': 'incorrect email'}),400
    if user.enabled:
        return jsonify({
            'message': 'fail',
            'data': None,
            'error': 'user is already active'}),400
    if user.activation_token != activation.get('activation_token'):
        return jsonify({
            'message': 'fail',
            'data': None,
            'error': 'incorrect activation_token'}),400
    user.enabled = True
    user.save()
    return jsonify({
        'message': 'user has been successfully activated',
        'data': f'{user.id}'}), 200


@auth_views.post("/refresh")
@jwt_required(refresh=True)
def refresh_access():
    additional_claims = {"role": current_user.role, "email": current_user.email, "name": current_user.name}
    new_access_token = create_access_token(identity=current_user.id, additional_claims=additional_claims)

    return jsonify({
        "messsage": "success",
        "data":{
            "access_token": new_access_token
            }
        }), 200


@auth_views.get('/logout')
@swag_from(os.path.join(current_directory, 'documentation/auth/logout.yml'))
@jwt_required(verify_type=False) 
def logout_user():
    jwt = get_jwt()
    jti = jwt.get('jti')
    token_type = jwt.get('type')

    token_b = TokenBlocklist(jti=jti)
    token_b.save()
    return jsonify({
        'message': 'success',
        "data": f"{token_type} token revoked successfully"}) , 200

@auth_views.route('/protected')
@jwt_required()
@swag_from(os.path.join(current_directory, 'documentation/auth/protected.yml'))
@user_required(allowed_roles={2, 1})
@swag_from('documentation/auth/protected.yml')
def protected_route():
    return jsonify({'message ': 'Access granted for user {}'.format(current_user.email)})


@auth_views.route('/login', methods=['POST'])
@swag_from(os.path.join(current_directory, 'documentation/auth/login.yml'))
def login():
    data = SignInSchema().load(data=request.get_json())
    email = data.get('email')
    password = data.get('password')
    user = storage.getUserByEmail(email)
    if user and user.enabled:
        userBytes = password.encode('utf-8')
        hashed_password_bytes = user.password.encode('utf-8')
        if checkpw(userBytes, hashed_password_bytes):
            additional_claims = {"role": user.role, "email": user.email, 'name': user.name}
            access_token = create_access_token(identity=user.id, additional_claims=additional_claims)
            refresh_token = create_refresh_token(identity=user.id, additional_claims=additional_claims)
            return jsonify({
                'message': 'success',
                'data': {
                    'name': user.name,
                    'role': user.role,
                    'id': user.id,
                    'email': user.email,
                    "access_token" : access_token, 
                    "refresh_token" : refresh_token
                }
            }), 200
        else:
            return jsonify({
            'message': 'fail',
            'data': None,
            'error': 'incorrect email or password'}),400
    elif user.enabled == False:
        return jsonify({
            'message': 'fail',
            'data': "you must first activate the account find activation in code in your inbox email",
            'error': 'not activated'}),400
    else:
        return jsonify({
            'message': 'fail',
            'data': None,
            'error': 'incorrect email or password'}),400
    
@auth_views.get("/whoami")
@jwt_required()
def whoami():
    return jsonify(
        {
            "message": "success",
            "user_details": {
                "name": current_user.name,
                "email": current_user.email,
                "id": current_user.id
            },
        }
    )


def role_data(data):
    """update data to handle new role"""
    new_data = {}
    for k, v in data.items():
        if k in ['interested']:
            new_data[k] = v

    return new_data
