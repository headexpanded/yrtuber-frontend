import { api } from 'boot/axios';
import type {
  Collection,
  CollectionResponse,
  CollectionsResponse,
  CreateCollectionData,
  PublishCollectionData,
  UpdateCollectionData,
} from 'src/types/Collection';
import type { ApiError } from 'src/types/User';

// Extended error type for axios errors
type AxiosError = {
  response?: {
    data: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
  request?: unknown;
  message?: string;
};

export class CollectionApiService {
  /**
   * Get all collections
   */
  static async getCollections(params?: Record<string, unknown>): Promise<CollectionsResponse> {
    try {
      const response = await api.get<CollectionsResponse>('/api/collections', {
        params,
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  /**
   * Get user's collections
   */
  static async getMyCollections(params?: Record<string, unknown>): Promise<CollectionsResponse> {
    try {
      const response = await api.get<CollectionsResponse>('/api/my-collections', {
        params,
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  /**
   * Get a specific collection
   */
  static async getCollection(id: number): Promise<Collection> {
    try {
      const response = await api.get<Collection>(`/api/collections/${id}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  /**
   * Create a new collection
   */
  static async createCollection(data: CreateCollectionData): Promise<CollectionResponse> {
    try {
      const response = await api.post<CollectionResponse>('/api/collections', data, {
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  /**
   * Update a collection
   */
  static async updateCollection(id: number, data: UpdateCollectionData): Promise<CollectionResponse> {
    try {
      const response = await api.put<CollectionResponse>(`/api/collections/${id}`, data, {
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  /**
   * Publish/unpublish a collection
   */
  static async publishCollection(id: number, data: PublishCollectionData): Promise<CollectionResponse> {
    try {
      const response = await api.patch<CollectionResponse>(`/api/collections/${id}/publish`, data, {
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  /**
   * Delete a collection
   */
  static async deleteCollection(id: number): Promise<{ message: string }> {
    try {
      const response = await api.delete<{ message: string }>(`/api/collections/${id}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  /**
   * Handle API errors
   */
  private static handleApiError(error: AxiosError): ApiError {
    if (error.response?.data) {
      const result: ApiError = {
        message: error.response.data.message || 'An error occurred'
      };

      if (error.response.data.errors) {
        result.errors = error.response.data.errors;
      }

      return result;
    }

    if (error.request) {
      return {
        message: 'Network error occurred'
      };
    }

    return {
      message: error.message || 'An unexpected error occurred'
    };
  }
}
