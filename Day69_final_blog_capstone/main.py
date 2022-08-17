from flask import Flask, render_template, redirect, url_for,flash,request,abort
from flask_bootstrap import Bootstrap
from flask_ckeditor import CKEditor
from datetime import date
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from flask_login import UserMixin, login_user, LoginManager, login_required, current_user, logout_user
from forms import CreateComments, CreatePostForm,CreateUserForm,CreateLoginForm
from flask_gravatar import Gravatar
from urllib.parse import urlparse, urljoin
import dotenv
import os

app = Flask(__name__)
keys=dotenv.load_dotenv("keys.env")
app.config['SECRET_KEY'] = os.getenv("secret_key")
ckeditor = CKEditor(app)
login_manager=LoginManager(app)
Bootstrap(app)

##Initialise Gravatar
gravatar = Gravatar(app,
                    size=100,
                    rating='x',
                    default='retro',
                    force_default=False,
                    force_lower=False,
                    use_ssl=False,
                    base_url=None)

##CONNECT TO DB
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

##CONFIGURE TABLES

class User(UserMixin,db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email=db.Column(db.String(250), nullable=False)
    name=db.Column(db.String(250), nullable=False)
    password=db.Column(db.String(250), nullable=False)
    postchild=relationship('BlogPost', back_populates="postparent") #creating relationship between User (parent) and child
    commentuserchild=relationship('Comments',back_populates="commentuserparent")
    #back populate creates bidirectional relationship
# db.create_all()

class BlogPost(db.Model):
    __tablename__ = "blog_posts"
    id = db.Column(db.Integer, primary_key=True)
    parent_id=db.Column(db.Integer, db.ForeignKey('users.id')) #new column for parent_id 
    title = db.Column(db.String(250), unique=True, nullable=False)
    subtitle = db.Column(db.String(250), nullable=False)
    date = db.Column(db.String(250), nullable=False)
    body = db.Column(db.Text, nullable=False)
    img_url = db.Column(db.String(250), nullable=False)
    postparent=relationship('User',back_populates="postchild") #create bidiretional relationship
    commentpostchild=relationship('Comments',back_populates="commentpostparent")
# db.create_all()

class Comments(db.Model):
    __tablename__="comments"
    id=db.Column(db.Integer, primary_key=True)
    user_id=db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id=db.Column(db.Integer, db.ForeignKey('blog_posts.id'))
    title=db.Column(db.String(250), nullable=False)
    data=db.Column(db.String(1000), nullable=False)
    commentuserparent=relationship('User',back_populates="commentuserchild")
    commentpostparent=relationship('BlogPost', back_populates="commentpostchild")
# db.create_all()

def is_safe_url(target):
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and \
           ref_url.netloc == test_url.netloc

def admin_only(function):
    def check_admin():
        if current_user.id==1:
            return function()
        else:
            error="You are unauthorised."
            return error,401
    return check_admin

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

@app.route('/')
def get_all_posts():
    posts = BlogPost.query.all()
    return render_template("index.html", all_posts=posts,current_user=current_user)

@app.route('/register',methods=["GET","POST"])
def register():
    register_form=CreateUserForm()
    if register_form.validate_on_submit():
        login_info=request.form
        password_hashed=generate_password_hash(password=login_info.get("password"),method="pbkdf2:sha256",salt_length=8)
        login_obj=User(
            name=login_info.get("name"),
            email=login_info.get("email"),
            password=password_hashed
        )
        data_base_info=User.query.filter_by(email=login_info.get("email")).first() #query email to check for entry
        if data_base_info:
            #refer to register.html to see how flash is rendered
            flash("You are already registered in the database. Please log in") 
        else:
            db.session.add(login_obj)
            db.session.commit()
            return redirect(url_for('get_all_posts'))

    return render_template("register.html",form=register_form,current_user=current_user)

@app.route('/login',methods=["GET","POST"])
def login():
    login_form=CreateLoginForm()
    if login_form.validate_on_submit():
        login_info=request.form
        data_base_info=User.query.filter_by(email=login_info.get("email")).first()
        if data_base_info:
            if check_password_hash(data_base_info.password,login_info.get("password")):
                login_user(data_base_info)
                next = request.args.get('next')
                # is_safe_url should check if the url is safe for redirects.
                if not is_safe_url(next):
                    return abort(400)
                return redirect(url_for("get_all_posts"))

            else:
                flash("You have entered the wrong username/password, please try again")
        else:
            flash("You have not registered in the data base. Please register.")
                
    return render_template("login.html",form=login_form,current_user=current_user)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('get_all_posts'))

@app.route("/post/<int:post_id>",methods=["GET","POST"])
def show_post(post_id):
    all_comments=Comments.query.filter_by(post_id=post_id).all()
    requested_post = BlogPost.query.get(post_id)
    comment_form=CreateComments()
    if comment_form.validate_on_submit():
        comment_obj=Comments(
            data=comment_form.body.data,
            title=comment_form.title.data,
            post_id=post_id,
            user_id=current_user.id
        )
        db.session.add(comment_obj)
        db.session.commit()
        return redirect(url_for("show_post",post_id=post_id,post=requested_post,current_user=current_user,form=comment_form,comments=all_comments))
    return render_template("post.html", post=requested_post,current_user=current_user,form=comment_form,comments=all_comments)

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/new-post",methods=["GET","POST"],endpoint="add_new_post") #important to add function endpoint to use same wrapper
@login_required
@admin_only
def add_new_post():
    form = CreatePostForm()
    if form.validate_on_submit():
        new_post = BlogPost(
            title=form.title.data,
            subtitle=form.subtitle.data,
            body=form.body.data,
            img_url=form.img_url.data,
            parent_id=current_user.id,
            date=str(date.today().strftime("%B %d, %Y"))
        )
        db.session.add(new_post)
        db.session.commit()
        return redirect(url_for("get_all_posts"))

    return render_template("make-post.html", form=form,current_user=current_user)

@app.route("/edit-post/<int:post_id>",endpoint="edit_post") #important to add function endpoint to use same wrapper
@login_required
@admin_only
def edit_post(post_id):
    post = BlogPost.query.get(post_id)
    edit_form = CreatePostForm(
        title=post.title,
        subtitle=post.subtitle,
        img_url=post.img_url,
        author=post.author,
        body=post.body
    )
    if edit_form.validate_on_submit():
        post.title = edit_form.title.data
        post.subtitle = edit_form.subtitle.data
        post.img_url = edit_form.img_url.data
        post.author = edit_form.author.data
        post.body = edit_form.body.data
        db.session.commit()
        return redirect(url_for("show_post", post_id=post.id,current_user=current_user))

    return render_template("make-post.html", form=edit_form,current_user=current_user)

@app.route("/delete/<int:post_id>",endpoint="delete_post")
def delete_post(post_id):
    post_to_delete = BlogPost.query.get(post_id)
    db.session.delete(post_to_delete)
    db.session.commit()
    return redirect(url_for('get_all_posts'))

if __name__ == "__main__":
    app.run(debug=True)
