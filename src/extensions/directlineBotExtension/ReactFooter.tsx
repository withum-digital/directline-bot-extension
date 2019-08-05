
import * as React from "react";
import { Link } from 'office-ui-fabric-react/lib/Link';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { DirectLine } from "botframework-directlinejs";
import ReactWebChat from "botframework-webchat";

export interface IReactFooterProps {
    directLineToken: string;
    upn: string;
 }

export default class ReactFooter extends React.Component<IReactFooterProps> {
    private directLine: DirectLine;
    constructor(props: IReactFooterProps) {
        super(props);

        this.directLine = new DirectLine({ token: props.directLineToken });

        // 2019-08-05 PD - Joe from AtBot:  We’ve made a small adjustment to the AtBot service which requires an additional step for any bot that uses a skill as the welcome message. The bot scope, which is an object you can populate with environmental information when you embed the bot, was not being sent if a skill defined the welcome message. As of an update this morning, it is required that you send the bot scope after you initialize the bot in order for the welcome message to appear. You can send default values, but it has to be sent.
        this.directLine.postActivity({
            type: 'event',
            value: {
                scope: "Withum Directline Webpart",
                uri: "//withum.directline.webpart",
                type: "scope initialization",
            },
            from: {id:this.props.upn},
            name: 'SetBotScope',
        }).subscribe(obs => {
            console.log("Welcome Message Initialized");
        });
    }

    public render() : JSX.Element{
        return (
            <ReactWebChat directLine={this.directLine} userID={this.props.upn}/>
        );
    }
}
