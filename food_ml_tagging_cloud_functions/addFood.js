// Code Reference:
// https://cloud.google.com/functions/docs/samples/functions-http-form-data

/**
 * Parses a 'multipart/form-data' upload request
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
const path = require('path');
const os = require('os');
const fs = require('fs');

// Node.js doesn't have a built-in multipart/form-data parsing library.
// Instead, we can use the 'busboy' library from NPM to parse these requests.
const Busboy = require('busboy');

const {Datastore} = require('@google-cloud/datastore');
const {Storage} = require('@google-cloud/storage');
const aiplatform = require('@google-cloud/aiplatform');


const datastore = new Datastore();
const storage = new Storage();


const insertData = async (data) => {
    const Key = datastore.key('food');
    const entity = {
        key: Key,
        data: data,
    };
    await datastore.upsert(entity);
    return Key;
};

const uploadFile = async (bucketName, filePath, fileName) => {
    await storage.bucket(bucketName).upload(filePath, {
        destination: fileName,
    });
};

const getPrediction = async (text) => {
    const {instance, prediction} =
        aiplatform.protos.google.cloud.aiplatform.v1.schema.predict;

    const {PredictionServiceClient} = aiplatform.v1;

    const predictionServiceClient = new PredictionServiceClient({
        apiEndpoint: 'us-central1-aiplatform.googleapis.com',
    });

    const endpoint = `projects/csci5410-316320/locations/us-central1/endpoints/3062922735635136512`;

    const predictionInstance =
        new instance.TextClassificationPredictionInstance({
            content: text,
        });

    const instanceValue = predictionInstance.toValue();

    const instances = [instanceValue];
    const request = {
        endpoint,
        instances,
    };

    const [response] = await predictionServiceClient.predict(request);

    const predictions = [];

    for (const predictionResultValue of response.predictions) {
        const predictionResult =
            prediction.ClassificationPredictionResult.fromValue(
                predictionResultValue
            );

        for (const [i, label] of predictionResult.displayNames.entries()) {
            let item = {"label": label, "confidence": predictionResult.confidences[i]};
            predictions.push(item)
        }
    }

    let maxConfidence = Math.max(...predictions.map(e => e.confidence));
    return predictions.find(prediction => prediction.confidence === maxConfidence);
};

exports.addFood = (req, res) => {
    if (req.method !== 'POST') {
        // Return a "method not allowed" error
        return res.status(405).end();
    }
    const busboy = new Busboy({headers: req.headers});
    const tmpdir = os.tmpdir();

    // This object will accumulate all the fields, keyed by their name
    const fields = {};

    // This object will accumulate all the uploaded files, keyed by their name.
    const uploads = {};
    const uploadNames = {};

    // This code will process each non-file field in the form.
    busboy.on('field', (fieldname, val) => {
        console.log(`Processed field ${fieldname}: ${val}.`);
        fields[fieldname] = val;
    });

    const fileWrites = [];


    // This code will process each file uploaded.
    busboy.on('file', (fieldname, file, filename) => {
        // Note: os.tmpdir() points to an in-memory file system on GCF
        // Thus, any files in it must fit in the instance's memory.
        console.log(`Processed file ${filename}`);
        const filepath = path.join(tmpdir, filename);
        uploads[fieldname] = filepath;
        uploadNames[fieldname] = filename;

        const writeStream = fs.createWriteStream(filepath);
        file.pipe(writeStream);

        // File was processed by Busboy; wait for it to be written.
        // Note: GCF may not persist saved files across invocations.
        // Persistent files must be kept in other locations
        // (such as Cloud Storage buckets).
        const promise = new Promise((resolve, reject) => {
            file.on('end', () => {
                writeStream.end();
            });
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
        fileWrites.push(promise);
    });

    // Triggered once all uploaded files are processed by Busboy.
    // We still need to wait for the disk writes (saves) to complete.
    busboy.on('finish', async () => {
        await Promise.all(fileWrites);

        const bucketName = 'hfxfoodie-sapp2';
        for (const file in uploads) {
            await uploadFile(bucketName,uploads[file],uploadNames[file]);
            fs.unlinkSync(uploads[file]);
        }

        const restaurant_id = fields['restaurant_id'];
        const title = fields['title'];
        const description = fields['description'];
        const thumbnail = `https://storage.googleapis.com/${bucketName}/${uploadNames['thumbnail']}`;
        const prediction = await getPrediction(description);
        const data = { restaurant_id, title, description, thumbnail, prediction };

        await insertData(data);

        res.send({status: 'success', msg: 'Food item successfully added.'});
    });

    busboy.end(req.rawBody);
};