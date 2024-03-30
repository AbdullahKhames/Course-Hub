#!/usr/bin/python3
"""module for email dealing utils"""
from course_hub import client
from mailtrap import Mail, Address


def send_email_token(subject, html_message, email, name, token):
    """send email for activation and reset tokens"""
    # msg = Message('Welcome To Course Hub WebSite', sender = 'admin@techiocean.tech', recipients = [new_user.email])
    # msg.html = generate_html_email(new_user.name, new_user.activation_token)
    # mail.send(msg)
    try:
        mail = Mail(
            sender=Address(email="admin@techiocean.tech", name="techiocean.tech"),
            to=[Address(email=email)],
            subject=subject,
            text=subject,
            html=generate_html_email(html_message, name, token)
        )
        res = client.send(mail=mail)
        print(res)
        return res.get('success')
    except Exception as ex:
        return False


def generate_html_email(html_message, name, activation_code):
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Course Hub</title>
    <style>
      body {{
        font-family: Arial, sans-serif;
        background-color: #f0f0f0;
        margin: 0;
        padding: 0;
      }}
      .container {{
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }}
      h1 {{
        color: #333;
        text-align: center;
      }}
      p {{
        color: #666;
        line-height: 1.6;
      }}
      .activation-code {{
        text-align: center;
        font-size: 20px;
        color: #007bff;
        margin-top: 20px;
        margin-bottom: 20px;
      }}
    </style>
    </head>
    <body>
      <div class="container">
        <h1>Hello there {name} !</h1>
        {html_message}
        <p class="activation-code">{activation_code}</p>
      </div>
    </body>
    </html>
    """
    return html_content
