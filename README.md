Table Size Layout
-----------------

Calculate column width or row height based on given parameters.

Installation
------------

	npm install --save table-size-layout

Import
------

ES6/Webpack

	import Layout from 'table-size-layout';

Node.js

	const Layout=require('table-size-layout');

Script Tag

	<script type='text/javascript' src='./dist/index.js'></script>


Initialization
--------------

### `const layout = new Layout();`

Initialize a new instance of `Layout()` without size configuration.

### `const layout = new Layout(conf);`

Initialize a new instance of `Layout()` with size configuration.


API
---

### `toJSON()`

Return a copy of the size configuration in use, can be used with `JSON.stringify()`.

### `layout(size)`

Return the calculated sizes for each column.

**Parameters**

* `size` - Size of the container, must be a number greater than 0.

**Returns**

An array contains sizes for each column.

**Throws**

* `TypeError` - If `size` parameter is not a number.
* `RangeError` - If `size` parameter is not greater than 0.

### `set(conf)`

Set configuration of each column.

**Parameters**

* `conf` - A non-empty array contains size configurations for each column.

**Returns**

A reference to this instance for chaining.

**Throws**

* `TypeError` - If `conf` is not a non-empty array or array contains element with data in wrong type.
* `RangeError` - If `conf` array contains element with either `minSize`, `maxSize`, `size` parameter not greater than 0.

