const express = require("express");
const axios = require("axios");
const redis = require("redis");
const app = express();
const redisPort = 6379
const client = redis.createClient(redisPort);

//log error to the console if any occurs
client.on("error", (err) => {
    console.log(err);
});
app.get("/:id", (req, res) => {
    const todoIndex = req.params.id;
    try {
        client.get(searchTerm, async (err, jobs) => {
            if (err) throw err;
            if (jobs) {
                res.status(200).send({
                    jobs: JSON.parse(jobs),
                    message: "data retrieved from the cache"
                });
            } else {
                const jobs = await axios.get(`https://jsonplaceholder.typicode.com/todos/${todoIndex}`).catch(e => console.error(e));
                console.log(jobs.data);
                client.set(searchTerm, JSON.stringify(jobs.data));
                res.status(200).send({
                    jobs: jobs.data,
                    message: "cache miss"
                });
            }
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});
app.listen(process.env.PORT || 3000, () => {
    console.log("server started");
});