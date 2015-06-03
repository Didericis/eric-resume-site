var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Didericis.com', requirejs: '//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.18/require.js', app: '/js/app.js'});
});

module.exports = router;
