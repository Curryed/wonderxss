import React from 'react'
import AceEditor from "react-ace";
import axios from 'axios';
import { Container, Input, Button } from '@material-ui/core';
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

import { API_PAYLOADS } from '../helpers/constants';


class PayloadEditor extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
        }
    };
    createAlias = (payload_id, alias) => {
        console.log(payload_id, alias)
    };
    createPayload = () => {
        var payloadName = document.getElementById("payload-name").value;
        var payload = this.refs.aceEditor.editor.getValue()
        if(payloadName === ""){
            alert("please provide a payload name.")
            return
        }
        
        console.log("Payload name:", payloadName)
        console.log("Payload content:");
        console.log(payload);

        axios.post(API_PAYLOADS, {
            name: payloadName,
            content: payload
        })
        .then(res => {
            var alias = ""
            var payload_id = ""

            console.log(res)

            if(res.data && res.data.id !== ""){
                payload_id = res.data.id
                alias = document.getElementById("payload-alias").value
                if ( alias !== ""){
                    this.createAlias(payload_id, alias)
                }
            }
        });
    };
    render() {
        return (
            <Container className="container">
                <AceEditor
                    width="100%"
                    ref="aceEditor"
                    mode="javascript"
                    theme="github"
                    name="editor"
                    editorProps={{ $blockScrolling: true}}
                    />
                <Input id="payload-name" type="text" placeholder="Payload name"></Input>
                <Input id="payload-alias" type="text" placeholder="short-alias"></Input>
                
                <Button onClick={this.createPayload}>Create paylaod</Button>
            </Container>
        )
    }
}
export default PayloadEditor