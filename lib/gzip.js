/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
    var pako = require('pako');
    var iconv = require('iconv-lite');

    function GzipNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;
        this.on("input", function(msg) {
            if (msg.hasOwnProperty("payload")) {
                if (typeof msg.payload === "object") {
                    try {
                        var out = pako.inflate(msg.payload);
                        var s = String.fromCharCode.apply(null, out);
                        msg.payload = iconv.decode(s, 'utf-8')
                        node.send(msg);
                    } catch(e) {
                      node.error(e, msg);
                    }
                } else if (typeof msg.payload === "string") {
                    try {
                        var out = pako.deflate(msg.payload);
                        msg.payload = out;
                        node.send(msg);
                    } catch(e) {
                        node.error(e, msg);
                    }
                } else {
                    node.error('dropped', msg);
                }
            } else {
              // If no payload - just pass it on.
              node.send(msg);
            }
        });
    }
    RED.nodes.registerType("gzip", GzipNode);
}
