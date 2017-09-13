# ember-line-clamp

[![Build Status](https://travis-ci.org/Luinova/ember-line-clamp.svg?branch=master)](https://travis-ci.org/Luinova/ember-line-clamp)
[![npm version](https://badge.fury.io/js/ember-line-clamp.svg)](https://badge.fury.io/js/ember-line-clamp)

This Ember addon provides a component for truncating/clamping text.

## Intallation

* `npm install ember-line-clamp`

## Usage

To get started, place the `line-clamp` component in one of your templates and provide a string to the `text` attribute.

```handlebars
{{line-clamp
  text="A really long text to truncate"
}}
```

* Note: This component currently does not support block form.

The `text` attribute is the only required attribute, but there are other important attributes (see the source code for more info):

* `lines` - the number of lines at which the component clamps the text, default is `3`.

```handlebars
{{line-clamp
  text="A really long text to truncate"
  lines=2
}}
```

* `ellipsis` - the characters to be used as the overflow element, default is `'...'`

```handlebars
{{line-clamp
  text="A really long text to truncate"
  lines=2
  ellipsis="~"
}}
```

* `interactive` - enable see more/see less functionality and overpowers `showMoreButton` and `showLessButton` when `false`, deafult is `true`

```handlebars
{{line-clamp
  text="A really long text to truncate"
  interative=false
}}
```

* `showMoreButton` - enable/disable 'See More' functionality, default is `true`

```handlebars
{{line-clamp
  text="A really long text to truncate"
  showMoreButton=false
}}
```

* `showLessButton` - enable/disable 'See Less' functionality, default is `true`

```handlebars
{{line-clamp
  text="A really long text to truncate"
  showLessButton=false
}}
```

* `seeMoreText` - text to use for the 'See More' button, default is `'See More'`

* `seeLessText` - text to use for the 'See Less' button, default is `'See Less'`

```handlebars
{{line-clamp
  text="A really long text to truncate"
  showLessButton=false
  seeMoreText="Read More"
  seeLessText="Read Less"
}}
```

* `onExpand` - action/closure to trigger when text is expanded

* `onCollapse` - action/closure to trigger when text is collapsed

* `handleTruncate` - action/closure to trigger everytime the text goes through the truncation procedure, receives a boolean to determine if text was truncated

```handlebars
{{line-clamp
  text="A really long text to truncate"
  onExpand=doSomethingWhenTextIsExpanded
  onCollapse=(action "doSomethingWhenTextIsCollapsed")
  handleTruncate=(action "onHandleTruncate")
}}
```

## Contributing

* `git clone <repository-url>` this repository
* `cd ember-line-clamp`
* `npm install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
