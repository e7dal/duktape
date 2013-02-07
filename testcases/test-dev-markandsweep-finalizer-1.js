/*---
{
    "custom": true
}
---*/

/*===
nulling
nulled
finalizer, foo -> 123
===*/

var a;
var b;

/* Note: values are created inside function to ensure that no references
 * to them may remain in temporary registers of the global function.
 * There is currently no guarantee that temporary values do not keep a
 * value reachable during function execution.
 */
function init() {
    a = { foo: 123 };
    b = {}

    __duk__.setFinalizer(a, function (x) {
        print('finalizer, foo ->', x.foo);
    });

    // circular reference prevents refcount collection
    a.bar = b;
    b.bar = a;
}

init();

// refcount does not finalize here
print('nulling')
a = null;
b = null;
print('nulled')

// mark-and-sweep finalizing happens here if refcount disabled
__duk__.gc();

