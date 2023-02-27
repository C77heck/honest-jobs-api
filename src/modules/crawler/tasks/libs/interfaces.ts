import { ProgressBar } from '../../../../libs/load-bar';

export interface Task {
    run: (progressBar: ProgressBar) => void;
}
