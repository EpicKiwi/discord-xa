const mathjax = require("mathjax-node")
const canvasUtil = require("./canvasUtils")

module.exports = {

    getEquationSvg(texEquation){ return new Promise((resolve, reject) => {
        mathjax.typeset({
            math: texEquation,
            format: "TeX",
            speakText: true,
            svg: true,
        }, function (data) {
            if (data.errors) {
                return reject(data.errors)
            }
            return resolve(data)
        })
    })},

    async renderEquation(texEquation,scale){
        scale = scale || 15

        let svgData = await this.getEquationSvg(texEquation)

        let width = Math.round(parseFloat(svgData.width)*scale)
        let height = Math.round(parseFloat(svgData.height)*scale)

        let margin = canvasUtil.margin

        let svg = svgData.svg.replace(/fill="currentColor"/i,`fill="#C0C1C2"`)

        let canvas = canvasUtil.initCanvas(width,height)

        let svgCanvas = canvasUtil.getSvgCanvas(svg,width,height)

        canvas.getContext('2d').drawImage(svgCanvas,canvas.width/2 - width/2,canvas.height/2 - height/2)

        return canvas
    }
}