import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { VideoData } from '../youtube-schema/youtube-schema';

@customElement('video-card')
export class CardUser extends LitElement {
    static override styles = css`
        .card {
            border-radius: var(--border-radius);
            box-shadow: rgba(0, 0, 0, 0.5) 0 6px 12px 0;
            display: flex;
            flex-direction: row;
            height: 130px;
            margin: 10px auto;
            overflow: hidden;
            padding: 1rem 1.2rem;
            width: 80%;
        }

        img {
            border-radius: var(--border-radius) 0 var(--border-radius) 0;
            margin: 0.25rem 1rem 0 0;
        }

        .video-summary {
            display: flex;
            flex-direction: column;
        }

        a {
            text-decoration: none;
            width: 80%;
        }
        a:hover {
          text-decoration: underline;
        }

        .comments {
            font-size: small;
            padding: 0.25rem 0;
        }

        .video-summary span {
            width: 65vw;
        }

        .description {
            height: 85px;
            overflow: hidden;
        }

        .opacity {
            background-image: linear-gradient(0deg, rgba(255,255,255,1) 30%, rgba(0,0,0,0) 100%);
            height: 1.5rem;
            margin-top: -1.5rem;
        }

        .truncate {
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    `;

    @property({type: Object}) video?: VideoData;

    override render() {
        if (!this.video) {
            return '';
        }

        return html`
            <div class="card">
                <img alt="${this.video.title}" src="${this.video.thumbnail.url}"
                     height="${this.video.thumbnail.height}"
                     width="${this.video.thumbnail.width}">
                <div class="video-summary">
                    <a class="truncate" href="${this.video.url}" target="_blank">${this.video.title}</a>
                    <span class="comments">Number of comments: <strong>${this.video.commentCount}</strong></span>
                    <span class="description">${this.video.description}</span>
                    <div class="opacity"></div>
                </div>
            </div>
        `;
    }
}
