export interface ProgressBarOptions {
    barLength: number;
    name: string;
    colour?: string;
}

export class ProgressBar {
    public barLength: number;
    public isActive: boolean;
    public colour: string;
    public name: string;
    private resetColour = '\x1b[0m';

    public initialize(options: ProgressBarOptions) {
        this.barLength = options.barLength;
        this.name = options.name;
        this.colour = options?.colour || '\x1b[31m';
        this.isActive = true;
    }

    public next(progress: number) {
        if (!this.isActive) {
            return;
        }

        const percent = Math.round((progress / this.barLength) * 100);
        const progressBar = '='.repeat(progress);

        process.stdout.clearLine(-1);
        process.stdout.cursorTo(0);
        process.stdout.write(this.colour + `[${progressBar}>] ${percent}% => ${this.name}` + this.resetColour);

        this.checkProgress(progress);
    }

    private checkProgress(progress: number) {
        this.isActive = progress <= this.barLength;
    }
}
