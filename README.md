# Dynamic templating for HTML pages

A source page contains a collection of HTML elements those will be included 
in the HTML template in the extension points:

```html
<!-- copy thw: attributes to the destination element -->
<div thw:ngApplication="sample-app" thw:id="application"></div>

<!-- copy the contents and thw: attributes to the destination element -->
<div thw:id="body" thw:_id="id1" thw:test="test_attr">
    <ul>
        <li>Item1</li>
        <li>Item2</li>
    </ul>
</div>
<!-- multiple elements with the same thw:id will result in multiple
     copies at the extension point -->
<div thw:id="body" thw:_id="id2">
    <ul>
        <li>Item3</li>
        <li>Item4</li>
    </ul>
</div>

<!-- works for scripts as well -->
<script type="text/plain" thw:id="script">
    console.log("Test1")
</script>
<script type="text/plain" thw:id="script">
    console.log("Test2")
</script>

<!-- this script actually applies the template -->
<script type="text/javascript" src="../jstemplate.src.js"></script>
<script>
    jstemplate.load("layout.html")
</script>
```

The template looks like follows:

```html
<!doctype html>
<html thw:attrs="application">
    <head>
        <style>
            .body {
                border: 1px solid black;
            }
        </style>
    </head>
    <body>
        <h1>Hello World!</h1>
        <div thw:ref="body" class="body"></div>
        <script thw:ref="script"></script>
    </body>
</html>
```

# Extension points

* `thw:attrs=<id>` -- copy the `thw:` attributes from the element `[thw:id=<id>]`. When
  attributes are copied the `thw:` prefix is removed. `thw:_id` attribute gets copied into `id`
* `thw:ref=<id>` -- copy the `thw:` attributes and the inner HTML content from the element `[thw:id=<id>]`. 
  When multiple elements with the same `thw:id` exist, multiple copies are inserted in the
  extension point
