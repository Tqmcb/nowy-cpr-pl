import { toast } from "sonner";

/**
 * Validates if the provided email is in correct format
 * @param email - Email address to validate
 * @returns Boolean indicating if the email is valid
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

/**
 * Subscribes a user to the newsletter
 * 
 * In a production environment, this would likely call an API endpoint
 * that would add the email to a mailing list service (like Mailchimp, SendGrid, etc.)
 * 
 * @param email - Email address to subscribe
 * @returns Promise that resolves to a boolean indicating success
 */
export const subscribeToNewsletter = async (email: string): Promise<boolean> => {
  // Validate email before proceeding
  if (!validateEmail(email)) {
    toast.error("Proszę podać poprawny adres email");
    return false;
  }

  try {
    // In a real implementation, this would be an API call to subscribe
    // For now, we'll simulate a successful subscription with a delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate successful subscription
    toast.success("Dziękujemy za zapisanie się do newslettera!");
    return true;
  } catch (error) {
    // Handle any errors
    console.error("Error subscribing to newsletter:", error);
    toast.error("Wystąpił błąd podczas zapisywania do newslettera. Spróbuj ponownie później.");
    return false;
  }
};
