import requests
from base64 import encodestring
from requests_oauthlib import OAuth2Session


client_id = '02aafc3c13da482f9b44676b065792fd'
client_secret = '169817bde569498c8aba668836376a35'
redirect_uri = 'http://localhost:8080/authorize/callback'
oauth = OAuth2Session(client_id, redirect_uri=redirect_uri)


def get_url():
    auth_base_url = 'https://accounts.spotify.com/authorize'
    auth_url, state = oauth.authorization_url(auth_base_url)
    return auth_url


def get_token(auth_code):
    token_base_url = 'https://accounts.spotify.com/api/token'
    auth_string = encodestring('%s:%s' % (client_id, client_secret)).replace('\n', '') 
    headers = {'Authorization': 'Basic %s' % auth_string}
    token_kwargs = {'grant_type': 'authorization_code'}
    token = oauth.fetch_token(
            token_url=token_base_url,
            code=auth_code,
            headers=headers,
            kwargs=token_kwargs)
    return token


def refresh_token(token):
    url = 'https://accounts.spotify.com/api/token'
    auth_string = encodestring('%s:%s' % (client_id, client_secret)).replace('\n', '')
    params = {'grant_type': 'refresh_token', 'refresh_token': token}
    headers = {'Authorization': 'Basic %s' % auth_string}
    data = requests.post(url, data=params, headers=headers).json()
    access_token = data['access_token']
    expires_in = data['expires_in']
    return access_token, expires_in

