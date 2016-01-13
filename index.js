var request = require('request');
var moment = require('moment');

module.exports = function(o) {
  const apiKey = o.apiKey;
  const bookSlug = o.bookSlug;

  if (!bookSlug) {
    throw new Error('Missing `bookSlug`!');
  }

  const urlRoot = 'https://leanpub.com/' + bookSlug;

  return {
    previewFull: function (cb) {
      req('get', '/preview.json', {}, cb);
    },
    previewSubset: function (cb) {
      req('get', '/preview/subset.json', {}, cb);
    },
    publish: function (o, cb) {
      if(!cb) {
        return req('post', '/publish.json', {}, o);
      }

      const releaseNotes = o.releaseNotes || '';

      req('post', '/publish.json', {
        'publish[email_readers]': true,
        'publish[release_notes]': releaseNotes
      }, cb);
    },
    jobStatus: function (cb) {
      req('get', '/book_status', {}, cb);
    },
    bookSummary: function (cb) {
      req('get', '.json', {}, cb);
    },
    latestVersion: function (o, cb) {
      const format = o.format;
      const output = o.output;

      if(!format) {
        return cb(new Error('Missing `format`'));
      }

      if(!output) {
        return cb(new Error('Missing `output`'));
      }

      cb(new Error('Not implemented yet!'));
    },
    sales: function (o, cb) {
      if(!cb) {
        return req('get', '/sales.json', {}, o);
      }

      const format = o.format || 'json';

      req('get', '/sales.' + format, {}, cb);
    },
    individualSales: function (o, cb) {
      if(!cb) {
        return req('get', '/individual_purchases.json', {}, o);
      }

      const format = o.format || 'json';
      const page = o.page || 1;

      req('get', '/individual_purchases.' + format + '?page=' + page, {}, cb);
    },
    coupons: function (o, cb) {
      if(!cb) {
        return req('get', '/coupons.json', {}, o);
      }

      const format = o.format || 'json';

      req('get', '/coupons.' + format, {}, cb);
    },
    createCoupon: function (o, cb) {
      // TODO: tidy up this logic
      if(!o.couponCode) {
        return cb(new Error('Missing `couponCode`'));
      }

      if(!o.packageDiscounts) {
        return cb(new Error('Missing `packageDiscounts`'));
      }

      if(!o.startDate) {
        return cb(new Error('Missing `startDate`'));
      }

      if(!o.maxUses) {
        return cb(new Error('Missing `maxUses`'));
      }

      const body = {
        'coupon_code': o.couponCode,
        'package_discounts_attributes': toUnderscore(o.packageDiscounts),
        'start_date': leanpubDate(o.startDate),
        'max_uses': o.maxUses,
        'note': o.note,
        'suspended': o.suspended
      };

      if(o.endDate) {
        body['end_date'] = leanpubDate(o.endDate);
      }

      req('post', '/coupons.json', body, cb);
    },
    updateCoupon: function (o, cb) {
      const couponCode = o.couponCode;
      const body = {};

      // TODO: tidy up this logic
      if(!couponCode) {
        return cb(new Error('Missing `couponCode`'));
      }

      if('packageDiscounts' in o) {
        body['package_discounts_attributes'] = toUnderscore(o.packageDiscounts);
      }

      if('startDate' in o) {
        body['start_date'] = leanpubDate(o.startDate);
      }

      if('endDate' in o) {
        body['end_date'] = leanpubDate(o.endDate);
      }

      if('maxUses' in o) {
        body['max_uses'] = o.maxUses;
      }

      if('note' in o) {
        body['note'] = o.note;
      }

      if('suspended' in o) {
        body['suspended'] = o.suspended;
      }

      req('put', '/coupons/' + couponCode + '.json', body, cb);
    }
  };

  function leanpubDate(date) {
    return moment(date).format('YYYY-MM-DD');
  }

  function toUnderscore(discounts) {
    return (discounts || []).map(function(discount) {
      return {
        'discounted_price': discount.discountedPrice,
        'package_slug': discount.packageSlug
      };
    });
  }

  function req(method, resource, body, cb) {
    request({
      method: method,
      url: urlRoot + resource,
      qs: {
        'api_key': apiKey
      },
      body: body,
      json: true
    }, function (err, d) {
      if(err) {
        return cb(err);
      }

      cb(null, d.body);
    });
  }
};
