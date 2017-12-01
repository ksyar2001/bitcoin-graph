const express = require('express');
const router = express.Router();

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/posts', (req, res) => {
	res.status(200).json({userid: "123", pwd: "123"});
})

module.exports = router;