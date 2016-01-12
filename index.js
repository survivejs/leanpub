module.exports = function(o) {
  const apiKey = o.apiKey;
  const bookSlug = o.bookSlug;

  if (!bookSlug) {
    throw new Error('Missing `bookSlug`!');
  }

  return {
    previewFull: function (cb) {
      cb(new Error('Not implemented yet!'));
    },
    previewSubset: function (cb) {
      cb(new Error('Not implemented yet!'));
    },
    publish: function (o, cb) {
      if(!o) {
        return cb(new Error('Not implemented yet!'));
      }

      const releaseNotes = o.releaseNotes || '';

      cb(new Error('Not implemented yet!'));
    },
    jobStatus: function (cb) {
      cb(new Error('Not implemented yet!'));
    },
    bookSummary: function (cb) {
      cb(new Error('Not implemented yet!'));
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
      const format = o.format || 'json';

      if(!cb) {
        return o(new Error('Not implemented yet!'));
      }

      cb(new Error('Not implemented yet!'));
    },
    individualSales: function (o, cb) {
      if(!o) {
        return cb(new Error('Not implemented yet!'));
      }

      const page = o.page || 1;

      cb(new Error('Not implemented yet!'));
    },
    coupons: function (o, cb) {
      const format = o.format || 'json';

      if(!cb) {
        return o(new Error('Not implemented yet!'));
      }

      cb(new Error('Not implemented yet!'));
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

      if(!endDate) {
        return cb(new Error('Missing `endDate`'));
      }

      if(!maxUses) {
        return cb(new Error('Missing `maxUses`'));
      }

      cb(new Error('Not implemented yet!'));
    },
    updateCoupon: function (o, cb) {
      cb(new Error('Not implemented yet!'));
    }
  };
};
