var express = require( 'express' ),
	compress = require( 'compression' ),
	fs = require( 'fs' ),
	serveStatic = require( 'serve-static' ),
	url = require( 'url' );

var app = express();

function redirect ( destination, excludeQueryString ) {
	return function ( req, res, next ) {
		var query = url.parse( req.url ).query;
		res.redirect( 301, destination + ( !excludeQueryString && query ? '?' + query : '' ) );
	}
}

function fourOhFour ( ) {
	var file = fs.readFileSync( __dirname +'/build/404.html', 'utf8' );
	return function ( req, res, next ) {
		res.status( 404 ).send( file );
	}
}

function setHeaders ( res, path ) {
	if ( path.match( /\.(gif|png|jpe?g)$/i ) ) {
		res.setHeader( 'Cache-Control', 'public, max-age=7200' );
	}
	else if ( path.match( /\.(css|js)$/i ) ) {
		res.setHeader( 'Cache-Control', 'public, max-age=3024000' );
	}
}

app.use( compress() );
app.use( serveStatic( __dirname +'/build', { setHeaders: setHeaders } ) );

app.get( '/pt/', redirect( '/' ) )
app.get( '/en/', redirect( '/' ) )
app.get( '/pt/blog', redirect( '/blog/' ) )
app.get( '/pt/blog/feed', redirect( '/rss.xml' ) )
app.get( '/pt/blog/hello-world', redirect( '/hello-world/' ) )
app.get( '/pt/blog/o-dia-que-eu-vendi-tudo', redirect( '/the-day-i-sold-everything/' ) )

app.get( '*', fourOhFour() )

app.listen( 3015 );
