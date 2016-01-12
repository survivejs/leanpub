[![build status](https://secure.travis-ci.org/survivejs/leanpub.png)](http://travis-ci.org/survivejs/leanpub)
# leanpub - Simple client for Leanpub API

This library provides a simple wrapper for [Leanpub API](https://leanpub.com/help/api). Before starting to use it, you will need to generate an API key for yourself.

## API

As the JavaScript API is missing plenty of functionality still, I've outlined curl based alternatives below. The idea is that these will be converted to JavaScript as time permits. PRs are welcome!

### Connecting to the API

To quote the official documentation:

1. Go to your [author dashboard](https://leanpub.com/author_dashboard/settings)
2. Click on the button that says "Enable the Leanpub API" and copy the API key. You are going to need it to access the API.

The API depends on your book slug: `https://leanpub.com/SLUG`.

```javascript
var leanpub = require('leanpub');
var client = leanpub({
  // optional. without this most operations won't work
  // or return partial data
  apiKey: process.env.LEANPUB,
  bookSlug: process.env.SLUG
});

...

// the API relies on optional callbacks. Example:
client.previewFull(function(err, d) {
  if(err) {
   return console.error(err);
  }

  console.log(d);
});
```

### Previewing

There are a few ways to generate a preview version of your book:

```javascript
...

client.previewFull();
client.previewSubset(); // preview based on Subset.txt

// Not supported yet. PR welcome.
// See https://leanpub.com/help/api#previewing-and-publishing for reference.
// client.previewSingle(...);
```

### Publishing

It is possible to publish a book silently or with email:

```javascript
...

client.publish(); // silent publish
client.publish({
  releaseNotes: 'Please let me know what you think'
});
```

### Getting Job Status

To know how your current job is progressing, use:

```javascript
...

client.jobStatus(function(err, d) {
  if(err) {
    return console.error(err);
  }

  console.log(d);
});
```

### Getting Book Summary Information

Leanpub provides both public and private (download urls etc.) information about books:

```javascript
...

client.bookSummary(function(err, d) {
  if(err) {
    return console.error(err);
  }

  console.log(d);
});
```

### Getting the Latest Version of the Book

You can get book urls through summary information. These should be kept secret. You can book files like this:

```javascript
...

// not implemented yet. PR welcome. This should stream to the given file
//client.latestVersion({format: 'pdf', output: 'yourbook.pdf'}, cb);
```

### Getting Sales Data

Sales data can be fetched in either JSON or XML like this:

```javascript
...

client.sales({
  format: 'xml' // defaults to json
}, cb);
```

Individual sales can be fetched like this:

```javascript
...

client.individualSales({
  format: 'xml', // defaults to json
  page: 2 // defaults to page 1, each page contains 50 sales
}, cb);
```

### Coupons

Existing coupons can be fetched like this:

```javascript
...

client.coupons({
  format: 'xml' // defaults to json
}, cb);
```

They can be created through `POST`:

```javascript
...

client.createCoupon({
  couponCode: 'testcoupon', // required
  packageDiscounts: [ // required
    {
      discountedPrice: 10,
      packageSlug: 'book'
    }
  ],
  startDate: new Date(), // required
  endDate: new Date(), // required
  maxUses: 1, // required
  note: 'test coupon', // optional
  suspended: false // optional, defaults to false
}, cb);
```

And updated through `PUT`:

```javascript
...

client.updateCoupon({
  couponCode: 'testcoupon', // required
  suspended: true
}, cb);
```

## Alternatives

* [leanpub-client](https://www.npmjs.com/package/leanpub-client)

## License

*leanpub* is available under MIT. See LICENSE for more details.
