#!/usr/bin/env python3
"""to init db"""

from os import getenv
from sqlalchemy import create_engine
from models.base_model import Base
from models.section import Section
from models.lesson import Lesson
from models.course import Course
from models.user import User
from models.student import Student
from models.instructor import Instructor
from models.admin import Admin
from models.TokenBlocklist import TokenBlocklist
from sqlalchemy.orm import scoped_session, sessionmaker

CH_MYSQL_USER = getenv('CH_MYSQL_USER')
CH_MYSQL_PWD = getenv('CH_MYSQL_PWD')
CH_MYSQL_HOST = getenv('CH_MYSQL_HOST')
CH_MYSQL_DB = getenv('CH_MYSQL_DB')
CH_ENV = getenv('CH_ENV')
engine = create_engine('mysql+mysqldb://{}:{}@{}/{}'.
                                format(CH_MYSQL_USER,
                                        CH_MYSQL_PWD,
                                        CH_MYSQL_HOST, 
                                        CH_MYSQL_DB))

Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

session_maker = sessionmaker(bind=engine)
session = scoped_session(session_maker)
