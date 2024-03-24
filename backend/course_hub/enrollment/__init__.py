#!/usr/bin/python3
"""initialize the blueprint app (app_views) for FLASK"""

from flask import Blueprint

enrollment_views = Blueprint('enrollment_views', __name__, url_prefix='/api/')
from course_hub.enrollment.views import *
