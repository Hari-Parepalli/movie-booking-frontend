// API service for backend communication
const API_BASE_URL = 'http://localhost:5000/api';

// Fallback mock data when backend is unavailable
const MOCK_MOVIES: any[] = [
  {
    id: '1',
    title: 'The Last Guardian',
    genre: 'Adventure',
    rating: 8.5,
    description: 'An epic adventure of friendship and survival',
    poster_url: 'https://via.placeholder.com/300x450/2d3748/ffffff?text=The+Last+Guardian',
    release_date: '2024-04-15',
  },
  {
    id: '2',
    title: 'Cosmic Quest',
    genre: 'Sci-Fi',
    rating: 8.2,
    description: 'Journey through the cosmos with stunning visuals',
    poster_url: 'https://via.placeholder.com/300x450/2d3748/ffffff?text=Cosmic+Quest',
    release_date: '2024-04-20',
  },
  {
    id: '3',
    title: 'Love in Paris',
    genre: 'Romance',
    rating: 7.8,
    description: 'A romantic tale set in the City of Light',
    poster_url: 'https://via.placeholder.com/300x450/2d3748/ffffff?text=Love+in+Paris',
    release_date: '2024-04-25',
  },
  {
    id: '4',
    title: 'Mystery Manor',
    genre: 'Thriller',
    rating: 8.0,
    description: 'Unravel the secrets hidden within the manor',
    poster_url: 'https://via.placeholder.com/300x450/2d3748/ffffff?text=Mystery+Manor',
    release_date: '2024-05-01',
  },
  {
    id: '5',
    title: 'Laughter Inc',
    genre: 'Comedy',
    rating: 7.5,
    description: 'A hilarious comedy that will keep you laughing',
    poster_url: 'https://via.placeholder.com/300x450/2d3748/ffffff?text=Laughter+Inc',
    release_date: '2024-05-05',
  },
];

interface RequestOptions {
  headers?: HeadersInit;
  token?: string;
}

interface AuthResponse {
  message: string;
  token: string;
  userId: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface Movie {
  id: string;
  title: string;
  genre: string;
  rating?: number;
  description?: string;
  poster_url?: string;
  release_date?: string;
  created_at?: string;
}

interface Booking {
  id: string;
  user_id: string;
  movie_id: string;
  seats: number;
  booking_date: string;
  total_price: number;
  status: 'confirmed' | 'cancelled';
  created_at: string;
  title?: string;
  poster_url?: string;
}

class ApiService {
  private baseUrl: string = API_BASE_URL;

  private async request<T>(
    endpoint: string,
    options: RequestInit & RequestOptions = {}
  ): Promise<T> {
    const { token, headers: customHeaders, ...fetchOptions } = options;
    
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    if (customHeaders) {
      if (typeof customHeaders === 'object' && !Array.isArray(customHeaders)) {
        Object.entries(customHeaders as Record<string, string>).forEach(([key, value]) => {
          headers.set(key, value);
        });
      }
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchOptions,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      // Network or fetch error
      if (error instanceof TypeError) {
        throw new Error('Backend is unavailable');
      }
      throw error;
    }
  }

  // Auth endpoints
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Movie endpoints
  async getMovies(): Promise<Movie[]> {
    try {
      return await this.request('/movies', {
        method: 'GET',
      });
    } catch (error) {
      // If backend is unavailable, return mock data silently
      console.warn('Using mock movie data - backend unavailable');
      return MOCK_MOVIES;
    }
  }

  async getMovieById(movieId: string): Promise<Movie> {
    return this.request(`/movies/${movieId}`, {
      method: 'GET',
    });
  }

  async createMovie(
    title: string,
    genre: string,
    description?: string,
    rating?: number,
    posterUrl?: string,
    releaseDate?: string,
    token?: string
  ): Promise<{ message: string; movieId: string; movie: Movie }> {
    return this.request('/movies', {
      method: 'POST',
      body: JSON.stringify({
        title,
        genre,
        description,
        rating,
        posterUrl,
        releaseDate,
      }),
      token,
    });
  }

  // Booking endpoints
  async createBooking(
    userId: string,
    movieId: string,
    seats: number,
    seatNames: string,
    bookingDate: string,
    totalPrice: number,
    token: string
  ): Promise<{ success?: boolean; message?: string; bookingId?: string; booking?: Booking }> {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        movieId,
        seats,
        seatNames,
        bookingDate,
        totalPrice,
      }),
      token,
    });
  }

  async getUserBookings(userId: string, token: string): Promise<Booking[]> {
    return this.request(`/bookings/user/${userId}`, {
      method: 'GET',
      token,
    });
  }

  async getBookingById(bookingId: string, token: string): Promise<Booking> {
    return this.request(`/bookings/${bookingId}`, {
      method: 'GET',
      token,
    });
  }

  async cancelBooking(bookingId: string, token: string): Promise<{ message: string }> {
    return this.request(`/bookings/${bookingId}`, {
      method: 'DELETE',
      token,
    });
  }

  async sendBookingConfirmationEmail(
    bookingId: string,
    email: string,
    token: string
  ): Promise<{ message: string; success: boolean }> {
    return this.request(`/bookings/${bookingId}/send-email`, {
      method: 'POST',
      body: JSON.stringify({ email }),
      token,
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request('/health', {
      method: 'GET',
    });
  }
}

export const apiService = new ApiService();
export type { Movie, Booking, AuthResponse };
