#!/usr/bin/python3
"""Module for check states of the api"""

from course_hub.course import course_views
from flask import jsonify
from models import storage


@course_views.route('/stats')
def stats():
    """return the number of each objects by type"""
    objects = {
        'users': storage.count('User'),
        'courses': storage.count('Course'),
        'sections': storage.count('Section'),
        'lessons': storage.count('Lesson'),
        'categories': storage.count('Category'),
        'students': storage.count('Student'),
        'instructors': storage.count('Instructor'),
        'admins': storage.count('Admin'),
        'enrollments': len(storage.get_enrollments())
    }
    return jsonify(objects)
