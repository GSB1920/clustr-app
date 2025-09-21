import requests
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from flask import current_app
import json

class GoogleOAuth:
    @staticmethod
    def verify_google_token(token):
        """
        Verify Google ID token and return user info
        """
        try:
            # Try both client IDs (web and android)
            valid_client_ids = [
                current_app.config['GOOGLE_CLIENT_ID_WEB'],
                current_app.config['GOOGLE_CLIENT_ID_ANDROID']
            ]
            
            # Verify the token with Google
            idinfo = id_token.verify_oauth2_token(
                token, 
                google_requests.Request(), 
                audience=valid_client_ids  # Accept both client IDs
            )
            
            # Check if token is from correct issuer
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')
            
            # Extract user information
            user_info = {
                'google_id': idinfo['sub'],
                'email': idinfo['email'],
                'name': idinfo.get('name', ''),
                'first_name': idinfo.get('given_name', ''),
                'last_name': idinfo.get('family_name', ''),
                'picture': idinfo.get('picture', ''),
                'email_verified': idinfo.get('email_verified', False)
            }
            
            return user_info
            
        except ValueError as e:
            print(f"Google token verification failed: {str(e)}")
            return None
        except Exception as e:
            print(f"Google OAuth error: {str(e)}")
            return None
    
    @staticmethod
    def get_user_info_from_token(access_token):
        """
        Get user info from Google using access token
        Alternative method if ID token verification doesn't work
        """
        try:
            response = requests.get(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                headers={'Authorization': f'Bearer {access_token}'}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Google API error: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"Google user info error: {str(e)}")
            return None
