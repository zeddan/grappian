import requests
import json


def me(access_token):
    url = 'https://api.spotify.com/v1/me'
    headers = {'Authorization': 'Bearer %s' % access_token}
    return requests.get(url, headers=headers).json()


def create_playlist(access_token, name):
    """Change what is in the brackets to fit your account"""
    url = 'https://api.spotify.com/v1/users/emilh4xx/playlists'
    headers = {'Authorization': 'Bearer %s' % access_token,
               'Content-Type': 'application/json'}
    params = {'name': name}
    return requests.post(url, headers=headers, data=json.dumps(params)).json()


def add_songs_to_playlist(access_token, user_id, playlist_id, track_list):
    """Fix what is in the brackets to fit your account and playlist"""
    base_url = 'https://api.spotify.com/v1/users'
    purpose_url = '/%s/playlists/%s/tracks' % (user_id, playlist_id)
    headers = {'Authorization': 'Bearer %s' % access_token,
               'Content-Type': 'application/json'}
    return requests.post(base_url + purpose_url, headers=headers, data=json.dumps(track_list)).json()
