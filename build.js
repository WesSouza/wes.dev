var Metalsmith         = require('metalsmith'),
    collections        = require('metalsmith-collections'),
    define             = require('metalsmith-define'),
    feed               = require('metalsmith-feed'),
    filemetadata       = require('metalsmith-filemetadata'),
    fingerprint        = require('metalsmith-fingerprint'),
    headingsIdentifier = require('metalsmith-headings-identifier'),
    lunr               = require('metalsmith-lunr'),
    markdown           = require('metalsmith-markdown'),
    marked             = require('marked'),
    metallic           = require('metalsmith-metallic'),
    pagination         = require('metalsmith-pagination'),
    permalinks         = require('metalsmith-permalinks'),
    publish            = require('metalsmith-publish'),
    sass               = require('metalsmith-sass'),
    tags               = require('metalsmith-tags'),
    layouts            = require('metalsmith-layouts')

var site = {
    title  : 'Wesley’s Blog',
    url    : 'http://wesley.so',
    author : 'Wesley de Souza'
};

var production = process.env.NODE_ENV == 'production';

function markedOptions () {
    var markedRenderer = new marked.Renderer();
    markedRenderer.heading = function (text, level) {
        level++;
        return '<h'+ level +'>'+ text +'</h'+ level +'>';
    };
    markedRenderer.image = function (src, title, alt) {
        return '<div class="blog-image-wrapper"><img src="'+ (production ? site.url : '') + src +'" alt="'+ (alt || '') +'" title="'+ (title || '') +'" class="blog-image"></div>';
    };
    markedRenderer.link = function (href, title, text) {
        return '<a href="'+ href +'" target="_blank" title="'+ (title || '') +'">'+ text +'</a>';
    };
    return {
        renderer: markedRenderer,
        smartypants: true
    };
}

Metalsmith(__dirname)
    .metadata({ site: site })
    .use(sass({ outputStyle: 'expanded' }))
    .use(fingerprint({ pattern: [ 'scripts/main.js', 'styles/main.css' ] }))
    .use(filemetadata([ { pattern: 'blog/**/*', metadata: { layout: 'blog-post.pug', collection: 'blog' } }, { pattern: 'products/**/*', metadata: { layout: 'ecommerce-product.pug', collection: 'products' } } ]))
    .use(publish({ draft: !production, unlisted: !production }))
    .use(metallic())
    .use(markdown(markedOptions()))
    .use(collections({ blog: { sortBy: 'date', reverse: true }, products: { sortBy: 'title' } }))
    .use(pagination({ 'collections.blog': { perPage: 10, layout: 'blog-index.pug', first: 'blog/index.html', path: 'blog/:num/index.html' } }))
    .use(permalinks({ pattern: ':title/' }))
    .use(feed({ collection: 'blog' }))
    .use(headingsIdentifier())
    .use(layouts({ engine: 'pug', directory: 'templates' }))
    .build(function (err) {if (err) throw err;});