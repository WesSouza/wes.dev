var Metalsmith = require( 'metalsmith' ),
	collections = require( 'metalsmith-collections' ),
	define = require( 'metalsmith-define' ),
	drafts = require( 'metalsmith-drafts' ),
	feed = require( 'metalsmith-feed' ),
	filemetadata = require( 'metalsmith-filemetadata' ),
	fingerprint = require( 'metalsmith-fingerprint' ),
	headingsIdentifier = require( 'metalsmith-headings-identifier' ),
	lunr = require( 'metalsmith-lunr' ),
	markdown = require( 'metalsmith-markdown' ),
	marked = require( 'marked' ),
	metallic = require( 'metalsmith-metallic' ),
	pagination = require( 'metalsmith-pagination' ),
	permalinks = require( 'metalsmith-permalinks' ),
	sass = require( 'metalsmith-sass' ),
	serve = require( 'metalsmith-serve' ),
	tags = require( 'metalsmith-tags' ),
	templates = require( 'metalsmith-templates' ),
	watch = require( 'metalsmith-watch' )

function markedOptions ( ) {
	var markedRenderer = new marked.Renderer();
	markedRenderer.heading = function ( text, level ) {
		level++;
		return '<h'+ level +'>'+ text +'</h'+ level +'>';
	};
	markedRenderer.image = function ( src, title, alt ) {
		return '<div class="blog-image-wrapper"><img src="'+ src +'" alt="'+ ( alt || '' ) +'" title="'+ ( title || '' ) +'" class="blog-image"></div>';
	};
	markedRenderer.link = function ( href, title, text ) {
		return '<a href="'+ href +'" target="_blank" title="'+ ( title || '' ) +'">'+ text +'</a>';
	};
	return {
		renderer: markedRenderer,
		smartypants: true
	};
}

Metalsmith( __dirname )
	.metadata( {
		site: {
			title: 'Wesley’s Blog',
			url: 'http://wesley.so/',
			author: 'Wesley de Souza'
		}
	} )
	.use( sass( { outputStyle: 'expanded' } ) )
	.use( fingerprint( { pattern: [ 'scripts/main.js', 'styles/main.css' ] } ) )
	.use( filemetadata( [ { pattern: 'blog/**/*', metadata: { template: 'blog-post.jade', collection: 'blog' } } ] ) )
	.use( drafts() )
	.use( markdown( markedOptions() ) )
	.use( headingsIdentifier() )
	.use( collections( { blog: { sortBy: 'date', reverse: true } } ) )
	.use( pagination( { 'collections.blog': { perPage: 10, template: 'blog-index.jade', first: 'blog/index.html', path: 'blog/:num/index.html' } } ) )
	.use( permalinks() )
	.use( templates( 'jade' ) )
	.use( feed( { collection: 'blog' } ) )
	.build( function ( err ) {
		if ( err ) throw err
	} );