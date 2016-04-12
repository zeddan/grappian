# -*- coding: utf-8 -*-
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


def get_recommendations(genre, target):
            url = '%s/recommendations' % (base_url)
            headers = {'Authorization': 'Bearer BQCulDQt416BX2Cgj30JivGJ5MaHWgPj0FfXj_4zpcozy2MxnWaoCIP9kMAaxkNIIA-Ly_QaUMkwC1aEaJSi7tND16PtZ1BJeAeJ6qCJuux3lyzYUfzvRiH7WHahT0Jzqlr_NnCQRM4EQw1JOUs'}
            params = {'seed_genres': genre,
                      'target': target}
            return requests.get(url, headers=headers, params=params).json()


def get_artist_image(artist_id):
    url = '%s/artists' % (base_url)
    params = {'ids': artist_id}
    return requests.get(url, params=params).json()
