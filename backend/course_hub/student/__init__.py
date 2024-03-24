#!/usr/bin/python3
"""initialize the blueprint app (app_views) for FLASK"""

from flask import Blueprint

student_views = Blueprint('student_views', __name__, url_prefix='/api/')
from course_hub.student.views import *
