import fs from 'fs';

export class IngatlanHuAggregate {
    public data: any;

    public constructor(data: any) {
        this.data = data;
    }

    // todo for dev logging
    public getExistingData(path: string) {
        try {
            const rawExistingData = fs.readFileSync(path, { encoding: 'utf-8' });

            const data = JSON.parse(rawExistingData);

            if (!data?.length) {
                throw null;
            }

            return data;
        } catch (e) {
            return [];
        }
    }

    public async log(data: string) {
        const path = `${__dirname}/logs.txt`;

        const existingData = this.getExistingData(path);

        existingData.push(...data);

        const json = JSON.stringify(existingData);

        return fs.appendFile(path, json, {}, (err) => console.log(err));
    }
}
