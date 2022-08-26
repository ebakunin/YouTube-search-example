import {
    MAX_RESULT_LENGTH,
    VideoData,
    YouTubeApiResponse,
    YouTubeSearchResource,
    YouTubeVideoResource
} from './youtube-schema/youtube-schema';

export const MOCK_THUMBNAIL = {
    height: 90,
    width: 120,
    url: 'https://i.ytimg.com/vi/D0fARKLhZ3o/default.jpg'
};

export const MOCK_API_SEARCH_RESOURCE = {
    kind: 'youtube#searchResult',
    id: {
        videoId: 'D0fARKLhZ3o'
    }
} as YouTubeSearchResource;

export const MOCK_API_VIDEO_RESOURCE = {
    kind: 'youtube#videoListResponse',
    id: 'D0fARKLhZ3o',
    snippet: {
        title: 'Who is John Dee Doctor Destiny in Sandman Netflix?',
        description: 'Who is John Dee Doctor Destiny in Sandman Netflix? \n\nSandman is chock full of characters, and the comics linked the entire storyline to the main DC universe. One of the subjects of the first season is a frequent and recurring villain in comics with an historical namesake also linked to magick. \nWho is John Dee or Doctor Destiny in Sandman and the Netflix Series? Originally a JLA villain, but later in a lot of other DC media, Doctor Destiny used a number of weapons especially a thing called the Materioptikon. But the historical John Dee influenced magic and occult studies for 500 years and also probably influenced Neil Gaiman as well.\n\n#JOHNDEE #DRDESTINY #SANDMAN\n\nWho is John Dee Doctor Destiny in Sandman Netflix? \n\nSince I started the doomcast in 2015 I haven’t really monetized it at all. Originally Curt and Kyle at capes were giving me comics in exchange for episodes. \nBut some of you have asked about ways to support the Doomcast. And I appreciate that. I put about 5-10 hours a week in making these episodes. So I hope you enjoy them.\nThe first and easiest is I’ve opened a Threadless store. \n\nthedoomcast.threadless.com\n\nWith 6 designs including the logo of the show and artwork by Des Moines and Image Comics Artist Jason Wright, you can get any design on any shirt.',
        thumbnails: {
            default: MOCK_THUMBNAIL
        }
    },
    statistics: {
        commentCount: '10'
    }
} as YouTubeVideoResource;

export const MOCK_API_SEARCH_RESPONSE = {
    kind: 'youtube#searchListResponse',
    nextPageToken: 'abc',
    prevPageToken: 'xyz',
    pageInfo: {
        totalResults: 10,
        resultsPerPage: MAX_RESULT_LENGTH
    },
    items: [MOCK_API_SEARCH_RESOURCE]
} as YouTubeApiResponse;

export const MOCK_API_VIDEO_RESPONSE = {
    kind: 'youtube#videoListResponse',
    items: [MOCK_API_VIDEO_RESOURCE]
} as YouTubeApiResponse;

export const MOCK_DATA = new Array(10).fill({
    id: 'D0fARKLhZ3o',
    title: 'Who is John Dee Doctor Destiny in Sandman Netflix?',
    description: 'Who is John Dee Doctor Destiny in Sandman Netflix? \n\nSandman is chock full of characters, and the comics linked the entire storyline to the main DC universe. One of the subjects of the first season is a frequent and recurring villain in comics with an historical namesake also linked to magick. \nWho is John Dee or Doctor Destiny in Sandman and the Netflix Series? Originally a JLA villain, but later in a lot of other DC media, Doctor Destiny used a number of weapons especially a thing called the Materioptikon. But the historical John Dee influenced magic and occult studies for 500 years and also probably influenced Neil Gaiman as well.\n\n#JOHNDEE #DRDESTINY #SANDMAN\n\nWho is John Dee Doctor Destiny in Sandman Netflix? \n\nSince I started the doomcast in 2015 I haven’t really monetized it at all. Originally Curt and Kyle at capes were giving me comics in exchange for episodes. \nBut some of you have asked about ways to support the Doomcast. And I appreciate that. I put about 5-10 hours a week in making these episodes. So I hope you enjoy them.\nThe first and easiest is I’ve opened a Threadless store. \n\nthedoomcast.threadless.com\n\nWith 6 designs including the logo of the show and artwork by Des Moines and Image Comics Artist Jason Wright, you can get any design on any shirt.',
    thumbnail: MOCK_THUMBNAIL,
    commentCount: 10,
    url: 'https://youtu.be/D0fARKLhZ3o'
} as VideoData);
