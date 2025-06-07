
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
    return data.loginUrl;
  } catch (error) {
    console.error('Error during auto-login:', error);
    throw error;
  }
};


export const autoLoginToYudha = async (user_id: string): Promise<string> => {
  try {
    const response = await fetch('https://tafvjwurzgpugcfidbfv.supabase.co/functions/v1/yudha-auto-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id }),
    });

    if (!response.ok) {
      throw new Error(`Auto-login failed: ${response.statusText}`);
    }

    const data = await response.json();
    // Extract the URL from the JSON response
    return data.auto_login_url;
  } catch (error) {
    console.error('Error during auto-login:', error);
    throw error;
  }
};

export const autoLoginToDrona = async (user_id: string): Promise<string> => {
  try {
    const response = await fetch('https://tafvjwurzgpugcfidbfv.supabase.co/functions/v1/drona-auto-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id }),
    });

    if (!response.ok) {
      throw new Error(`Auto-login failed: ${response.statusText}`);
    }

    const data = await response.json();
    // Extract the URL from the JSON response
    return data.login_url;
  } catch (error) {
    console.error('Error during auto-login:', error);
    throw error;
  }
};
