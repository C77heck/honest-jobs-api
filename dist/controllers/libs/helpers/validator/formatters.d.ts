export declare type FormatterFunction<TValue> = (value: TValue) => TValue;
export declare const trim: FormatterFunction<string>;
export declare const escape: FormatterFunction<string>;
