from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField,ValidationError
from wtforms.validators import DataRequired, URL,EqualTo,InputRequired
from flask_ckeditor import CKEditorField

 
##WTForm
class CreatePostForm(FlaskForm):
    title = StringField("Blog Post Title", validators=[DataRequired()])
    subtitle = StringField("Subtitle", validators=[DataRequired()])
    img_url = StringField("Blog Image URL", validators=[DataRequired(), URL()])
    body = CKEditorField("Blog Content", validators=[DataRequired()])
    submit = SubmitField("Submit Post")

##RegisterUsers
class CreateUserForm(FlaskForm):
    def checkemail(form,field):
        if "@" not in field.data or ".com" not in field.data:
            raise ValidationError(message="Please enter a URL")

    email=StringField("Email", validators=[DataRequired(),checkemail])
    password = PasswordField("Password", validators=[InputRequired(),EqualTo("repeat_password",message="Passwords must match")])
    repeat_password = PasswordField("Repeat password", validators=[InputRequired()])
    name = StringField("Name", validators=[DataRequired()])
    submit = SubmitField("Submit")

##Login User
class CreateLoginForm(FlaskForm):
    def checkemail(form,field):
        if "@" not in field.data or ".com" not in field.data:
            raise ValidationError(message="Please enter a URL")

    email=StringField("Email", validators=[DataRequired(),checkemail])
    password = PasswordField("Password", validators=[InputRequired()])
    submit = SubmitField("Submit")

##Input comments
class CreateComments(FlaskForm):
    title = StringField("Comments title", validators=[DataRequired()])
    body = CKEditorField("Comments Content", validators=[DataRequired()])
    submit = SubmitField("Submit")
