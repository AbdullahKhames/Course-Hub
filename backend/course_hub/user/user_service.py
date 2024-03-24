#!/usr/bin/python3
"""service for user"""
from os import getenv

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from utils import sess_manager
from models.user import User


class UserService:
    # __engine = None
    # __session = None

    def __init__(self):
        # CH_MYSQL_USER = getenv('CH_MYSQL_USER')
        # CH_MYSQL_PWD = getenv('CH_MYSQL_PWD')
        # CH_MYSQL_HOST = getenv('CH_MYSQL_HOST')
        # CH_MYSQL_DB = getenv('CH_MYSQL_DB')
        # self.__engine = create_engine('mysql+mysqldb://{}:{}@{}/{}'.
        #                         format(CH_MYSQL_USER,
        #                                 CH_MYSQL_PWD,
        #                                 CH_MYSQL_HOST,
        #                                 CH_MYSQL_DB))
        # sess_factory = sessionmaker(bind=self.__engine, expire_on_commit=False)
        # Session = scoped_session(sess_factory)
        sess_manager.reload()
        self.__session = sess_manager.session
        
    def get_users(self, page, per_page):
        """method to paginate users"""
        offset = (page - 1) * per_page

        results = self.__session.query(User)\
            .offset(offset)\
                .limit(per_page).all()
        return results
