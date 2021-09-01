const {Datastore} = require('@google-cloud/datastore');

const datastore = new Datastore();

const getData = async (restaurant_id) => {
    let query = datastore.createQuery('food');
    if(restaurant_id){
        query = query.filter('restaurant_id', '=', restaurant_id);
    }
    return await datastore.runQuery(query);
};

exports.getFood = async (req, res) => {
    if (req.method !== 'GET') {
        // Return a "method not allowed" error
        return res.status(405).end();
    }
    let data = [];
    let restaurant_id;
    if(req.query && req.query.restaurant_id){
        restaurant_id = req.query.restaurant_id;
    }
    data = await getData(restaurant_id);
    res.send({'data':data, status: 'success', msg: 'Food item/s found.'});
};