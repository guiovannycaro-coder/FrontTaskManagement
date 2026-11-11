export class Tasks {

    taskId: number;
    taskTitle: string;
    taskDescription: string;
    taskStatus: string;
    taskCreatedAt: Date;
    taskAdditionalData: string;

    constructor() {
        this.taskId = 0;
        this.taskTitle = '';
        this.taskDescription = '';
        this.taskStatus = 'Pending';
        this.taskCreatedAt = new Date();
        this.taskAdditionalData = '';
    }
}