from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

async def send_reset_email(to_email: str, reset_token: str, user_name: str = ""):
    """
    Envoie un email de réinitialisation de mot de passe
    """
    
    # Configuration SMTP (exemple avec Gmail)
    SMTP_HOST = settings.SMTP_HOST or "smtp.gmail.com"
    SMTP_PORT = settings.SMTP_PORT or 587
    SMTP_USER = settings.SMTP_USER  # ton email
    SMTP_PASSWORD = settings.SMTP_PASSWORD  # mot de passe d'application
    
    # URL frontend
    FRONTEND_URL = settings.FRONTEND_URL or "http://localhost:5173"
    reset_link = f"{FRONTEND_URL}/reset-password?token={reset_token}"
    
    # Corps HTML de l'email
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Réinitialisation de mot de passe</title>
        <style>
            body {{ font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }}
            .container {{ max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
            .header {{ background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 30px; text-align: center; }}
            .header h1 {{ color: white; margin: 0; font-size: 22px; }}
            .content {{ padding: 30px; }}
            .content p {{ color: #4b5563; line-height: 1.6; font-size: 14px; }}
            .button {{ display: inline-block; background: #2563eb; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }}
            .button:hover {{ background: #1d4ed8; }}
            .footer {{ background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; }}
            .warning {{ background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; border-radius: 4px; font-size: 13px; color: #92400e; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 SEO Insights</h1>
            </div>
            <div class="content">
                <p>Bonjour <strong>{user_name or 'Utilisateur'}</strong>,</p>
                <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
                
                <div style="text-align: center;">
                    <a href="{reset_link}" class="button">Réinitialiser mon mot de passe</a>
                </div>
                
                <div class="warning">
                    ⚠️ Ce lien est valable pendant <strong>1 heure</strong> et ne peut être utilisé qu'une seule fois.
                </div>
                
                <p>Si vous n'avez pas fait cette demande, ignorez simplement cet email. Votre mot de passe reste sécurisé.</p>
                
                <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">
                    Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
                    <span style="word-break: break-all;">{reset_link}</span>
                </p>
            </div>
            <div class="footer">
                <p>© {datetime.now().year} SEO Insights — Tous droits réservés</p>
                <p>Tunis, Tunisia</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Version texte simple
    text_content = f"""
    SEO Insights — Réinitialisation de mot de passe
    
    Bonjour,
    
    Vous avez demandé la réinitialisation de votre mot de passe.
    
    Cliquez sur ce lien : {reset_link}
    
    Ce lien est valable pendant 1 heure.
    
    Si vous n'avez pas fait cette demande, ignorez cet email.
    """
    
    # Création du message
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "🔐 Réinitialisation de votre mot de passe — SEO Insights"
    msg["From"] = f"SEO Insights <{SMTP_USER}>"
    msg["To"] = to_email
    
    msg.attach(MIMEText(text_content, "plain"))
    msg.attach(MIMEText(html_content, "html"))
    
    # Envoi
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"❌ Erreur envoi email: {e}")
        return False