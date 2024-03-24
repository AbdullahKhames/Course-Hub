#!/usr/bin/python3

"""module for auth utils"""
from functools import wraps
from flask_jwt_extended import (
    current_user,
)
from flask import abort, jsonify


def user_required(allowed_roles):
    def docerator(func):
        @wraps(func)
        def decorated(*args, **kwargs):
            if not current_user:
                abort(401)
            if current_user.role in allowed_roles:
                return func(*args, **kwargs)
            else:
                return jsonify(message="you have not premmssion to do this operation"), 403
        return decorated
    return docerator
