import app from "@server/server";

const PORT = 8080;
app.get('/', (req,res) => res.send('Express + TypeScript Server'));
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});