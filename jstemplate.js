import * as jQuery from './jquery'

export default {load}

function load(url, cb) {
    jQuery.ajax(url).
        done(function(data) {
            _displayPage(_processHtml(data));
            if (cb) {
                cb();
            }
        }).
        fail(function() {
            if (cb) {
                cb("Error loading page");
            } else {
                _displayPage(_processHtml("<h1>Error loading page.</h1>"));
            }
        });
}

function _displayPage(html) {
    var newDoc = document.open("text/html", "replace");
    newDoc.write(html.documentElement.outerHTML);
    newDoc.close();
}

function _processHtml(str) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, "text/html");

    _traverseElement(doc.documentElement);
    return doc;
}

function _copyInto(src, dest, copyInnerHTML) {
    if (copyInnerHTML) {
        dest.innerHTML = src.innerHTML;
    }
    var destElem = jQuery(dest)
    jQuery(src).each((_, srcElem) => {
        jQuery.each(srcElem.attributes, (_, srcAttr) => {
            if (srcAttr.name == "thw:id") {
                return
            }
            if (srcAttr.name.startsWith("thw:")) {
                if (srcAttr.name == "thw:_id") {
                    destElem.attr("id", srcAttr.value)
                } else {
                    destElem.attr(srcAttr.name.substring(4), srcAttr.value)
                }
            }
        })
    })
    destElem.removeAttr("thw:ref")
    destElem.removeAttr("thw:attrs")
}

function _traverseElement(elem) {
    if (elem.nodeType == Node.ELEMENT_NODE && elem.getAttribute("thw:ref")) {
        var ref = elem.getAttribute("thw:ref");
        var src = jQuery("[thw\\:id=\'"+ref+"\']");
        if (src.length > 0) {     
            var elemClone = null
            if (src.length > 1) {
                elemClone = jQuery(elem).clone()
            }  
            var toInsert = []     
            src.each((index, srcElem) => {
                if (index === 0) {
                    _copyInto(srcElem, elem, true)
                } else {
                    var destElem = elemClone.clone()
                    _copyInto(srcElem, destElem.get()[0], true)
                    toInsert.push(destElem)
                }
            })
            if (toInsert.length > 0) {
                jQuery(elem).after(toInsert)                
            }
        }
    } else if (elem.nodeType == Node.ELEMENT_NODE && elem.getAttribute("thw:attrs")) {
        var ref = elem.getAttribute("thw:attrs");
        var src = jQuery("[thw\\:id=\'"+ref+"\']");
        if (src.length > 0) {
            src.each((index, srcElem) => {
                _copyInto(srcElem, elem, false)
            })
        }
        elem.childNodes.forEach(_traverseElement);
    } else {
        elem.childNodes.forEach(_traverseElement);
    }
}