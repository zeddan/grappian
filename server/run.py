import base64
import authorize as auth
import json
import spotify
from time import time
from datetime import date
from bottle import route, run, request, response, static_file, \
                   redirect, hook, abort


def update_access_token(request):
    access_token = None
    refresh_token = None
    if request.method == 'GET':
        access_token = request.query.get('access_token')
        refresh_token = request.query.get('refresh_token')
    elif request.method == 'POST':
        access_token = request.json.get('access_token')
        refresh_token = request.json.get('refresh_token')
    if access_token:
        pass
    elif refresh_token:
        access_token, expires_in = auth.refresh_token(refresh_token)
        response.set_cookie('access_token',
                            access_token,
                            max_age=expires_in,
                            path='/')
    else:
        redirect('http://localhost:8080/authorize')
    return access_token


def decode_base64(data):
    missing_padding = 4 - len(data) % 4
    if missing_padding:
        data += b'=' * missing_padding
    return base64.b64decode(data)


@hook('before_request')
def strip_path():
    request.environ['PATH_INFO'] = request.environ['PATH_INFO'].rstrip('/')


@hook('after_request')
def after_req():
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:8000'
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Vary'] = 'Accept-Encoding, Origin'


@route('/public/<path:re:.+>')
def static(path):
    return static_file(path, root='../public')


@route('/<:re:.*>', method='OPTIONS')
def enableCORSGenericRoute():
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:8000'
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Vary'] = 'Accept-Encoding, Origin'


@route('/authorize')
def authorize():
    redirect(auth.get_url())


@route('/authorize/callback')
def authorize_callback():
    data = auth.get_token(request.query.code)
    response.set_cookie('access_token',
                        data['access_token'],
                        max_age=data['expires_in'],
                        domain='localhost',
                        path='/')
    response.set_cookie('refresh_token',
                        data['refresh_token'],
                        expires=time()*2,
                        domain='localhost',
                        path='/')
    user_data = spotify.me(data['access_token'])
    user = base64.b64encode(user_data[u'id'].encode('utf-8'))
    response.set_cookie('username',
                        user,
                        expires=time()*2,
                        domain='localhost',
                        path='/')
    redirect('http://localhost:8000/#/modes')


@route('/api/getrecommendations', method="POST")
def get_recommendations():
    genre = request.json.get('genre')
    target = request.json.get('target')
    tracks = request.json.get('tracks')
    access_token = update_access_token(request)
    res = None
    if tracks:
        res = spotify.get_rec_from_tracks(access_token, tracks)
    else:
        res = spotify.get_recommendations(access_token, genre, target)
    return json.dumps(res)


@route('/me')
def me():
    access_token = update_access_token(request)
    return spotify.me(access_token)


@route('/api/create-playlist', method='POST')
def create_playlist():
    user_id = decode_base64(request.json.get('user_id')).decode('utf-8')
    p_name = request.json.get('name')
    tracks = request.json.get('tracks')
    access_token = update_access_token(request)
    p_id, p_link = spotify.create_playlist(access_token, user_id, p_name)
    status_code = spotify.add_tracks(access_token, user_id, p_id, tracks)
    if status_code == 201:
        return p_link
    elif status_code == 403:
        abort(403, "Unauthorized")
    return "neither 201 nor 403... hmmmm...."


#run(host='0.0.0.0', port=8080, debug=True, reloader=True)
run(host='0.0.0.0', port=8080, server='tornado')
