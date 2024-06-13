function loadImage(url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = "blob";
        xhr.onload = function (e) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const res = event.target.result;
                resolve(res);
            }
            const file = this.response;
            reader.readAsDataURL(file);
        }
        xhr.send();
    });
}

let signaturePad = null;

window.addEventListener('load', async () => {

    const canvas = document.querySelector("canvas");
    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;

    signaturePad = new SignaturePad(canvas, {});

    const otrosContainer = document.getElementById('otros-container');
    const numeroHijosSelect = document.getElementById('numeroHijos');
    numeroHijosSelect.addEventListener('change', () => {
        if (numeroHijosSelect.value === '7') {
            otrosContainer.style.display = 'block';
        } else {
            otrosContainer.style.display = 'none';
        }
    });

    const form = document.querySelector('#form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let curso = document.getElementById('curso').value;
        let nombre = document.getElementById('nombree').value;
        let codigo = document.getElementById('codigoe').value;
        let cursoc = document.getElementById('cursoc').value;
        let numeroHijos = document.getElementById('numeroHijos').value;
        let otrosText = document.getElementById('otrosText').value;

        // Validar que todos los campos requeridos estén completos
        if (!curso || !nombre || !codigo || !cursoc || !numeroHijos || (numeroHijos === '7' && !otrosText)) {
            alert("Por favor, completa todos los campos requeridos.");
            return;
        }

        generatePDF(curso, nombre, codigo, cursoc, numeroHijos, otrosText);
    });

});

async function generatePDF(curso, nombre, codigo, cursoc, numeroHijos, otrosText) {
    const image = await loadImage("SOLICITUD DE RETIRO DE CURSOS(1)_page-0001.jpg");
    const signatureImage = signaturePad.toDataURL();

    const pdf = new jsPDF('p', 'pt', 'letter');

    pdf.addImage(image, 'PNG', 0, 0, 565, 792);
    pdf.addImage(signatureImage, 'PNG', 200, 370, 300, 60);

    pdf.setFontSize(12);

    const date = new Date();
    var day = date.getUTCDate().toString().padStart(2, '0');
    var month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    var year = date.getUTCFullYear().toString();

    var formattedDate = '' + day + '/' + month + '/' + year + '';
    pdf.text(formattedDate, 275, 135);

    pdf.setFontSize(10);
    pdf.text(nombre, 260, 105);
    pdf.text(curso, 260, 75);
    pdf.text(codigo, 275, 90);
    pdf.text(cursoc, 170, 202);

    pdf.setFillColor(0,0,0);

    const circles = {
        1: 358,
        2: 385,
        3: 400,
        4: 425,
        5: 443,
        6: 458,
        7: 478
    };
    if (circles[numeroHijos]) {
        pdf.circle(circles[numeroHijos], 202, 4, 'FD');
    }

    if (numeroHijos === '7' && otrosText) {
        pdf.text(otrosText, 220, 364); // Position of the additional text
    }

    pdf.save("Solicitud de retiro de curso.pdf");
}
