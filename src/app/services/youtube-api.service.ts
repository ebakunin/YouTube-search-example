import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';

import {
    YOUTUBE_API_SEARCH_URL,
    YOUTUBE_API_VIDEO_URL,
    YouTubeSearchResource,
    YouTubeApiResponse,
    YouTubeVideoResource, MAX_RESULT_LENGTH
} from '../youtube-schema/youtube-schema';

export enum ESearchOrderOptions {
    date = 'date',
    rating = 'rating',
    relevance = 'relevance'
}

@Injectable({
    providedIn: 'root'
})
export class YouTubeApiService {
    #nextPageToken!: string;
    #totalResults!: number;
    #totalResults$ = new BehaviorSubject<number | null>(null);

    constructor(private _http: HttpClient) {}

    get nextPageToken(): string {
        return this.#nextPageToken;
    }

    get totalResults$(): BehaviorSubject<number | null> {
        return this.#totalResults$;
    }

    resetSearch(): void {
        this.#nextPageToken = '';
        this.#totalResults = 0;
    }

    /**
     * Fetch keyword search results from the YouTube API.
     * Store results information for future calls.
     * @param {string} searchTerm
     * @param {ESearchOrderOptions} [order = ESearchOrderOptions.date]
     * @param {string} pageToken
     */
    keywordSearch$(
        searchTerm: string,
        order: ESearchOrderOptions = ESearchOrderOptions.date,
        pageToken?: string
    ): Observable<YouTubeSearchResource[]> {
        const searchParameters = `&q=${encodeURIComponent(searchTerm)}`
            + '&part=snippet'
            + '&type=video'
            + `&maxResults=${MAX_RESULT_LENGTH}`
            + `&order=${order}`
            + `&regionCode=US`
            + '&relevanceLanguage=en'
            + (!!pageToken ? `&pageToken=${pageToken}` : '');

        return this._http.get<YouTubeApiResponse>(YOUTUBE_API_SEARCH_URL + searchParameters).pipe(
            map((response) => {
                this.#nextPageToken = response.nextPageToken;
                this.#totalResults = response.pageInfo.totalResults;
                this.#totalResults$.next(response.pageInfo.totalResults);
                return response.items as YouTubeSearchResource[];
            })
        );
    }

    /**
     * Fetch video data from the YouTube API.
     * @param {YouTubeVideoResource['id'][]} videoIds
     */
    videoSearch$(videoIds: YouTubeVideoResource['id'][]): Observable<YouTubeVideoResource[]> {
        const searchParameters = `&part=snippet,statistics&id=${videoIds.join(',')}`;

        return this._http.get<YouTubeApiResponse>(YOUTUBE_API_VIDEO_URL + searchParameters).pipe(
            map((data) => data.items as YouTubeVideoResource[])
        );
    }
}
