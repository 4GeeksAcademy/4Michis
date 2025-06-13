"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""


from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Favorites, TokenBlockedList, UserReviews, UserReviewsDetails, CatUser, CatPhoto, CatContactRequest
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import or_
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity, get_jwt
from flask_jwt_extended import jwt_required
from faker import Faker
from random import choice, randint


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


@api.route("/cats/<int:cat_id>/contact", methods=["POST"])
@jwt_required()
def contact_cat_owner(cat_id):
    user_id = get_jwt_identity()
    cat = CatUser.query.get(cat_id)

    if not cat:
        return jsonify({"error": "Michi no encontrado"}), 404

    if user_id == cat.user_id:
        return jsonify({"error": "No puedes contactarte a ti mismo"}), 400

    # Check for existing contact
    contact = CatContactRequest.query.filter_by(
        cat_id=cat_id, contactor_id=user_id).first()
    if not contact:
        contact = CatContactRequest(
            cat_id=cat_id,
            contactor_id=user_id,
            owner_id=cat.user_id
        )
        db.session.add(contact)
        db.session.commit()

    # Obtener datos del dueño del gato
    owner = User.query.get(cat.user_id)

    return jsonify({
        "msg": "Contacto registrado correctamente",
        "owner": {
            "name": owner.name,
            "lastname": owner.lastname,
            "email": owner.email,
            "phone": owner.phone,
            "nickname": owner.nickname,
            "profile_picture": owner.profile_picture,
        }
    }), 200

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


@api.route('/favorites', methods=["POST"])
@jwt_required()
def add_favorite():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)  # más directo que filter_by(id=...)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()
    michi_id = data.get("michi_id")

    if not michi_id:
        return jsonify({"msg": "se necesita ID del gato"}), 400

    michi = CatUser.query.get(michi_id)
    if not michi:
        return jsonify({"msg": "Michi not found"}), 404

    # Verifica si ya existe ese favorito
    existing_fav = Favorites.query.filter_by(
        user_id=user.id, michi_id=michi.id).first()
    if existing_fav:
        return jsonify({"msg": "This michi is already in your favorites", "favorite": existing_fav.serialize()}), 409

    # Crea y guarda el favorito
    new_favorite = Favorites(user_id=user.id, michi_id=michi.id)
    db.session.add(new_favorite)
    db.session.commit()

    return jsonify({"msg": "Michi has been added to favorites", "favorite": new_favorite.serialize()}), 201


@api.route('/favorites/<int:michi_id>', methods=["DELETE"])
@jwt_required()
def delete_favorite(michi_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    michi = CatUser.query.get(michi_id)
    if not michi:
        return jsonify({"msg": "Michi not found"}), 404

    favorite_to_delete = Favorites.query.filter_by(
        user_id=user.id, michi_id=michi.id
    ).first()

    if not favorite_to_delete:
        return jsonify({"msg": "This michi is not in your favorites"}), 404

    db.session.delete(favorite_to_delete)
    db.session.commit()
    return jsonify({"msg": f"Michi with id {michi_id} has been removed from favorites"}), 200


@api.route("/favorites", methods=["GET"])
@jwt_required()
def get_favorites():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404
    user_favorites = Favorites.query.filter_by(user_id=user.id).all()
    serialized_favorites = [favorite.serialize()
                            for favorite in user_favorites]

    return jsonify(serialized_favorites), 200


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
    try:
        body = request.get_json()
        print("Datos recibidos:", body)

        # Validación básica
        if not body or "name" not in body:
            return jsonify({"msg": "Falta el campo 'name'"}), 400

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

    except Exception as e:
        print("Error en create_cat:", str(e))
        return jsonify({"msg": "Error interno", "error": str(e)}), 500


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
    user.profile_picture = upload_result["secure_url"]
    db.session.add(user)
    db.session.commit()
    photo_url = cloudinary_url(user.profile_picture)
    # se respponde con un mensaje y la direccion de la foto
    return jsonify({"userId": user_id, "msg": "foto actualizada", "profilePicture": photo_url})

 # -----------#


@api.route("/cats/<int:cat_id>/profilepicture", methods=["PUT"])
@jwt_required()
def upload_cat_profile_picture(cat_id):
    try:
        user_id = int(get_jwt_identity())
        cat = CatUser.query.get(cat_id)

        if not cat:
            return jsonify({"msg": "Gato no encontrado"}), 404

        if cat.user_id != user_id:
            print(
                f"❌ No autorizado: user_id={user_id} ≠ cat.user_id={cat.user_id}")
            return jsonify({"msg": "No autorizado"}), 403

        if "CAT_PROFILE" not in request.files:
            return jsonify({"msg": "No se envió imagen"}), 400

        photo = request.files["CAT_PROFILE"]

        # ⏫ Subida a Cloudinary
        try:
            upload_result = upload(photo)
            secure_url = upload_result.get("secure_url")
            if not secure_url:
                raise Exception("Cloudinary no devolvió una URL segura")
        except Exception as e:
            return jsonify({"msg": "Error al subir la imagen", "error": str(e)}), 500

        # 📸 Guardar en base de datos
        new_photo = CatPhoto(
            foto=secure_url,
            cat_id=cat.id,
            user_id=user_id
        )

        db.session.add(new_photo)
        db.session.commit()

        return jsonify({
            "msg": "Foto del gato subida correctamente",
            "photo": new_photo.serialize()
        }), 201

    except Exception as e:
        print("🐞 Error general:", str(e))
        return jsonify({"msg": "Error inesperado", "error": str(e)}), 500


@api.route("/cats-contacted", methods=["GET"])
@jwt_required()
def my_cats_with_contacts():
    user_id = get_jwt_identity()

    my_cats = CatUser.query.filter_by(user_id=user_id).all()
    result = []

    for cat in my_cats:
        contacts = CatContactRequest.query.filter_by(cat_id=cat.id).all()
        contact_list = []
        for contact in contacts:
            contactor = User.query.get(contact.contactor_id)
            contact_list.append({
                "contactor_id": contact.contactor_id,
                "nickname": contactor.nickname,
                "email": contactor.email,
                "phone": contactor.phone,
                "profile_picture": contactor.profile_picture,  # ✅ Esta es la clave
                "contacted_at": contact.contacted_at.isoformat(),
                "is_selected": contact.is_selected
            })

        result.append({
            "cat_id": cat.id,
            "cat_name": cat.name,
            "photo": cat.photos[0].foto if cat.photos and len(cat.photos) > 0 else None,
            "contacts": contact_list
        })

    return jsonify(result), 200


@api.route("/cats/<int:cat_id>/adopt/<int:user_id>", methods=["PATCH"])
@jwt_required()
def mark_as_adoptant(cat_id, user_id):
    current_user_id = get_jwt_identity()

    cat = CatUser.query.get(cat_id)
    if not cat:
        return jsonify({"error": "Gato no encontrado"}), 404

    print("Dueño del gato:", cat.user_id)
    print("Usuario actual:", current_user_id)

    if int(cat.user_id) != int(current_user_id):
        return jsonify({"error": "No tienes permiso para marcar al adoptante"}), 403

    existing_adoptant = CatContactRequest.query.filter_by(
        cat_id=cat_id,
        is_selected=True
    ).first()

    if existing_adoptant:
        return jsonify({"error": "Ya has seleccionado un adoptante para este gato"}), 400

    contact = CatContactRequest.query.filter_by(
        cat_id=cat_id,
        contactor_id=user_id
    ).first()

    if not contact:
        return jsonify({"error": "Ese usuario no ha contactado por este gato"}), 404

    contact.is_selected = True
    cat.is_active = False
    db.session.commit()

    return jsonify({"msg": "Adoptante marcado correctamente"}), 200


@api.route("/cats/<int:cat_id>/toggle-active", methods=["PATCH"])
@jwt_required()
def toggle_cat_status(cat_id):
    user_id = get_jwt_identity()
    cat = CatUser.query.get(cat_id)

    if not cat:
        return jsonify({"msg": "Gato no encontrado"}), 404

    if cat.user_id != int(user_id):
        return jsonify({"msg": "No autorizado"}), 403

    body = request.get_json()
    new_status = body.get("is_active")

    if new_status is None:
        return jsonify({"msg": "Falta el campo 'is_active'"}), 400

    cat.is_active = new_status
    db.session.commit()

    return jsonify({"msg": f"Gato {'habilitado' if new_status else 'deshabilitado'} correctamente"}), 200


@api.route("/user/adopted-cats", methods=["GET"])
@jwt_required()
def get_adopted_cats():
    user_id = int(get_jwt_identity())

    adopted_contacts = CatContactRequest.query.filter_by(
        contactor_id=user_id,
        is_selected=True
    ).all()

    adopted_cats = [
        {
            "cat_id": contact.cat.id,
            "cat_name": contact.cat.name,
            "photo": next((photo.foto for photo in contact.cat.photos), None),
            "owner_nickname": contact.owner.nickname,
            "owner_id": contact.owner.id
        } for contact in adopted_contacts
    ]

    return jsonify(adopted_cats), 200


@api.route("/user/given-cats-with-adoptant", methods=["GET"])
@jwt_required()
def get_given_cats():
    user_id = int(get_jwt_identity())

    given_contacts = CatContactRequest.query.filter_by(
        owner_id=user_id,
        is_selected=True
    ).all()

    given_cats = [
        {
            "cat_id": contact.cat.id,
            "cat_name": contact.cat.name,
            "photo": next((photo.foto for photo in contact.cat.photos), None),
            "adoptant_nickname": contact.contactor.nickname,
            "adoptant_id": contact.contactor.id
        } for contact in given_contacts
    ]

    return jsonify(given_cats), 200


@api.route("/user/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user_by_id(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify({
        "id": user.id,
        "name": user.name,
        "nickname": user.nickname,
        "profile_picture": user.profile_picture
    }), 200


@api.route('/cats/search', methods=["GET"])
def search_cats():
    query = request.args.get("q", "").strip().lower()

    if not query:
        return jsonify([]), 200

    translated_sex = None
    if query in ["macho", "male"]:
        translated_sex = "male"
    elif query in ["hembra", "female"]:
        translated_sex = "female"

    filters = [CatUser.is_active.is_(True)]

    if translated_sex:
        filters.append(CatUser.sex == translated_sex)
    else:
        filters.append(or_(
            CatUser.age.cast(db.String).ilike(f"%{query}%"),
            CatUser.breed.ilike(f"%{query}%"),
            CatUser.color.ilike(f"%{query}%"),
        ))

    cats = CatUser.query.filter(*filters).all()
    return jsonify([cat.serialize() for cat in cats]), 200


# gatos de prueba, snippet
def insert_test_cats(n=10, user_id=1):
    colors = ['negro', 'blanco', 'gris', 'naranja', 'marrón']
    breeds = ['persa', 'siamés', 'maine coon', 'británico', 'común europeo']
    sex = ['male', 'female']
    fake = Faker()

    for _ in range(n):
        cat = CatUser(
            name=fake.first_name(),
            breed=choice(breeds),
            age=randint(1, 15),
            weight=round(randint(200, 700) / 100, 1),
            description=fake.sentence(),
            color=choice(colors),
            sex=choice(sex),
            user_id=user_id,
            is_active=True
        )
        db.session.add(cat)
        db.session.flush()

        photo = CatPhoto(
            foto="",
            cat_id=cat.id,
            user_id=user_id
        )
        db.session.add(photo)

    db.session.commit()


@api.route("/insert-test-cats", methods=["POST"])
def add_test_cats():
    insert_test_cats(n=10, user_id=1)
    return jsonify({"msg": "Gatos de prueba insertados"})
