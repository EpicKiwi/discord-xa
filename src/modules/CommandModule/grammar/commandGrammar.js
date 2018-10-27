// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

	const first = (d) => d[1]
	const argument = (argType,pos=0) => (d) => {return{type:argType,value:d[pos]}}
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "main$ebnf$1", "symbols": []},
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["__", "argument"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "main$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main", "symbols": ["command", "main$ebnf$1"], "postprocess":  (d) => {
        	
        	return {
        		command: d[0],
        		arguments: d[1].reduce((acc,el) => {
        			if(el[1].type == "switch"){
        				return [...acc,...(el[1].value[1].map(argument("switch")))]
        			} else {
        				return [...acc,el[1]]
        			}
        		},[])
        	}
        	
        } },
    {"name": "command", "symbols": ["literal"], "postprocess": id},
    {"name": "argument", "symbols": ["value"], "postprocess": id},
    {"name": "argument", "symbols": ["switch"], "postprocess": argument("switch")},
    {"name": "argument", "symbols": ["namedParam"], "postprocess": argument("named")},
    {"name": "switch$ebnf$1", "symbols": ["startChar"]},
    {"name": "switch$ebnf$1", "symbols": ["switch$ebnf$1", "startChar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "switch", "symbols": [{"literal":"-"}, "switch$ebnf$1"]},
    {"name": "namedParam$string$1", "symbols": [{"literal":"-"}, {"literal":"-"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "namedParam", "symbols": ["namedParam$string$1", "literal"], "postprocess": first},
    {"name": "value", "symbols": ["literal"], "postprocess": argument("literal")},
    {"name": "value", "symbols": ["user"], "postprocess": argument("user")},
    {"name": "value", "symbols": ["role"], "postprocess": argument("role")},
    {"name": "value", "symbols": ["channel"], "postprocess": argument("channel")},
    {"name": "value", "symbols": ["code"], "postprocess": argument("code")},
    {"name": "value$ebnf$1", "symbols": [/[^"]/], "postprocess": id},
    {"name": "value$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "value", "symbols": [{"literal":"\""}, "value$ebnf$1", {"literal":"\""}], "postprocess": argument("literal",1)},
    {"name": "value$ebnf$2", "symbols": [/[^']/], "postprocess": id},
    {"name": "value$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "value", "symbols": [{"literal":"'"}, "value$ebnf$2", {"literal":"'"}], "postprocess": argument("literal",1)},
    {"name": "code", "symbols": ["multiCode"], "postprocess": id},
    {"name": "code", "symbols": ["labMultiCode"], "postprocess": id},
    {"name": "code", "symbols": ["inlineCode"], "postprocess": id},
    {"name": "code", "symbols": ["inlineBigCode"], "postprocess": id},
    {"name": "inlineCode$ebnf$1", "symbols": []},
    {"name": "inlineCode$ebnf$1", "symbols": ["inlineCode$ebnf$1", /[^`]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "inlineCode", "symbols": [{"literal":"`"}, "inlineCode$ebnf$1", {"literal":"`"}], "postprocess": (d) => {return{content:d[1].join(''),language:null}}},
    {"name": "inlineBigCode$string$1", "symbols": [{"literal":"`"}, {"literal":"`"}, {"literal":"`"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "inlineBigCode$ebnf$1", "symbols": []},
    {"name": "inlineBigCode$ebnf$1", "symbols": ["inlineBigCode$ebnf$1", /./], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "inlineBigCode$string$2", "symbols": [{"literal":"`"}, {"literal":"`"}, {"literal":"`"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "inlineBigCode", "symbols": ["inlineBigCode$string$1", "inlineBigCode$ebnf$1", "inlineBigCode$string$2"], "postprocess": (d) => {return{content:d[1],language:null}}},
    {"name": "multiCode$string$1", "symbols": [{"literal":"`"}, {"literal":"`"}, {"literal":"`"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "multiCode$ebnf$1", "symbols": ["anything"], "postprocess": id},
    {"name": "multiCode$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "multiCode$string$2", "symbols": [{"literal":"`"}, {"literal":"`"}, {"literal":"`"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "multiCode", "symbols": ["multiCode$string$1", "_", {"literal":"\n"}, "multiCode$ebnf$1", "multiCode$string$2"], "postprocess": (d) => {return{content:d[1],language:null}}},
    {"name": "labMultiCode$string$1", "symbols": [{"literal":"`"}, {"literal":"`"}, {"literal":"`"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "labMultiCode$ebnf$1", "symbols": ["anything"], "postprocess": id},
    {"name": "labMultiCode$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "labMultiCode$string$2", "symbols": [{"literal":"`"}, {"literal":"`"}, {"literal":"`"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "labMultiCode", "symbols": ["labMultiCode$string$1", "literal", {"literal":"\n"}, "labMultiCode$ebnf$1", "labMultiCode$string$2"], "postprocess": (d) => {return{content:d[3],language:d[1]}}},
    {"name": "user$string$1", "symbols": [{"literal":"<"}, {"literal":"@"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "user$ebnf$1", "symbols": [{"literal":"!"}], "postprocess": id},
    {"name": "user$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "user", "symbols": ["user$string$1", "user$ebnf$1", "snowflake", {"literal":">"}], "postprocess": (d) => d[2]},
    {"name": "role$string$1", "symbols": [{"literal":"<"}, {"literal":"@"}, {"literal":"&"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "role", "symbols": ["role$string$1", "snowflake", {"literal":">"}], "postprocess": first},
    {"name": "channel$string$1", "symbols": [{"literal":"<"}, {"literal":"#"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "channel", "symbols": ["channel$string$1", "snowflake", {"literal":">"}], "postprocess": first},
    {"name": "snowflake", "symbols": ["number"], "postprocess": id},
    {"name": "literal", "symbols": ["startChar"], "postprocess": id},
    {"name": "literal", "symbols": ["startChar", "endChar"], "postprocess": (d) => [...d[0],...d[1]].join('')},
    {"name": "literal$ebnf$1", "symbols": ["char"]},
    {"name": "literal$ebnf$1", "symbols": ["literal$ebnf$1", "char"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "literal", "symbols": ["startChar", "literal$ebnf$1", "endChar"], "postprocess": (d) => [...d[0],...d[1],...d[2]].join('')},
    {"name": "char", "symbols": [/[^ ]/]},
    {"name": "startChar", "symbols": [/[^ "'`<-]/]},
    {"name": "endChar", "symbols": [/[^ "'`>]/]},
    {"name": "anything$ebnf$1", "symbols": ["any"]},
    {"name": "anything$ebnf$1", "symbols": ["anything$ebnf$1", "any"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "anything", "symbols": ["anything$ebnf$1"], "postprocess": (d) => d[0].join('')},
    {"name": "any", "symbols": [/[\S\s]/]},
    {"name": "number$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$1", "symbols": ["number$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "number", "symbols": ["number$ebnf$1"], "postprocess": (d) => d[0].join('')}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
