import {MongoClient} from 'mongodb';

export class MongoHelper {
    public static client: MongoClient;
    public static url: string = "mongodb://localhost:27017";
    public static dbName: string = "charrez_architecture";

    constructor() {
    }

    public static connect(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            MongoClient.connect(this.url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }, (err, client: MongoClient) => {
                if (err) {
                    reject(err);
                } else {
                    this.client = client;
                    resolve(client);
                }
            });
        });
    }

    public static disconnect() {
        MongoHelper.client.close((err) => {
            if (err) {
                return err;
            }
            return;
        });
    };

    public static db() {
        return this.client.db(this.dbName)
    }
}

