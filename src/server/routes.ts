import express from 'express';

// redirect the user to the correct page
const router = express.Router();
router.get('/', function(req, res){
    res.render('index');
});
export default router;