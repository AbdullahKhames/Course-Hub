#!/usr/bin/python3
"""initialize the blueprint app (app_views) for FLASK"""

from flask import Blueprint

instructor_views = Blueprint('instructor_views', __name__, url_prefix='/api/')
from course_hub.instructor.views import *

