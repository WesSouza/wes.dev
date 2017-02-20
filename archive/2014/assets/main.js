/**
 * Code is not minified so you can check my style.
 *
 * @author Wesley de Souza <dev@wesley.so>
 */

var wex = null;
$( function ( ) {
    wex = new Wesley();
} );

var Wesley = function ( ) {
    var self = this,
        $ = jQuery;

    self.nav = null;

    self.unwex = null;

    self.init = function ( ) {
        self.nav = new Wesley_Nav( self );
        $('body').addClass('transitions-enabled');

        if ( $('#unwex').length )
            self.unwex = new Wesley_UnWex( self );
    }

    self.init();
}

var Wesley_Nav = function ( parent ) {
    var self = this,
        $ = jQuery,
        scrollOnTop = true;

    self.init = function ( ) {
        $('.nav-btn-dropdown').on('click', function( e ) {
            e.preventDefault();
            $('html').toggleClass('nav-open');
        } );

        $( window ).on('scroll', self.scrolled);
        $( window ).on('touchmove', self.scrolled);
        setTimeout( self.scrolled, 500 );
    }

    self.scrolled = function ( ) {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

        var newScrollOnTop = scrollTop <= 0;
        if ( newScrollOnTop && !scrollOnTop ) {
            scrollOnTop = true;
            $('body').addClass( 'scroll-on-top' );
        }
        else if ( !newScrollOnTop && scrollOnTop ) {
            scrollOnTop = false;
            $('body').removeClass( 'scroll-on-top' );
        }
    }

    self.init();
}

/**
 * You get the idea, right?
 *
 * Otherwise it's cheating.
 */

var Wesley_UnWex = function ( parent ) {
    var self = this,
        $ = jQuery,
        enabled = false,
        scanfing = false,
        scanfHistory = [],
        scanfHistoryIndex = 0,
        scanfHistoryEnabled = false,
        $unwex, $pre, $buffer, $prompt, $command, $cursor, $capture,
        currentApp,

        bsodCurrent = -1,
        bsodTrigger = [ 38, 38, 40, 40, 37, 39, 37, 39, 66, 65 ],
        bsodText = 'A problem has been detected and this tab has been shut down to prevent damage\nto your browser.\n\nERR_KONAMI_CODE_OF_DEATH\n\nIf this is the first time you\'ve seen this Stop error screen,\ncongratulations! If this screen appears again, follow\nthese steps:\n\nCheck to make sure you stop doing the Konami Code while visiting this website.\nIf you are a n00b, stop hitting your keyboard randomly, you\'ll upset your\nhardware or software manufacturer.\n\nIf this problem continue, disable or remove any drugs or alcohol from\nyour system. Disable your computer, get to a bed and rest for at least\neight hours.\n\nTechnical information:\n*** STOP: 0x000b00bs (0x45617374, 0x65724567, 0x67735241, 0x77736d21)\n\n\nBeginning doing nothing else\r\r\r\r\r\nNothing else complete\nContact your mother more often or your father or someone you really love for further\nassistance.';

    self.version = '0.0.1';

    self.init = function ( ) {
        $unwex = $('#unwex');
        $pre = $unwex.find('pre');
        $buffer = $unwex.find('.buffer');
        $prompt = $unwex.find('.prompt');
        $command = $unwex.find('.command');
        $cursor = $unwex.find('.cursor');
        $capture = $unwex.find('.capture');

        self.registerEventHandlers();

        self.enable();

        currentApp = new unwex_bash( self );
        currentApp.run();
    }

    self.enable = function ( e ) {
        if ( e )
            e.stopPropagation();

        enabled = true;
        $cursor.addClass('animate-blink').show();

        if ( !e || e.type != 'focus' )
            $capture.focus();
    }

    self.disable = function ( event ) {
        enabled = false;
        $cursor.removeClass('animate-blink').hide();
    }

    self.registerEventHandlers = function ( ) {
        $('html').on('click', self.disable);
        $unwex.on('click', self.enable);
        $capture.on('keydown', self.eventKeyDown);
        $capture.on('keyup', self.eventKeyUp);
        $capture.on('focus', self.enable);
        $capture.on('blur', self.disable);
    }

    self.eventKeyDown = function ( e ) {
        if ( !enabled || self.eventReject( e ) )
            return;

        debug( 'down', modifierKeys( e ), e.which );

        var modifier = modifierKeys( e ),
            key = e.which;

        if ( self.scanfing ) {
            self.updateCommand();
            self.scrollToBottom();
            if ( ( modifier == 0 && [ 9, 38, 40 ].indexOf( key ) != -1 )
                || ( modifier & 1 && [ 37, 39 ].indexOf( key ) != -1 ) )
                e.preventDefault();
        }
        else
            $capture.val('');
    }

    self.eventKeyUp = function ( e ) {
        if ( !enabled || self.eventReject( e ) )
            return;

        debug( 'up', modifierKeys( e ), e.which );

        var modifier = modifierKeys( e ),
            key = e.which;

        if ( self.scanfing ) {
            self.updateCommand();
            if ( modifier == 0 && key == 13 ) // return
                self.scanfReturn();
            if ( modifier == 2 && key == 76 ) // Ctrl+L
                self.clear();
            if ( modifier == 2 && key == 67 ) // Ctrl+C
                self.sigkill();
            if ( modifier == 0 && key == 38 ) // Up
                self.scanfHistoryNavigate( -1 );
            if ( modifier == 0 && key == 40 ) // Down
                self.scanfHistoryNavigate( 1 );
            if ( modifier == 0 && key == 37 ) // Left
                self.scanfMoveCursor();
            if ( modifier == 0 && key == 39 ) // Right
                self.scanfMoveCursor();
            if ( modifier == 2 && key == 65 ) // Ctrl+A
                self.scanfMoveCursor( 0 );
            if ( modifier == 2 && key == 69 ) // Ctrl+E
                self.scanfMoveCursor( 'end' );
            if ( modifier == 2 && key == 85 ) // Ctrl+U
                self.scanfEmpty();

            if ( modifier == 0 && key == bsodTrigger[ bsodCurrent + 1 ] )
                bsodCurrent ++;
            else
                bsodCurrent = -1;

            if ( bsodCurrent >= bsodTrigger.length - 1 )
                self.bsod( bsodText );
        }
        else
            $capture.val('');
    }

    self.eventReject = function ( e ) {
        var modifier = modifierKeys( e ) ;
        return ( modifier & 2 || modifier & 8 ) && [ 82, 192 ].indexOf( e.which ) != -1;
    }

    self.updateCommand = function ( ) {
        if ( $command.text() != $capture.val() ) {
            $command.text( $capture.val() );

            if ( scanfHistoryEnabled )
                scanfHistory[ scanfHistory.length - 1 ] = $capture.val();
        }
    }

    self.scanf = function ( prompt, callback, options ) {
        options = options || {};

        debug('kernel scanf', prompt, options);
        self.scanfing = true;
        self.scanfCallback = callback;
        $prompt.text( prompt );
        self.scanfMoveCursor();

        scanfHistoryEnabled = !!options.history;
        if ( scanfHistoryEnabled ){
            scanfHistoryIndex = scanfHistory.length;
            scanfHistory.push('');
        }

        $command.toggle( !options.invisible );
    }

    self.scanfHistoryNavigate = function ( direction ) {
        if ( !scanfHistoryEnabled || ( direction == -1 && scanfHistoryIndex == 0 ) || ( direction == 1 && scanfHistoryIndex == scanfHistory.length - 1 ) )
            return;

        scanfHistoryIndex += direction;
        $capture.val( scanfHistory[ scanfHistoryIndex ] );
        $command.text( scanfHistory[ scanfHistoryIndex ] );
    }

    self.scanfMoveCursor = function ( position ) {
        if ( $capture[0].selectionStart === undefined )
            return;
        if ( position == 'end' )
            position = $capture.val().length;
        if ( position !== undefined )
            $capture[0].selectionStart = $capture[0].selectionEnd = position;
        debug( 'scanf move cursor', $capture.val().length, $capture[0].selectionStart );
        $cursor.css( 'left', '-'+ ( ( $capture.val().length - $capture[0].selectionStart ) * $cursor.outerWidth() ) +'px' )
    }

    self.scanfEmpty = function ( ) {
        if ( $capture[0].selectionStart === undefined )
            return;
        $capture[0].selectionStart = 0;
        $capture[0].setRangeText('');
        self.updateCommand();
        self.scanfMoveCursor();
    }

    self.scanfReturn = function ( ) {
        debug('kernel scanfReturn');

        if ( scanfHistoryEnabled )
            scanfHistory[ scanfHistory.length - 1 ] = $capture.val();

        ( function ( callback, command ) { setTimeout( function ( ) {
            callback( command );
        }, 1 ) } )( self.scanfCallback, $command.text() );

        self.scanfing = false;
        self.scanfCallback = null;
        self.writeln( $prompt.text() + ( $command.is(':visible') ? $command.text() : '' ) );
        $prompt.text('');
        $command.text('').show();
        $capture.val('');
    }

    self.sigkill = function ( ) {
        self.scanfing = false;
        self.scanfCallback = null;
        currentApp.sigkill || currentApp.sigkill();
    }

    self.clear = function ( ) {
        $buffer.text('');
    }

    self.write = function ( text ) {
        text = text || '';
        $buffer.text( $buffer.text() + text );
        self.scrollToBottom();
    }

    self.writeln = function ( text ) {
        text = text || '';
        self.write( text +'\n' );
    }

    self.writeAnimated = function ( text, callback ) {
        if ( typeof text != 'string' )
            text = '';

        text = text.split('');
        if ( text[ text.length - 1 ] != '\n' )
            text.push('\n');

        var speed = 10,
            pause = 0,
            pauseForSpace = 0,
            pauseForReturn = 10,
            pauseForPause = 50,
            pauseForEOL = 50,
            nextChar = '',
            timer;
        timer = setInterval( function ( ) {
            if ( pause ) {
                pause --;
                return;
            }

            nextChar = text.shift();

            if ( nextChar == '\n' )
                pause = pauseForReturn;
            else if ( nextChar == '\r' )
                pause = pauseForPause;
            else if ( nextChar == ' ' )
                pause = pauseForSpace;

            self.write( nextChar );

            if ( text.length == 1 )
                pause = pauseForEOL;

            if ( text.length == 0 ) {
                clearTimeout( timer );
                ( function ( callback ) { setTimeout( function ( ) {
                    callback();
                }, 1 ) } )( callback );
            }
        }, speed );
    }

    self.scrollToBottom = function ( ) {
        $pre.scrollTop( $pre[0].scrollHeight );
    }

    self.getColumns = function ( ) {
        return parseInt( $pre.outerWidth() / $cursor.outerWidth() );
    }

    self.getRows = function ( ) {
        return parseInt( $pre.outerHeight() / $cursor.outerHeight() );
    }

    self.bsod = function ( message ) {
        var $body = $('body');

        self.write = function ( text ) {
            $body.text( $body.text() + text );
        }

        $body.empty().addClass('bsod').append('<pre></pre>');

        self.writeAnimated( message, function ( ) { } );

        self.disable();
    }

    function modifierKeys ( event ) {
        var result = 0;
        if ( event.shiftKey )
            result += 1;
        if ( event.ctrlKey )
            result += 2;
        if ( event.altKey )
            result += 4;
        if ( event.metaKey )
            result += 8;
        return result;
    }

    self.init();
}

var unwex_bash = function ( control ) {
    var self = this,
        cwd = '/home/wesley',
        home = '/home/wesley',
        user = 'wesley',
        hostname = 'wesley.so',
        root = false,
        commands = {},
        hiddenCommands = {};

    self.run = function ( command ) {
        if ( command !== undefined ) {
            if ( command ) {
                command = parseCommand( command );
                if ( commands[ command[0] ] ) {
                    commands[ command[0] ].run( command[0], command[1] );
                    ga( 'send', 'event', 'Commands', command[0], command[1].join( ' ' ) );
                }
                else if ( hiddenCommands[ command[0] ] ) {
                    hiddenCommands[ command[0] ].run( command[0], command[1] );
                    ga( 'send', 'event', 'Hidden Commands', command[0], command[1].join( ' ' ) );
                }
                else {
                    control.writeAnimated( '-bash: '+ command[0] +': command not found\n\n', self.prompt );
                    ga( 'send', 'event', 'Command Errors', command[0], command[1].join( ' ' ) );
                }
            }
            else {
                self.prompt();
            }
        }
        else
            self.boot( self.prompt );
    }

    self.boot = function ( callback ) {
        new unwex_fs( self, control );
        new unwex_utils( self, control );
        new unwex_easter( self, control );

        var text = 'login as: wesley\n'+
            'wesley@wesley.so\'s password:\n'+
            '\n'+
            'Welcome!\n'+
            '\n'+
            'Type \'help\' for available commands.\n'+
            '\n';
        control.writeAnimated( text, callback );
    }

    self.prompt = function ( ) {
        debug('bash prompt')
        control.scanf( user +'@'+ hostname +':'+ self.getCwd( true ) + ( root ? '#' : '$' ) +' ', self.run, { history: true } );
    }

    self.sigkill = function ( ) {
        self.prompt();
    }

    self.resume = function ( ) {
        self.prompt();
    }

    self.register = function ( handler, data ) {
        debug( 'bash register', handler, data );
        data && data.commands && data.commands.forEach( function ( value, index ) {
            commands[ value ] = handler;
        } );
        data && data.hiddenCommands && data.hiddenCommands.forEach( function ( value, index ) {
            hiddenCommands[ value ] = handler;
        } );
    }

    self.registeredCommands = function ( ) {
        var registeredCommands = [];
        for ( var i in commands )
            registeredCommands.push( i );
        registeredCommands.sort();
        return registeredCommands;
    }

    self.registeredHiddenCommands = function ( ) {
        var registeredHiddenCommands = [];
        for ( var i in hiddenCommands )
            registeredHiddenCommands.push( i );
        registeredHiddenCommands.sort();
        return registeredHiddenCommands;
    }

    self.getCwd = function ( relative ) {
        if ( relative )
            return cwd.replace( home, '~' );
        return cwd;
    }

    self.setCwd = function ( nwd ) {
        if ( nwd.indexOf( '~' ) == 0 )
            nwd = nwd.replace( /^~/, home );
        cwd = nwd;
        return cwd;
    }

    self.getUser = function ( ) {
        return user;
    }

    self.getHome = function ( ) {
        return home;
    }

    self.isRoot = function ( ) {
        return root;
    }

    self.resolvePwd = function ( pwd ) {
        var re = /([^\/]+\/+\.\.(\/|$)|^\.\.\/|\/$)/;

        if ( pwd == '..' && self.getCwd() == '/' )
            pwd = '/';

        if ( pwd.charAt( 0 ) != '/' )
            pwd = self.getCwd() +'/'+ pwd;

        if ( pwd.charAt( 0 ) == '~' )
            pwd = pwd.replace( /^~/, self.getHome() );

        while ( pwd.match( re ) )
            pwd = pwd.replace( re, '' );

        if ( pwd.charAt( 0 ) != '/' )
            pwd = '/'+ pwd;

        return pwd.replace( /\/{2,}/g, '/' );
    }

    function parseCommand ( command ) {
        var re = /-(-[a-z]([a-z0-9]*)|[a-z])((=|\s*)("[^"\-][^"]*"|'[^'\-][^']*'|[^\s\-][^\s]*))?/gi, // That's a very nice regular expression. Too bad it proved to be useless.
            parts = command.split( /\s+/g ),
            command = parts.shift(),
            parameters = [],
            currentProperty = null;

        parts.forEach( function ( value, index ) {
            if ( value !== "" )
                parameters.push( value );
        } );

        return [ command, parameters ];
    }
}

var unwex_fs = function ( bash, control ) {
    var self = this,
        commands = [ 'cat', 'cd', 'chmod', 'chown', 'cp', 'ln', 'ls', 'mkdir', 'mv', 'pwd', 'rm', 'tail', 'touch' ],
        hiddenCommands = [],
        catCats = [ '   ____\n  (.   \\\n    \\  |   \n     \\ |___(\\--/)\n   __/    (  . . )\n  "\'._.    \'-.O.\'\n       \'-.  \\ "|\\\n          \'.,,/\'.,,\n', '  ( \\\n   \\ \\\n   / /                |\\\\\n  / /     .-`````-.   / ^`-.\n  \\ \\    /         \\_/  {|} `o\n   \\ \\  /   .---.   \\\\ _  ,--\'\n    \\ \\/   /     \\,  \\( `^^^\n     \\   \\/\\      (\\  )\n      \\   ) \\     ) \\ \\\n       ) /__ \\__  ) (\\ \\___\n      (___)))__))(__))(__)))\n', ' ((      /|_/|\n  \\\\.._.\'  , ,\\\n  /\\ | \'.__ v / \n (_ .   /   "         \n  ) _)._  _ /\n \'.\\ \\|( / (\n   \'\' \'\'\\\\ \\\\\n', '   |\\      _,,,---,,_\n   /,`.-\'`\'    -.  ;-;;,_\n  |,4-  ) )-,_..;\\ (  `\'-\'\n \'---\'\'(_/--\'  `-\'\\_)\n', '                         _\n                        | \\\n                        | |\n                        | |\n   |\\                   | |\n  /, ~\\                / /\n X     `-.....-------./ /\n  ~-. ~  ~              |\n     \\             /    |\n      \\  /_     ___\\   /\n      | /\\ ~~~~~   \\ |\n      | | \\        || |\n      | |\\ \\       || )\n     (_/ (_/      ((_/\n', '   /\\_/\\\n   >^.^<.---.\n  _\'-`-\'     )\\\n (6--\\ |--\\ (`.`-.\n     --\'  --\'  ``-\'\n', '   ,     ,\n   |\\."./|\n  / _   _ \\\n / {|} {|} \\   ______\n \\==  Y  ==/"\'`      `.\n /`-._^_.-\'\\     ,-  . \\\n/     `     \\   /     \\ \\\n\\  \\.___./  /_ _\\     / /\n `, \\   / ,\'  (,-----\' / \n   ""\' \'""     \'------\' ' ],
        initDate = new Date( 1390354977000 ),
        fs = {
            '/': { t: 'd', d: initDate, u: 'root   root  ', m: 'drwxr-xr-x', s: 68 },
            '/bin': { t: 'd', d: initDate, u: 'root   root  ', m: 'drwxr-xr-x', s: 68 },
            '/etc': { t: 'd', d: initDate, u: 'root   root  ', m: 'drwxr-xr-x', s: 68 },
            '/etc/crontab': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 229 },
            '/etc/hosts': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 324 },
            '/etc/passwd': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 413 },
            '/etc/resolv.conf': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 54 },
            '/home': { t: 'd', d: initDate, u: 'root   root  ', m: 'drwxr-xr-x', s: 68 },
            '/home/wesley': { t: 'd', d: initDate, u: 'wesley wesley', m: 'drwxr-xr-x', s: 68 },
            '/home/wesley/projects': { t: 'd', d: initDate, u: 'wesley wesley', m: 'drwxr-xr-x', s: 68 },
            '/home/wesley/projects/booking.com.txt': { t: 'f', d: initDate, u: 'wesley wesley', m: '-rw-r--r--', s: 734 },
            '/home/wesley/projects/mtv.txt': { t: 'f', d: initDate, u: 'wesley wesley', m: '-rw-r--r--', s: 734 },
            '/home/wesley/projects/mundo-dbz.txt': { t: 'f', d: initDate, u: 'wesley wesley', m: '-rw-r--r--', s: 262 },
            '/home/wesley/projects/mznews.txt': { t: 'f', d: initDate, u: 'wesley wesley', m: '-rw-r--r--', s: 349 },
            '/home/wesley/projects/palavrometro.txt': { t: 'f', d: initDate, u: 'wesley wesley', m: '-rw-r--r--', s: 510 },
            '/home/wesley/projects/prefixo9.txt': { t: 'f', d: initDate, u: 'wesley wesley', m: '-rw-r--r--', s: 389 },
            '/home/wesley/projects/scup.txt': { t: 'f', d: initDate, u: 'wesley wesley', m: '-rw-r--r--', s: 123 },
            '/home/wesley/projects/univision.txt': { t: 'f', d: initDate, u: 'wesley wesley', m: '-rw-r--r--', s: 536 },
            '/home/wesley/projects/whocares.txt': { t: 'f', d: initDate, u: 'wesley wesley', m: '-rw-r--r--', s: 364 },
            '/home/wesley/hi.txt': { t: 'f', d: initDate, u: 'wesley wesley', m: '-rw-r--r--', s: 339 },
            '/media': { t: 'd', d: initDate, u: 'root   root  ', m: 'drwxr-xr-x', s: 68 },
            '/media/cdrom': { t: 'd', d: initDate, u: 'root   root  ', m: 'drwxr-xr-x', s: 68 },
            '/media/cdrom/Track 01 - One More Time.cda': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 0 },
            '/media/cdrom/Track 02 - Aerodynamic.cda': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 0 },
            '/media/cdrom/Track 03 - Digital Love.cda': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 0 },
            '/media/cdrom/Track 04 - Harder Better Faster Stronger.cda': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 0 },
            '/media/cdrom/Track 05 - Crescendolls.cda': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 0 },
            '/media/cdrom/Track 06 - Nightvision.cda': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 0 },
            '/media/cdrom/Track 07 - Superheroes.cda': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 0 },
            '/media/cdrom/Track 08 - High Life.cda': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 0 },
            '/media/cdrom/Track 09 - Something About Us.cda': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 0 },
            '/media/cdrom/Track 10 - Voyager.cda': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 0 },
            '/media/cdrom/Track 11 - Veridis Quo.cda': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 0 },
            '/media/cdrom/Track 12 - Short Circuit.cda': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 0 },
            '/media/cdrom/Track 13 - Face to Face.cda': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 0 },
            '/media/cdrom/Track 14 - Too Long.cda': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 0 },
            '/tmp': { t: 'd', d: initDate, u: 'root   root  ', m: 'drwxr-xr-x', s: 68 },
            '/var': { t: 'd', d: initDate, u: 'root   root  ', m: 'drwxr-xr-x', s: 68 },
            '/var/log': { t: 'd', d: initDate, u: 'root   root  ', m: 'drwxr-xr-x', s: 68 },
            '/var/log/syslog': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 1682 },
            '/var/log/syslog.1': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 1682 },
            '/var/log/syslog.2.gz': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 2134 },
            '/var/log/syslog.3.gz': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 1242 },
            '/var/log/syslog.pim.gz': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 2314 },
            '/var/www': { t: 'd', d: initDate, u: 'root   root  ', m: 'drwxr-xr-x', s: 68 },
            '/var/www/construcao.gif': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 10829 },
            '/var/www/index.htm': { t: 'f', d: initDate, u: 'root   root  ', m: '-rw-r--r--', s: 522 }
        },
        cdOldPwd = false;

    self.load = function ( ) {
        bash.register( self, { commands: commands, hiddenCommands: hiddenCommands } );

        // This should be an event. But whatever.
        setTimeout( function ( ) {
            bash.registeredCommands().concat( bash.registeredHiddenCommands() ).sort().forEach( function ( command, i ) {
                fs[ '/bin/'+ command ] = { t: 'f', d: initDate, u: 'root   root  ', m: '-rwxr-xr-x', s: command.length * 9 };
            } );
        }, 2000 );
    }

    self.run = function ( command, options ) {
        switch ( command ) {
            case 'cat':
                if ( !options[0] )
                    control.writeAnimated( 'Here\'s a cat:\n'+ catCats[ parseInt( Math.random() * catCats.length ) ], self.terminate );
                else {
                    file = bash.resolvePwd( options[0] );
                    if ( !fs[ file ] || fs[ file ].t != 'f' ) {
                        control.writeAnimated( '-bash: cat: '+ file +': No such file or directory', self.terminate );
                    }
                    else if ( file == '/var/www/construcao.gif' ) {
                        control.writeAnimated( '-bash: cat: '+ file +' is a binary file', function ( ) {
                            $( '.home-hero' ).css( 'background', 'url(/fsf/'+ file.replace( /[^a-z]+/g, '-' ).replace( /-+/g, '-' ).replace( /(^-|-$)/g, '' ) +'.gif) repeat-x center center' );
                            self.terminate();
                        } );
                    }
                    else if ( file == '/var/log/syslog.pim.gz' ) {
                        control.writeAnimated( '-bash: cat: '+ file +' is a binary file', function ( ) {
                            location.href = 'http://youtu.be/t18d94Juk-4';
                            self.terminate();
                        } );
                    }
                    else if ( file.match( /\.gz$/ ) ) {
                        control.writeAnimated( '-bash: cat: '+ file +' is a binary file', self.terminate );
                    }
                    else {
                        $.ajax( {
                            url: './assets/fsf/'+ file.replace( /[^a-z\d]+/g, '-' ).replace( /-+/g, '-' ).replace( /(^-|-$)/g, '' ) +'.txt',
                            success: function ( response ) {
                                control.writeAnimated( response, self.terminate );
                            },
                            error: function ( ) {
                                control.writeAnimated( '-bash: cat: '+ cwd +': Read error', self.terminate );
                            }
                        } );
                    }
                }
                return;

            case 'cd':
                var option = options[0],
                    nwd = false,
                    error = false;
                if ( !option ) {
                    nwd = '~';
                }
                else if ( option == '.' ) {
                    nwd = false;
                }
                else if ( option == '-' ) {
                    if ( !cdOldPwd ) {
                        error = 2;
                    }
                    else {
                        nwd = cdOldPwd;
                        cdOldPwd = bash.getCwd();
                    }
                }
                else {
                    option = bash.resolvePwd( option );

                    if ( fs[ option ] && fs[ option ].t == 'd' )
                        nwd = option;
                    else
                        error = true;
                }

                if ( nwd ) {
                    cdOldPwd = bash.getCwd();
                    bash.setCwd( nwd );
                }

                if ( error === 1 )
                    control.writeAnimated( '-bash: cd: '+ options[0] +': No such file or directory', self.terminate );
                else if ( error === 2 ) {
                    history.back();
                    control.writeAnimated( '-bash: cd: OLDPWD not set', self.terminate );
                }
                else
                    self.terminate();
                return;

            case 'ls':
                var detailed = false,
                    all = false,
                    list = [], listOut = '',
                    cwd = bash.getCwd(),
                    maxNameLen = 0, maxSizeLen = 0, maxColumns = control.getColumns(),
                    i, name, columns;

                options.forEach( function ( value, index ) {
                    if ( value.indexOf( '-' ) == 0 && value.indexOf( '--' ) != 0 ) {
                        if ( value.indexOf( 'l' ) != -1 )
                            detailed = true;
                        if ( value.indexOf( 'a' ) != -1 )
                            all = true;
                        if ( value.indexOf( 'h' ) != -1 )
                            human = true;
                    }
                    else {
                        cwd = bash.resolvePwd( value );
                    }
                } );

                if ( !fs[ cwd ] || fs[ cwd ].t != 'd' ) {
                    control.writeAnimated( '-bash: ls: cannot access '+ cwd +': No such file or directory', self.terminate );
                }
                else {
                    if ( all ) {
                        list.push( [ '.', cwd, fs[ cwd ] ] );
                        list.push( [ '..', cwd.replace( /\/[^\/]+$/, '' ) || '/', fs[ cwd.replace( /\/[^\/]+$/, '' ) || '/' ] ] );
                        maxNameLen = 2;
                        maxSizeLen = 2;
                    }
                    for ( i in fs ) {
                        if ( i != cwd && i.indexOf( cwd ) == 0 && i.indexOf( '/', cwd.length + 1 ) == -1 ) {
                            name = i.substr( i.lastIndexOf( '/' ) + 1 );
                            if ( name.indexOf( '.' ) != 0 || all ) {
                                list.push( [ name, i, fs[ i ] ] );
                                if ( maxNameLen < name.length )
                                    maxNameLen = name.length;
                                if ( maxSizeLen < fs[ i ].s.toString().length )
                                    maxSizeLen = fs[ i ].s.toString().length;
                            }
                        }
                    }

                    if ( list.length > 0 ) {
                        if ( detailed ) {
                            list.forEach( function ( item, i ) {
                                listOut += item[2].m +' '+ item[2].u +' '+ ' '.repeat( maxSizeLen - item[2].s.toString().length ) + item[2].s.toString() +' '+ formatDate( item[2].d ) +' '+ item[0] +'\n';
                            } );
                        }
                        else {
                            columns = parseInt( maxColumns / ( maxNameLen + 2 ) );
                            list.forEach( function ( item, i ) {
                                listOut += item[0];
                                if ( ( i + 1 ) % columns == 0 )
                                    listOut += '\n';
                                else
                                    listOut += ' '.repeat( maxNameLen - item[0].length + 2 );
                            } );
                        }
                        control.writeAnimated( listOut, self.terminate );
                    }
                    else
                        self.terminate();
                }

                return;

            case 'pwd':
                control.writeAnimated( bash.getCwd(), self.terminate );
                return;

            case 'tail':
                control.writeAnimated( 'I prefer to play with Sonic.', self.terminate );
                return;

            case 'touch':
                control.writeAnimated( 'Push me\r, and then just touch me\r\nTill I can get my\r satisfaction', self.terminate );
                return;

            case 'chmod':
            case 'chown':
            case 'cp':
            case 'ln':
            case 'mkdir':
            case 'mv':
            case 'rm':
                self.alertReadonly( command );
                return;

            default:
                control.writeAnimated( '-fs: '+ command +': command not yet implemented', self.terminate );
                return;
        }

        self.terminate();
    }

    self.terminate = function ( ) {
        control.writeln();
        bash.resume();
    }

    self.alertReadonly = function ( command ) {
        control.writeAnimated( '-'+ command +': Permission denied', self.terminate );
    }

    // This is a heck of an old and ugly function
    function twoDigits ( d, s ) {
        return parseInt( d ) < 10 ? ( s || '0' ) + d.toString() : d.toString();
    }

    function formatDate ( d, s ) {
        var m = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
        return m[ d.getMonth() ] +' '+ twoDigits( d.getDate(), ' ' ) +' '+ twoDigits( d.getHours() ) +':'+ twoDigits( d.getMinutes() ) + ( s ? ':'+ twoDigits( d.getSeconds() ) : '' );
    }

    self.load();
}

var unwex_utils = function ( bash, control ) {
    var self = this,
        commands = [ 'clear', 'date', 'echo', 'help', 'kill', 'logout', 'man', 'passwd', 'sudo', 'time', 'times', 'wait', 'whereis', 'whoami', 'yes' ],
        hiddenCommands = [],

        manPhrases = [ 'Woman.', 'Duuuude...', 'Shoot.' ],
        whoamiPhrases = [ 'I have no idea.', 'Really, I don\'t know.', 'Come on, believe me, I can\'t even see you.', 'Okay, enable your webcam.', 'Didn\'t work. Try again.', 'One more time, try unplugging and plugging it again.', 'Have you tried restarting your modem?', 'Go to Internet Options > Empty Temporary Internet Files.', 'Nevermind, I can\'t help.', 'Please, bear with me...', 'Come on, dude! Leave me alone!', 'I can\'t take this anymore!!', 'STOP!', '...' ],
        whoamiPhraseCurrent = 0,
        whereisPhrases = [ 'Behind you!', 'In a galaxy far, far away.', 'Inside your left pocket.', 'You left it in the fridge.', 'By your keys.', 'Nowhere to be found.', 'Let me know if you find it.', 'Beats me...', 'Did you ask your mother?', 'Only NSA knows.' ];

    self.load = function ( ) {
        bash.register( self, { commands: commands, hiddenCommands: hiddenCommands } );
    }

    self.run = function ( command, options ) {
        switch ( command ) {
            case 'clear':
                control.clear();
                self.terminate( true );
                return;

            case 'date':
                if ( options[0] == 'me' )
                    control.writeAnimated( 'I\'m not her.', self.terminate );
                else
                    control.writeAnimated( 'Today.', self.terminate );
                return;

            case 'echo':
                control.writeAnimated( 'Echo...\r echo... \recho...', self.terminate );
                return;

            case 'help':
                var commands = bash.registeredCommands(),
                    help =
                    'Wex Bash, version '+ control.version +' (ecmascript5-nodejs)' +'\n'+
                    '' +'\n'+
                    '';

                commands.forEach( function ( command, index ) {
                    help += command;
                    if ( index % 2 == 1 )
                        help += '\n';
                    else
                        help += ' '.repeat( 20 - command.length );
                } )

                control.writeAnimated( help, self.terminate );
                return;

            case 'kill':
                control.writeAnimated( 'Kill it yourself.', self.terminate );
                return;

            case 'logout':
                control.writeAnimated( 'Goodbye.', function () {} );
                return;

            case 'man':
                control.writeAnimated( manPhrases[ parseInt( Math.random() * manPhrases.length ) ], self.terminate );
                return;

            case 'passwd':
                var user = false;

                options.forEach( function ( value, index ) {
                    if ( value.indexOf( '-' ) != 0 && value.indexOf( '--' ) != 0 && index == options.length - 1 ) {
                        user = value;
                    }
                } );

                if ( user && user != bash.getUser() )
                    control.writeAnimated( '-'+ command +': Permission denied', self.terminate );
                else {
                    control.scanf( 'Old Password: ', function ( oldPasswd ) {
                        control.scanf( 'New Password: ', function ( newPasswd1 ) {
                            if ( newPasswd1.match( /(123|abc|qwe|asd|password|adobe)/i ) )
                                control.writeAnimated( '-'+ command +': Really?! '+ newPasswd1 +'?!?! Get the f**k out of here!', self.terminate );
                            else {
                                control.scanf( 'Retype New Password: ', function ( newPasswd2 ) {
                                    control.writeAnimated( '-'+ command +': Authentication token failure', self.terminate );
                                }, { invisible: true } );
                            }
                        }, { invisible: true } );
                    }, { invisible: true } );
                }
                return;

            case 'sudo':
                control.writeAnimated( 'Unauthorized usage, please wait until the FBI arrives at your door.', self.terminate );
                return;

            case 'time':
                control.writeAnimated( 'Now.', self.terminate );
                return;

            case 'times':
                control.writeAnimated( 'It\'s times like these you learn to live again\r\nIt\'s times like these you give and give again\r\nIt\'s times like these you learn to love again\r\nIt\'s times like these time and time again', self.terminate );
                return;

            case 'wait':
                control.writeAnimated( 'Waiting...\r\r\r\r', self.terminate );
                return;

            case 'whoami':
                if ( whoamiPhraseCurrent >= whoamiPhrases.length )
                    control.writeAnimated( '-bash: '+ command +': gave up and killed itself', self.terminate );
                else {
                    control.writeAnimated( whoamiPhrases[ whoamiPhraseCurrent ], self.terminate );
                    whoamiPhraseCurrent ++;
                }
                return;

            case 'whereis':
                control.writeAnimated( whereisPhrases[ parseInt( Math.random() * whereisPhrases.length ) ], self.terminate );
                return;

            case 'yes':
                var text = options[0] || 'y';
                control.writeAnimated( ( text +'\n' ).repeat( parseInt( Math.random() * 20 ) ) +'\nOkay, I\'m tired.', self.terminate );
                return;

            default:
                control.writeAnimated( '-utils: '+ command +': command not yet implemented', self.terminate );
                return;
        }

        self.terminate();
    }

    self.terminate = function ( silent ) {
        if ( !silent )
            control.writeln();
        bash.resume();
    }

    self.load();
}

var unwex_easter = function ( bash, control ) {
    var self = this,
        commands = [],
        hiddenCommands = [ 'dude', 'god', 'hello', 'iexplore', 'iexplore.exe', 'iexplorer', 'iexplorer.exe', 'make', 'ok', 'okay', 'select', 'why', 'c:', 'C:', 'cls', 'del', 'deltree', 'dir', 'win' ],

        dosBsod = 'A problem has been detected and this tab has been shut down to prevent damage\nto your browser.\n\nERR_YOU_WANT_WINDOWS_YOU_GET_A_BSOD\n\n\nBeginning stop talking to you',
        iexplorerBsod = 'A problem has been detected and this tab has been shut down to prevent damage\nto your browser.\n\nERR_REALLY_INTERNET_EXPLORER_QUESTIONMARK_EXCLAMATIONMARK\n\nIf this is the first time you try to open Internet Explorer,\nNEVER TRY TO DO IT AGAIN. If this screen appears again, please\nseek psychological help.\n\nCheck to make sure you are not your mother, grandmother, father or anyone\nover 70 years old. If this is a new installation, use Internet Explorer\nto download Google Chrome and NEVER COME BACK.\n\nIf this problem continue, stop using computers or any electronic device.\n\nTechnical information:\n*** STOP: 0x00babaca (0x4675636b, 0x49457870, 0x6c6f7265, 0x72446965)\n\n\nBeginning installing toolbars\r\r\r\r\r\nToolbars installation complete\nDo not attempt to contact anyone, leave the computer and don\'t touch it\nagain.',
        whyPhrases = [ 'Why not?', 'Oh god, why?', 'Because.', 'Because I said so.', 'Because of reasons.', 'It\'s in the bible.', 'It\'s in that Spider Man comic.', '42' ];

    self.load = function ( ) {
        bash.register( self, { commands: commands, hiddenCommands: hiddenCommands } );
    }

    self.run = function ( command, options ) {
        switch ( command ) {
            case 'dude':
                control.writeAnimated( 'Where\'s your car again?', self.terminate );
                return;

            case 'god':
                control.writeAnimated( '-god: god not found', self.terminate );
                return;

            case 'hello':
                if ( options[0] && options[0].toLowerCase() == 'world' )
                    control.writeAnimated( 'document.write( "Hello world" ); ', self.terminate );
                else if ( options.length == 0 )
                    control.writeAnimated( 'Is it me you\'re looking for?', self.terminate );
                else
                    control.writeAnimated( 'Hi there.', self.terminate );
                return;

            case 'iexplore':
            case 'iexplore.exe':
            case 'iexplorer':
            case 'iexplorer.exe':
                if ( options[0] && bash.resolvePwd( options[0] ) == '/var/www/index.htm' ) {
                    $.ajax( {
                        url: '/fsf/var-www-index-htm.htm',
                        success: function ( response ) {
                            $( 'html' ).empty().html( response );
                            $( 'html, body' ).height( '100%' );
                        },
                        error: function ( ) {
                            control.bsod( iexplorerBsod );
                        }
                    } );
                }
                else
                    control.bsod( iexplorerBsod );
                return;

            case 'make':
                if ( options.length == 0 )
                    control.writeAnimated( '-'+ command +': nothing to make', self.terminate );
                else if ( options.length == 3 && options.join( '' ).toLowerCase() == 'measandwich' )
                    control.writeAnimated( 'Okay.\r\r\r See? I\'m a nice guy.\r\r\n\nYour sandwich will arrive in 0 to undefined business days.', self.terminate );
                else
                    control.writeAnimated( '-'+ command +': I can\'t make this', self.terminate );
                return;

            case 'ok':
            case 'okay':
                if ( options[0] == 'google'|| options[0] == 'google,' )
                    control.writeAnimated( 'I\'m sorry Dave, I\'m afraid I can\'t do that.', self.terminate );
                else
                    control.writeAnimated( '-bash: '+ command +': command not found', self.terminate );
                return;

            case 'select':
                control.writeAnimated( 'I\'m not a database, man.', self.terminate );
                return;

            case 'why':
                control.writeAnimated( whyPhrases[ parseInt( Math.random() * whyPhrases.length ) ], self.terminate );
                return;

            case 'c:':
            case 'C:':
            case 'cls':
            case 'del':
            case 'deltree':
            case 'dir':
            case 'win':
                control.writeAnimated( 'Really?\r REALLY YOU THINK I\'M DOS??\r\r\n\nFUCK YOU!\r\r\n\nENJOY THIS TERRIFIC WINDOWS EXPERIENCE IN 3...\r\r 2...\r\r 1\r', function ( ) {
                    control.bsod( dosBsod );
                } );
                return;

            default:
                control.writeAnimated( '-bug: '+ command +': command not yet implemented because I forgot, please e-mail me asking for it', self.terminate );
                return;
        }

        self.terminate();
    }

    self.terminate = function ( ) {
        control.writeln();
        bash.resume();
    }

    self.load();
}

String.prototype.repeat = function( num )
{
    return num > 0 ? new Array( num + 1 ).join( this ) : '';
}

function debug ( ) {
    if ( location.hostname == 'localhost' )
        console.log.apply( console, arguments );
}
