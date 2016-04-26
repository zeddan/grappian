import requests
import json
# danceability=0.3,tempo=140,valance=0.8


def get_recommendations(genre, target):
    url = 'https://api.spotify.com/v1/recommendations'
    headers = {'Authorization': 'Bearer BQD3ah5AStIFEy18_SF1rGxDMbuNMd3Ujl29-CtANTGhthAxuiBQsbfODtxiruixP_oVM284p_GXPEJh5yE3IUi9eRW7DvGRwWHB11d_fOu9Ya4-GrnZ6nWzJxIBL2UtbS50M4zS9DageQ7xR4M'}
    params = {'seed_genres': genre,
              'target': target,
              'limit': '5'}
    print requests.get(url, headers=headers, params=params).json()


def get_recommendations2(genre, target):
            url = 'https://api.spotify.com/v1/recommendations'
            headers = {'Authorization': 'Bearer BQCKrMaMDZb2cRHdD-UX92FGb9qYM1zcQ1cDzWSE8LNkp2juzMiVvXOP2E4TjnJJQqBFVj5jd3a6zid8lTI_ziRiWHrjyWFXxFOXvqDdwdBOWRRfSbqYNnMcAIZlCLdPq3Wz8DPX_eQqcETRELs'}
            params = {'seed_genres': genre,
                      'target': target,
                      'limit': '30'}
            response = requests.get(url, headers=headers, params=params).json()
#            print response.keys()
#            print response[u'tracks'][0].keys()
            data = []
            count = 0
            for track in response[u'tracks']:
                new_dict = {}
                for artist in track[u'artists']:
                    new_dict['artist_name'] = artist[u'name']
                    new_dict['artist_id'] = artist[u'id']
                    artist_image = requests.get(artist[u'href']).json()
                    new_dict['artist_image'] = artist_image['images'][1]['url']
#                    new_dict['artist_image'] = artist[u'href']
                new_dict['song_id'] = track[u'id']
                new_dict['preview_url'] = track['preview_url']
                data.append(new_dict)
                count = count+1
            print data
            print count


target = {'danceability': '0.3',
          'tempo': '120',
          'valance': '0.5'
          }
get_recommendations2('rock', target)
