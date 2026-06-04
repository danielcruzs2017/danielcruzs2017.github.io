document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM (Formulario)
    const form = document.getElementById('citation-form');
    const institutionInput = document.getElementById('institution');
    const gradeInput = document.getElementById('grade');
    const sectionInput = document.getElementById('section');
    const dateInput = document.getElementById('date');
    const timeStartInput = document.getElementById('timeStart');
    const timeEndInput = document.getElementById('timeEnd');
    const areaInput = document.getElementById('area');
    const reasonInput = document.getElementById('reason');
    const teacherNameInput = document.getElementById('teacherName');
    const teacherRoleInput = document.getElementById('teacherRole');
    const designStyleSelect = document.getElementById('design-style');

    const studentsContainer = document.getElementById('students-container');
    const addStudentBtn = document.getElementById('add-student-btn');
    const templateBtns = document.querySelectorAll('.btn-template');

    // Referencias a elementos del DOM (Vista Previa)
    const citationDocument = document.getElementById('citation-document');
    const previewInstitution = document.getElementById('preview-institution');
    const previewLogo = document.getElementById('preview-logo');
    const previewGrade = document.getElementById('preview-grade');
    const previewSection = document.getElementById('preview-section');
    const previewDate = document.getElementById('preview-date');
    const previewTimeStart = document.getElementById('preview-timeStart');
    const previewTimeEnd = document.getElementById('preview-timeEnd');
    const previewArea = document.getElementById('preview-area');
    const previewReason = document.getElementById('preview-reason');
    const previewTeacherName = document.getElementById('preview-teacherName');
    const previewTeacherRole = document.getElementById('preview-teacherRole');
    const previewStudentsList = document.getElementById('preview-students-list');
    const citationTypeInput = document.getElementById('citationType');

    // Botones de acción
    const btnGenerate = document.getElementById('btn-generate');
    const btnClear = document.getElementById('btn-clear');
    const btnPrint = document.getElementById('btn-print');
    const btnPdf = document.getElementById('btn-pdf');
    const btnImage = document.getElementById('btn-image');

    // Estado inicial
    let studentCount = 0;
    
    // Inicializar con un estudiante
    addStudentRow();

    // Inicializar Flatpickr para selección de hora sin teclado
    flatpickr("#timeStart", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        disableMobile: false, // usa el selector nativo en celular (rueda táctil)
        onChange: function(selectedDates, dateStr, instance) {
            previewTimeStart.textContent = formatTime(dateStr);
        }
    });

    flatpickr("#timeEnd", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        disableMobile: false,
        onChange: function(selectedDates, dateStr, instance) {
            previewTimeEnd.textContent = formatTime(dateStr);
        }
    });

    // Formateadores de fecha y hora
    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr + 'T00:00:00'); // Evitar problemas de zona horaria
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return null;
        let [hours, minutes] = timeStr.split(':');
        let h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'p.m.' : 'a.m.';
        h = h % 12;
        h = h ? h : 12; 
        return `${h}:${minutes} ${ampm}`;
    };

    // Event Listeners (Actualización en tiempo real básica)
    const inputsToWatch = [
        { input: institutionInput, previewId: 'preview-institution', default: 'Institución Educativa' },
        { input: gradeInput, previewId: 'preview-grade', default: '____' },
        { input: sectionInput, previewId: 'preview-section', default: '_' },
        { input: dateInput, previewId: 'preview-date', default: '____', format: formatDate },
        { input: timeStartInput, previewId: 'preview-timeStart', default: '____', format: formatTime },
        { input: timeEndInput, previewId: 'preview-timeEnd', default: '____', format: formatTime },
        { input: areaInput, previewId: 'preview-area', default: '____' },
        { input: reasonInput, previewId: 'preview-reason', default: '____' },
        { input: teacherNameInput, previewId: 'preview-teacherName', default: 'Nombre del Docente' },
        { input: teacherRoleInput, previewId: 'preview-teacherRole', default: 'Cargo del Docente' }
    ];

    function updateAllPreviews() {
        inputsToWatch.forEach(item => {
            let val = item.input.value;
            if(item.format && val) {
                val = item.format(val);
            }
            const el = document.getElementById(item.previewId);
            if (el) el.textContent = val || item.default;
            
            if (item.input === institutionInput) {
                const inlineEl = document.getElementById('preview-institution-inline');
                if (inlineEl) inlineEl.textContent = val || item.default;
            }
        });
    }

    function updateDynamicTexts() {
        const type = citationTypeInput.value;
        const introEl = document.getElementById('preview-intro-text');
        const detailsEl = document.getElementById('preview-details-text');

        if (type === 'estudiantes') {
            introEl.innerHTML = `Por medio de la presente, se cita a los siguientes estudiantes del <span id="preview-grade" class="highlight">____</span> "<span id="preview-section" class="highlight">_</span>".`;
            detailsEl.innerHTML = `El día <span id="preview-date" class="highlight">____</span> de <span id="preview-timeStart" class="highlight">____</span> a <span id="preview-timeEnd" class="highlight">____</span>, con el fin de <span id="preview-reason" class="highlight">____</span> en el área de <span id="preview-area" class="highlight">____</span>.`;
        } else if (type === 'apoderado') {
            introEl.innerHTML = `SEÑOR/SEÑORA/APODERADO<br>Por la presente se hace de su conocimiento que en su calidad de padre/madre/apoderado del estudiante del <span id="preview-grade" class="highlight">____</span> "<span id="preview-section" class="highlight">_</span>":`;
            detailsEl.innerHTML = `Deberá apersonarse a la institución educativa <strong id="preview-institution-inline" class="highlight">Institución Educativa</strong> el día <span id="preview-date" class="highlight">____</span> de <span id="preview-timeStart" class="highlight">____</span> a <span id="preview-timeEnd" class="highlight">____</span>, a fin de brindar/tratar: <span id="preview-reason" class="highlight">____</span> en el área de <span id="preview-area" class="highlight">____</span>.`;
        }
        updateAllPreviews();
    }

    citationTypeInput.addEventListener('change', updateDynamicTexts);

    inputsToWatch.forEach(item => {
        item.input.addEventListener('input', updateAllPreviews);
    });

    // Manejo de diseño
    designStyleSelect.addEventListener('change', (e) => {
        citationDocument.className = 'citation-document style-' + e.target.value;
        checkSignatureVisibility();
    });


    // Plantillas rápidas
    templateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            reasonInput.value = btn.getAttribute('data-text');
            previewReason.textContent = reasonInput.value;
            checkSignatureVisibility();
        });
    });

    // Validar visibilidad de firma
    function checkSignatureVisibility() {
        const text = reasonInput.value.toLowerCase();
        // Si el motivo incluye palabras clave sobre padres o si se usó la plantilla
        if (text.includes('padres') || text.includes('apoderado')) {
            citationDocument.classList.remove('no-signature');
        } else {
            citationDocument.classList.add('no-signature');
        }
    }
    
    // Llamada inicial
    checkSignatureVisibility();

    // Actualizar firma al escribir motivo
    reasonInput.addEventListener('input', checkSignatureVisibility);

    // Agregar Estudiante
    addStudentBtn.addEventListener('click', () => {
        addStudentRow();
    });

    function addStudentRow() {
        studentCount++;
        const rowId = `student-row-${Date.now()}`;
        
        const row = document.createElement('div');
        row.className = 'student-row';
        row.id = rowId;
        
        row.innerHTML = `
            <span class="student-number">${studentCount}.</span>
            <input type="text" class="student-input" placeholder="Nombre del estudiante" required>
            <button type="button" class="btn-remove-student" onclick="removeStudent('${rowId}')" title="Eliminar">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        `;
        
        studentsContainer.appendChild(row);
        
        // Agregar listener para actualizar lista en vista previa
        const input = row.querySelector('.student-input');
        input.addEventListener('input', updateStudentsPreview);
        
        updateStudentsPreview();
    }

    // Exponer removeStudent globalmente para el onclick
    window.removeStudent = function(rowId) {
        const row = document.getElementById(rowId);
        if (row) {
            row.remove();
            renumberStudents();
            updateStudentsPreview();
        }
    };

    function renumberStudents() {
        const rows = studentsContainer.querySelectorAll('.student-row');
        studentCount = rows.length;
        rows.forEach((row, index) => {
            row.querySelector('.student-number').textContent = `${index + 1}.`;
        });
    }

    function updateStudentsPreview() {
        previewStudentsList.innerHTML = '';
        const inputs = studentsContainer.querySelectorAll('.student-input');
        
        let hasStudents = false;
        let validStudentsCount = 0;
        inputs.forEach(input => {
            if (input.value.trim() !== '') {
                const li = document.createElement('li');
                li.textContent = input.value;
                previewStudentsList.appendChild(li);
                hasStudents = true;
                validStudentsCount++;
            }
        });

        const previewStudentsTitle = document.getElementById('preview-students-title');
        if (previewStudentsTitle) {
            if (validStudentsCount > 1) {
                previewStudentsTitle.textContent = 'Estudiantes:';
            } else {
                previewStudentsTitle.textContent = 'Estudiante:';
            }
        }

        if (!hasStudents) {
            previewStudentsList.innerHTML = '<li style="color: #999;">Agregue estudiantes en el formulario...</li>';
        }
    }

    // Botón Generar (Fuerza actualización total)
    btnGenerate.addEventListener('click', () => {
        updateDynamicTexts();
        updateStudentsPreview();
        // Scroll hacia la vista previa en móviles
        if (window.innerWidth < 992) {
            citationDocument.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Botón Limpiar
    btnClear.addEventListener('click', () => {
        if(confirm('¿Estás seguro de que quieres borrar todos los datos del formulario?')) {
            form.reset();
            
            // Limpiar estudiantes
            studentsContainer.innerHTML = '';
            studentCount = 0;
            addStudentRow();

            // Forzar actualización de vista previa a valores por defecto
            updateDynamicTexts();
            updateStudentsPreview();
        }
    });

    // Configuración para el nombre de los archivos a descargar
    function getFilename() {
        const gradeStr = gradeInput.value.replace(/[^a-zA-Z0-9]/g, '');
        const sectionStr = sectionInput.value.replace(/[^a-zA-Z0-9]/g, '');
        const dateStr = new Date().toISOString().split('T')[0];
        
        let name = "Citacion";
        if (gradeStr) name += `_${gradeStr}`;
        if (sectionStr) name += `_${sectionStr}`;
        return `${name}_${dateStr}`;
    }

    // Imprimir
    btnPrint.addEventListener('click', () => {
        window.print();
    });

    // Descargar PDF usando html2pdf.js
    btnPdf.addEventListener('click', () => {
        const element = document.getElementById('citation-document');
        
        // Guardamos el estilo actual para restaurarlo después
        const originalBoxShadow = element.style.boxShadow;
        element.style.boxShadow = 'none';

        // Prevenir problemas de hoja en blanco por scroll
        window.scrollTo(0, 0);

        const opt = {
            margin:       10,
            filename:     `${getFilename()}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, scrollY: 0 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Generar PDF
        html2pdf().set(opt).from(element).save().then(() => {
            // Restaurar estilo
            element.style.boxShadow = originalBoxShadow;
        });
    });

    // Descargar Imagen usando html2canvas
    btnImage.addEventListener('click', () => {
        const element = document.getElementById('citation-document');
        
        // Guardamos el estilo actual y aplicamos el de exportación compacta
        const originalBoxShadow = element.style.boxShadow;
        element.style.boxShadow = 'none';
        element.classList.add('compact-export'); // Compactar para WhatsApp

        // Prevenir problemas de hoja en blanco por scroll
        window.scrollTo(0, 0);

        html2canvas(element, {
            scale: 2,
            useCORS: true,
            scrollY: 0,
            backgroundColor: '#ffffff'
        }).then(canvas => {
            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.download = `${getFilename()}.png`;
            link.href = image;
            link.click();
            
            // Restaurar estilos
            element.style.boxShadow = originalBoxShadow;
            element.classList.remove('compact-export');
        });
    });

    // Llamada inicial para cargar los valores por defecto (ej. Institución)
    btnGenerate.click();
});
