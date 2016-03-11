from bottle import route, run, request, template, static_file


@route('/static/css/<filename>')
def static_css(filename):
    return static_file(filename, root='./static/css')


@route('/static/js/<filename>')
def static_js(filename):
    return static_file(filename, root='./static/js')


@route('/')
def root():
    return "hey hey hey"


run(host='0.0.0.0', port=8080, debug=True, reloader=True)
