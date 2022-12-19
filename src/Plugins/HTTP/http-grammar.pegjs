http
	= req:http_request { return { type: "request", result: req } }
    / res:http_response { return { type: "response", result: res } }
    
http_request
	= verb:verb _+ path:path _+ protocol:protocol headers:headers "\n\n" body:body { return {
    verb: verb,
    path: path,
    protocol: protocol,
    headers: headers,
    body: body
    } }
    
http_response
	= protocol:protocol _+ statusCode:digit+ _+ statusMessage:[^\n]+ headers:headers "\n\n" body:body { return {
    protocol: protocol,
    statusCode: parseInt(statusCode.join("")),
    statusMessage: statusMessage.join(""),
    headers: headers,
    body: body
    } }
    
protocol
	= "HTTP/" version:http_version { return { version: version } }

http_version
	= pre:digit+ "." suff:digit+ { return pre.join("") + "." + suff.join("") } 
    / ver: digit+ { return ver.join("") } 
    
headers
	= "\n" header:header headers:headers { return [header].concat(headers) }
    / "\n" header:header { return [header] }

header
	= key:[^:]+ _* ":" _* value:[^\n]+ _* { return { key: key.join(""), value: value.join("") } }

verb
	= verb:[a-zA-Z]+ { return verb.join("") }
    
path
	= uri:uri "?" parameters:parameters { return { uri: uri.join(""), parameters: parameters } }
    / uri:uri { return { uri: uri.join("") } }
    
parameters
	= param:parameter "&" params:parameters { return [param].concat(params) }
    / param:parameter { return [param] }
    
parameter
	= name:[^=]+ "=" value:[^(&| )]+ { return { name: name.join(""), value: value.join("") } }
	/ name:[^=]+ { return { name: name.join("") } }
    
uri
	= [^\? ]*

digit
	= [0-9]
 
_
	= " "
    
body = content:.* { return content.join("") }