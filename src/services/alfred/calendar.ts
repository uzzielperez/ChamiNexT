import type { CalendarEvent } from '../../components/alfred/data';

const API_URL = 'http://localhost:3001';

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

export const calendarService = {
  // Get the Google Auth URL from the backend
  getGoogleAuthUrl: async () => {
    const response = await fetch(`${API_URL}/auth/google/url`);
    const data = await response.json();
    return data.url;
  },

  // Exchange the code for tokens
  exchangeCodeForTokens: async (code: string): Promise<GoogleTokens> => {
    const response = await fetch(`${API_URL}/auth/google/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    return response.json();
  },

  // Fetch Google events via the backend proxy
  fetchGoogleEvents: async (accessToken: string): Promise<CalendarEvent[]> => {
    const response = await fetch(`${API_URL}/calendar/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: accessToken })
    });
    
    const data = await response.json();
    
    // Map raw Google events to our internal CalendarEvent structure
    return data.map((item: any) => ({
      id: item.id,
      title: item.summary,
      start: item.start?.dateTime || item.start?.date || '',
      end: item.end?.dateTime || item.end?.date || '',
      source: 'google' as const,
      isAllDay: !!item.start?.date
    }));
  }
};
