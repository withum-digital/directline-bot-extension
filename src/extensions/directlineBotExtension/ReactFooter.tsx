
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

        // 2019-07-02 PD In order for the welcome message to be sent from AtBot to the chat window, we need to post some event.
        // Without the hack below, the welcome message will be delayed until someone types something into the chat window and clicks "send"
        this.directLine.postActivity({
            from: {id:this.props.upn},
            type: 'event',
            name: 'WelcomeMessage',
            value: 'Initialize Welcome Message'
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
