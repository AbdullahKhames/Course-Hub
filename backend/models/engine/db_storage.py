#!/usr/bin/python3
"""
Contains the class DBStorage
"""

# import models
from models.TokenBlocklist import TokenBlocklist
from models.user import User
from models.course import Course
from models.enrollment import Enrollment
from models.section import Section
from models.lesson import Lesson
from models.category import Category
from models.student import Student
from models.instructor import Instructor
from models.admin import Admin
from os import getenv
from utils import sess_manager
from models.base_model import Base


classes = {"User": User, "Course": Course, "Section": Section,
           "Lesson": Lesson, "Category": Category, "Student": Student,
           "Instructor": Instructor, "Admin": Admin}


class DBStorage:
    """interaacts with the MySQL database"""
    __engine = None
    __session = None

    def __init__(self):
        """Instantiate a DBStorage object"""
        # CH_MYSQL_USER = getenv('CH_MYSQL_USER')
        # CH_MYSQL_PWD = getenv('CH_MYSQL_PWD')
        # CH_MYSQL_HOST = getenv('CH_MYSQL_HOST')
        # CH_MYSQL_DB = getenv('CH_MYSQL_DB')
        # SQLALCHEMY_DATABASE_URI = 'mysql+mysqldb://{}:{}@{}/{}'.format(
        #                             CH_MYSQL_USER,
        #                             CH_MYSQL_PWD,
        #                             CH_MYSQL_HOST,
        #                             CH_MYSQL_DB)
        # self.__engine = create_engine(SQLALCHEMY_DATABASE_URI,
        #                               pool_size=10,
        #                               max_overflow=30,
        #                               pool_timeout=60,
        #                               pool_recycle=3600)
        self.__engine = sess_manager.get_engine()
        CH_ENV = getenv('CH_ENV')
        if CH_ENV == "test":
            Base.metadata.drop_all(self.__engine)

    def all(self, cls=None):
        """query on the current database session"""
        new_dict = {}
        for clss in classes:
            if cls is None or cls is classes[clss] or cls is clss:
                objs = self.__session.query(classes[clss]).all()
                for obj in objs:
                    key = obj.__class__.__name__ + '.' + obj.id
                    new_dict[key] = obj
        return (new_dict)

    def new(self, obj):
        """add the object to the current database session"""
        self.__session.add(obj)

    def save(self):
        """commit all changes of the current database session"""
        self.__session.commit()

    def delete(self, obj=None):
        """delete from the current database session obj if not None"""
        if obj is not None:
            self.__session.delete(obj)

    def reload(self):
        """reloads data from the database"""
        # Base.metadata.create_all(self.__engine)
        # sess_factory = sessionmaker(bind=self.__engine, expire_on_commit=False)
        # Session = scoped_session(sess_factory)
        self.__session = sess_manager.get_session()

    def close(self):
        """call remove() method on the private session attribute"""
        self.__session.close()

    def get(self, cls, id):
        """A method to retrieve one object by its id"""
        objects = self.all(cls).values()
        for obj in objects:
            if id and obj.id == id:
                return obj
        return None

    def getUserByEmail(self, email):
        """A method to retrieve one object by its id"""
        if email is not None:
            return self.__session.query(User).filter(User.email == str(email)).first()
        else:
            return None

    def getUserByResetToken(self, reset_token):
        """A method to retrieve one object by its id"""
        if reset_token is not None:
            return self.__session.query(User).filter(User.reset_token == str(reset_token)).first()
        else:
            return None

    def getUserById(self, id):
        """A method to retrieve one object by its id"""
        if id is not None:
            return self.__session.query(User).filter(User.id == str(id)).scalar()
        else:
            return None

    def count(self, cls=None):
        """A method to count the number of objects in storage"""
        objects = self.all(cls)
        return len(objects)
    
    def getTokenByJti(self, jti):
        """method to get token by jti"""
        if jti is not None:
            return self.__session.query(TokenBlocklist).filter(TokenBlocklist.jti == str(jti)).scalar()
        else:
            return None

    def get_enrollments(self):
        """return list of enrollments"""
        result = self.__session.query(Enrollment).all()
        return result
