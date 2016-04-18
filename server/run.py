import authorize as auth
import json
import spotify
import echonest
from time import time
from bottle import route, run, request, response, static_file, \
                   redirect, hook, abort

# :)

def update_access_token(request):
    access_token = request.get_cookie('access_token')
    refresh_token = request.get_cookie('refresh_token')
    if access_token:
        pass
    elif refresh_token:
        access_token, expires_in = auth.refresh_token(refresh_token)
        response.set_cookie('access_token',
                            access_token,
                            max_age=expires_in,
                            path='/')
    else:
        redirect('/authorize')
    return access_token


@hook('before_request')
def strip_path():
    request.environ['PATH_INFO'] = request.environ['PATH_INFO'].rstrip('/')


@hook('after_request')
def enable_cors():
    response.headers['Access-Control-Allow-Origin'] = '*'


@route('/public/<path:re:.+>')
def static(path):
    return static_file(path, root='../public')


@route('/authorize')
def authorize():
    redirect(auth.get_url())


@route('/authorize/callback')
def authorize_callback():
    data = auth.get_token(request.query.code)
    response.set_cookie('access_token',
                        data['access_token'],
                        max_age=data['expires_in'],
                        path='/')
    response.set_cookie('refresh_token',
                        data['refresh_token'],
                        expires=time()*2,
                        path='/')
    redirect('http://localhost:8000/#/modes')


@route('/api/casual')
def casual():
    genre = request.query.genre
    mood = request.query.mood
    return json.dumps(echonest.get_casual(genre, mood))


@route('/me')
def me():
    access_token = update_access_token(request)
    return spotify.me(access_token)


@route('/api/create-playlist', method="POST")
def create_playlist():
    if request.headers.get('Content-Type') != "application/json":
        abort(400, "Bad request")
    user_id = requests.params.get("user_id")
    p_name = requests.params.get("name")
    tracks = requests.params.get("tracks")
    access_token = update_access_token(request)
    p_id, p_link = spotify.create_playlist(access_token, user_id, p_name)
    status_code = spotify.add_tracks(access_token, user_id, p_id, tracks)
    if status_code == 201:
        return playlist_link
    elif status_code == 403:
        abort(403, "Unauthorized")


@route('/<url:re:.+>')
def catch_all(url):
    return static_file('index.html', root='../app')


@route('/')
def root():
    return static_file('index.html', root='../app')


run(host='0.0.0.0', port=8080, debug=True, reloader=True)
