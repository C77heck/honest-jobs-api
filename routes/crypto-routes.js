const express = require('express');
const {check} = require('express-validator')
const router = express.Router();
const {
    getLatestListings,
    getNewListings,
    getAllCryptos,
    getCryptosWithFluctuation,
    getFavourites,
    addToFavourites,
    removeFromFavourties,
    getShouldSell,
    addNewPurchase,
    updatePurchase,
    getAssets,
    deletePurchase,
    getPurcasedPrices,
} = require('../controllers/crypto-controller');
const checkAuth = require('../middleware/check-auth');

router.get('/should_sell', getShouldSell);

router.get('/latest_listings', getLatestListings);

router.use(checkAuth);

router.get('/get_select_assets', getAssets);

router.get('/new_cryptos', getNewListings);

router.get('/all_cryptos', getAllCryptos);

router.get('/get_purchases', getPurcasedPrices);

router.get('/get_changes_in_value', getCryptosWithFluctuation);

router.post('/add_new_purchase', [
    check('name').not().isEmpty().escape().trim(),
    check('symbol').not().isEmpty().escape().trim(),
    check('price').not().isEmpty().escape().trim().isNumeric(),
    check('amount').not().isEmpty().escape().trim().isNumeric(),
    check('thresholds').not().isEmpty(),
], addNewPurchase);

router.patch('/update_purchase/:id', [
    check('name').not().isEmpty().escape().trim(),
    check('symbol').not().isEmpty().escape().trim(),
    check('price').not().isEmpty().escape().trim().isNumeric(),
    check('amount').not().isEmpty().escape().trim().isNumeric(),
    check('thresholds').not().isEmpty(),
], updatePurchase);

router.get('/favourites',
    [],
    getFavourites);

router.post('/add-to-favourites',
    [check('cryptoId').not().isEmpty().escape().trim()],
    addToFavourites);

router.delete('/remove-from-favourites',
    [check('cryptoId').not().isEmpty().escape().trim()],
    removeFromFavourties);

router.delete('/delete_purchase/:id', [],
    deletePurchase);

module.exports = router;
