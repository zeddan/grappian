import authorize as auth
import spotify
from bottle import route, run, request, response, static_file, \
                   redirect, hook


@hook('before_request')
def strip_path():
    request.environ['PATH_INFO'] = request.environ['PATH_INFO'].rstrip('/')


@route('/static/css/<filename>')
def static_css(filename):
    return static_file(filename, root='./static/css')


@route('/static/js/<filename>')
def static_js(filename):
    return static_file(filename, root='./static/js')


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
                        path='/')
    redirect('/me')


@route('/me')
def me():
    access_token = request.get_cookie('access_token')
    refresh_token = request.get_cookie('refresh_token')
    if access_token:
        token = access_token
    elif refresh_token:
        # code to get new access token
        pass
    else:
        token = 'undefined'
    return spotify.me(token)


@route('/')
def root():
    return static_file('index.html', root='./static')


run(host='0.0.0.0', port=8080, debug=True, reloader=True)
