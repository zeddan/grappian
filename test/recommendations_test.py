import requests
import json
# danceability=0.3,tempo=140,valance=0.8

def get_recommendations(genre, target):
    url = 'https://api.spotify.com/v1/recommendations'
    headers = {'Authorization': 'Bearer BQCulDQt416BX2Cgj30JivGJ5MaHWgPj0FfXj_4zpcozy2MxnWaoCIP9kMAaxkNIIA-Ly_QaUMkwC1aEaJSi7tND16PtZ1BJeAeJ6qCJuux3lyzYUfzvRiH7WHahT0Jzqlr_NnCQRM4EQw1JOUs'}
    params = {'seed_genres': genre,
              'target': target,
              'limit': '5'}
    print requests.get(url, headers=headers, params=params).json()

target = {'danceability': '0.3',
          'tempo': '120',
          'valance': '0.5'
          }
get_recommendations('rock', target)
