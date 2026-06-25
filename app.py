import os
import json
import time
import re
import random
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

PORT = int(os.environ.get("PORT", 5000))
MONGODB_URI = os.environ.get("MONGODB_URI")
EMAIL_USER = os.environ.get("EMAIL_USER") or "bhushaningale2006@gmail.com"
EMAIL_PASS = os.environ.get("EMAIL_PASS") or "godv hupw cita qvmw"

JSON_DB_DIR = os.path.join(os.getcwd(), "public", "data")
JSON_DB_PATH = os.path.join(JSON_DB_DIR, "portfolio_db.json")

DEFAULT_DB = {
    "hero": None,
    "about": None,
    "experience": None,
    "education": None,
    "projects": None,
    "skills": None,
    "techBubbles": None,
    "certifications": [],
    "achievements": [],
    "media": [],
    "mediaSlider": []
}

# ========================================================
# DATABASE HELPER FUNCTIONS
# ========================================================

def get_local_db():
    if not os.path.exists(JSON_DB_DIR):
        os.makedirs(JSON_DB_DIR, exist_ok=True)
    if not os.path.exists(JSON_DB_PATH):
        with open(JSON_DB_PATH, "w", encoding="utf-8") as f:
            json.dump(DEFAULT_DB, f, indent=2)
        return DEFAULT_DB
    try:
        with open(JSON_DB_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print("Failed to read JSON DB:", e)
        return DEFAULT_DB

def save_local_db(data):
    if not os.path.exists(JSON_DB_DIR):
        os.makedirs(JSON_DB_DIR, exist_ok=True)
    with open(JSON_DB_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def get_db_client():
    if not MONGODB_URI:
        return None
    try:
        client = MongoClient(MONGODB_URI)
        client.admin.command('ping')
        return client
    except Exception as e:
        print("MongoDB connection error, falling back to JSON:", e)
        return None

def get_portfolio_data():
    client = get_db_client()
    if client:
        try:
            db = client.get_default_database()
            settings = db.settings.find_one({"id": "portfolio"})
            certifications = list(db.certifications.find({}))
            achievements = list(db.achievements.find({}))
            media = list(db.media.find({}))
            mediaSlider = list(db.mediaSlider.find({}))
            
            def serialize_doc(doc):
                if doc and "_id" in doc:
                    doc["id"] = str(doc["_id"])
                    del doc["_id"]
                return doc

            return {
                "hero": settings.get("hero") if settings else None,
                "about": settings.get("about") if settings else None,
                "experience": settings.get("experience") if settings else None,
                "education": settings.get("education") if settings else None,
                "projects": settings.get("projects") if settings else None,
                "skills": settings.get("skills") if settings else None,
                "techBubbles": settings.get("techBubbles") if settings else None,
                "certifications": [serialize_doc(c) for c in certifications],
                "achievements": [serialize_doc(a) for a in achievements],
                "media": [serialize_doc(m) for m in media],
                "mediaSlider": [serialize_doc(m) for m in mediaSlider]
            }
        except Exception as e:
            print("MongoDB error, falling back to JSON:", e)
            
    return get_local_db()

def update_section(section, data):
    client = get_db_client()
    if client:
        try:
            db = client.get_default_database()
            db.settings.update_one(
                {"id": "portfolio"},
                {"$set": {section: data}},
                upsert=True
            )
            return {"success": True}
        except Exception as e:
            print("MongoDB error, writing to JSON:", e)
            
    db = get_local_db()
    db[section] = data
    save_local_db(db)
    return {"success": True}

# ========================================================
# CRUD DATABASE OPERATIONS
# ========================================================

def generate_random_id():
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=7))

# Certifications
def add_certification(cert):
    client = get_db_client()
    id_str = generate_random_id()
    new_cert = {**cert, "_id": id_str, "id": id_str}
    
    if client:
        try:
            db = client.get_default_database()
            db.certifications.insert_one({**cert, "_id": id_str})
            return new_cert
        except Exception as e:
            print("MongoDB error, adding to JSON:", e)
            
    db = get_local_db()
    db["certifications"].append(new_cert)
    save_local_db(db)
    return new_cert

def update_certification(id_str, cert):
    client = get_db_client()
    update_data = {k: v for k, v in cert.items() if k not in ["_id", "id"]}
    
    if client:
        try:
            db = client.get_default_database()
            db.certifications.update_one({"_id": id_str}, {"$set": update_data})
            return {"success": True}
        except Exception as e:
            print("MongoDB error, updating in JSON:", e)
            
    db = get_local_db()
    db["certifications"] = [
        {**c, **cert} if c.get("id") == id_str else c for c in db["certifications"]
    ]
    save_local_db(db)
    return {"success": True}

def delete_certification(id_str):
    client = get_db_client()
    if client:
        try:
            db = client.get_default_database()
            db.certifications.delete_one({"_id": id_str})
            return {"success": True}
        except Exception as e:
            print("MongoDB error, deleting from JSON:", e)
            
    db = get_local_db()
    db["certifications"] = [c for c in db["certifications"] if c.get("id") != id_str]
    save_local_db(db)
    return {"success": True}

# Achievements
def add_achievement(ach):
    client = get_db_client()
    id_str = generate_random_id()
    new_ach = {**ach, "_id": id_str, "id": id_str}
    
    if client:
        try:
            db = client.get_default_database()
            db.achievements.insert_one({**ach, "_id": id_str})
            return new_ach
        except Exception as e:
            print("MongoDB error, adding to JSON:", e)
            
    db = get_local_db()
    db["achievements"].append(new_ach)
    save_local_db(db)
    return new_ach

def update_achievement(id_str, ach):
    client = get_db_client()
    update_data = {k: v for k, v in ach.items() if k not in ["_id", "id"]}
    
    if client:
        try:
            db = client.get_default_database()
            db.achievements.update_one({"_id": id_str}, {"$set": update_data})
            return {"success": True}
        except Exception as e:
            print("MongoDB error, updating in JSON:", e)
            
    db = get_local_db()
    db["achievements"] = [
        {**a, **ach} if a.get("id") == id_str else a for a in db["achievements"]
    ]
    save_local_db(db)
    return {"success": True}

def delete_achievement(id_str):
    client = get_db_client()
    if client:
        try:
            db = client.get_default_database()
            db.achievements.delete_one({"_id": id_str})
            return {"success": True}
        except Exception as e:
            print("MongoDB error, deleting from JSON:", e)
            
    db = get_local_db()
    db["achievements"] = [a for a in db["achievements"] if a.get("id") != id_str]
    save_local_db(db)
    return {"success": True}

# Media Slider
def get_media_slider():
    data = get_portfolio_data()
    return data.get("mediaSlider", [])

def add_media_slider_item(item):
    client = get_db_client()
    id_str = generate_random_id()
    new_item = {**item, "_id": id_str, "id": id_str}
    
    if client:
        try:
            db = client.get_default_database()
            db.mediaSlider.insert_one({**item, "_id": id_str})
            return new_item
        except Exception as e:
            print("MongoDB error, adding slider in JSON:", e)
            
    db = get_local_db()
    if "mediaSlider" not in db:
        db["mediaSlider"] = []
    db["mediaSlider"].append(new_item)
    save_local_db(db)
    return new_item

def update_media_slider_item(id_str, item):
    client = get_db_client()
    update_data = {k: v for k, v in item.items() if k not in ["_id", "id"]}
    
    if client:
        try:
            db = client.get_default_database()
            db.mediaSlider.update_one({"_id": id_str}, {"$set": update_data})
            return {"success": True}
        except Exception as e:
            print("MongoDB error, updating slider in JSON:", e)
            
    db = get_local_db()
    if "mediaSlider" not in db:
        db["mediaSlider"] = []
    db["mediaSlider"] = [
        {**m, **item} if m.get("id") == id_str else m for m in db["mediaSlider"]
    ]
    save_local_db(db)
    return {"success": True}

def delete_media_slider_item(id_str):
    client = get_db_client()
    
    url = ""
    current_slider = get_media_slider()
    found = next((m for m in current_slider if m.get("id") == id_str), None)
    if found:
        url = found.get("url", "")
        
    if url:
        # Delete from both public and out directories
        for base_dir in ["public", "out"]:
            file_path = os.path.join(os.getcwd(), base_dir, url.lstrip("/"))
            if os.path.exists(file_path) and os.path.isfile(file_path):
                try:
                    os.remove(file_path)
                except Exception as e:
                    print(f"Failed to delete file from {base_dir}:", e)
                
    if client:
        try:
            db = client.get_default_database()
            db.mediaSlider.delete_one({"_id": id_str})
            return {"success": True}
        except Exception as e:
            print("MongoDB error, deleting slider from JSON:", e)
            
    db = get_local_db()
    if "mediaSlider" not in db:
        db["mediaSlider"] = []
    db["mediaSlider"] = [m for m in db["mediaSlider"] if m.get("id") != id_str]
    save_local_db(db)
    return {"success": True}

# Media Uploads
def get_media():
    data = get_portfolio_data()
    return data.get("media", [])

def add_media(item):
    client = get_db_client()
    id_str = generate_random_id()
    new_item = {**item, "_id": id_str, "id": id_str}
    
    if client:
        try:
            db = client.get_default_database()
            db.media.insert_one({**item, "_id": id_str})
            return new_item
        except Exception as e:
            print("MongoDB error, adding media in JSON:", e)
            
    db = get_local_db()
    db["media"].append(new_item)
    save_local_db(db)
    return new_item

def delete_media(id_str):
    client = get_db_client()
    
    url = ""
    current_media = get_media()
    found = next((m for m in current_media if m.get("id") == id_str), None)
    if found:
        url = found.get("url", "")
        
    if url:
        # Delete from both public and out directories
        for base_dir in ["public", "out"]:
            file_path = os.path.join(os.getcwd(), base_dir, url.lstrip("/"))
            if os.path.exists(file_path) and os.path.isfile(file_path):
                try:
                    os.remove(file_path)
                except Exception as e:
                    print(f"Failed to delete file from {base_dir}:", e)
                
    if client:
        try:
            db = client.get_default_database()
            db.media.delete_one({"_id": id_str})
            return {"success": True}
        except Exception as e:
            print("MongoDB error, deleting media from JSON:", e)
            
    db = get_local_db()
    db["media"] = [m for m in db["media"] if m.get("id") != id_str]
    save_local_db(db)
    return {"success": True}

# ========================================================
# FLASK ROUTING ENDPOINTS
# ========================================================

@app.route("/api/admin/login", methods=["POST"])
def api_admin_login():
    try:
        body = request.get_json() or {}
        password = body.get("password")
        # Default fallback password is "M@toshree"
        admin_pass = os.environ.get("ADMIN_PASSWORD") or "M@toshree"
        if password == admin_pass:
            return jsonify({"success": True}), 200
        else:
            return jsonify({"success": False, "error": "Incorrect admin password"}), 401
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/portfolio", methods=["GET", "POST"])
def api_portfolio():
    if request.method == "GET":
        try:
            data = get_portfolio_data()
            return jsonify(data)
        except Exception as e:
            print("API Error (portfolio GET):", e)
            return jsonify({"error": "Failed to fetch portfolio data"}), 500
            
    elif request.method == "POST":
        try:
            body = request.get_json() or {}
            section = body.get("section")
            data = body.get("data")
            if not section or data is None:
                return jsonify({"error": "Missing section or data in request body"}), 400
                
            valid_sections = ["hero", "about", "experience", "education", "projects", "skills", "techBubbles"]
            if section not in valid_sections:
                return jsonify({"error": "Invalid section name"}), 400
                
            result = update_section(section, data)
            return jsonify(result)
        except Exception as e:
            print("API Error (portfolio POST):", e)
            return jsonify({"error": str(e)}), 500

@app.route("/api/certifications", methods=["GET", "POST"])
def api_certifications():
    if request.method == "GET":
        try:
            data = get_portfolio_data().get("certifications", [])
            return jsonify(data)
        except Exception as e:
            return jsonify({"error": "Failed to fetch certifications"}), 500
    elif request.method == "POST":
        try:
            cert = request.get_json() or {}
            if not cert.get("title") or not cert.get("issuer"):
                return jsonify({"error": "Title and Issuer are required"}), 400
            created = add_certification(cert)
            return jsonify(created)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@app.route("/api/certifications/<id_str>", methods=["PUT", "DELETE"])
def api_certification_id(id_str):
    if request.method == "PUT":
        try:
            cert = request.get_json() or {}
            result = update_certification(id_str, cert)
            return jsonify(result)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    elif request.method == "DELETE":
        try:
            result = delete_certification(id_str)
            return jsonify(result)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@app.route("/api/achievements", methods=["GET", "POST"])
def api_achievements():
    if request.method == "GET":
        try:
            data = get_portfolio_data().get("achievements", [])
            return jsonify(data)
        except Exception as e:
            return jsonify({"error": "Failed to fetch achievements"}), 500
    elif request.method == "POST":
        try:
            ach = request.get_json() or {}
            if not ach.get("title"):
                return jsonify({"error": "Title is required"}), 400
            created = add_achievement(ach)
            return jsonify(created)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@app.route("/api/achievements/<id_str>", methods=["PUT", "DELETE"])
def api_achievement_id(id_str):
    if request.method == "PUT":
        try:
            ach = request.get_json() or {}
            result = update_achievement(id_str, ach)
            return jsonify(result)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    elif request.method == "DELETE":
        try:
            result = delete_achievement(id_str)
            return jsonify(result)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@app.route("/api/media", methods=["GET", "DELETE"])
def api_media():
    if request.method == "GET":
        try:
            data = get_media()
            return jsonify(data)
        except Exception as e:
            return jsonify({"error": "Failed to fetch media assets"}), 500
    elif request.method == "DELETE":
        try:
            id_str = request.args.get("id")
            if not id_str:
                return jsonify({"error": "Missing media ID"}), 400
            result = delete_media(id_str)
            return jsonify(result)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@app.route("/api/media-slider", methods=["GET", "POST"])
def api_media_slider():
    if request.method == "GET":
        try:
            data = get_media_slider()
            return jsonify(data)
        except Exception as e:
            return jsonify({"error": "Failed to fetch media slider items"}), 500
    elif request.method == "POST":
        try:
            item = request.get_json() or {}
            if not item.get("url") or not item.get("title"):
                return jsonify({"error": "Title and Image URL are required"}), 400
            created = add_media_slider_item(item)
            return jsonify(created)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@app.route("/api/media-slider/<id_str>", methods=["PUT", "DELETE"])
def api_media_slider_id(id_str):
    if request.method == "PUT":
        try:
            item = request.get_json() or {}
            result = update_media_slider_item(id_str, item)
            return jsonify(result)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    elif request.method == "DELETE":
        try:
            result = delete_media_slider_item(id_str)
            return jsonify(result)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@app.route("/api/upload", methods=["POST"])
def api_upload():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400
        file = request.files["file"]
        is_resume = request.form.get("isResume") == "true"
        
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400
            
        original_name = file.filename
        clean_name = secure_filename(original_name).replace(" ", "_")
        
        file_bytes = file.read()
        file_size = len(file_bytes)
        content_type = file.content_type
        
        if is_resume and (content_type == "application/pdf" or original_name.lower().endswith(".pdf")):
            # Save directly to both public and out folders
            for base_dir in ["public", "out"]:
                target_dir = os.path.join(os.getcwd(), base_dir)
                os.makedirs(target_dir, exist_ok=True)
                resume_path = os.path.join(target_dir, "Bhushan_Resume.pdf")
                with open(resume_path, "wb") as f:
                    f.write(file_bytes)
                
            file_url = "/Bhushan_Resume.pdf"
            
            # Update database cvUrl in Hero
            portfolio = get_portfolio_data()
            hero = portfolio.get("hero") or {}
            hero["cvUrl"] = "/Bhushan_Resume.pdf"
            update_section("hero", hero)
            
            # Add to media list
            media_meta = {
                "name": "Bhushan_Resume.pdf (Resume)",
                "url": file_url,
                "type": content_type or "application/pdf",
                "size": file_size,
                "uploadedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            }
            saved = add_media(media_meta)
            return jsonify(saved)
            
        # Standard media upload
        timestamp = int(time.time() * 1000)
        filename = f"{timestamp}_{clean_name}"
        
        # Save directly to both public/uploads and out/uploads folders
        for base_dir in ["public", "out"]:
            target_dir = os.path.join(os.getcwd(), base_dir, "uploads")
            os.makedirs(target_dir, exist_ok=True)
            file_path = os.path.join(target_dir, filename)
            with open(file_path, "wb") as f:
                f.write(file_bytes)
            
        file_url = f"/uploads/{filename}"
        
        media_meta = {
            "name": original_name,
            "url": file_url,
            "type": content_type or "application/octet-stream",
            "size": file_size,
            "uploadedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        saved = add_media(media_meta)
        return jsonify(saved)
        
    except Exception as e:
        print("Upload error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/contact", methods=["POST"])
def api_contact():
    try:
        body = request.get_json() or {}
        name = str(body.get("name", "")).strip()
        email = str(body.get("email", "")).strip()
        message = str(body.get("message", "")).strip()
        
        if not name or not email or not message:
            return jsonify({"error": "All fields are required."}), 400
            
        email_pattern = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
        if not re.match(email_pattern, email):
            return jsonify({"error": "Please enter a valid email address."}), 400
            
        if not EMAIL_USER or not EMAIL_PASS:
            print("Email environment variables not configured. Skipping sending emails.")
            return jsonify({"success": True}), 201
            
        # 1. Email to Owner
        owner_msg = MIMEMultipart("alternative")
        owner_msg["From"] = EMAIL_USER
        owner_msg["To"] = EMAIL_USER
        owner_msg["Subject"] = f"New Portfolio Contact from {name}"
        owner_msg.add_header("reply-to", email)
        
        owner_html = f"""
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #0b0f19; padding: 50px 20px; color: #e2e8f0; text-align: center;">
          <div style="max-width: 600px; margin: 0 auto; background: #111827; border-radius: 16px; overflow: hidden; border: 1px solid #1f2937; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7); text-align: left;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); padding: 35px 30px; border-bottom: 1px solid #1f2937;">
              <div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #f472b6; text-transform: uppercase; margin-bottom: 5px;">Portfolio Notification</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">New Message Received</h1>
            </div>
            <div style="padding: 40px 30px;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #1f2937; color: #9ca3af; font-size: 14px; width: 100px;"><strong>Sender Name</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #1f2937; color: #ffffff; font-size: 15px; font-weight: 600;">{name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #1f2937; color: #9ca3af; font-size: 14px;"><strong>Email Address</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #1f2937; font-size: 15px; font-weight: 600;">
                    <a href="mailto:{email}" style="color: #60a5fa; text-decoration: none; border-bottom: 1px dashed #60a5fa;">{email}</a>
                  </td>
                </tr>
              </table>
              <div style="font-size: 12px; font-weight: 800; color: #f472b6; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px;">Message Details</div>
              <div style="background: #030712; border-left: 4px solid #7c3aed; padding: 25px; border-radius: 8px; color: #f3f4f6; font-size: 15px; line-height: 1.6; white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">{message}</div>
            </div>
            <div style="background: #090d16; padding: 20px 30px; text-align: center; color: #4b5563; font-size: 12px; border-top: 1px solid #1f2937;">
              This email was securely dispatched from your website contact form.
            </div>
          </div>
        </div>
        """
        owner_msg.attach(MIMEText(owner_html, "html"))
        
        # 2. Auto-reply to Visitor
        user_msg = MIMEMultipart("alternative")
        user_msg["From"] = EMAIL_USER
        user_msg["To"] = email
        user_msg["Subject"] = "Thank you for contacting me!"
        
        user_html = f"""
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #030712; padding: 50px 20px; color: #9ca3af; text-align: center;">
          <div style="max-width: 600px; margin: 0 auto; background: #0b0f19; border-radius: 16px; overflow: hidden; border: 1px solid #1f2937; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8); text-align: left;">
            <div style="background: linear-gradient(135deg, #1d4ed8 0%, #06b6d4 100%); padding: 40px 30px; text-align: left; border-bottom: 1px solid #1f2937;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Message Received!</h1>
              <p style="margin: 5px 0 0 0; color: #93c5fd; font-size: 14px; font-weight: 500;">Thank you for reaching out</p>
            </div>
            <div style="padding: 45px 35px; color: #cbd5e1;">
              <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">Hi <strong style="color: #ffffff; font-weight: 600;">{name}</strong>,</p>
              <p style="font-size: 15px; line-height: 1.6; color: #94a3b8;">I've successfully received your message from my portfolio contact form. I appreciate you taking the time to write, and I will review it as soon as possible!</p>
              <div style="margin: 35px 0; border: 1px solid #1f2937; border-radius: 12px; overflow: hidden; background: #030712;">
                <div style="background: #090d16; padding: 12px 20px; border-bottom: 1px solid #1f2937; color: #94a3b8; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
                  Your Submitted Message
                </div>
                <div style="padding: 25px; color: #e2e8f0; font-size: 14.5px; line-height: 1.6; font-style: italic; white-space: pre-wrap;">"{message}"</div>
              </div>
              <p style="font-size: 15px; line-height: 1.6; color: #94a3b8; margin-bottom: 40px;">I look forward to connecting with you soon.</p>
              <div style="border-top: 1px solid #1f2937; padding-top: 30px;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: -0.2px;">Bhushan Ingale</h3>
                <p style="margin: 3px 0 20px 0; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Full Stack Developer & AI Engineer</p>
                <table style="border-collapse: collapse;">
                  <tr>
                    <td style="padding-right: 12px;">
                      <a href="https://www.linkedin.com/in/bhushaningale27" style="display: inline-block; padding: 8px 16px; background: #1e293b; color: #38bdf8; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 13px; border: 1px solid #334155;">LinkedIn</a>
                    </td>
                    <td style="padding-right: 12px;">
                      <a href="https://github.com/2710-bhushan" style="display: inline-block; padding: 8px 16px; background: #1e293b; color: #e2e8f0; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 13px; border: 1px solid #334155;">GitHub</a>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div style="background: #030712; padding: 20px 35px; text-align: center; color: #4b5563; font-size: 12px; border-top: 1px solid #1f2937;">
              &copy; 2026 Bhushan Ingale. All rights reserved.
            </div>
          </div>
        </div>
        """
        user_msg.attach(MIMEText(user_html, "html"))
        
        # Connect to Gmail SMTP
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, EMAIL_USER, owner_msg.as_string())
        server.sendmail(EMAIL_USER, email, user_msg.as_string())
        server.quit()
        
        return jsonify({"success": True}), 201
    except Exception as e:
        print("Contact email error:", e)
        return jsonify({"error": "Unable to send message right now. Please try again."}), 500

# ========================================================
# STATIC FILES SERVING (Serve Next.js Static Export)
# ========================================================

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    # Ensure we don't intercept API routes
    if path.startswith("api/"):
        return jsonify({"error": "Not Found"}), 404

    out_dir = os.path.join(os.getcwd(), "out")

    # If path is empty, serve index.html
    if not path:
        return send_from_directory(out_dir, "index.html")

    # Serve direct file if exists
    file_path = os.path.join(out_dir, path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return send_from_directory(out_dir, path)

    # Handle Next.js trailingSlash structure: /admin/ -> out/admin/index.html
    # Also support clean URL /admin by normalizing trailing slash
    normalized_path = path.strip("/")
    admin_index = os.path.join(out_dir, normalized_path, "index.html")
    if os.path.exists(admin_index) and os.path.isfile(admin_index):
        return send_from_directory(os.path.join(out_dir, normalized_path), "index.html")

    # Try serving path as html file (e.g. /admin -> /admin.html)
    html_path = os.path.join(out_dir, normalized_path + ".html")
    if os.path.exists(html_path) and os.path.isfile(html_path):
        return send_from_directory(out_dir, normalized_path + ".html")

    # Fallback to serving main index.html for client-side routing
    return send_from_directory(out_dir, "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)
