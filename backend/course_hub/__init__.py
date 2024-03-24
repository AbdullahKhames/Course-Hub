#!/usr/bin/python
"""module init"""

from os import environ
from flask import Flask
from models.admin import Admin
from models.instructor import Instructor
from models.student import Student
from flask_jwt_extended import JWTManager

roles = [Admin, Instructor, Student]

jwt = JWTManager()
app = Flask(__name__, instance_relative_config=True)

app.config.from_object('config.default')

app.config.from_pyfile('config.py')

config_file_env_var = 'APP_CONFIG_FILE'
if config_file_env_var in environ:
    try:
        # Attempt to load the configuration from the specified file
        app.config.from_envvar(config_file_env_var)
    except RuntimeError as e:
        # Handle the RuntimeError (e.g., print a warning, log the error, etc.)
        print(f"Error loading configuration from {environ[config_file_env_var]}: {e}")
else:
    # Handle the case where the environment variable is not set
    print(f"{config_file_env_var} environment variable is not set.")
