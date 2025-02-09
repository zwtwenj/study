function loader(sourceCss) {
    let style = `
        let style = document.createElement('style');
        style.innerHTML = ${JSON.stringify(sourceCss)};
        document.head.appendChild(style);
    `
    return style
}

module.exports = loader