/**
 * Funkcje pomocnicze do obsługi newslettera
 */

/**
 * Zapisuje adres email do bazy subskrybentów newslettera
 * @param email Adres email do zapisania
 * @param source Źródło zapisu (np. blog, strona główna)
 * @param name Opcjonalne imię subskrybenta
 * @returns Promise<boolean> True jeśli zapisano pomyślnie
 */
export const subscribeToNewsletter = async (email: string, source: string = 'blog', name?: string): Promise<boolean> => {
  try {
    // Tutaj możemy dodać integrację z API do zapisu w bazie danych
    // Na razie symulujemy zapis w localStorage
    
    // Pobieramy istniejącą listę
    const subscribers = JSON.parse(localStorage.getItem('newsletter-subscribers') || '[]');
    
    // Sprawdzamy czy email już istnieje
    if (subscribers.some((sub: any) => sub.email === email)) {
      console.log('Ten email jest już zapisany do newslettera');
      return true; // Uznajemy to za sukces
    }
    
    // Dodajemy nowy wpis
    subscribers.push({
      email,
      source,
      name: name || '',
      timestamp: new Date().toISOString(),
    });
    
    // Zapisujemy zaktualizowaną listę
    localStorage.setItem('newsletter-subscribers', JSON.stringify(subscribers));
    
    console.log(`Zapisano email ${email} do newslettera`);
    return true;
  } catch (error) {
    console.error('Błąd podczas zapisu do newslettera:', error);
    return false;
  }
};

/**
 * Weryfikuje czy podany adres email jest prawidłowy
 * @param email Adres email do weryfikacji
 * @returns boolean True jeśli adres jest prawidłowy
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};
