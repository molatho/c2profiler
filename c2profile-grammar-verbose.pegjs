start
	= entities:entity+  { return { "type": "profile", "entities": entities.filter(e => e) }; }
 
entity
	= option
    / block_code_signer
    / block_http
    / block_stage
    / block_process_inject
    / block_dns_beacon
    / block_post_ex
    / comment
    / _

comment
	= "#"  str:[^\r\n]* [\r\n]  { return null }
    //= "#" str:[^\r\n]* [\r\n] { return { "type": "comment", "value": str.join("") }; }
    
id
	= p:[a-zA-Z_] b:[a-zA-Z0-9\-_]* { return p + b.join(""); }

string
	= "\"" str:[^"]* "\"" { return str.join(""); }
    
option
	= "set" _ name:id _+ value:string ";" comment? { return { "type": "option", "name": name, "value": value }; }

headerset
	= "header" _+ name:string _* value:string ";" comment? { return {"type":"header", "name": name, "value": value }; }

datatransform
	= "append" _ value:string _* ";" comment? { return { "type": "dsl::append", "value": value }; }
	/ "prepend" _ value:string _* ";"{ return { "type": "dsl::prepend", "value": value }; }
    / "base64;" { return { "type": "dsl::base64" }; }
    / "base64url;" { return { "type": "dsl::base64url" }; }
    / "mask;" { return { "type": "dsl::mask" }; }
    / "netbios;" { return { "type": "dsl::netbios" }; }
    / "netbiosu;" { return { "type": "dsl::netbiosu" }; }
    / _
    
termination
	= "header" _+ value:string ";" comment? { return { "type": "termination::header", "value": value }; }
	/ "parameter" _+ value:string ";" comment? { return { "type": "termination::parameter", "value": value }; }
	/ "print;" { return { "type": "termination::print" }; }
	/ "uri-append;"{ return { "type": "termination::uri-append" }; }

block_code_signer
	= "code-signer" _* "{" _* body:block_options_only* _* "}"  { return { "type": "block::code::signer", "body": body.filter(e => e)}; }

block_dns_beacon
	= "dns-beacon" _* variant:string? _* "{" _* body:block_options_only* _* "}"  { return { "type": "block::dns::beacon", "body": body.filter(e => e), "variant": variant}; }

block_post_ex
	= "post-ex" _* "{" _* body:block_options_only* _* "}"  { return { "type": "block::post::ex", "body": body.filter(e => e)}; }

block_http
	= "http-get" _* variant:string? _* "{" _* body:block_http_get* _* "}" { return { "type": "block::http::get", "body": body.filter(e => e), "variant": variant }; }
	/ "http-post" _* variant:string?_* "{" _* body:block_http_post* _* "}" { return { "type": "block::http::post", "body": body.filter(e => e), "variant": variant }; }
    / "http-stager" _* variant:string?_* "{" _* body:block_http_stager* _* "}" { return { "type": "block::http::stager", "body": body.filter(e => e), "variant": variant }; }
    / "http-config" _* "{" _* body:block_http_config* _* "}" { return { "type": "block::http::config", "body": body.filter(e => e) }; }
    / "https-certificate" _* variant:string?_* "{" _* body:block_options_only* _* "}" { return { "type": "block::http::certificate", "body": body.filter(e => e), "variant": variant }; }

block_http_transformation
	= transforms:(datatransform)* term:termination { return { "type": "block::http::transformation", "transforms": transforms.filter(e => e), "termination": term }; }

block_http_get
	= option
    / "client" _+ "{" _* body:block_http_get_client* _* "}" { return { "type": "block::http::get::client", "body": body.filter(e => e) }; }
	/ "server" _+ "{" _* body:block_http_get_server* _* "}" { return { "type": "block::http::get::server", "body": body.filter(e => e) }; }
    / comment
    / _

block_http_get_client
	= headerset
	/ "metadata" _+ "{" _* body:block_http_transformation _* "}" { return { "type": "block::http::get::client::metadata", "body": body }; }
    / comment
    / _


block_http_get_server
	= headerset
    / "output" _+ "{" _* body:block_http_transformation _* "}" { return { "type": "block::http::get::server::output", "body": body }; }
    / comment
    / _

block_http_post
	= option
    / "client" _+ "{" _* body:block_http_post_client* _* "}" { return { "type": "block::http::post::client", "body": body.filter(e => e) }; }
	/ "server" _+ "{" _* body:block_http_post_server* _* "}" { return { "type": "block::http::post::server", "body": body.filter(e => e) }; }
    / comment
    / _

block_http_post_client
	= headerset
	/ "id" _+ "{" _* body:block_http_transformation _* "}" { return { "type": "block::http::post::client::id", "body": body }; }
    / "output" _+ "{" _* body:block_http_transformation _* "}" { return { "type": "block::http::post::client::output", "body": body }; }
    / comment
    / _


block_http_post_server
	= headerset
    / "output" _+ "{" _* body:block_http_transformation _* "}" { return { "type": "block::http::post::server::output", "body": body }; }
    / comment
    / _

block_http_stager
	= option
    / "client" _+ "{" _* body:block_http_stager_client _* "}" { return { "type": "block::http::stager::client", "body": body.filter(e => e) }; }
    / "server" _+ "{" _* body:block_http_stager_server _* "}" { return { "type": "block::http::stager::server", "body": body.filter(e => e) }; }
	/ comment
    / _

block_http_stager_client
	= termination
    / headerset
    / comment
    / _
    
block_http_stager_server
	= headerset
    / "output" _+ "{" _* body:block_http_transformation _* "}" { return { "type": "block::http::stager::server::output", "body": body }; }
    / comment
    / _
    
block_http_config
	= option
    / headerset
    / comment
    / _
    
block_options_only
	= option
    / comment
    / _

block_stage
	= "stage" _+ "{" _* body:block_stage_body* _* "}" { return { "type": "block::stage", "body": body.filter(e => e) }; }
    
block_stage_body
	= option
    / block_stage_transform
    / block_stage_command
    / comment
    / _
    
block_stage_command
	= "stringw" _+ str:string ";" comment? { return {"type": "block::stage::command::stringw", "value": str }; }
    / "data" _+ str:string ";" comment? { return {"type": "block::stage::command::data", "value": str }; }

block_stage_transform
	= "transform-x86" _+ "{" _* body:block_transform_body* _* "}" {return {"type":"block::stage::transform::x86", "body": body.filter(e => e) }; }
    / "transform-x64" _+ "{" _* body:block_transform_body* _* "}" {return {"type":"block::stage::transform::x64", "body": body.filter(e => e) }; }
    
block_transform_body
	= option
    / block_transform_operation
    / comment
    / _
    
block_transform_operation
	= "prepend" _+ str:string ";" comment? { return {"type": "block::transform::operation::prepend", "value": str }; }
    / "append" _+ str:string ";" comment? { return {"type": "block::transform::operation::append", "value": str }; }
    / "strrep" _+ orig:string _+ repl:string ";" comment? { return { "type": "block::transform::operation::strrep", "original": orig, "replacement": repl }; }

block_process_inject
	= "process-inject" _+ "{" _* body:block_process_inject_body* _* "}" { return { "type": "block::process:inject", "body": body.filter(e => e) }; }

block_process_inject_body
	= option
    / block_stage_transform
    / block_process_inject_execute
    / comment
    / _

block_process_inject_execute
	= "execute" _+ "{" _* body:block_process_inject_execute_body* _* "}" { return { "type": "block::process:inject::execute", "body": body.filter(e => e) }; }

block_process_inject_execute_body
	= option
    / block_process_inject_execute_commands
    / comment
    / _

block_process_inject_execute_commands
	= "CreateThread" _+ str:string ";" comment? { return {"type": "block::process::inject::execute::CreateThread", "value": str }; }
	/ "CreateRemoteThread" _+ str:string ";" comment? { return {"type": "block::process::inject::execute::CreateRemoteThread", "value": str }; }
	/ "NtQueueApcThread;" comment? { return {"type": "block::process::inject::execute::NtQueueApcThread" }; }
	/ "NtQueueApcThread-s;" comment? { return {"type": "block::process::inject::execute::NtQueueApcThreads" }; }
	/ "RtlCreateUserThread;" comment? { return {"type": "block::process::inject::execute::RtlCreateUserThread" }; }
	/ "SetThreadContext;" comment? { return {"type": "block::process::inject::execute::SetThreadContext" }; }

_ "whitespace"
  = [ \t\n\r] { return null; }