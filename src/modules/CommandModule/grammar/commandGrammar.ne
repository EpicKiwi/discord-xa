@builtin "whitespace.ne"
@{%
	const first = (d) => d[1]
	const argument = (argType,pos=0) => (d) => {return{type:argType,value:d[pos]}}
%}

main		-> command (__ argument):*							{% (d) => {
	
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
	
} %}

# The base command name
command 	-> literal											{% id %}

# Arguments
argument	-> value											{% id %}
			  |switch											{% argument("switch") %}
			  |namedParam										{% argument("named") %}

# - Stackable sigle letter parameters such as -a -e -zer
switch		-> "-" char:+

# - Multi letter parameter such as --named --foo
namedParam  -> "--" literal										{% first %}

# Possible values of argument
value		-> literal											{% argument("literal") %}
			  |user												{% argument("user") %}
			  |role												{% argument("role") %}
			  |channel											{% argument("channel") %}
			  |code												{% argument("code") %}
			  |"\"" [^"]:? "\""									{% argument("literal",1) %}
			  |"'" [^']:? "'"									{% argument("literal",1) %}

# A line or block of code
code		-> multiCode										{% id %}
			  |labMultiCode										{% id %}
			  |inlineCode										{% id %}
			  |inlineBigCode									{% id %}

inlineCode	-> "`" [^`]:* "`"									{% (d) => {return{content:d[1].join(''),language:null}} %}

inlineBigCode-> "```" .:* "```"							{% (d) => {return{content:d[1],language:null}} %}

multiCode	-> "```" _ "\n" anything:? "```"							{% (d) => {return{content:d[1],language:null}} %}

labMultiCode-> "```" literal "\n" anything:? "```"				{% (d) => {return{content:d[3],language:d[1]}} %}

# A user mention

user -> "<@" "!":? snowflake ">"								{% (d) => d[2] %}

# A role mention

role	-> "<@&" snowflake ">"									{% first %}

# A channel mention

channel -> "<#" snowflake ">"									{% first %}

# Primitives
snowflake   -> number											{% id %}
literal		-> startChar 										{% id %}	
			  |startChar endChar								{% (d) => [...d[0],...d[1]].join('') %}
			  |startChar char:+ endChar							{% (d) => [...d[0],...d[1],...d[2]].join('') %}
char		-> [^ ]
startChar	-> [^ "'`<-]
endChar		-> [^ "'`>]
anything	-> any:+											{% (d) => d[0].join('') %}
any			-> [\S\s]
number		-> [0-9]:+											{% (d) => d[0].join('') %}