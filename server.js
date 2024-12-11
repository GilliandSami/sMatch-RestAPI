const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Bienvenue sur sMatch');
    console.log(`Server started on port ${PORT}`);
});