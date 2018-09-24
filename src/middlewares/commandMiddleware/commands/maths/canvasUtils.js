const Canvas = require("canvas")
const canvg = require("canvg")

module.exports = {

    minWidth: 500,
    margin: 20,

    initCanvas(width,height){
        let canvas = new Canvas(Math.max(this.minWidth,width)+2*this.margin,height+2*this.margin)
        let ctx = canvas.getContext('2d')
        ctx.fillStyle = "#2F3136"
        this.roundRect(ctx,0,0,canvas.width,canvas.height,20,true,false)
        ctx.fillStyle = "#C0C1C2"
        ctx.font = "30px Droid sans"
        return canvas
    },

    getSvgCanvas(svg,width,height){
        let svgCanvas = new Canvas(width,height)
        canvg(svgCanvas,svg,{
            ignoreMouse: true,
            ignoreAnimation: true,
            ignoreDimensions: true,
            scaleWidth: width,
            scaleHeight: height})
        return svgCanvas
    },

    roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke == 'undefined') {
            stroke = true;
        }
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }

    }
}