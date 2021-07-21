export const messages = [
    {
        "title": "Olha eu aqui",
        "body": "Bora dar uma revisada rapidinho?",
    },
    {
        "title": "Bora dar uma revisada?",
        "body": "Bora revisar o conteudo para ele se fixar cada vez mais",
    },
    {
        "title": "#estudar",
        "body": "Já estudou hoje?\nBora estudar, é só clicar em mim :)",
    },
    {
        "title": "Como vão os estudos?",
        "body": "Vamos criar vários cards para coisas muito importantes",
    },
]

export function getRandomMessage(){
    return messages[_randomNumber(messages.length)]
}

function _randomNumber(end=0, start=0){
    return start + Math.floor(Math.random() * end)
}