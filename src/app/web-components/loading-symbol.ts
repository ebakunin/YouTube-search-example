import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('loading-symbol')
export class LoadingSymbol extends LitElement {
    static override styles = css`
        .lds-ellipsis {
            display: block;
            position: relative;
            width: 60px;
            height: 60px;
            margin: auto;
        }
        .lds-ellipsis div {
            position: absolute;
            top: 33px;
            width: 11px;
            height: 11px;
            border-radius: 50%;
            background-color: var(--light-gray);
            animation-timing-function: cubic-bezier(0, 1, 1, 0);
        }
        .lds-ellipsis div:nth-child(1) {
            left: 8px;
            animation: lds-ellipsis1 0.6s infinite;
        }
        .lds-ellipsis div:nth-child(2) {
            left: 8px;
            animation: lds-ellipsis2 0.6s infinite;
        }
        .lds-ellipsis div:nth-child(3) {
            left: 32px;
            animation: lds-ellipsis2 0.6s infinite;
        }
        .lds-ellipsis div:nth-child(4) {
            left: 56px;
            animation: lds-ellipsis3 0.6s infinite;
        }
        @keyframes lds-ellipsis1 {
            0% {
                transform: scale(0);
            }
            100% {
                transform: scale(1);
            }
        }
        @keyframes lds-ellipsis3 {
            0% {
                transform: scale(1);
            }
            100% {
                transform: scale(0);
            }
        }
        @keyframes lds-ellipsis2 {
            0% {
                transform: translate(0, 0);
            }
            100% {
                transform: translate(24px, 0);
            }
        }
    `;

    override render() {
        return html`
            <div class="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        `;
    }
}
