import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
    BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';
import { sp } from "@pnp/sp";

import * as strings from 'DirectlineBotExtensionApplicationCustomizerStrings';
// import { ReactWebChat, renderMarkdown, renderWebChat } from 'botframework-webchat'
require("./InlineCSS.css");

import { getIconClassName } from '@uifabric/styling';
import * as React from "react";
import * as ReactDOM from "react-dom";
import ReactFooter, { IReactFooterProps } from "./ReactFooter";

import * as jQuery from 'jquery';

const LOG_SOURCE: string = 'HelloWorldApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IDirectlineBotExtensionApplicationCustomizerProperties {
    BotName: string;
    DirectLineSecret: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class DirectlineBotExtensionApplicationCustomizer
    extends BaseApplicationCustomizer<IDirectlineBotExtensionApplicationCustomizerProperties> {

    // private _topPlaceholder: PlaceholderContent | undefined;
    private _bottomPlaceholder: PlaceholderContent | undefined;
    // private _botConnection: DirectLine | undefined;

    private _userLoaded: Promise<any>;

    constructor() {
        super();

        this._userLoaded = this.getUpnForCurrentUser();
    }

    @override
    public onInit(): Promise<void> {
        Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

        // Wait for the placeholders to be created (or handle them being changed) and then
        // render.
        this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);

        return this._userLoaded;
    }

    public _openChat(): void {
        //When called as a click event, 'this' is the HTML element, not my class.  Grab the reference to my class stored in the <div id="bot"> element.
        let _that: DirectlineBotExtensionApplicationCustomizer = jQuery("#bot").data("ref");

        jQuery("#chatOpener").fadeOut("fast", () => {
            jQuery("#chatWindow").fadeIn("fast", () => {
            });
        });
    }

    public _closeChat(): void {
        jQuery("#chatWindow").fadeOut("fast", () => {
            jQuery("#chatOpener").fadeIn("fast");
        });
    }

    private getUpnForCurrentUser(): Promise<string> {
        sp.setup({
            sp:{
                baseUrl:`https://${window.location.host}`
            }
        });

        return sp.profiles.myProperties.get().then(props => {
            var upn = props.UserProfileProperties.find((prop) => { return prop.Key == "SPS-UserPrincipalName"; });
            console.log(upn.Value);
            return upn.Value;
        });

    }

    private _renderPlaceHolders(): void {
        console.log("HelloWorldApplicationCustomizer._renderPlaceHolders()");
        console.log(
            "Available placeholders: ",
            this.context.placeholderProvider.placeholderNames
                .map(name => PlaceholderName[name])
                .join(", ")
        );

        // Handling the bottom placeholder
        if (!this._bottomPlaceholder) {
            this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
                PlaceholderName.Bottom,
                { onDispose: this._onDispose }
            );

            // The extension should not assume that the expected placeholder is available.
            if (!this._bottomPlaceholder) {
                console.error("The expected placeholder (Bottom) was not found.");
                return;
            }

            if (this.properties) {

                if (this._bottomPlaceholder.domElement) {
                    this._userLoaded.then((upnString) => { // 2019-06-17 PD Render only after we've gotten the current user's UPN (to support persistent cookie in atbot)
                        this._bottomPlaceholder.domElement.innerHTML = `
                        <div>
                        <div id="chatOpener" class="ms-bgColor-themeDark chat-opener">
                            <a class="b" href="javascript:">
                                <i class="${getIconClassName('CommentPrevious')}"></i>
                                <span>${this.properties.BotName}</span>
                            </a>
                        </div>
                        <div id="chatWindow" class="chat-window" style="display:none;">
                            <div class="ms-bgColor-themeDark heading">
                                <a href="javascript:" id="chatCloser" title="Close chat window"><i class="${getIconClassName('Cancel')}"></i></a> ${this.properties.BotName}
                            </div>
                            <div id="bot"></div>
                        </div>
                        </div>
                        `;

                        document.getElementById("chatOpener").onclick = this._openChat;//OnClick event assignment
                        document.getElementById("chatCloser").onclick = this._closeChat;//OnClick event assignment
                        var botElem = document.getElementById("bot");

                        const elem: React.ReactElement<IReactFooterProps> = React.createElement(ReactFooter, { directLineToken: this.properties.DirectLineSecret, upn: upnString });
                        ReactDOM.render(elem, botElem);
                    });
                }
            }
        }
    }

    private _onDispose(): void {
        console.log('[DirectlineBotExtensionApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
    }

}
