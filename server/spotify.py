import requests


def me(access_token):
    url = 'https://api.spotify.com/v1/me'
    headers = {'Authorization': 'Bearer %s' % access_token}
    return requests.get(url, headers=headers).json()
