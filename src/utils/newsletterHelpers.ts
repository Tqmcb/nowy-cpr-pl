/**
 * Funkcje pomocnicze do obsługi newslettera
 */

/**
 * Zapisuje adres email do newslettera i wysyła powiadomienie na biuro@multicert.pl
 */
export const subscribeToNewsletter = async (email: string, source: string = 'blog', name?: string): Promise<boolean> => {
  try {
    // Sprawdzamy czy email już istnieje lokalnie
    const subscribers = JSON.parse(localStorage.getItem('newsletter-subscribers') || '[]');
    if (subscribers.some((sub: any) => sub.email === email)) {
      return true;
    }

    // Wysyłamy powiadomienie do biuro@multicert.pl
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
        subject: `Nowy zapis do newslettera — ${email}`,
        from_name: name || "Nowy subskrybent",
        replyto: email,
        email,
        source,
        timestamp: new Date().toLocaleString('pl-PL'),
        botcheck: false,
      }),
    });

    const data = await res.json();

    if (data.success) {
      subscribers.push({ email, source, name: name || '', timestamp: new Date().toISOString() });
      localStorage.setItem('newsletter-subscribers', JSON.stringify(subscribers));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Błąd podczas zapisu do newslettera:', error);
    return false;
  }
};

/**
 * Weryfikuje czy podany adres email jest prawidłowy
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};
