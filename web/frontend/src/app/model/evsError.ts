export class EvsError extends Error {
    displayNotification: boolean;
    displayMessage: string;
    constructor(error: Error, displayMessage: string) {
        super(error.message);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, EvsError.prototype);
        // Display the notification by default
        this.displayNotification = true;
        this.displayMessage = displayMessage;

    }
}
