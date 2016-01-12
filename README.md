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

```bash
curl -d "api_key=YOUR_API_KEY" https://leanpub.com/SLUG/preview.json # whole book
curl -d "api_key=YOUR_API_KEY" https://leanpub.com/SLUG/preview/subset.json # Subset.txt
```

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

```bash
# publish without sending email
curl -d "api_key=YOUR_API_KEY" https://leanpub.com/SLUG/publish.json

# publish and send email
curl -d "api_key=YOUR_API_KEY" -d "publish[email_readers]=true" -d "publish[release_notes]=please+let+me+know+what+you+think" https://leanpub.com/SLUG/publish.json
```

```javascript
...

client.publish(); // silent publish
client.publish({
  releaseNotes: 'Please let me know what you think'
});
```

### Getting Job Status

To know how your current job is progressing, use:

```bash
curl "https://leanpub.com/SLUG/book_status?api_key=YOUR_API_KEY"
```

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

```bash
curl https://leanpub.com/SLUG.json
curl https://leanpub.com/SLUG.json?api_key=YOUR_API_KEY # more info
```

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

```bash
curl -L https://leanpub.com/s/some-long-uuid.pdf > yourbook.pdf
curl -L https://leanpub.com/s/some-long-uuid.epub > yourbook.epub
curl -L https://leanpub.com/s/some-long-uuid.mobi > yourbook.mobi
```

```javascript
...

// not implemented yet. PR welcome. This should stream to the given file
//client.latestVersion({format: 'pdf', output: 'yourbook.pdf'}, cb);
```

### Getting Sales Data

Sales data can be fetched in either JSON or XML like this:

```bash
curl https://leanpub.com/SLUG/sales.json?api_key=YOUR_API_KEY
curl https://leanpub.com/SLUG/sales.xml?api_key=YOUR_API_KEY
```

```javascript
...

// defaults to json. accepts xml
client.sales({format: 'xml'}, cb);
```

Individual sales can be fetched like this:

```bash
curl https://leanpub.com/SLUG/individual_purchases.json?api_key=YOUR_API_KEY
curl https://leanpub.com/SLUG/individual_purchases.json?api_key=YOUR_API_KEY&page=2
```

```javascript
...

// defaults to page 1, each page contains 50 sales
client.individualSales({page: 2}, cb);
```

### Coupons

Existing coupons can be fetched like this:

```bash
curl https://leanpub.com/SLUG/coupons.json?api_key=YOUR_API_KEY
curl https://leanpub.com/SLUG/coupons.xml?api_key=YOUR_API_KEY
```

```javascript
...

// defaults to json. accepts xml
client.coupons({format: 'xml'}, cb);
```

They can be created through `POST`:

```bash
curl -H "Content-Type: application/json" -X POST \
-d '{"coupon_code":"coupon-code-123456","package_discounts_attributes":[{"package_slug":"book","discounted_price":0.0}], \
"start_date":"2013-12-28"}' "http://leanpub.com/SLUG/coupons.json?api_key=YOUR_API_KEY"

# alternative
curl -d "coupon[coupon_code]=coupon-code-123456" -d "coupon[discounted_price]=0.0" \
 -d "coupon[start_date]=2013-10-21" -d "api_key=YOUR_API_KEY" \
-d "coupon[package_discounts_attributes][][package_slug]=book"
-d "coupon[package_discounts_attributes][][discounted_price]=0.00"
https://leanpub.com/SLUG/coupons.json
```

```javascript
...

client.createCoupon({
  couponCode: 'test coupon', // required
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

```bash
curl -H "Content-Type: application/json" -XPUT -d '{"suspended":false}' \
"https://leanpub.com/SLUG/coupons/some_coupon_code.json?api_key=YOUR_API_KEY"
```

```javascript
...

client.updateCoupon({
  couponCode: 'test coupon', // required
  suspended: true
}, cb);
```

## Alternatives

* [leanpub-client](https://www.npmjs.com/package/leanpub-client)

## License

*leanpub* is available under MIT. See LICENSE for more details.
