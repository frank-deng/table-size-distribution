<a name='english'></a>

Table Size Layout
-----------------

[English](#english) | [中文](#chinese)

Calculate width of columns based on size configuration of each column.

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

Initialize an empty instance of `Layout()`.

### `const layout = new Layout(conf);`

Initialize a new instance of `Layout()` with size configuration, format of `conf` parameter is the same as the `set(conf)` method below.


API
---

### `toJSON()`

Return a copy of the size configuration in use, can be used with `JSON.stringify()`.

### `layout(size)`

Return the calculated sizes for each column.

**Parameters**

* `size` - Size of the container, must be a number greater than 0.

**Returns**

An array of sizes for each column.

**Throws**

* `TypeError` - If `size` parameter is not a number.
* `RangeError` - If `size` parameter is not greater than 0.

### `set(conf)`

Set configuration of each column.

**Parameters**

* `conf` - A non-empty array contains size configuration elemets for each column.

Each size cofiguration element may have keys `size`, `minSize`, `maxSize`, all of them are optional, while the value of the keys must be greater than 0.

`minSize` specifies a column's minimum size, while `maxSize` specifies a column's maximum size.

`size` parameter is **NOT** intended for specifing the width of a column. To specify a fixed-width column, please set `minSize` and `maxSize` with the same column width value.

`size` parameter is used for specifing the column width relative to other columns. If one column's `size` value is 2, while other columns' `size` value is 1, then the column widths 2x wider than other columns. 

Below is a example:

	[
	  {
	    "minSize":10,
	    "maxSize":200,
	    "size":1
	  },
	  {
	    "minSize":10,
	    "maxSize":200,
	    "size":2
	  },
	  {
	    "minSize":20,
	    "maxSize":20
	  }
	]

**Returns**

A reference to this instance for chaining.

**Throws**

* `TypeError` - If `conf` is not a non-empty array or array contains element with `minSize`, `maxSize`, `size` not in number type.
* `RangeError` - If `conf` array contains element with either `minSize`, `maxSize`, `size` parameter not greater than 0.


<a name='chinese'></a>

Table Size Layout
-----------------

[English](#english) | [中文](#chinese)

根据给定参数计算表格列宽。

安装
----

	npm install --save table-size-layout

引入
----

ES6/Webpack

	import Layout from 'table-size-layout';

Node.js

	const Layout=require('table-size-layout');

Script标签

	<script type='text/javascript' src='./dist/index.js'></script>


初始化
------

### `const layout = new Layout();`

新建一个空的`Layout()`实例。

### `const layout = new Layout(conf);`

使用给定的参数新建一个`Layout()`实例，参数的具体格式可参考`set(conf)`方法。


API
---

### `toJSON()`

返回一份现在使用的参数的拷贝，可配合`JSON.stringify()`使用。

### `layout(size)`

计算各个列的宽度。

**参数**

* `size` - 容器宽度，必须大于0。

**返回值**

包含各列宽度的数组。

**异常**

* `TypeError` - `size`参数不是数字格式。
* `RangeError` - `size`参数的值不是大于0的数字。

### `set(conf)`

设置每列的宽度计算参数。

**参数**

* `conf` - 非空数组，数组中每一项对应一列的宽度配置。

每个配置项可含有键`size`、`minSize`、`maxSize`，均为可选键，每个键的值均需大于0。

`minSize`指定了列的最小宽度，`maxSize`指定了列的最大宽度。

`size`参数**不能**用于指定列的宽度，如需指定固定宽度的列，请将`minSize`和`maxSize`设置成相同的值。

`size`用于指定当前列相对其它列的宽度。如果当前列的`size`值为2，而其它列的`size`值为1，则当前列的宽度为其它列的2倍。

以下为`conf`参数的范例：

	[
	  {
	    "minSize":10,
	    "maxSize":200,
	    "size":1
	  },
	  {
	    "minSize":10,
	    "maxSize":200,
	    "size":2
	  },
	  {
	    "minSize":20,
	    "maxSize":20
	  }
	]

**返回值**

返回当前对象的引用，可用于链式操作。

**异常**

* `TypeError` - `conf`不是非空数组，或数组中存在`size`、`minSize`、`maxSize`的值不为数字的情况。
* `RangeError` - `conf`数组中存在配置项中`size`、`minSize`、`maxSize`的值小于等于0的情况。
