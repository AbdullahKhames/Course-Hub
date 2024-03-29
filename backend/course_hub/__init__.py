#!/usr/bin/python
"""module init"""

from os import environ
from flask import Flask
from models.admin import Admin
from models.instructor import Instructor
from models.student import Student
from flask_jwt_extended import JWTManager
from pathlib import Path
from flask_mail import Mail
from mailtrap import MailtrapClient

roles = [Admin, Instructor, Student]

jwt = JWTManager()
app = Flask(__name__, instance_relative_config=True)

#testing mail sending
# app.config['MAIL_SERVER']='sandbox.smtp.mailtrap.io'
# app.config['MAIL_PORT'] = 2525
# app.config['MAIL_USERNAME'] = '43f98cc6600bf3'
# app.config['MAIL_PASSWORD'] = environ.get('TESTING_MAIL_PASS')
# app.config['MAIL_USE_TLS'] = True
# app.config['MAIL_USE_SSL'] = False
#prod mail sending
# app.config['MAIL_SERVER']='live.smtp.mailtrap.io'
# app.config['MAIL_PORT'] = 587
# app.config['MAIL_USERNAME'] = 'api'
# app.config['MAIL_PASSWORD'] = environ.get('PROD_MAIL_PASS')
# app.config['MAIL_USE_TLS'] = True
# app.config['MAIL_USE_SSL'] = False

mail = Mail(app)
client = MailtrapClient(token=environ.get('MAIL_TRAP_TOKEN'))
app.config.from_object('config.default')

app.config.from_pyfile('config.py')
cwd = Path.cwd()
config_file_path = cwd / "config" / "production.py"
exported_config_file_path = environ.get("APP_CONFIG_FILE")
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
