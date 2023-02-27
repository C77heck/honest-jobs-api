export class ProgressBar {
    public barLength: number;
    public isActive: boolean;
    public colour: string;
    private resetColour = '\x1b[0m';

    public initialize(barLength: number, colour = '\x1b[31m') {
        this.barLength = barLength;
        this.colour = colour;
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
        process.stdout.write(this.colour + `[${progressBar}>] ${percent}%` + this.resetColour);

        this.checkProgress(progress);
    }

    private checkProgress(progress: number) {
        this.isActive = progress <= this.barLength;
    }
}
