---
title: 'Keeping Control of the Front-end'
slug: keeping-control-of-the-front-end
description: 'At Booking.com, hundreds of developers and designers contribute daily to our codebase, which leads to...'
date: '2016-02-15T08:00:00.000Z'
tags: ['components', 'development', 'jquery', 'javascript']
published: true
wes95_file: '/C/My Documents/Blog/Keeping Control of the Front-end.doc'
---

# Keeping Control of the Front-end

At Booking.com, hundreds of developers and designers contribute daily to our codebase, which leads to potential complications with code discoverability, maintenance, and reuse. In this post, we’re going to focus on the client-side aspect of these challenges, and introduce some of the techniques we use to tackle them.

### Prefixing and Namespacing

Because of the size of our codebase and the number of people introducing changes to it daily, it can be difficult to maintain unique identifiers for all of our pages’ components.

Both [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) and [Cascading Style Sheets](https://developer.mozilla.org/en-US/docs/Web/CSS) make use of identifiers to work properly, by means of [variable names](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var) and [selectors](https://developer.mozilla.org/en/docs/Web/Guide/CSS/Getting_started/Selectors) respectively, both on a global execution scope.

Let’s start with JavaScript. We make use of [namespaces](https://www.2ality.com/2011/04/modules-and-namespaces-in-javascript.html), which are object properties of a global variable. (We also implement modules, which will be discussed later in the article.)

```js
// The only global variable
var B = {};

// The search namespace
B.search = {};

// Check-in date of the search
B.search.checkIn = new Date(2015, 3, 1);

// Travel purpose of the search
B.search.travelPurpose = 'business';
```

In the example above, B.search is the namespace we're using to visually identify our code. Notice how travelPurpose has its scope within search, clarifying its context and meaning.

CSS is different. Because CSS doesn’t provide a scalable way of grouping selectors, we make use of prefixes instead. We also make sure all selectors are as specific as possible — to prevent collisions. For example, in our files we already have about 4,000 class selectors containing the term item in their declaration.

Imagine the following simple case: a list of facilities on the hotel page.

```html
<ul class="facilities">
  <li class="item">Wi-Fi</li>
  <li class="item">Breakfast</li>
</ul>
```

That might interfere with another team's work that is adding a universal menu on the website's header.

```html
<ul class="menu">
  <li class="item">Home</li>
</ul>
```

On both cases, .item will have specific CSS rules that could be overridden, thus generating unexpected results. Sometimes these interactions happen on a specific page that was beyond the scope of the developer's tests.

To prevent these conflicts we often use prefixing:

```html
<ul class="hp-facilities">
  <li class="hp-facilites__facility">Wi-Fi</li>
  <li class="hp-facilites__facility">Breakfast</li>
</ul>
```

Since we invest so much into experimentation through A/B testing, a considerable amount of code becomes irrelevant when its related experiment expires.

Because we want to avoid [code rot](https://en.wikipedia.org/wiki/Software_rot) in our codebase, we want to keep only the parts that we actually need, and those irrelevant pieces of code must be removed periodically. Being able to quickly search the code for a specific token, such as a CSS class name, is a key requirement for this clean up.

### Control of Execution

It is very important that our JavaScript code runs in a controlled fashion. Our code needs to be _precise_ by only executing when it is necessary for a certain feature, page, or event. It also needs to be _robust_, preventing interference between unrelated features.

Suppose we have three script files concatenated, and the resulting file is added to every page on our website.

```js
// from tooltip.js
$('.tooltip').addTooltip();

// from available_rooms.js
var prices = $('#prices .price');
prices[0].scrollTop = 0;

// from sticky_user_bar.js
$(window).scroll(function () {
  $('.user_bar').css('top', document.body.scrollTop);
});
```

Any part that fails will prevent the next part from executing. For instance, if there is no element on the page that matches #prices .price there will be an error stopping everything else from executing, breaking the user bar behavior.

Also, there might be code that shouldn't be running, which is undesirable. In the example, if no element matches .user_bar on the page, the scrolling event is still monitored, wasting CPU cycles.

To mitigate this, we chose to develop an internal flow controller that provides an execution control API based on [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md), built on top of [Almond](https://github.com/jrburke/almond). It uses setTimeout to provide a separate context, which then isolates failures and prevents the blockage of the main thread.

As a bonus, because the code is wrapped, we can easily [label those calls for profiling](https://developer.mozilla.org/en-US/docs/Web/API/Console/profile) and find features that might be wasting resources.

This also helps isolate the experimented part of our A/B testing, making it easy to find and clean up failed tentatives, as mentioned in the previous section.

### Restricting Your Execution

While CSS code avoids clashes by using namespaces, JavaScript should not leak behavior to DOM elements or to other unrelated components in the same page.

Part of that problem can be prevented by following well-established coding principles, such as avoiding global variables (enforced by using the [strict mode](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Strict_mode)), modularizing the specific parts of your code, and so forth.

We also encourage our teams to develop context specific software to avoid side-effects.

```js
$('form').on('submit', function () {
  var destination = $('.destination');
});
```

Here, every form element will have a submit event handler attached to it. Also, it searches the entire document DOM tree for the .destination selector, which might stop working as soon as someone inadvertently adds an element that matches the same selector.

An even better approach stresses specifying targets in more detail, aiming to only affect what needs to be affected.

```js
$('.js-searchbox-form').on('submit', function (event) {
  var form = $(event.currentTarget);
  var destination = form.find('.js-destination-input');
});
```

In this scenario, the class names are clear and specific, and the code will only look for elements inside of its own form, preventing possible leaking.

### Modularization

Having multiple teams working independently at the same time allows different development styles across the codebase. One developer might like wrapping her own code on [IIFE](https://benalman.com/news/2010/11/immediately-invoked-function-expression/), and another might prefer the [prototype pattern](https://www.patterns.dev/posts/prototype-pattern).

While this is not a problem if the code is achieving a simple task, more complex solutions might become too big to understand, to manipulate, or to maintain.

```js
function showTheGallery(hotelId) {
  /* Here goes 31415 lines of code involving all event handlers, the overlay behind the gallery, capturing the keyboard events to navigate and close the gallery, logic to preload the images, logic to center the main image relative to another element, scrolling of the thumbnails, obtaining the images from a specific variable in the code, showing the gallery, etc. */
}

showTheGallery(42);
```

As you can see, parts of the code can become too complicated and isolated, making it difficult to understand and debug. It also prevents any kind of reusability.

However, we can break the code into smaller blocks that serve a specific purpose, as described in the [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) principle as "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system".

```js
define('photo-gallery',
  [
    'component-maker',
    'dom-position',
    'dom-scroll',
    'env-variables',
    'image-preload',
    'keyboard-events',
    'overlay'
  ],
  function (...) {
    // Tying them all together nicely, exporting an extensible component
  }
);
```

Here, every dependency is self-contained, specific enough, and totally reusable by others, and the resulting object allows quick extension and behavior changing, so the original code can be adapted.

### Components

Following the principles of restricting the behavior of your code to exactly where you want it to run, and the fact that we want to build a modularized and reusable codebase, we developed a simple solution called **B.components**.

The principle behind it is to add behavior to one or more DOM nodes. It only executes the code when the element exists, and allows one component to extend the features of another, facilitating reusability.

```html
<button type="button" data-component="alert">Alert</button>
```

In this example, we add behavior to a specific button in the code. The JavaScript doesn't need to know which exact element to target in the document, since it's the button that requests a behavior, not the other way around.

The code receives a pointer to the DOM node, and can perform the necessary action, such as listening to click events on this reference and triggering an alert window.

The benefit of this approach is its DOM-based flexibility. We might change every aspect of the HTML, and even add more elements, while preserving the same behavior.

```html
<a data-component="alert">Alert Anchor</a>

<button type="button" data-component="alert">Alert Span</button>
```

We use AMD as the foundation to store the component definitions as modules, the same setTimeout technique mentioned before for containing the execution, and to create a new instance for each component definition found in the DOM or any specified node.

This solution frees us from knowing exactly what to do when rendering dynamic HTML on the page.

```js
var templateCode = 'Complex HTML structure';
$('body').append(templateCode);

// We added tooltips, so initialize them
$('.tooltip').tooltip();

// We also added a lightbox, but that uses another API
LightboxFactory.addLightbox('#lightbox-a', { lightbox: 'options' });

// Did we forget something? Did some API change?
```

This is all replaced by a one-liner:

```js
$(templateCode).appendTo('body').loadComponents();
```

The method $.fn.loadComponents will take care of finding the necessary components, and each component will be given the opportunity to initialize itself, all under the same predictable API.

### The Big Picture

Because we are a big company with hundreds of developers, we exercise care so that our contributions leave our code better than we found it, keeping it more maintainable in the long run.

Organizing and namespacing our CSS and JavaScript blocks helps to make our code easily findable and robust. Controlling our executed code scope and only running it when really necessary makes it predictable and fast. Thinking about modules and UI components ensures we are able to quickly understand and reuse our solutions. All of this is done while keeping a good sense of community and respect for each other.

These are just some of the techniques we adopted and created at Booking.com to help us deal with the challenges of growth.

The important lesson is to always look a the big picture, never assume you are in a perfectly controlled environment.

Code must be resilient.
