from enum import Enum


class UserRole(str, Enum):
    ADMINISTRATOR = "administrator"
    STAFF = "staff"
    CUSTOMER = "customer"