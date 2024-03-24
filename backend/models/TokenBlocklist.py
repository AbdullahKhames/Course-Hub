#!/usr/bin/python3
"""module yo describe token blocklist
"""

from sqlalchemy import String, DateTime, Column, Integer
from .base_model import Base
from datetime import datetime
from .base import BaseMethods


class TokenBlocklist(Base, BaseMethods):
    __tablename__ = 'token_blocklist'
    id = Column(Integer, primary_key=True)
    jti = Column(String(60), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Token {self.jti}>"
