import { MongoClient } from 'mongodb';
import {
  ObjectId
} from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    '$match': {
      'product': new ObjectId('6863c60523ea10fde752043e')
    }
  }, {
    '$group': {
      '_id': null, 
      'averageRating': {
        '$avg': '$rating'
      }, 
      'numberOfReviews': {
        '$sum': 1
      }
    }
  }
];

const client = await MongoClient.connect(
  'mongodb+srv://shem1:church@shemapp.ylcv6.mongodb.net/06-JOBS-API?retryWrites=true&w=majority&appName=shemApp'
);
const coll = client.db('10-e-commerce').collection('reviews');
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();