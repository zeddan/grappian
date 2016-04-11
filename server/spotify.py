import requests
import json
base_url = 'https://api.spotify.com/v1'
username = ''
playlist = ''


def me(access_token):
    url = '%s/me' % base_url
    headers = {'Authorization': 'Bearer %s' % access_token}
    data = requests.get(url, headers=headers).json()
    global username
    username = data['id']
    return data


def create_playlist(access_token, name):
    url = '%s/users/%s/playlists' % (base_url, username)
    headers = {'Authorization': 'Bearer %s' % access_token,
               'Content-Type': 'application/json'}
    params = {'name': name}
    request_data = requests.post(url,
                                 headers=headers,
                                 data=json.dumps(params)).json()
    global playlist
    playlist = request_data['id']
    return request_data


def add_songs_to_playlist(access_token, user_id, playlist_id, track_list):
    url = '%s/users/%s/playlists/%s/tracks' % (base_url,
                                               username,
                                               playlist)
    headers = {'Authorization': 'Bearer %s' % access_token,
               'Content-Type': 'application/json'}
    return requests.post(url,
                         headers=headers,
                         data=json.dumps(track_list)).json()


def show_image(artist_id):
    print artist_id
    artist = ''
    for artistid in artist_id:
        artist = artistid['spotify']['artist']
    print artist
    url = '%s/artists/%s' % (base_url, artist)
    request_data = requests.get(url)
    print request_data['images']['url']
