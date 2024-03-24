#!/usr/bin/python3
"""initialize the blueprint app (app_views) for FLASK"""

from flask import Blueprint

course_views = Blueprint('course_views', __name__, url_prefix='/api/')
from course_hub.course.views.courses import *
from course_hub.course.views.sections import *
from course_hub.course.views.lessons import *
from course_hub.course.views.index import *
from course_hub.course.views.categories import *

