// EVS error - thrown in reponse to EVSRESTAPI failures
export class EvsError extends Error {

    // Indicates whether to display a notification 
    displayNotification: boolean;
    // Error message
    displayMessage: string;

    constructor(error: Error, displayMessage: string) {
        super(error.message);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, EvsError.prototype);
        this.displayMessage = displayMessage;

        // Display the notification by default
        this.displayNotification = true;
    }
}
