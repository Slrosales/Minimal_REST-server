import express from 'express';
import fs from 'node:fs';

const app = express()
const port = 3000

app.get('/', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

        const head = data.responsibles.map((number) => {
            const prof = data.profs.find((p) => p.number === number); // find the professor with the matching number
            return {name: `${prof.lastname} ${prof.firstname[0]}.`, href: `/profs/${number}`};
        } );

        res.status(200).json({
            name : data.name,
            _links: {
                students : {href: '/students'},
                profs : {href: '/profs'},
                modules : {href: '/modules'},
                head,
            },
        });

    } catch(err) {
        console.error(err);
        res.status(500).send('data.json file not found or invalid');
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});