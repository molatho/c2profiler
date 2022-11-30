{{
  function clean(obj) {
  	delete obj.CTYPE;
    return obj;
  }
  
  function filter(objects, type) {
  	return objects.filter(o => o != null && o.CTYPE && o.CTYPE.startsWith(type)).map(o => clean(o));
  }

  function first(objects, type) {
    var objs = filter(objects, type);
    return objs.length > 0 ? objs[0] : null;
  }

  function mk(type, data) {
    return {
        ...data,
        "CTYPE": type
    }
  }

  const OPTION = "option";
  const HEADER = "header";
  const DSL = "header";
  const TERMINATION = "header";
  const COMMAND = "block::stage::command";
  const TRANSFORM = "block::stage::transform";
  const TRANSFORMOPERATION = "block::stage::transform::operation";
  const BLOCKTRANFORMINFORMATION = "block::transform";
  const BLOCKCODESIGNER = "block::code::signer";
  const BLOCKHTTPGET = "block::http::get";
  const BLOCKHTTPGETCLIENT = "block::http::get::client";
  const BLOCKHTTPGETCLIENTMETADATA = "block::http::get::client::METADATA";
  const BLOCKHTTPGETSERVER = "block::http::get::server";
  const BLOCKHTTPGETSERVEROUTPUT = "block::http::get::server::output";
  const BLOCKHTTPPOST = "block::http::post";
  const BLOCKHTTPPOSTCLIENT = "block::http::post::client";
  const BLOCKHTTPPOSTCLIENTID = "block::http::post::client::id";
  const BLOCKHTTPPOSTCLIENTOUTPUT = "block::http::post::client::output";
  const BLOCKHTTPPOSTSERVER = "block::http::post::server";
  const BLOCKHTTPPOSTSERVEROUTPUT = "block::http::post::server::output";
  const BLOCKHTTPSTAGER = "block::http::stager";
  const BLOCKHTTPSTAGEROUTPUT = "block::http::stager::output";
  const BLOCKHTTPCONFIG = "block::http::config";
  const BLOCKHTTPSCERT = "block::https::certificate";
  const BLOCKSTAGE = "block::stage";
  const BLOCKDNSBEACON = "block::dns::beacon";
  const BLOCKPOSTEX = "block::post::ex";
  const BLOCKPROCESSINJECT = "block::process::inject";
}}


profile
	= entities:entity+  { return {
        "options": filter(entities, OPTION),
        "code_signer": first(entities, BLOCKCODESIGNER),
        "http_get": first(entities, BLOCKHTTPGET),
        "http_post": first(entities, BLOCKHTTPPOST),
        "http_stager": first(entities, BLOCKHTTPSTAGER),
        "http_config": first(entities, BLOCKHTTPCONFIG),
        "https_certificate": first(entities, BLOCKHTTPSCERT),
        "stage": first(entities, BLOCKSTAGE),
        "dns_beacon": first(entities, BLOCKDNSBEACON),
        "post_ex" : first(entities, BLOCKPOSTEX),
        "process_inject": first(entities, BLOCKPROCESSINJECT)
    } }
 
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
    //= "#" str:[^\r\n]* [\r\n] { return mk("comment", { "value": str.join("") }); }
    
id
	= p:[a-zA-Z_] b:[a-zA-Z0-9\-_]* { return p + b.join(""); }

string
	= "\"" str:[^"]* "\"" { return str.join(""); }
    
option
	= "set" _ name:id _+ value:string ";" comment? { return mk(OPTION, { "name": name, "value": value }); }

headerset
	= "header" _+ name:string _* value:string ";" comment? { return mk(HEADER, { "name": name, "value": value }); }

datatransform
	= "append" _ operand:string _* ";" comment? { return mk(DSL, { "name": "append", "operand": operand }); }
	/ "prepend" _ operand:string _* ";"{ return mk(DSL, { "name": "prepend", "operand": operand }); }
    / "base64;" { return mk(DSL, { "name": "base64" }); }
    / "base64url;" { return mk(DSL, { "name": "base64url" }); }
    / "mask;" { return mk(DSL, { "name": "mask" }); }
    / "netbios;" { return mk(DSL, { "name": "netbios" }); }
    / "netbiosu;" { return mk(DSL, { "name": "netbiosu" }); }
    / _
    
termination
	= "header" _+ operand:string ";" comment? { return mk(TERMINATION, { "name": "header", "operand": operand }); }
	/ "parameter" _+ operand:string ";" comment? { return mk(TERMINATION, { "name": "parameter", "operand": operand }); }
	/ "print;" { return mk(TERMINATION, { "name": "print" }); }
	/ "uri-append;"{ return mk(TERMINATION, { "name": "uri-append" }); }

block_code_signer
	= "code-signer" _* "{" _* body:block_options_only* _* "}"  { return mk(BLOCKCODESIGNER, { "options": filter(body, OPTION)}); }

block_dns_beacon
	= "dns-beacon" _* variant:string? _* "{" _* body:block_options_only* _* "}"  { return mk("block::dns::beacon", { "body": body.filter(e => e), "variant": variant}); }

block_post_ex
	= "post-ex" _* "{" _* body:block_options_only* _* "}"  { return mk("block::post::ex", { "body": body.filter(e => e)}); }

block_http
	= "http-get" _* variant:string? _* "{" _* body:block_http_get* _* "}" { return mk(BLOCKHTTPGET, {
        "options": filter(body, OPTION),
        "client": first(body, BLOCKHTTPGETCLIENT),
        "server": first(body, BLOCKHTTPGETSERVER),
        "variant": variant
        }); }
	/ "http-post" _* variant:string? _* "{" _* body:block_http_post* _* "}" { return mk(BLOCKHTTPPOST, {
        "options": filter(body, OPTION),
        "client": first(body, BLOCKHTTPPOSTCLIENT),
        "server": first(body, BLOCKHTTPPOSTSERVER),
        "variant": variant
        }); }
    / "http-stager" _* variant:string? _* "{" _* body:block_http_stager* _* "}" { return mk(BLOCKHTTPSTAGER, {
        "client": first(body, BLOCKHTTPSTAGERCLIENT),
        "server": first(body, BLOCKHTTPSTAGERSERVER),
        "variant": variant
        }); }
    / "http-config" _* "{" _* body:block_http_config* _* "}" { return mk(BLOCKHTTPCONFIG, {
        "options": filter(body, OPTION),
        "headers": filter(body, HEADER),
        }); }
    / "https-certificate" _* variant:string? _* "{" _* body:block_options_only* _* "}" { return mk(BLOCKHTTPCERTIFICATE, {
        "options": filter(body, OPTION),
        "variant": variant
        }); }

block_http_transformation
	= transforms:(datatransform)* term:termination { return mk(BLOCKTRANFORMINFORMATION, { "transforms": filter(transforms, DSL), "termination": clean(term) }); }

block_http_get
	= option
    / "client" _+ "{" _* body:block_http_get_client* _* "}" { return mk(BLOCKHTTPGETCLIENT, {
        "headers": filter(body, HEADER),
        "metadata": first(body, BLOCKHTTPGETCLIENTMETADATA)
        }); }
	/ "server" _+ "{" _* body:block_http_get_server* _* "}" { return mk(BLOCKHTTPGETSERVER, {
        "headers": filter(body, HEADER),
        "output": first(body, BLOCKHTTPGETSERVEROUTPUT),
        "body": body.filter(e => e)
        }); }
    / comment
    / _

block_http_get_client
	= headerset
	/ "metadata" _+ "{" _* transforminfo:block_http_transformation _* "}" { return mk(BLOCKHTTPGETCLIENTMETADATA, clean(transforminfo)); }
    / comment
    / _


block_http_get_server
	= headerset
    / "output" _+ "{" _* transforminfo:block_http_transformation _* "}" { return mk(BLOCKHTTPGETSERVEROUTPUT, clean(transforminfo)); }
    / comment
    / _

block_http_post
	= option
    / "client" _+ "{" _* body:block_http_post_client* _* "}" { return mk("block::http::post::client", { "body": body.filter(e => e) }); }
	/ "server" _+ "{" _* body:block_http_post_server* _* "}" { return mk("block::http::post::server", { "body": body.filter(e => e) }); }
    / comment
    / _

block_http_post_client
	= headerset
	/ "id" _+ "{" _* body:block_http_transformation _* "}" { return mk("block::http::post::client::id", { "body": body }); }
    / "output" _+ "{" _* body:block_http_transformation _* "}" { return mk("block::http::post::client::output", { "body": body }); }
    / comment
    / _


block_http_post_server
	= headerset
    / "output" _+ "{" _* body:block_http_transformation _* "}" { return mk("block::http::post::server::output", { "body": body }); }
    / comment
    / _

block_http_stager
	= option
    / "client" _+ "{" _* body:block_http_stager_client _* "}" { return mk("block::http::stager::client", { "body": body.filter(e => e) }); }
    / "server" _+ "{" _* body:block_http_stager_server _* "}" { return mk("block::http::stager::server", { "body": body.filter(e => e) }); }
	/ comment
    / _

block_http_stager_client
	= termination
    / headerset
    / comment
    / _
    
block_http_stager_server
	= headerset
    / "output" _+ "{" _* body:block_http_transformation _* "}" { return mk("block::http::stager::server::output", { "body": body }); }
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
	= "stage" _+ "{" _* body:block_stage_body* _* "}" { return mk(BLOCKSTAGE, { 
        "options": filter(body, OPTION),
        "transforms": filter(body, TRANSFORM),
        "commands": filter(body, COMMAND) 
        }); }
    
block_stage_body
	= option
    / block_stage_transform
    / block_stage_command
    / comment
    / _
    
block_stage_command
	= "stringw" _+ str:string ";" comment? { return mk(COMMAND, { "type": "stringw", "operand": str }); }
	/ "string" _+ str:string ";" comment? { return mk(COMMAND, { "type": "string", "operand": str }); }
    / "data" _+ str:string ";" comment? { return mk(COMMAND, { "type": "data", "operand": str }); }

block_stage_transform
	= "transform-x86" _+ "{" _* body:block_transform_body* _* "}" {return mk(TRANSFORM, { "type": "x86", "operations": filter(body, TRANSFORMOPERATION) }); }
    / "transform-x64" _+ "{" _* body:block_transform_body* _* "}" {return mk(TRANSFORM, { "type": "x64", "operations": filter(body, TRANSFORMOPERATION) }); }
    
block_transform_body
	= block_transform_operation
    / comment
    / _
    
block_transform_operation
	= "prepend" _+ str:string ";" comment? { return mk(TRANSFORMOPERATION, { "type": "prepend", "operand1": str }); }
    / "append" _+ str:string ";" comment? { return mk(TRANSFORMOPERATION, { "type": "append", "operand1": str }); }
    / "strrep" _+ orig:string _+ repl:string ";" comment? { return mk(TRANSFORMOPERATION, { "type": "strrep", "operand1": orig, "operand2": repl }); }

block_process_inject
	= "process-inject" _+ "{" _* body:block_process_inject_body* _* "}" { return mk("block::process:inject", { "body": body.filter(e => e) }); }

block_process_inject_body
	= option
    / block_stage_transform
    / block_process_inject_execute
    / comment
    / _

block_process_inject_execute
	= "execute" _+ "{" _* body:block_process_inject_execute_body* _* "}" { return mk("block::process:inject::execute", { "body": body.filter(e => e) }); }

block_process_inject_execute_body
	= option
    / block_process_inject_execute_commands
    / comment
    / _

block_process_inject_execute_commands
	= "CreateThread" _+ str:string ";" comment? { return mk("block::process::inject::execute::CreateThread", { "value": str }); }
	/ "CreateRemoteThread" _+ str:string ";" comment? { return mk("block::process::inject::execute::CreateRemoteThread", { "value": str }); }
	/ "NtQueueApcThread;" comment? { return mk("block::process::inject::execute::NtQueueApcThread", { }); }
	/ "NtQueueApcThread-s;" comment? { return mk("block::process::inject::execute::NtQueueApcThreads", { }); }
	/ "RtlCreateUserThread;" comment? { return mk("block::process::inject::execute::RtlCreateUserThread", { }); }
	/ "SetThreadContext;" comment? { return mk("block::process::inject::execute::SetThreadContext", { }); }

_ "whitespace"
  = [ \t\n\r] { return null; }