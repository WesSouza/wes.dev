---
title: 'Writing Good Pull Requests: A Primer'
slug: opening-a-pr-a-primer
description: 'Pull Requests are the main path to add code to any open source project, as well as many closed source...'
date: '2020-02-18T23:00:00.000Z'
tags: ['opensource', 'productivity', 'github', 'git']
published: true
wes95_file: '/C/My_Documents/Blog/Writing Good Pull Requests - A Primer.doc'
---

Pull Requests are the main path to add code to any open source project, as well as many closed source ones. They are opportunities to add new features, fix bugs, or bring improvements to the quality of the project.

Before contributing to a project, it’s important to pay careful attention to its contribution rules. An ideal pull request has a clear title, a concise body, and well-defined commits. Below are some suggestions for opening a good pull request for any type of project.

# Read the Contributing.md File

Before anything, it is important to understand the contribution rules. What is the expected code style? Should you rebase commits from `master` before pushing, or should you merge your branch[[1](#footnote-1)]? How are the commit messages formatted? These and other rules are often laid out in a document named `CONTRIBUTING.md`, on the root folder of the project, or in a `docs` folder.

Read the document thoroughly and follow its guidelines.

# Scope of Work

Make sure your pull request refers to a single scope of work, one clear goal. This will make it easier to follow and reason about.

If you are fixing three bugs, it’s better to open three isolated pull requests. PRs that depend on each other are a bit more complicated[[2](#footnote-2)].

# Commits

Commits are how Git keeps track of code history. For a pull request, the most important aspect of a commit is to isolate part of your change so it has a smaller, more manageable cognitive load. This only applies to larger pull requests, and can vary a lot.

You can see it as a recipe, where you break your work down into smaller pieces.

Let’s consider an example: you need to fix a bug in a library function in the code, by introducing a new required parameter to it. That function is used in many places in the codebase, which will also need to change to work with the new function signature. You will also want to update the function’s tests, to make sure that parameter works as intended.

We can split this up into two separate commits:

1. Update the library function including a new parameter;
2. Update the code to adhere to the changed function signature.

This way, a person reading the pull request can separate what changed as part of what step on your recipe, and verify each step independently.

If we mix the steps, it might be easy to miss the changes in the library among its use changes.

# Commit Messages

Every commit message on your branch is important to understand what the commit changed. First of all, check the contribution guidelines for instructions on how to format and phrase the commit messages. Some projects use a rebase and fast-forward merge strategy, which means your commit messages will go as-is to the master branch.

If the rules on the branch commit messages are open, make sure to keep them aligned with the guidelines. Most guidelines ask the message to be short, in the present tense, imperative mood, and not end with punctuation.

In our example:

1. Fix binaryToString not working, introduce encoding parameter
2. Update usage of binaryToString across the code

See how we’ve used "update" instead of "updated" or "updating". This makes the messages more uniform, and usually shorter.

# Pull Request Title

Your pull request title is how other people will find your contribution. It represents the main intent of your proposed changes, so it should represent it well. Try to apply the same guides from the commit messages into the PR title.

You can highlight side-effects of your change can in the body instead, to keep the title concise. In our example, we can use:

> Fix binaryToString not working

This title highlights the intent of the pull request. The code contained in this pull request is all related to achieving this goal.

# Pull Request Body

The pull request body is your opportunity to have a conversation with the reviewers. Describe your changes and reasoning in detail, and match the commits with the proposed change explanation.

It is where you can argue about decisions you took to achieve the proposed change in the title. It can also be a place to mention alternatives you didn’t take or would be willing to take if requested.

My ideal pull request body has the following structure:

1. A paragraph describing the main changes in detail
2. A list of steps taken to achieve those changes
3. Considerations about the approach taken and other available options
4. Linked external resources

The first item is mandatory, the remaining ones are optional. They depend on the extent of your changes. Use your best judgement.

Sometimes extra assets can make a huge difference. If there is a visual change, add a screen capture or video that highlights the changes. It is a great way to convey the effects of the changes.

In our example, we could say:

    This fixes all cases where `binaryToString` stopped fooing, by making explicit
    the need of the necessary encoding.

    It:
    - Fixes `binaryToString`, and adds a new encoding parameter
    - Updates usage of `binaryToString` across the code to pass the correct encoding
      parameter

    `binaryToString` used to infer the encoding, which used an unsupported
    feature[1] that was unsafe and caused problems in some situations[2]. In order
    to avoid the issue, we will stop inferring the encoding and instead require it
    to be passed down.

    1: https://example.org/encoding-detection
    2: https://example.org/issues-with-encoding
    Jira: ABC-123

Here we are free to write the text on any form, as long as it’s concise and reasonable to the reviewer.

You should remember that we are speaking to another person who is seeing that change for the first time. We must be careful to not make assumptions about the reader’s knowledge of the matter, by always providing enough context.

---

Writing a perfect pull request is not possible, but we can make efforts to write ones that are as good as possible. Some key takeaways are:

- Always follow the contributing guidelines;
- Limit the affected scope so your intent is clear;
- Be concise on your text and commit intent;
- Provide context about your decisions;
- Detail alternatives and visual examples of the changes, if possible.

Remember: reviewers are people. They are trying to understand your point. They might not have as much knowledge as you about your intents.

I hope this helps you make sure your pull request gets approved and merged in no time!

---

<aside><small><ol>
  <li><a name="footnote-1"></a>You can read more about <a href="https://hackernoon.com/git-merge-vs-rebase-whats-the-diff-76413c117333">the difference between merge and rebase in this article on Hacker Noon</a>.</li>
  <li><a name="footnote-2"></a>There isn’t a standard way on git to point out that one branch depends on another. You can open multiple PRs where they all have the commits they are dependent on, which might be confusing for reviewers since those changes are not described by that PR; or open PRs that are merging your code into a parent PR branch instead of `master`, but remember those branches are not protected, so restrictions might not apply. This is, for sure, a topic for an entire new article.</li>
</ol></small></aside>

---

<small>Thanks to [Daniel Fosco](https://twitter.com/dfosco), [Jay Ashe](https://twitter.com/jgashe) and [Mathias Jessen](https://twitter.com/IISResetMe) for the help revising this content.<br>Photo by [Ross Findon](https://unsplash.com/photos/mG28olYFgHI) on Unsplash.
</small>
