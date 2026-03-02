/**
 * Funkcje pomocnicze do obsługi newslettera
 * Używa MailerLite API do zapisu subskrybentów.
 */

/**
 * Zapisuje adres email do newslettera przez MailerLite API.
 */
export const subscribeToNewsletter = async (email: string, source: string = 'blog', name?: string): Promise<boolean> => {
  try {
    // Sprawdzamy czy email już istnieje lokalnie (cache UI)
    const subscribers = JSON.parse(localStorage.getItem('newsletter-subscribers') || '[]');
    if (subscribers.some((sub: any) => sub.email === email)) {
      return true;
    }

    const body: Record<string, unknown> = { email };
    if (name) {
      body.fields = { name };
    }
    body.groups = [];  // brak grup — trafia do głównej listy

    const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_MAILERLITE_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    // MailerLite zwraca 200 (istniejący) lub 201 (nowy) przy sukcesie
    if (res.ok) {
      subscribers.push({ email, source, name: name || '', timestamp: new Date().toISOString() });
      localStorage.setItem('newsletter-subscribers', JSON.stringify(subscribers));
      return true;
    }

    const err = await res.json().catch(() => ({}));
    console.error('MailerLite error:', res.status, err);
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
