export class Users {

    usuId: number;
    usuNames: string;
    usuEmail: string;
    usuPassword: string;
    usuIsActive: boolean;
    usuRolId: number;
    roles: any;

    constructor() {
        this.usuId = 0;
        this.usuNames = '';
        this.usuEmail = '';
        this.usuPassword = '';
        this.usuIsActive = true;
        this.usuRolId = 0;
        this.roles = null;
    }
}