import requests


url = 'http://developer.echonest.com/api/v4/playlist/static'
api_key = 'WJWBYGLVXEXJHQXOH'

casual_params = {
    'api_key': api_key,
    'type': 'artist-description',
    'bucket': ['tracks', 'id:spotify']
}


def get_casual(genre, mood):
    casual_params['style'] = genre
    casual_params['mood'] = mood
    response = requests.get(url, params=casual_params).json()
    return response


def parse(response):
    data = {}
    return data


def test_print(response):
    '''
    This a method for testing. Should be deleted after sprint 2
    '''
    print response

test_print(get_casual('ambient dub', 'sad'))
