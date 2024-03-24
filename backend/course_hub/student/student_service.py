#!/usr/bin/python3
"""service for instructor"""

from os import getenv

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from models.student import Student
from utils import sess_manager

class StudentService:

    def __init__(self):

        sess_manager.reload()
        self.__session = sess_manager.session
        
    def get_students(self, page, per_page):
        """method to paginate students"""
        offset = (page - 1) * per_page

        results = self.__session.query(Student)\
            .offset(offset)\
                .limit(per_page).all()
        return results
