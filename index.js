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
      const couponCode = o.couponCode;
      const packageDiscounts = o.packageDiscounts;
      const startDate = o.startDate;
      const endDate = o.endDate;
      const maxUses = o.maxUses;
      const note = o.note;
      const suspended = o.suspended;

      // TODO: tidy up this logic
      if(!couponCode) {
        return cb(new Error('Missing `couponCode`'));
      }

      if(!packageDiscounts) {
        return cb(new Error('Missing `packageDiscounts`'));
      }

      if(!startDate) {
        return cb(new Error('Missing `startDate`'));
      }

      if(!maxUses) {
        return cb(new Error('Missing `maxUses`'));
      }

      const body = {
        'coupon_code': couponCode,
        'package_discounts_attributes': toUnderscore(packageDiscounts),
        'start_date': leanpubDate(startDate),
        'max_uses': maxUses,
        'note': note,
        'suspended': suspended
      };

      if(endDate) {
        body['end_date'] = leanpubDate(endDate);
      }

      req('post', '/coupons.json', body, cb);
    },
    updateCoupon: function (o, cb) {
      const couponCode = o.couponCode;
      const packageDiscounts = o.packageDiscounts;
      const startDate = o.startDate;
      const endDate = o.endDate;
      const maxUses = o.maxUses;
      const note = o.note;
      const suspended = o.suspended;
      const body = {};

      // TODO: tidy up this logic
      if(!couponCode) {
        return cb(new Error('Missing `couponCode`'));
      }

      if(packageDiscounts) {
        body['package_discounts_attributes'] = toUnderscore(packageDiscounts);
      }

      if(startDate) {
        body['start_date'] = leanpubDate(startDate);
      }

      if(endDate) {
        body['end_date'] = leanpubDate(endDate);
      }

      if(maxUses) {
        body['max_uses'] = maxUses;
      }

      if(note) {
        body['note'] = note;
      }

      if(suspended) {
        body['suspended'] = suspended;
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
