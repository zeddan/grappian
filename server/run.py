import authorize as auth
import spotify
import echonest
from time import time
from bottle import route, run, request, response, static_file, \
                   redirect, hook


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


@route('/static/<path:re:.+>')
def static(path):
    return static_file(path, root='../public/static')


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
    redirect('/me')


@route('/api/casual')
def casual():
    genre = request.query.genre
    mood = request.query.mood
    return echonest.get_casual(genre, mood)


@route('/me')
def me():
    access_token = update_access_token(request)
    return spotify.me(access_token)


@route('/create-playlist')
def create_playlist():
    access_token = update_access_token(request)
    playlistname = request.query.playlistname
    return spotify.create_playlist(access_token, playlistname)


@route('/add-songs')
def add_songs():
    echo_object = echonest.get_casual('rock', 'happy')
    songs = []
    artist = []
    for songid in echo_object:
        songs.append(songid['song_id'])
    song_list = {"uris": songs}
    for artistid in echo_object:
        artist.append(artistid['artist_id'])
    spotify.show_image(artist)
    access_token = update_access_token(request)
    return spotify.add_songs_to_playlist(access_token, song_list)


@route('/<url:re:.+>')
def catch_all(url):
    return static_file('index.html', root='../public/app')


@route('/')
def root():
    return static_file('index.html', root='../public/app')
run(host='0.0.0.0', port=8080, debug=True, reloader=True)
