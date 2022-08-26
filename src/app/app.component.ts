import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import {
    BehaviorSubject,
    debounceTime,
    distinctUntilChanged,
    EMPTY,
    filter,
    map,
    of,
    Subject,
    switchMap,
    take,
    takeUntil
} from 'rxjs';

import { ESearchOrderOptions, YouTubeApiService } from './services/youtube-api.service';
import { MAX_RESULT_LENGTH, VideoData, YouTubeSearchResource } from './youtube-schema/youtube-schema';
import './web-components/video-card';
import './web-components/loading-symbol';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy, OnInit {
    videoData: VideoData[] = [];

    readonly form = new FormGroup({
        searchTerm: new FormControl<string>(''),
        sort: new FormControl<ESearchOrderOptions>(ESearchOrderOptions.date)
    });

    readonly searchOrderOptions: string[] = [
        ESearchOrderOptions.date,
        ESearchOrderOptions.rating,
        ESearchOrderOptions.relevance
    ];

    readonly totalResults$ = this._youtubeApiService.totalResults$;
    readonly isLoading$ = new BehaviorSubject<boolean>(false);
    readonly copyrightYear = new Date().getFullYear();

    #currentResultCount = 0;
    readonly #onDestroy$ = new Subject<void>();

    constructor(private _cdr: ChangeDetectorRef, private _youtubeApiService: YouTubeApiService) {}

    /**
     *
     */
    ngOnInit(): void {
        this.#addFormListeners();
    }

    /**
     * Cancel subscriptions.
     */
    ngOnDestroy(): void {
        this.#onDestroy$.next();
        this.#onDestroy$.complete();
    }

    /**
     *
     */
    clearForm(): void {
        this.form.get('searchTerm')?.patchValue('');
        this._cdr.detectChanges();
    }

    /**
     * @param {LazyLoadEvent} e
     */
    onLazyLoad(e: LazyLoadEvent): void {
        if (e.last === this.#currentResultCount && e.last % MAX_RESULT_LENGTH === 0) {
            this.#keywordSearch();
        }
    }

    /**
     *
     */
    #addFormListeners(): void {
       this.form.get('searchTerm')?.valueChanges.pipe(
           distinctUntilChanged(),
           debounceTime(250),
           switchMap((term) => {
               if (!term || term.trimStart().length < 2) {
                   this.#resetSearchResults();
                   return EMPTY;
               } else {
                   this.isLoading$.next(true);
                   return of(term);
               }
           }),
           takeUntil(this.#onDestroy$)
       ).subscribe(() => this.#keywordSearch());

        this.form.get('sort')?.valueChanges.pipe(
            distinctUntilChanged(),
            takeUntil(this.#onDestroy$)
        ).subscribe(() => {
            const currentTerm = this.form.get('searchTerm')!.value;
            this.form.get('searchTerm')?.patchValue('');
            this.#resetSearchResults();
            this.form.get('searchTerm')?.patchValue(currentTerm);
        });
    }

    /**
     *
     */
    #keywordSearch(): void {
        const searchTerm = (this.form.get('searchTerm')!.value as string).trim();
        const sortOption = this.form.get('sort')!.value as ESearchOrderOptions;

        if (!searchTerm || !sortOption) {
            return;
        }

        this._youtubeApiService.keywordSearch$(searchTerm, sortOption, this._youtubeApiService.nextPageToken).pipe(
            map((items) => {
                if (items.length === 0) {
                    this.isLoading$.next(false);
                }

                const videoIds: YouTubeSearchResource['id']['videoId'][] = [];
                items.forEach((item) => videoIds.push(item.id.videoId));
                return videoIds;
            }),
            filter((videoIds) => videoIds.length > 0),
            switchMap((videoIds) => this._youtubeApiService.videoSearch$(videoIds)),
            map((videos) => videos.map(video => new VideoData(video))),
            take(1)
        ).subscribe({
            next: (data) => {
                this.isLoading$.next(false);
                this.videoData = [...this.videoData, ...data];
                this.#currentResultCount = this.videoData.length;
                this._cdr.detectChanges();
            },
            error: (error: HttpErrorResponse) => {
                console.error(error.message);
            }
        });
    }

    #resetSearchResults(): void {
        this._youtubeApiService.resetSearch();
        this.videoData = [];
        this.#currentResultCount = 0;
        this._cdr.detectChanges();
    }
}
