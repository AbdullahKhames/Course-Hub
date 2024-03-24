from os import getenv
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from models.base_model import Base


class SessionManagement:
    __engine = None
    session = None

    def __init__(self):
        CH_MYSQL_USER = getenv('CH_MYSQL_USER')
        CH_MYSQL_PWD = getenv('CH_MYSQL_PWD')
        CH_MYSQL_HOST = getenv('CH_MYSQL_HOST')
        CH_MYSQL_DB = getenv('CH_MYSQL_DB')
        SQLALCHEMY_DATABASE_URI = 'mysql+mysqldb://{}:{}@{}/{}'.format(
                                    CH_MYSQL_USER,
                                    CH_MYSQL_PWD,
                                    CH_MYSQL_HOST,
                                    CH_MYSQL_DB)
        self.__engine = create_engine(SQLALCHEMY_DATABASE_URI, 
                                      pool_size=10,
                                      max_overflow=30,
                                      pool_timeout=60, 
                                      pool_recycle=3600)
        # self.__engine = create_engine('mysql+mysqldb://{}:{}@{}/{}'.
        #                         format(CH_MYSQL_USER,
        #                                 CH_MYSQL_PWD,
        #                                 CH_MYSQL_HOST,
        #                                 CH_MYSQL_DB))
        self.reload()

    def reload(self):
        """Reloads data from the database."""
        Base.metadata.create_all(self.__engine)
        sess_factory = sessionmaker(bind=self.__engine, expire_on_commit=False)
        self.session = scoped_session(sess_factory)

    def close(self):
        """Closes the session."""
        self.session.close()

    def session_status(self):
        """Returns the status of the session."""
        return self.session.is_active