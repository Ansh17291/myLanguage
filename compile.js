function lexer(input){
    const token = []
    let cursor = 0;

    while(cursor < input.length){
        let char = input[cursor];

        if(/\s/.test(char)){
            cursor++;
            continue;
        }

        if(/[a-zA-Z]/.test(char)){
            let word = "";
            while(/[a-zA-Z0-9]/.test(char)){
                word+= char;
                char = input[++cursor];
            }
            if(word === "oi" || word === "chaldekha"){
                token.push({type:'keyword', value :word});
            }else{
                token.push({type:'identifier', value: word});
            }

            continue;
        }

        if(/[0-9]/.test(char)){
            let num = ""
            while(/[0-9]/.test(char)){
                num+= char
                char = input[++cursor];
            }
            token.push({type:'number', value:parseInt(num)});
        }

        if(/[\+\-\*\=]/.test(char)){
            token.push({type:'operator', value:char});
            cursor++;
            continue;
        }


    }

    return token;
}

function parser(tokens){
    const ast= {
        type: 'Program',
        body : []
    };

    while(tokens.length > 0){
        let token = tokens.shift();
        if(token.type === 'keyword' && token.value === 'oi'){
            let declaration = {
                type : 'Declaration',
                name:tokens.shift().value,
                value: null
            };

            if(tokens[0].type === 'operator' && tokens[0].value === "="){
                tokens.shift();
                let expression = '';
                while(tokens.length > 0 && tokens[0].type != 'keyword'){
                    expression += tokens.shift().value;
                }
                declaration.value = expression.trim();
            }

            ast.body.push(declaration);
        }

        if(token.type === 'keyword' && token.value === 'chaldekha'){
            ast.body.push({
                type: 'Print',
                expression: tokens.shift().value
            });
        }
    }

    return ast;

}

function codeGen(node){
    switch(node.type) {
        case 'Program': return node.body.map(codeGen).join('\n');
        case 'Declaration': return `const ${node.name} = ${node.value};`
        case 'Print' : return `console.log(${node.expression})`
    }
}


function compiler(input){
    const tokens = lexer(input);
    // console.log(tokens)
    const ast = parser(tokens);
    // console.log(ast)
    const executableCode = codeGen(ast);
    // console.log(executableCode);
    return executableCode
}

function runner(input){
    eval(input);
}

const code = `
    oi x = 10
    oi y = 20

    oi sum = x + y
    chaldekha sum

`
const executable = compiler(code);
runner(executable);
