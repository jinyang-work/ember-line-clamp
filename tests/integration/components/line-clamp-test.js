import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('line-clamp', 'Integration | Component | line clamp', {
  integration: true
});

test('inline form works as expeted', function(assert) {

  this.render(hbs`<div style="width: 300px; font-size: 16px; font-family: sans-serif;">
    {{line-clamp
      text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
    }}
  </div>`);

  const element = this.$()[0];
  const lines = Array.from(element.querySelectorAll('.lt-line-clamp__line'));
  const lastLine = lines[lines.length - 1];
  const lastLineChildren = lastLine.children;
  const ellipsisElement = lastLineChildren[0];
  const seeMoreButton = ellipsisElement.children[0];
  const dummyEllipsis = element.querySelectorAll('.lt-line-clamp--dummy');

  assert.ok(
    element,
    'line clamp target exists'
  );

  assert.equal(
    lines.length,
    3,
    'text is clamped at 3 lines (default)'
  );

  // This test a bit flaky, depends on the width of div and knowing 'helloworld helloworld' will be a line
  // assert.ok(
  //   lines.slice(0,2)
  //     .every((line) => line.innerText.trim() === 'helloworld helloworld'),
  //   'first lines contain expected text'
  // );

  // This is a better test since we know the truncation will push 'helloworld' to a new line if it does not fit
  assert.ok(
    lines.slice(0,2)
      .every((line) => line.innerText.trim().split(' ')[0] === 'helloworld'),
    'first lines contain expected text'
  );

  assert.ok(
    lastLine.classList.contains('lt-line-clamp__line--last'),
    'lt-line-clamp__line--last is applied to last line'
  );

  assert.equal(
    lastLineChildren.length,
    1,
    'last line contains 1 child'
  );

  assert.ok(
    ellipsisElement,
    'last line child is the ellipsis element and it exists'
  );

  assert.ok(
    ellipsisElement.classList.contains('lt-line-clamp__ellipsis'),
    'ellipsis element contains right CSS class'
  );

  assert.equal(
    ellipsisElement.innerText,
    '... See More',
    'Ellipsis element contains expetend ellipsis and see more text'
  );

  assert.ok(
    seeMoreButton,
    'see more button exists'
  );

  assert.ok(
    seeMoreButton.classList.contains('lt-line-clamp__more'),
    'see more button contains right CSS class'
  );

  assert.equal(
    seeMoreButton.innerText,
    'See More',
    'see more button contains expected text'
  );

  assert.ok(
    dummyEllipsis,
    'dummy ellipsis element exists'
  );

  assert.equal(
    element.innerText.trim(),
    'helloworld helloworld helloworld helloworld hellowor... See More'
  );
});
