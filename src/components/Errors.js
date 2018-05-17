function handleError(err) {
    alert('Ocorreu um erro!');
    console.error(err);
    return null;
}

module.exports = {
    handleError
}