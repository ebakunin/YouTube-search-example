import { environment } from '../../environments/environment';

export const YOUTUBE_API_SEARCH_URL = `https://www.googleapis.com/youtube/v3/search?key=${environment.youtube_api_key}`;
export const YOUTUBE_API_VIDEO_URL = `https://www.googleapis.com/youtube/v3/videos?key=${environment.youtube_api_key}`;

export const MAX_RESULT_LENGTH = 10;

export enum EThumbnailKey {
    default = 'default',
    medium = 'medium',
    high = 'high',
    standard = 'standard',
    maxres = 'maxres'
}
type ThumbnailInfo = Record<EThumbnailKey, { url: string, width: number, height: number }>;

/**
 * Taken from the YouTube API search results schema.
 * @see https://developers.google.com/youtube/v3/docs/search
 */
export interface YouTubeApiResponse extends Readonly<{
    kind: 'youtube#searchListResponse'|'youtube#videoListResponse',
    nextPageToken: string,
    prevPageToken: string,
    pageInfo: {
        totalResults: number,
        resultsPerPage: number
    },
    items: YouTubeSearchResource[] | YouTubeVideoResource[]
}> {}

/**
 * Taken from the YouTube API search results schema.
 * @see https://developers.google.com/youtube/v3/docs/search
 */
export interface YouTubeSearchResource extends Readonly<{
    kind: 'youtube#searchResult',
    id: {
        videoId: string,
        channelId: string,
        playlistId: string
    }
}> {}

/**
 * Taken from the YouTube API video results schema.
 * @see https://developers.google.com/youtube/v3/docs/videos
 */
export interface YouTubeVideoResource extends Readonly<{
    kind: 'youtube#videoListResponse',
    id: string,
    snippet: {
        // datetime, ISO 8601
        publishedAt: string,
        channelId: string,
        title: string,
        description: string,
        thumbnails: ThumbnailInfo,
        channelTitle: string,
        categoryId: string,
        defaultLanguage: string,
        localized: {
            title: string,
            description: string
        }
    },
    statistics: {
        viewCount: string,
        likeCount: string,
        favoriteCount: string,
        commentCount: string
    }
}> {}

/**
 * Data structure of the videos used by the app.
 */
export class VideoData {
    id!: Readonly<YouTubeVideoResource['id']>;
    title!: Readonly<YouTubeVideoResource['snippet']['title']>;
    description!: Readonly<YouTubeVideoResource['snippet']['description']>;
    thumbnail!: {
        height: Readonly<YouTubeVideoResource['snippet']['thumbnails']['default']['height']>,
        width: Readonly<YouTubeVideoResource['snippet']['thumbnails']['default']['width']>,
        url: Readonly<YouTubeVideoResource['snippet']['thumbnails']['default']['url']>
    };
    commentCount!: Readonly<number>;

    constructor(resource: YouTubeVideoResource) {
        this.id = resource.id;
        this.title = fixText(resource.snippet.title);
        this.description = fixText(resource.snippet.description);
        this.thumbnail = {
            height: resource.snippet.thumbnails.default.height,
            width: resource.snippet.thumbnails.default.width,
            url: resource.snippet.thumbnails.default.url
        };
        this.commentCount = parseInt(resource.statistics.commentCount, 10);
    }

    get url(): string {
        return `https://youtu.be/${this.id}`;
    }
}

/**
 * Fix encoding issues from the API response.
 * @param {string} text
 */
function fixText(text: string): string {
    return text
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, `'`)
        .replace(/&#34;/g, `'`)
        .replace(/\\n/g, ' ');
}
