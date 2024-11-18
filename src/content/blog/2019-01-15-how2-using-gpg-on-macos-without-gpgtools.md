---
title: 'how2: Using GPG on macOS without GPGTools'
slug: how2-using-gpg-on-macos-without-gpgtools
description: 'I don’t like GPGTools. I want GPG on macOS. Every tutorial has some obsolete part. Here’s what I...'
date: '2019-01-15T16:16:21.000Z'
tags: ['gpgtools', 'gpg', 'git', 'howto']
published: true
wes95_file: '/C/My_Documents/Blog/how2 - Using GPG on macOS without GPGTools.doc'
---

I don’t like GPGTools. I want GPG on macOS. Every tutorial has some obsolete part. Here’s what I did.

---

GPGTools installs a lot of things that I don’t want to use. I just want to sign my commits on GitHub and save my GPG key in macOS keychain.

There are two main dependencies to achieve that, gnupg contains the GPG tools to generate keys and sign things, as well as an agent to do agent things; and pinentry-mac which is the part of GPGTools that prompts for your key password and stores it on the OS keychain.

### GPG Setup

Before anything, install [Homebrew](https://brew.sh).

After that, install the dependencies:

```sh
brew install gnupg pinentry-mac
```

Note the output of the install command, which will tell you the location of the `pinentry-mac` program:

```
==> Caveats
==> pinentry-mac
You can now set this as your pinentry program like

~/.gnupg/gpg-agent.conf
    pinentry-program /some/path/here
```

You need to configure gpg-agent to use pinentry-mac by creating a file ~/.gnupg/gpg-agent.conf, pointing to the correct pinentry-mac program:

```sh
# Connects gpg-agent to the OSX keychain via the brew-installed
# pinentry program from GPGtools. This is the OSX 'magic sauce',
# allowing the gpg key's passphrase to be stored in the login
# keychain, enabling automatic key signing.
pinentry-program /usr/local/bin/pinentry-mac
```

For Apple Silicon Macs, Homebrew uses a different path:

```sh
pinentry-program /opt/homebrew/bin/pinentry-mac
```

Then, let’s generate your first key. I recommend using RSA and RSA, a key size of 4096, and not having the key expire. Remember to [choose a strong password](https://xkcd.com/936/).

```sh
gpg --full-generate-key
```

Then, sign a test message so pinentry-mac can store your password in the keychain:

```sh
echo "test" | gpg --clearsign
```

This should open a dialog prompting your password. Remember to check “Save in Keychain”.

### Connecting to GitHub

First, copy your private key to add to GitHub:

```sh
gpg --export --armor your@email.here | pbcopy
```

And paste it in [GitHub’s Settings \> SSH and GPG keys \> New GPG key](https://github.com/settings/gpg/new).

Second, configure your git environment to use signed commits. I’ve done it globally. First obtain your public GPG keys:

```sh
$ gpg --list-secret-keys
(...)
sec   rsa2048 2019-01-15 [SC]
      YOUR_GPG_KEY_APPEARS_HERE
uid           [ultimate] Your Name <your@email.here>
ssb   rsa2048 2019-01-15 [E]
```

Then configure git:

```sh
git config --global commit.gpgsign true
git config --global user.signingkey YOUR_GPG_KEY
```

And finally, commit something with the-S argument to make sure it’s signed:

```sh
git commit -S -m "Testing GPG signature"
```

### Troubleshooting

Things you can try if things are not working:

```sh
# Kill gpg-agent
killall gpg-agent

# Run gpg-agent in daemon mode
gpg-agent --daemon
```
