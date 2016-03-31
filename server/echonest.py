import requests


url = 'http://developer.echonest.com/api/v4/playlist/static'
api_key = 'WJWBYGLVXEXJHQXOH'

casual_params = {
    'api_key': api_key,
    'type': 'artist-description',
    'bucket': ['tracks', 'id:spotify'],
    'limit': 'true'
}


def get_casual(genre, mood):
    casual_params['style'] = genre
    casual_params['mood'] = mood
    response = requests.get(url, params=casual_params).json()
    return parse(response)


def parse(response):
    data = {}
    i = 0
    for artist in response[u'response'][u'songs']:
        i = i+1
        key = 'artist' + str(i)
        new_dict = {}
        new_dict['artist_name'] = artist[u'artist_name']
        new_dict['song_title'] = artist[u'title']
        for artistid in artist[u'artist_foreign_ids']:
            new_dict['artist_id'] = artistid[u'foreign_id']
        for songid in artist[u'tracks']:
            new_dict['song_id'] = songid[u'foreign_id']
        data.update({key: new_dict})
    return data


def test_print(response):
    '''
    This a method for testing. Should be deleted after sprint 2
    '''
    print response

test_print(get_casual('ambient dub', 'sad'))
