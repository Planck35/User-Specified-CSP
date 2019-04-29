class HelpTextScript {

    constructor(){
        this.scripts = [
            "main_frame is the whole view where the web page document is displayed. Do NOT turn off this unless you know what you are doing",
            "sub_frame is the sub window/frame that nests under another window/frame. Turn off this to avoid information stealing",
            "stylesheet is a set of codes used to control the appearance and layout of various elements on webpages. A small amount of attacks are reported to exploit stylesheets",
            "script is a set of codes used to add automation, animations and interactivity to Web pages.",
            "image is a visual representation of information. Attackers can steal your data and send it to the server hosting the image",
            "a font is a particular size, weight and style of a typeface. Each font was a matched set of type, one piece for each glyph, and a typeface consisting of a range of fonts that shared an overall design",
            "resources loaded by <object> element. The HTML <object> element represents an external resource, which can be treated as an image, a nested browsing context, or a resource to be handled by a plugin.",
            "Requests sent by a specific object. Turning this off will damage some features in the page but increase security",
            "Requests sent to the URL given in a hyperlink's ping attribute, when the hyperlink is followed. Turning this off will damage some features in the page but increase security",
            "These are requests sent to report violation detected in this page. Not recommended to turn this off unless you know what you are doing",
            "Resources loaded by a  <video> or  <audio> element. <video> embeds a media player which supports video playback into the document. <audio> used to embed sound content in documents. It may contain one or more audio sources",
            "Requests initiating a connection to a server through the WebSocket API. The WebSocket API is an advanced technology that makes it possible to open a two-way interactive communication session between the user's browser and a server. ",
            "Resources that aren't covered by any other available type."
        ]
    }

    getHelpText(index){
        return this.scripts[index]
    }
}