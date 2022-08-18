import { BaseQueryHandler } from './base-query.handler';

export class AdQueryHandler extends BaseQueryHandler {
    public customQueryHandler(): any {
        const rawQuery = this.query;
        const query: any = {};
        for (const key in rawQuery) {
            switch (key) {
                case 'what':
                    query.title = { $regex: rawQuery[key], $options: 'is' };
                    break;
                case 'where':
                    query.location = { $regex: rawQuery[key], $options: 'is' };
                    break;
                default:
                    query[key] = { $regex: rawQuery[key], $options: 'is' };
                    break;
            }
        }

        return query;
    }
}
