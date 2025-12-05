// EVS error - thrown in reponse to EVSRESTAPI failures
export class EvsError extends Error {

    // Indicates whether to display a notification 
    displayNotification: boolean;
    // Error message
    displayMessage: string;

    constructor(error: any, displayMessage: string) {
        super(error.message);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, EvsError.prototype);
        this.displayMessage = displayMessage;

        // strictly for term form
        if (displayMessage === 'An error occurred submitting the form'){
            // account for if we're getting back an error message from backend
            if (error && typeof error.error === 'object') {
                if (error.error.message) {
                    this.displayMessage = error.error.message;
                }
                else if (error.error.error) {
                    this.displayMessage = error.error.error;
                }
            }
            // or if we're getting a simpler error
            else if (error && typeof error.error === 'string') {
                this.displayMessage = error.error
            }
        }

        // Display the notification by default
        this.displayNotification = true;
    }
}
