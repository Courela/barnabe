function dateFormat(date) {
    //console.log(date);
    if (!date) { return ''; }
     
    const dateObj = new Date(date);
    var dd = dateObj.getDate();
    var mm = dateObj.getMonth() + 1; //January is 0!

    var yyyy = dateObj.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return dd + '/' + mm + '/' + yyyy;
}

export {
    dateFormat
}