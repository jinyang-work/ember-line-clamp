# ember-line-clamp

[![Build Status](https://travis-ci.org/Luinova/ember-line-clamp.svg?branch=master)](https://travis-ci.org/Luinova/ember-line-clamp)
[![npm version](https://badge.fury.io/js/ember-line-clamp.svg)](https://badge.fury.io/js/ember-line-clamp)
[![dependencies Status](https://david-dm.org/Luinova/ember-line-clamp/status.svg)](https://david-dm.org/Luinova/ember-line-clamp)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![GitHub issues](https://img.shields.io/github/issues/Luinova/ember-line-clamp.svg)](https://github.com/Luinova/ember-line-clamp/issues)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/Luinova/ember-line-clamp/master/LICENSE.md)

This Ember addon provides a component for truncating/clamping text.

* Note: This component currently does not support block form.

## Intallation

* `npm install ember-line-clamp`

## Demo

Demo application **coming soon**

## Usage

To get started, place the `line-clamp` component in one of your templates and provide a string to the `text` attribute. The `line-clamp` component supports other attributes, for more details you can always look at the source code.

### `text`

The text attribute is not required but would be nice to truncate something.

Default: ` `

```handlebars
{{line-clamp
  text="A really long text to truncate"
}}
```

### `lines`

This attribute allows you to set the number of lines to clamp the text.

Default: `3`

```handlebars
{{line-clamp
  text="A really long text to truncate"
  lines=2
}}
```

### `stripText`

This attribute allows user to prevent stripping text of `<br>` tags when clamping.

Default: `true`

```handlebars
{{line-clamp
  text="A really long text to truncate"
  lines=2
  stripText=false
}}
```

### `ellipsis`

The characters/string to be used as the overflow element.

Default: `...`

```handlebars
{{line-clamp
  text="A really long text to truncate"
  lines=2
  ellipsis="~"
}}
```

### `interactive`

Line clamp is not always interactive, in fact if you use `-webkit-line-clamp` there is not interqaction enabled. This attribute allows you to enable see more/see less functionality and overpowers `showMoreButton` and `showLessButton` when `false`. In cases where you do not want any interaction `-webkit-line-clamp` is used in the background to save work.

Default: `true`

```handlebars
{{line-clamp
  text="A really long text to truncate"
  interactive=false
}}
```

### `useJsOnly`

Some users for some unknown reason might like to disable the native CSS solution when available, we want to keep them happy.

Default: `false`

```handlebars
{{line-clamp
  text="A really long text to truncate"
  interactive=false
  useJsOnly=true
}}
```

### `truncate`

Some users might not like our style for the component, and they would like to do some fancy stuff. You can use this attribute to control truncation from outside the component and have a button that controls the truncation.

Default: `true`

```handlebars
{{line-clamp
  text="A really long text to truncate"
  interactive=false
  truncate=truncate
}}
<button class="super-fancy-style" {{action "toggleTruncate"}}>{{buttonText}}</button>
```

### `showMoreButton`

This attribute enables/disables 'See More' functionality

Default: `true`

```handlebars
{{line-clamp
  text="A really long text to truncate"
  showMoreButton=false
}}
```

### `showLessButton`

This attribute enables/disables 'See Less' functionality

Default: `true`

```handlebars
{{line-clamp
  text="A really long text to truncate"
  showLessButton=false
}}
```

### `seeMoreText`

This component should work in any language, hence this attribute allows you to set the text for the 'See More' button

Default: `See More`

```handlebars
{{line-clamp
  text="A really long text to truncate"
  showLessButton=false
  seeMoreText="Ver Más"
}}
```

### `seeLessText`

This component should work in any language, hence this attribute allows you to set the text for the 'See Less' button

Default: `See Less`

```handlebars
{{line-clamp
  text="A really long text to truncate"
  showLessButton=false
  seeMoreText="Read More"
  seeLessText="Read Less"
}}
```

### `onExpand`

This attribuet allows you to pass an action/closure to trigger when text is expanded

```handlebars
{{line-clamp
  text="A really long text to truncate"
  onExpand=doSomethingWhenTextIsExpanded
}}
```

### `onCollapse`

This attribuet allows you to pass an action/closure to trigger when text is collapsed

```handlebars
{{line-clamp
  text="A really long text to truncate"
  onExpand=doSomethingWhenTextIsExpanded
  onCollapse=(action "doSomethingWhenTextIsCollapsed")
}}
```

### `handleTruncate`

This attribuet allows you to pass an action/closure to trigger everytime the text goes through the truncation procedure, receives a boolean to determine if text was truncated

```handlebars
{{line-clamp
  text="A really long text to truncate"
  onExpand=doSomethingWhenTextIsExpanded
  onCollapse=(action "doSomethingWhenTextIsCollapsed")
  handleTruncate=(action "onHandleTruncate")
}}
```

## Dev TODOs

- [ ] demo page
- [ ] support block form

## Thanks

* [CSS Line Clamping](http://guerillalabs.co/blog/css-line-clamping.html) article
* [@nilsynils](https://github.com/nilsynils) for his [Medium Post](https://medium.com/mofed/css-line-clamp-the-good-the-bad-and-the-straight-up-broken-865413f16e5)
* [@One-com](https://github.com/One-com) for a [inspiration](https://github.com/One-com/react-truncate)

