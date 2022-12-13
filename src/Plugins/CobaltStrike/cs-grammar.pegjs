{{
  function clean(obj) {
  	delete obj.CTYPE;
    return obj;
  }
  
  function filter(objects, type) {
    if (!objects.filter) console.log(objects, type)
  	return objects.filter(o => o != null && o.CTYPE && o.CTYPE.startsWith(type)).map(o => clean(o));
  }

  function first(objects, type) {
    var objs = filter(objects, type);
    return objs.length > 0 ? objs[0] : null;
  }

  function mk(type, data) {
    return {
        ...(data ?? {}),
        "CTYPE": type
    }
  }

  function splitvariants(objects) {
    if (objects.length == 0) return null;
    var baseline = objects.filter(o => !o.variant);
    if (!baseline) throw "Missing baseline profile!";
    if (baseline.length > 1) throw "Multiple baseline profiles!";
    return {
        "baseline": baseline[0],
        "variants": objects.filter(o => o.variant)
    }
  }

  const OPTION = "option";
  const COMMENT = "comment"
  const HEADER = "header";
  const PARAMETER = "parameter";
  const DSL = "dsl";
  const TERMINATION = "termination";
  const COMMAND = "block::stage::command";
  const TRANSFORMX86 = "block::stage::transform::x86";
  const TRANSFORMX64 = "block::stage::transform::x64";
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
  const BLOCKHTTPSTAGERCLIENT = "block::http::stager::client";
  const BLOCKHTTPSTAGERSERVER = "block::http::stager::server";
  const BLOCKHTTPSTAGERSERVEROUTPUT = "block::http::stager::server::output";
  const BLOCKHTTPCONFIG = "block::http::config";
  const BLOCKHTTPSCERT = "block::https::certificate";
  const BLOCKSTAGE = "block::stage";
  const BLOCKDNSBEACON = "block::dns::beacon";
  const BLOCKPOSTEX = "block::post::ex";
  const BLOCKPROCESSINJECT = "block::process::inject";
  const BLOCKPROCESSINJECTEXECUTE = "block::process::inject::execute";
  const BLOCKPROCESSINJECTEXECUTECOMMAND = "block::process::inject::execute::command";
}}

// TODO: Extract comments on all entities instead of stripping them

profile
	= entities:entity+  { return {
        "options": filter(entities, OPTION),
        "code_signer": first(entities, BLOCKCODESIGNER),
        "http_get": splitvariants(filter(entities, BLOCKHTTPGET)),
        "http_post": splitvariants(filter(entities, BLOCKHTTPPOST)),
        "http_stager": splitvariants(filter(entities, BLOCKHTTPSTAGER)),
        "http_config": first(entities, BLOCKHTTPCONFIG),
        "https_certificate": splitvariants(filter(entities, BLOCKHTTPSCERT)),
        "stage": first(entities, BLOCKSTAGE),
        "dns_beacon": splitvariants(filter(entities, BLOCKDNSBEACON)),
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
	//= _* "#" str:[^\r\n]* [\r\n]  { return null }
    = "#" _* str:[^\r\n]* [\r\n] { return str.join(""); }
    
id
	= p:[a-zA-Z_] b:[a-zA-Z0-9\-_]* { return p + b.join(""); }

string
	= "\"" str:[^"]* "\"" { return str.join(""); }
    
option
	= "set" _ name:id _+ value:string ";" comment? { return mk(OPTION, { "name": name, "value": value }); }

headerset
	= "header" _+ name:string _* value:string ";" comment? { return mk(HEADER, { "name": name, "value": value }); }

parameterset
	= "parameter" _+ name:string _* value:string ";" comment? { return mk(PARAMETER, { "name": name, "value": value }); }

datatransform
	= "append" _ operand:string _* ";" comment? { return mk(DSL, { "type": "append", "operand": operand }); }
	/ "prepend" _ operand:string _* ";"{ return mk(DSL, { "type": "prepend", "operand": operand }); }
    / "base64;" { return mk(DSL, { "type": "base64" }); }
    / "base64url;" { return mk(DSL, { "type": "base64url" }); }
    / "mask;" { return mk(DSL, { "type": "mask" }); }
    / "netbios;" { return mk(DSL, { "type": "netbios" }); }
    / "netbiosu;" { return mk(DSL, { "type": "netbiosu" }); }
    / _
    
termination
	= "header" _+ operand:string ";" comment? { return mk(TERMINATION, { "type": "header", "operand": operand }); }
	/ "parameter" _+ operand:string ";" comment? { return mk(TERMINATION, { "type": "parameter", "operand": operand }); }
	/ "print;" { return mk(TERMINATION, { "type": "print" }); }
	/ "uri-append;"{ return mk(TERMINATION, { "type": "uri-append" }); }

block_code_signer
	= "code-signer" _* "{" _* body:block_options_only* _* "}"  { return mk(BLOCKCODESIGNER, { "options": filter(body, OPTION)}); }

block_dns_beacon
	= "dns-beacon" _* variant:string? _* "{" _* body:block_options_only* _* "}"  { return mk(BLOCKDNSBEACON, { "options": filter(body, OPTION), "variant": variant}); }

block_post_ex
	= "post-ex" _* "{" _* body:block_options_only* _* "}"  { return mk(BLOCKPOSTEX, { "options": filter(body, OPTION) }); }

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
        "options": filter(body, OPTION),
        "client": first(body, BLOCKHTTPSTAGERCLIENT),
        "server": first(body, BLOCKHTTPSTAGERSERVER),
        "variant": variant
        }); }
    / "http-config" _* "{" _* body:block_http_config* _* "}" { return mk(BLOCKHTTPCONFIG, {
        "options": filter(body, OPTION),
        "headers": filter(body, HEADER),
        }); }
    / "https-certificate" _* variant:string? _* "{" _* body:block_options_only* _* "}" { return mk(BLOCKHTTPSCERT, {
        "options": filter(body, OPTION),
        "variant": variant
        }); }

block_http_transformation_elements_head
    = (comment / _)* transform:datatransform (comment / _)* { return transform; }

block_http_transformation_elements_tail
    = (comment / _)* term:termination (comment / _)* { return term; }

block_http_transformation
	= transforms:block_http_transformation_elements_head+ term:block_http_transformation_elements_tail { return mk(BLOCKTRANFORMINFORMATION, { "transforms": filter(transforms, DSL), "termination": clean(term) }); }

block_http_get
	= option
    / "client" _+ "{" _* body:block_http_get_client* _* "}" { return mk(BLOCKHTTPGETCLIENT, {
        "headers": filter(body, HEADER),
        "metadata": first(body, BLOCKHTTPGETCLIENTMETADATA),
        "parameters": filter(body, PARAMETER)
        }); }
	/ "server" _+ "{" _* body:block_http_get_server* _* "}" { return mk(BLOCKHTTPGETSERVER, {
        "headers": filter(body, HEADER),
        "output": first(body, BLOCKHTTPGETSERVEROUTPUT)
        }); }
    / comment
    / _

block_http_get_client
	= headerset
    / parameterset
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
    / "client" _+ "{" _* body:block_http_post_client* _* "}" { return mk(BLOCKHTTPPOSTCLIENT, {
        "headers": filter(body, HEADER),
        "output": first(body, BLOCKHTTPPOSTCLIENTOUTPUT),
        "id": first(body, BLOCKHTTPPOSTCLIENTID),
        "parameters": filter(body, PARAMETER)
        }); }
	/ "server" _+ "{" _* body:block_http_post_server* _* "}" { return mk(BLOCKHTTPPOSTSERVER, {
        "headers": filter(body, HEADER),
        "output": first(body, BLOCKHTTPPOSTSERVEROUTPUT),
        }); }
    / comment
    / _

block_http_post_client
	= headerset
	/ "id" _+ "{" _* transforminfo:block_http_transformation _* "}" { return mk(BLOCKHTTPPOSTCLIENTID, clean(transforminfo)); }
    / "output" _+ "{" _* transforminfo:block_http_transformation _* "}" { return mk(BLOCKHTTPPOSTCLIENTOUTPUT, clean(transforminfo)); }
    / comment
    / _


block_http_post_server
	= headerset
    / "output" _+ "{" _* transforminfo:block_http_transformation _* "}" { return mk(BLOCKHTTPPOSTSERVEROUTPUT, clean(transforminfo)); }
    / comment
    / _

block_http_stager
	= option
    / "client" _+ "{" _* body:block_http_stager_client* _* "}" { return mk(BLOCKHTTPSTAGERCLIENT, {
        "headers": filter(body, HEADER),
        "parameters": filter(body, PARAMETER)
        }); }
    / "server" _+ "{" _* body:block_http_stager_server* _* "}" { return mk(BLOCKHTTPSTAGERSERVER, {
        "headers": filter(body, HEADER),
        "output": first(body, BLOCKHTTPSTAGERSERVEROUTPUT)
        }); }
	/ comment
    / _

block_http_stager_client
	= headerset
    / parameterset
    / comment
    / _
    
block_http_stager_server
	= headerset
    / "output" _+ "{" _* transforminfo:block_http_transformation _* "}" { return mk(BLOCKHTTPSTAGERSERVEROUTPUT, clean(transforminfo)); }
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
        "transform-x86": first(body, TRANSFORMX86),
        "transform-x64": first(body, TRANSFORMX64),
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
	= "transform-x86" _+ "{" _* body:block_transform_body* _* "}" {return mk(TRANSFORMX86, { "type": "x86", "operations": filter(body, TRANSFORMOPERATION) }); }
    / "transform-x64" _+ "{" _* body:block_transform_body* _* "}" {return mk(TRANSFORMX64, { "type": "x64", "operations": filter(body, TRANSFORMOPERATION) }); }
    
block_transform_body
	= block_transform_operation
    / comment
    / _
    
block_transform_operation
	= "prepend" _+ str:string ";" comment? { return mk(TRANSFORMOPERATION, { "type": "prepend", "operand1": str }); }
    / "append" _+ str:string ";" comment? { return mk(TRANSFORMOPERATION, { "type": "append", "operand1": str }); }
    / "strrep" _+ orig:string _+ repl:string ";" comment? { return mk(TRANSFORMOPERATION, { "type": "strrep", "operand1": orig, "operand2": repl }); }

block_process_inject
	= "process-inject" _+ "{" _* body:block_process_inject_body* _* "}" { return mk(BLOCKPROCESSINJECT, {
        "transform-x86": first(body, TRANSFORMX86),
        "transform-x64": first(body, TRANSFORMX64),
        "execute": first(body, BLOCKPROCESSINJECTEXECUTE)
        }); }

block_process_inject_body
	= option
    / block_stage_transform
    / block_process_inject_execute
    / comment
    / _

block_process_inject_execute
	= "execute" _+ "{" _* body:block_process_inject_execute_body* _* "}" { return mk(BLOCKPROCESSINJECTEXECUTE, {
        "commands": filter(body, BLOCKPROCESSINJECTEXECUTECOMMAND)
        }); }

block_process_inject_execute_body
	= block_process_inject_execute_commands
    / comment
    / _

block_process_inject_execute_commands
	= "CreateThread" _+ str:string ";" comment? { return mk(BLOCKPROCESSINJECTEXECUTECOMMAND, { "type": "CreateThread",  "operand": str }); }
	/ "CreateRemoteThread" _+ str:string ";" comment? { return mk(BLOCKPROCESSINJECTEXECUTECOMMAND, { "type": "CreateRemoteThread", "operand": str }); }
    / "CreateThread;" comment? { return mk(BLOCKPROCESSINJECTEXECUTECOMMAND, { "type": "CreateThread" }); }
	/ "CreateRemoteThread;" comment? { return mk(BLOCKPROCESSINJECTEXECUTECOMMAND, { "type": "CreateRemoteThread" }); }
	/ "NtQueueApcThread;" comment? { return mk(BLOCKPROCESSINJECTEXECUTECOMMAND, { "type": "NtQueueApcThread" }); }
	/ "NtQueueApcThread-s;" comment? { return mk(BLOCKPROCESSINJECTEXECUTECOMMAND, { "type": "NtQueueApcThreads"}); }
	/ "RtlCreateUserThread;" comment? { return mk(BLOCKPROCESSINJECTEXECUTECOMMAND, { "type": "tlCreateUserThread"}); }
	/ "SetThreadContext;" comment? { return mk(BLOCKPROCESSINJECTEXECUTECOMMAND, { "type": "SetThreadContext" }); }

_ "whitespace"
  = [ \t\n\r] { return null; }