import requests
import json
base_url = 'https://api.spotify.com/v1/artists'

'''
def get_artist_image(artist_id):
    url = 'https://api.spotify.com/v1/artists'
    params = {'ids': artist_id}
    return requests.get(url, params=params).json()
'''


def get_artist_image(artist_id):
    url = '%s/artists' % (base_url)
    params = {'ids': artist_id}
    print artist_id
    response = requests.get(url, params=params).json()
    data = []
    print response.keys()
    print response
    for artist in response:
        new_dict = {}
        new_dict['artist_id'] = artist[u'id']
        new_dict['artist_image'] = artist[u'images'][1][u'url']
        new_dict['artist_name'] = artist[u'name']
        data.append(new_dict)
    print data

print get_artist_image(['0oSGxfWSnnOXhD2fKuz2Gy', '2VAvhf61GgLYmC6C8anyX1'])
