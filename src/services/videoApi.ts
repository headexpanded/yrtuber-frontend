import { api } from 'boot/axios';
import type {
  Video,
  VideoResponse,
  VideosResponse,
  CreateVideoData,
  CreateEnhancedVideoData,
  UpdateVideoData,
  AddVideoToCollectionData,
  UpdateVideoInCollectionData,
  YouTubeSearchResponse,
  YouTubeValidationResponse,
} from 'src/types/Video';
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

export class VideoApiService {
  /**
   * Get all videos
   */
  static async getVideos(params?: Record<string, unknown>): Promise<VideosResponse> {
    try {
      const response = await api.get<VideosResponse>('/api/videos', {
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
   * Get a specific video
   */
  static async getVideo(id: number): Promise<Video> {
    try {
      const response = await api.get<Video>(`/api/videos/${id}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  /**
   * Create a new video
   */
  static async createVideo(data: CreateVideoData): Promise<VideoResponse> {
    try {
      const response = await api.post<VideoResponse>('/api/videos', data, {
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  /**
   * Create a new video with enhanced features
   */
  static async createEnhancedVideo(data: CreateEnhancedVideoData): Promise<VideoResponse> {
    try {
      const response = await api.post<VideoResponse>('/api/enhanced-videos', data, {
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  /**
   * Update a video
   */
  static async updateVideo(id: number, data: UpdateVideoData): Promise<VideoResponse> {
    try {
      const response = await api.put<VideoResponse>(`/api/videos/${id}`, data, {
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  /**
   * Delete a video
   */
  static async deleteVideo(id: number): Promise<{ message: string }> {
    try {
      const response = await api.delete<{ message: string }>(`/api/videos/${id}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  /**
   * Search videos by YouTube ID
   */
  static async searchByYoutubeId(youtubeId: string): Promise<Video> {
    try {
      const response = await api.get<{ data: Video }>(`/api/videos/search/youtube`, {
        params: { youtube_id: youtubeId },
        withCredentials: true
      });
      return response.data.data;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  /**
   * Get videos by channel
   */
  static async getVideosByChannel(channelId: string, params?: Record<string, unknown>): Promise<VideosResponse> {
    try {
      const response = await api.get<VideosResponse>(`/api/videos/channel/${channelId}`, {
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
   * Add video to collection
   */
  static async addToCollection(collectionId: number, data: AddVideoToCollectionData): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(`/api/collections/${collectionId}/videos`, data, {
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  /**
   * Remove video from collection
   */
  static async removeFromCollection(collectionId: number, videoId: number): Promise<{ message: string }> {
    try {
      const response = await api.delete<{ message: string }>(`/api/collections/${collectionId}/videos/${videoId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  /**
   * Update video in collection
   */
  static async updateInCollection(collectionId: number, videoId: number, data: UpdateVideoInCollectionData): Promise<{ message: string }> {
    try {
      const response = await api.put<{ message: string }>(`/api/collections/${collectionId}/videos/${videoId}`, data, {
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  /**
   * Search YouTube videos
   */
  static async searchYouTube(query: string, maxResults: number = 10): Promise<YouTubeSearchResponse> {
    try {
      const response = await api.post<YouTubeSearchResponse>('/api/youtube/search', {
        query,
        max_results: maxResults
      }, {
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  /**
   * Validate YouTube URL or ID
   */
  static async validateYouTube(input: string): Promise<YouTubeValidationResponse> {
    try {
      const response = await api.post<YouTubeValidationResponse>('/api/youtube/validate', {
        input
      }, {
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  /**
   * Refresh video metadata
   */
  static async refreshMetadata(videoId: number): Promise<VideoResponse> {
    try {
      const response = await api.post<VideoResponse>(`/api/videos/${videoId}/refresh-metadata`, {}, {
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
