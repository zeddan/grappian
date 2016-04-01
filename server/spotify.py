import requests
import json


def me(access_token):
    url = 'https://api.spotify.com/v1/me'
    headers = {'Authorization': 'Bearer %s' % access_token}
    return requests.get(url, headers=headers).json()


def create_playlist(access_token, name):
    url = 'https://api.spotify.com/v1/users/ajsbrejker/playlists'
    headers = {'Authorization': 'Bearer %s' % access_token,
               'Content-Type': 'application/json'}
    params = {'name': name}
    return requests.post(url, headers=headers, data=json.dumps(params)).json()
