

export const autoLoginToAstra = async (userId: string): Promise<string> => {
  try {
    const response = await fetch('https://tafvjwurzgpugcfidbfv.supabase.co/functions/v1/auto-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Auto-login failed: ${response.statusText}`);
    }

    const data = await response.json();
    // Extract the URL from the JSON response
    return data.url || data.redirectUrl || data;
  } catch (error) {
    console.error('Error during auto-login:', error);
    throw error;
  }
};

