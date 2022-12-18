import { Application } from '../../application/application';

export interface Task {
    application: Application;
    run: () => void;
}
