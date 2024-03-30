#!/usr/bin/python
"""module init"""

from os import environ
from flask import Flask
from models.admin import Admin
from models.instructor import Instructor
from models.student import Student
from flask_jwt_extended import JWTManager
from pathlib import Path
from mailtrap import MailtrapClient

roles = [Admin, Instructor, Student]

jwt = JWTManager()
app = Flask(__name__, instance_relative_config=True)
client = MailtrapClient(token=environ.get('MAIL_TRAP_TOKEN'))

app.config.from_object('config.default')

app.config.from_pyfile('config.py')
cwd = Path.cwd()
config_file_path = cwd / "config" / "development.py"
config_file_env_var = 'APP_CONFIG_FILE'
if config_file_env_var in environ:
    try:
        app.config.from_envvar(config_file_env_var)
    except RuntimeError as e:
        print(f"Error loading configuration from {environ[config_file_env_var]}: {e}")
else:
    try:
        app.config.from_pyfile(config_file_path)
    except FileNotFoundError:
        print(f"Default configuration file {config_file_path} not found.")
    except RuntimeError as e:
        print(f"Error loading default configuration from {config_file_path}: {e}")
