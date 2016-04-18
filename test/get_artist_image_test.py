import requests
import json


def get_artist_image(artist_id):
    url = 'https://api.spotify.com/v1/artists'
    params = {'ids': artist_id}
    return requests.get(url, params=params).json()


print get_artist_image(['0oSGxfWSnnOXhD2fKuz2Gy', '0OdUWJ0sBjDrqHygGUXeCF'])
