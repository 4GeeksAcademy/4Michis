"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""


from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Favorites, TokenBlockedList, UserReviews, UserReviewsDetails, CatUser, CatPhoto
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity, get_jwt
from flask_jwt_extended import jwt_required


import cloudinary
from cloudinary import CloudinaryImage
from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url

cloudinary_config = cloudinary.config(secure=True)


api = Blueprint('api', __name__)
app = Flask(__name__)
bcrypt = Bcrypt(app)

# Allow CORS requests to this API
CORS(api)


@api.route("/register", methods=["POST"])
def register_user():
    body = request.get_json()
    new_user = User(
        name=body["name"],
        lastname=body["lastname"],
        dni=body["dni"],
        nickname=body["nickname"],
        direction=body["direction"],
        email=body["email"],
        phone=body["phone"],
        is_active=body["is_active"],
        rol=body["rol"],
        profile_picture="",
    )
    # Password
    hashed_password = bcrypt.generate_password_hash(
        body["password"]).decode("utf-8")
    new_user.password = hashed_password
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 201


@api.route("/login", methods=["POST"])
def login_user():
    body = request.get_json()
    user = User.query.filter_by(email=body["email"]).first()
    if user is None:
        return jsonify({"msg": "Mail not found"}), 401
    is_valid_password = bcrypt.check_password_hash(
        user.password, body["password"])
    if not is_valid_password:
        return jsonify({"msg": "Invalid password"}), 401
    payload = {
        "admin": False,
        "permisions": 123123
    }
    token = create_access_token(identity=str(
        user.id), additional_claims=payload)
    return jsonify({"token": token}), 200


@api.route("/private", methods=["GET"])
@jwt_required()
def private():
    actually_user = get_jwt_identity()
    return jsonify(logged_in_as=actually_user), 200


@api.route("/userinfo", methods=["GET"])
@jwt_required()
def user_info():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    photo_url = cloudinary_url(user.profile_picture, crop="fill", width=400,
                               height=400)

    payload = get_jwt()
    return jsonify({
        "user": user.serialize(),
        "payload": payload,
        "profilePicture": photo_url[0]

    })


@api.route("/logout", methods=["POST"])
@jwt_required()
def user_logout():
    payload = get_jwt()
    token_blocked = TokenBlockedList(jti=payload["jti"])
    db.session.add(token_blocked)
    db.session.commit()
    return jsonify({"msg": "User Logged Out"}), 200

# Review Routes


@api.route("/user/<int:id>/reviews", methods=["GET"])
@jwt_required()
def get_received_reviews(id):
    reviews_details = UserReviewsDetails.query.filter_by(
        target_user_id=id).all()
    return jsonify([review.serialize() for review in reviews_details]), 200


@api.route("/user/sent-reviews", methods=["GET"])
@jwt_required()
def get_sent_reviews():
    user_id = get_jwt_identity()
    reviews_details = UserReviewsDetails.query.filter_by(
        sender_user_id=user_id).all()
    return jsonify([review.serialize() for review in reviews_details]), 200


@api.route("/user/<int:target_user_id>/<int:michi_id>/review", methods=["POST"])
@jwt_required()
def add_review(target_user_id, michi_id):
    body = request.get_json()
    sender_user_id = int(get_jwt_identity())
    if sender_user_id == target_user_id:
        return jsonify({"msg": "You cannot rate yourself"}), 409
    existing_review = UserReviewsDetails.query.filter_by(
        sender_user_id=sender_user_id, target_user_id=target_user_id, michi_id=michi_id).first()
    if existing_review:
        return jsonify({"msg": "You already reviewed this michi"}), 409

    new_user_review = UserReviews(
        user_id=sender_user_id, rating=body["rating"], comment=body.get("comment"))
    db.session.add(new_user_review)
    db.session.commit()

    new_review_relationship = UserReviewsDetails(
        sender_user_id=sender_user_id, target_user_id=target_user_id, michi_id=michi_id, review_id=new_user_review.id)
    db.session.add(new_review_relationship)
    db.session.commit()

    return jsonify(new_review_relationship.serialize()), 201

# User Routes


@api.route("/users/", methods=["GET"])
@jwt_required()
def user_list():
    users = User.query.all()
    return jsonify({
        "users": [user.serialize() for user in users],
    }), 200


@api.route("/user/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    body = request.get_json()
    if not body:
        return jsonify({"msg": "Debes proporcionar informacion para actulizar el usuario"}), 400

    current_user_id = get_jwt_identity()
    if int(current_user_id) != user_id:
        return jsonify({"msg": f"{user_id} No tienes permiso para actualizar este usuario {current_user_id}"}), 403

    current_user = User.query.get(current_user_id)
    if not current_user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    new_email = body.get("email")
    if new_email and new_email != current_user.email:
        if User.query.filter(User.email == new_email, User.id != current_user.id).first():
            return jsonify({"msg": "El email ya está en uso por otro usuario"}), 409
        current_user.email = new_email

    current_user.name = body.get("name", current_user.name)
    current_user.lastname = body.get("lastname", current_user.lastname)
    current_user.dni = body.get("dni", current_user.dni)
    current_user.nickname = body.get("nickname", current_user.nickname)
    current_user.direction = body.get("direction", current_user.direction)
    current_user.phone = body.get("phone", current_user.phone)
    current_user.rol = body.get("rol", current_user.rol)

    if "password" in body:
        hashed_password = bcrypt.generate_password_hash(
            body["password"]).decode("utf-8")
        current_user.password = hashed_password

    db.session.add(current_user)
    db.session.commit()
    return jsonify(current_user.serialize()), 201


@api.route('/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"User with id {user_id} has been deleted."}), 200


@api.route('/favorites/<int:michi_id>', methods=["POST"])
@jwt_required()
def add_favorite(michi_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)  # más directo que filter_by(id=...)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    michi = CatUser.query.get(michi_id)
    if not michi:
        return jsonify({"msg": "Michi not found"}), 404

    # Verifica si ya existe ese favorito
    existing_fav = Favorites.query.filter_by(
        user_id=user.id, michi_id=michi.id).first()
    if existing_fav:
        return jsonify({"msg": "This michi is already in your favorites"}), 409

    # Crea y guarda el favorito
    new_favorite = Favorites(user_id=user.id, michi_id=michi.id)
    db.session.add(new_favorite)
    db.session.commit()

    return jsonify({"msg": "Michi has been added to favorites"}), 201


@api.route('/favorites/<int:michi_id>', methods=["DELETE"])
@jwt_required()
def delete_favorite(michi_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    favorite_to_delete = Favorites.query.filter_by(
        user_id=user.id, michi_id=michi_id
    ).first()

    if not favorite_to_delete:
        return jsonify({"msg": "This michi is not in your favorites"}), 404

    db.session.delete(favorite_to_delete)
    db.session.commit()
    return jsonify({"msg": f"Michi with id {michi_id} has been removed from favorites"}), 200


@api.route("/cats/<int:cat_id>", methods=["GET"])
def cat_info(cat_id):
    cat = CatUser.query.get(cat_id)
    return jsonify({
        "cat": cat.serialize(),
    })


@api.route("/cats/", methods=["GET"])
def cat_list():
    cats = CatUser.query.all()
    return jsonify({
        "cats": [cat.serialize() for cat in cats],
    }), 200


@api.route("/cats", methods=["POST"])
@jwt_required()
def create_cat():
    body = request.get_json()
    user_id = get_jwt_identity()
    new_cat = CatUser(
        name=body["name"],
        breed=body.get("breed"),
        age=body.get("age"),
        weight=body.get("weight"),
        description=body.get("description"),
        color=body.get("color"),
        sex=body.get("sex"),
        is_active=body.get("is_active", True),
        user_id=user_id
    )
    db.session.add(new_cat)
    db.session.commit()
    return jsonify(new_cat.serialize()), 201


@api.route("/cats/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_cat(id):
    user_id = int(get_jwt_identity())
    cat = db.session.get(CatUser, id)
    if cat is None:
        return jsonify({"error": "Cat not found"}), 404
    if user_id != cat.user_id:
        return jsonify({"error": "Not authorized"}), 403

    db.session.delete(cat)
    db.session.commit()
    return jsonify({"message": "Cat deleted"}), 200


@api.route("/cats/<int:id>", methods=["PUT"])
@jwt_required()
def update_cat(id):
    body = request.get_json()
    cat = db.session.get(CatUser, id)
    if cat is None:
        return jsonify({"error": "Cat not found"}), 404

    cat.name = body.get("name", cat.name)
    cat.breed = body.get("breed", cat.breed)
    cat.age = body.get("age", cat.age)
    cat.weight = body.get("weight", cat.weight)
    cat.description = body.get("description", cat.description)
    cat.color = body.get("color", cat.color)
    cat.sex = body.get("sex", cat.sex)
    cat.is_active = body.get("is_active", cat.is_active)
    cat.user_id = get_jwt_identity()

    db.session.commit()
    return jsonify(cat.serialize()), 200


@api.route("/cats/<int:cat_id>/photos/", methods=["POST"])
@jwt_required()
def create_cat_photo(cat_id):
    body = request.get_json()
    user_id = int(get_jwt_identity())
    cat = CatUser.query.filter_by(id=cat_id).first()

    if user_id != cat.user_id:
        return jsonify({"error": "Not authorized"}), 403

    new_photo = CatPhoto(
        foto=body.get("foto"),
        cat_id=cat_id,
        user_id=get_jwt_identity()
    )

    db.session.add(new_photo)
    db.session.commit()
    return jsonify(new_photo.serialize()), 201


@api.route("/cats/<int:cat_id>/photos/<int:photo_id>", methods=["DELETE"])
@jwt_required()
def delete_cat_photo(cat_id, photo_id):
    photo = CatPhoto.query.filter_by(id=photo_id, cat_id=cat_id).first()
    user_id = int(get_jwt_identity())
    if photo is None:
        return jsonify({"error": "Photo not found"}), 404
    if user_id != photo.user_id:
        return jsonify({"error": "Not authorized"}), 403

    db.session.delete(photo)
    db.session.commit()
    return jsonify({"message": "Photo entry deleted"}), 200


@api.route("/profilepicture", methods=["PUT"])
@jwt_required()
def user_profile_picture():
    user_id = get_jwt_identity()
    # validamos el usuario del token
    user = User.query.get(user_id)  # buscamos el usuario en la base de datos
    if user is None:
        return jsonify({"msg": "No se encontro el usuario"}), 403
    # validamos que la peticion contenga la imagen
    # esta vez la peticion no sera json sino form data
    photo = request.files["PERFIL FEDE"]
    if photo is None:
        return jsonify({"msg": "No se envio una imagen"}), 400
    # se carga la imagen a cloudinary
    # llamamos a l a galeria de cloudinary para hacer la carga de la foto
    upload_result = upload(photo)
    print(upload_result)
    """ photo_url = cloudinary_url(upload_result['public_id'], format="jpg", crop="fill", width=100,
                               height=100) """
    # actulizar el usuario con la direccion del recurso en cloudinary
    user.profile_picture = upload_result["public_id"]
    db.session.add(user)
    db.session.commit()
    photo_url = cloudinary_url(user.profile_picture)
    # se respponde con un mensaje y la direccion de la foto
    return jsonify({"userId": user_id, "msg": "foto actualizada", "profilePicture": photo_url})
