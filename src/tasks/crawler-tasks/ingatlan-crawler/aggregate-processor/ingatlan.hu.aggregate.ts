import fs from 'fs';

export class IngatlanHuAggregate {
    public data: any;

    public constructor(data: any) {
        this.data = data;

        this.log(data);
    }

    public async log(data: string) {
        return fs.writeFileSync(`${__dirname}/logs.txt`, data);
    }
}
