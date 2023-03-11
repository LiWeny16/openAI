import https from 'https'

https.get('https://jsonplaceholder.typicode.com/todos/1', (response) => {
    let todo = ''
    response.on('data', (chunk) => {
        todo += chunk
    })
    response.on('end', () => {
        console.log(JSON.parse(todo))
    })

}).on("error", (error) => {
    console.log("Error: " + error.message)
})