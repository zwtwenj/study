let less = require('less')

function loader(sourceLess) {
    let css = ''
    less.render(sourceLess, function(err, res) {
        css = res.css
    })
    css = css.replace(/\n/g, '\\n')
    return css
}

module.exports = loader