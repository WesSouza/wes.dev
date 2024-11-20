---
title: 'Small Things to Make Others Happy'
slug: cool-things-make-people-happy
description: 'Working for a couple of big companies as MTV, Univision and Booking.com gave me a glimpse of what it...'
date: '2015-03-01T08:00:00.000Z'
tags: ['code', 'webdev', 'css', 'scalability']
published: true
wes95_file: '/C/My_Documents/Blog/Small Things to Make Others Happy.doc'
---

# Small Things to Make Others Happy

Working for a couple of big companies as [MTV](https://www.mtv.com.br), [Univision](https://www.univision.com) and [Booking.com](https://www.booking.com) gave me a glimpse of what it is to deploy my code to a huge amount of users, and also share it with a lot of other developers and designers.

It made me learn a lot, and I’ve compiled this list of small positive actions that can potentially improve everyone’s daily routine.

Most of this makes more sense if applied in big organizations, due to the nature of having multiple people responsible for multiple aspects of a product or even multiple products.

## Daily Life

The first part of the presentation revolves around common abstract ideas that I feel should be reinforced.

### Keep Calm and Don’t Rush Your Commits

Rushed coding is a potential for undetected problems. Avoid rushing your commit just so that it makes the next deployment, from my experience nobody dies if your code is one day late.

### Learn

Part of what makes us hackers is that we love to learn. And dealing with MSIE 8 is no excuse to stop in ECMAScript 3 and stop improving your knowledge.

It is also a good opportunity to expand your horizons. If you’re a designer with weak JavaScript coding abilities, seek training. Same thing for front end developers that do not code properly in their company’s back end language.

### Teach

Knowledge should always be shared. Teaching makes you understand that subject better, because you only truly understand something if you can explain it to someone else.

Teaching improves your communication skills, spreads knowledge to your company’s community, and gives you karma points among your colleagues.

### Embrace User Experience

Whenever creating a feature, do put the user in the center of your design. Do not solve using the quickest available solution, be it because of it being technically difficult, or just easier to couple with the current design.

From a design perspective this applies to every small enhancement that in the end culminates in a messed up visual experience. Because every new addition has to conform to the current design, and the first design was never conceptualized with all these new additions, the end experience is most of the times a mess. There are times to rethink the whole user experience.

From a developer perspective this applies to lazy solutions that work but do not make immediate sense to the user.

### Your Code Is Not Yours

And by that I don’t mean your code is your company’s property. It is, don’t get me wrong, but my point is that your code is shared with a number of other developers and sometimes designers.

You have to be aware that you’ll hardly work in the same team forever, and that your software will certainly be changed and maintained by a number of different people throughout time.

And how many times you got back to your own code from the previous day and thought “what the fuck was I doing here?”

Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live. Code for readability. –John F. Woods

### Keep it Simple

This is a mantra for every applicable aspect of your life. If you’re creating code, designing a new feature, talking about a new technology, creating a new database table, or even an entire new product, you should always aim for simplicity.

This goes together with code maintainability, because if you think into small, simple pieces instead of a huge chunk of interconnected functions you have more chances of having an understandable code file.

### Value Others’ Opinions

Do not assume you have the best solution at all cases. This is part of life, but is greatly enhanced in technology, since we have to come up with solutions frequently, we tend to ignore others’ opinions and shove our solution down everybody’s throats.

Ponder what you are changing and involve people in your decisions before deploying your new code. Be it as a simple code review by a trusted colleague, or by an e-mail thread to the company’s developers list.

### Engage in the Community

In big organizations, there is a huge chance that a lot of other people do the same kind of job that you do, and then it is your responsibility to gather together and talk.

This is extremely useful for sharing experiences, discussing new technologies, and determine technical steps — like moving to SCSS, using Browserify, implementing ES5 shims.

This also brings people together and engages people.

## Code

Talking about more concrete things, these are my recommendations about HMTL, CSS and JavaScript coding.

### Tabs vs. Spaces

I don’t care if you use tabs or spaces, but you must respect the current file settings. Set up your file editor to detect and use whatever the opened file has, and make sure you are not mixing up.

Specially when copying code.

```html
<div>
  <a> Drunk code. </a>
</div>
```

### Explain Your Code

We are not in 1980 anymore, your methods, variable and class names can be bigger and more descriptive. Other people must understand what your code does without reading extensive documentation or attending a workshop you give.

```js
function wat(a) {
  // what is a?
  let b = a.c; // what is c?
  b += d.e; // where the fuck did d come from?
  return !!b; // oh dear.
}
```

### Don’t Style #ids or elements

Styling ids are bad because they are technically unique for one element, and this restricts reuse of styling.

And big companies rarely have omnipresent design guidelines, so one \<button\> is potentially very different across components, so never style the element.

```css
/* surprise interference! */
button {
  padding-left: 20px !important;
}
```

### Lower Your Specificity

In order to prevent a proliferation of !important shit, keep your CSS selectors specificity as low as possible.

This also reduces the chances of CSS interference between teams, since generic class names can be used at any time.

```css
/* what the specificity hell */
body div#header ul.menu .item {
}

/* hmm, peace */
.header-menu__item {
}
```

### Prefix

Whenever you create a new component, try to prefix every class name with it. The syntax becomes very verbose, which is actually good for consistency, self-explanatory code and small specificity.

```css
/* component */
.searchbox {
}

/* component + something */
.searchbox-input {
}

/* parent component + state */
.searchbox.-active .searchbox-input {
}
```

### Template is Not Backend

Business logic and complex coding should be in the back end. If the template engine you use provide ways to program like ifs, loops, variable setting, never use them to create an algorithm in the template code.

It is always weird, hard to understand, and very fragile.

### git diff is Our Friend

If you use git and have a master branch that is always deployable, you need to be very careful before pushing your code changes.

Doing a git diff before committing, or git show before pushing, gives you a last chance to see if you forgot to remove test code, or if there was a bad merge you need to fix, before breaking things for everyone else.

## Conclusion

I hope you found something useful from these points. I know I would be much happier if everyone I work with followed them.
