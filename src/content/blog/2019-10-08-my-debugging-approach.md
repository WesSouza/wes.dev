---
title: 'Something Broke! How do I fix it?'
slug: my-debugging-approach
description: 'Software development is not about how to write perfect, bug-free code, but to be prepared to handle...'
date: '2019-10-08T16:45:10.047Z'
tags: ['webdev', 'debug', 'css', 'javascript']
published: false
wes95_file: '/C/My_Documents/Blog/Something Broke! How do I fix it.doc'
---

# Something Broke! How do I fix it?

Software development is not about how to write perfect, bug-free code, but to be prepared to handle problems when they arise.

The art of fighting a bug is usually referred as debugging, and most runtimes provide a way of helping that.

Browsers offer the “developer tools” view, which allows you to inspect

---

Debugging can be very different depending on the type of problem we are trying to solve.

Here are some common issues we debug daily as we develop software for the web:

# Something looks incorrect on screen

Visual issues are mostly related to either incorrect HTML or CSS.

- Open the browser developer tools and inspect the element
- Is the applied CSS correct? Is there interference from another CSS rule?
- Are the expected CSS classes present on `class`? Is there a missing class name?
- Is it a browser specific problem? Is there a hack to fix it?
- Are all styles correctly loaded?
- Are styles loaded from a previous or cached version?

# Something does not have the expected behavior

Behavior issues indicates something is either not implemented, not connected to the user interface properly, or broken.

- Open the browser developer tools and look at the console
- Before trying the interaction, is there any error that could prevent further interactions to function properly?
- After trying the interactions, are there any new errors?
- If there is no error, is the correct functions connected to the interaction event?
-

# The application crashes

# Something works, but slower than acceptable

# Other general practices

- Are you testing against the correct environment?
