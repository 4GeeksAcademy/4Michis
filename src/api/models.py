from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Integer, Float, Boolean, Text, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(40), nullable=False)
    lastname: Mapped[str] = mapped_column(String(40), nullable=False)
    dni: Mapped[str] = mapped_column(String(20), nullable=False)
    nickname: Mapped[str] = mapped_column(String(40), nullable=False)
    direction: Mapped[str] = mapped_column(String(40), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)
    rol: Mapped[str] = mapped_column(String(40), nullable=False)
    profile_picture: Mapped[str] = mapped_column(String(500), nullable=True)

    sent_reviews = relationship(
        'UserReviewsDetails', foreign_keys='UserReviewsDetails.sender_user_id', backref='sender', lazy=True)
    received_reviews = relationship(
        'UserReviewsDetails', foreign_keys='UserReviewsDetails.target_user_id', backref='receiver', lazy=True)
    favorites = relationship('Favorites', backref='user', lazy=True)
    michis = relationship('CatUser', backref='user', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "lastname": self.lastname,
            "dni": self.dni,
            "nickname": self.nickname,
            "direction": self.direction,
            "email": self.email,
            "phone": self.phone,
            "rol": self.rol
        }

 # User reviews model group


class UserReviews(db.Model):
    __tablename__ = "userreviews"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)
    rating: Mapped[int] = mapped_column(nullable=False)
    comment: Mapped[str] = mapped_column(String(300), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "rating": self.rating,
            "comment": self.comment
        }


class UserReviewsDetails(db.Model):
    __tablename__ = "userreviewsdetails"
    id: Mapped[int] = mapped_column(primary_key=True)
    target_user_id: Mapped[int] = mapped_column(
        ForeignKey('user.id'), nullable=False)
    sender_user_id: Mapped[int] = mapped_column(
        ForeignKey('user.id'), nullable=False)
    review_id: Mapped[int] = mapped_column(
        ForeignKey('userreviews.id'), nullable=False)
    michi_id: Mapped[int] = mapped_column(
        ForeignKey('cat_user.id'), nullable=False)
    user_review = relationship('UserReviews', backref='details', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "sender_user_id": self.sender_user_id,
            "target_user_id": self.target_user_id,
            "michi_id": self.michi_id,
            "review": self.user_review.serialize() if self.user_review else None
        }


class Favorites(db.Model):
    __tablename__ = "favorites"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id:  Mapped[int] = mapped_column(ForeignKey('user.id'))
    michi_id: Mapped[int] = mapped_column(ForeignKey('cat_user.id'))

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "michi_id": self.michi_id
        }

# Cat Models


class CatSex(enum.Enum):
    male = "male"
    female = "female"


class CatUser(db.Model):
    __tablename__ = "cat_user"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    breed: Mapped[str] = mapped_column(String(100), nullable=True)
    age: Mapped[int] = mapped_column(Integer, nullable=True)
    weight: Mapped[float] = mapped_column(Float, nullable=True)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    color: Mapped[str] = mapped_column(String(100), nullable=True)
    sex: Mapped[str] = mapped_column(String(10), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)
    photos: Mapped[list["CatPhoto"]] = relationship(
        "CatPhoto", back_populates="cat", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "breed": self.breed,
            "age": self.age,
            "weight": self.weight,
            "description": self.description,
            "color": self.color,
            "sex": self.sex,
            "is_active": self.is_active,
            "user_id": self.user_id,
            "photos": [photo.serialize() for photo in self.photos]
        }

class CatPhoto(db.Model):
    __tablename__ = "cat_photo"

    id: Mapped[int] = mapped_column(primary_key=True)
    foto: Mapped[str] = mapped_column(String(500), nullable=True)


    cat_id: Mapped[int] = mapped_column(
        ForeignKey("cat_user.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=True)

    # Relaciones
    cat: Mapped["CatUser"] = relationship("CatUser", back_populates="photos")
    user: Mapped["User"] = relationship("User")

    def serialize(self):
        return {
            "id": self.id,
            "foto": self.foto,
            "cat_id": self.cat_id,
            "user_id": self.user_id
        }


class TokenBlockedList(db.Model):
    __tablename__ = "tokenblockedlist"
    id: Mapped[int] = mapped_column(primary_key=True)
    jti: Mapped[str] = mapped_column(String(50), nullable=False)
