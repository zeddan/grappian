import requests
import json
base_url = 'https://api.spotify.com/v1'


def me(access_token):
    url = '%s/me' % base_url
    headers = {'Authorization': 'Bearer %s' % access_token}
    data = requests.get(url, headers=headers).json()
    return data


def create_playlist(access_token, user_id, playlist_name):
    url = '%s/users/%s/playlists' % (base_url, user_id)
    headers = {'Authorization': 'Bearer %s' % access_token,
               'Content-Type': 'application/json'}
    params = {'name': playlist_name}
    request_data = requests.post(url,
                                 headers=headers,
                                 data=json.dumps(params)).json()
    playlist_id = request_data['id']
    playlist_link = request_data['external_urls']['spotify']
    return playlist_id, playlist_link


def add_tracks(access_token, user_id, playlist_id, tracks):
    url = '%s/users/%s/playlists/%s/tracks' % (base_url,
                                               user_id,
                                               playlist_id)
    headers = {'Authorization': 'Bearer %s' % access_token,
               'Content-Type': 'application/json'}
    status_code = requests.post(url,
                                headers=headers,
                                data=json.dumps(tracks)).status_code
    return status_code
