var _PDF_DOC,
_CURRENT_PAGE,
_TOTAL_PAGES,
_PAGE_RENDERING_IN_PROGRESS = 0


var  _CANVAS;

var canvas
var ctx,
rect = {},
drag = false;

window.onload = () => {
    _CANVAS = document.querySelector('#pdf-canvas')
    canvas = document.querySelector('#canvas')
    ctx = canvas.getContext('2d')
}


function init() {
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mousemove', mouseMove, false);
}

function draw() {
    ctx.beginPath();
    ctx.fillStyle = "rgba(164, 221, 249, 0.3)";
    ctx.fill();
    ctx.strokeStyle = "#1b9aff";
    ctx.linewidth = 1;
    ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
    ctx.stroke();
    console.log(rect)
    
}

function mouseDown(e) {
    rect.startX = e.pageX - this.offsetLeft;
    rect.startY = e.pageY - this.offsetTop;
    drag = true;
}

function mouseUp() {
    drag = false;
}

function mouseMove(e) {
    if (drag) {

        rect.w = (e.pageX - this.offsetLeft) - rect.startX;
        rect.h = (e.pageY - this.offsetTop) - rect.startY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();
        // const pixelsArr = rect.split(" ")
        // const ptArr = pixelsArr.map(px => {
        //     const pt = (px * 96) / 72
        //     return {
        //         pt
        //     }
        // })
        // console.log("PT EQUIVALENT")
        // console.log(ptArr)
        // console.log(rect.startX, rect.startY, rect.w, rect.h);
    }
}


// initialize and load the PDF
async function showPDF(pdf_url) {

    // get handle of pdf document
    try {
        _PDF_DOC = await pdfjsLib.getDocument({ url: pdf_url });
        console.log(_PDF_DOC)
    }
    catch (error) {
        alert(error.message);
    }

    // total pages in pdf
    _TOTAL_PAGES = _PDF_DOC.numPages;

    showPage(1);
}

// load and render specific page of the PDF
async function showPage(page_no) {
    _PAGE_RENDERING_IN_PROGRESS = 1;
    _CURRENT_PAGE = page_no;
    try {
        var page = await _PDF_DOC.getPage(page_no);
    }
    catch (error) {
        alert(error.message);
    }

    // console.log(_CANVAS)

    // original width of the pdf page at scale 1
    var pdf_original_width = page.getViewport(1).width;

    // as the canvas is of a fixed width we need to adjust the scale of the viewport where page is rendered
    var scale_required = _CANVAS.width / pdf_original_width;

    // get viewport to render the page at required scale
    var viewport = page.getViewport(scale_required);

    // set canvas height same as viewport height
    _CANVAS.height = viewport.height;
    // page is rendered on <canvas> element
    var render_context = {
        canvasContext: _CANVAS.getContext('2d'),
        viewport: viewport
    };

    // render the page contents in the canvas
    try {
        await page.render(render_context);
    }
    catch (error) {
        alert(error.message);
    }

    _PAGE_RENDERING_IN_PROGRESS = 0;
}
function previewFile(event) {
    var tmppath = URL.createObjectURL(event.target.files[0]);
    showPDF(tmppath);
    init();

}
function submitCoordinates() {
    // fetch('https://api.github.com/gists', {
    //     method: 'post',
    //     body: JSON.stringify(opts)
    // }).then(function(response) {
    //     return response.json();
    // }).then(function(data) {
    //     ChromeSamples.log('Created Gist:', data.html_url);
    // });
}


