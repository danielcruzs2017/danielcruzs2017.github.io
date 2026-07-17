document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM (Formulario)
    const form = document.getElementById('citation-form');
    const gradeInput = document.getElementById('grade');
    const sectionInput = document.getElementById('section');
    const dateInput = document.getElementById('date');
    const timeStartInput = document.getElementById('timeStart');
    const timeEndInput = document.getElementById('timeEnd');
    const areaInput = document.getElementById('area');
    const teacherNameInput = document.getElementById('teacherName');
    const teacherPhoneInput = document.getElementById('teacherPhone');
    const citationModelInput = document.getElementById('citationModel');
    const shiftInput = document.getElementById('shift');

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
    const previewTeacherName = document.getElementById('preview-teacherName');
    const previewTeacherPhone = document.getElementById('preview-teacherPhone');
    const previewStudentsList = document.getElementById('preview-students-list');

    // Botones de acción
    const btnGenerate = document.getElementById('btn-generate');
    const btnClear = document.getElementById('btn-clear');
    const btnPdf = document.getElementById('btn-pdf');
    const btnImage = document.getElementById('btn-image');

    // Estado inicial
    let studentCount = 0;
    
    // Inicializar con un estudiante
    addStudentRow();


    // Inicializar Flatpickr para selección de hora visual
    flatpickr("#timeStart", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true
    });

    flatpickr("#timeEnd", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true
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
        { input: gradeInput, previewId: 'preview-grade', default: '____' },
        { input: sectionInput, previewId: 'preview-section', default: '_' },
        { input: dateInput, previewId: 'preview-date', default: '____', format: formatDate },
        { input: timeStartInput, previewId: 'preview-timeStart', default: '____', format: formatTime },
        { input: timeEndInput, previewId: 'preview-timeEnd', default: '____', format: formatTime },
        { input: teacherNameInput, previewId: 'preview-teacherName', default: '' },
        { input: teacherPhoneInput, previewId: 'preview-teacherPhone', default: '' }
    ];

    function updateAllPreviews() {
        inputsToWatch.forEach(item => {
            let val = item.input.value;
            if(item.format && val) {
                val = item.format(val);
            }
            const el = document.getElementById(item.previewId);
            if (el) el.textContent = val || item.default;
        });
        if (previewInstitution) previewInstitution.textContent = 'I.E.P. FRANCISCO BOLOGNESI';
    }

    function updateDynamicTexts() {
        const area = areaInput.value;
        const model = citationModelInput.value;
        const shift = shiftInput.value ? shiftInput.value.toUpperCase() : 'MAÑANA';
        const institution = 'I.E.P. FRANCISCO BOLOGNESI';
        
        const isMathOrComm = (area === 'Matemática' || area === 'Comunicación');
        
        const greetingEl = document.getElementById('preview-greeting');
        const introEl = document.getElementById('preview-intro-text');
        const actionEl = document.getElementById('preview-action-text');
        const reasonTitleEl = document.getElementById('preview-reason-title');
        const reasonDetailEl = document.getElementById('preview-reason-detail');
        const shiftEl = document.getElementById('preview-shift');
        
        const studentsListEl = document.getElementById('preview-students-list');
        
        if (shiftEl) shiftEl.textContent = shift;
        
        if (isMathOrComm) {
            studentsListEl.classList.remove('bg-gray');
            studentsListEl.classList.add('bg-yellow');
            
            // Modelos Matemática y Comunicación
            greetingEl.textContent = 'SEÑOR/SEÑORA/APODERADO';
            introEl.textContent = 'POR LA PRESENTE SE HACE DE SU CONOCIMIENTO QUE SU MENOR HIJO:';
            actionEl.innerHTML = `DEBERÁ DE APERSONARSE A LA <span id="preview-institution-inline" class="highlight-inline">${institution}</span> A FIN DE BRINDAR:`;
            
            if (model === 'refuerzo') {
                reasonTitleEl.innerHTML = '<span class="fuchsia-text title-large">REFUERZO ESCOLAR EN EL ÁREA DE:</span>';
                reasonDetailEl.innerHTML = `<div class="centered-large-text bg-yellow blue-text">${area ? area.toUpperCase() : '____'}</div>`;
            } else if (model === 'atencion_estudiante') {
                reasonTitleEl.innerHTML = '';
                reasonDetailEl.innerHTML = '<div class="centered-large-text bg-yellow green-text">ATENCIÓN AL ESTUDIANTE</div>';
            } else {
                greetingEl.textContent = 'POR LA PRESENTE SE HACE DE SU CONOCIMIENTO QUE SU CALIDAD DE:';
                introEl.textContent = 'PADRE/MADRE/APODERADO/APODERADA DE';
                reasonTitleEl.innerHTML = '';
                actionEl.innerHTML = `DEBERÁ DE APERSONARSE A LA <span id="preview-institution-inline" class="highlight-inline">${institution}</span> A FIN DE BRINDAR LA:`;
                reasonDetailEl.innerHTML = '<div class="centered-large-text bg-yellow blue-text">ATENCIÓN AL PADRE DE FAMILIA</div>';
            }
        } else {
            studentsListEl.classList.remove('bg-yellow');
            studentsListEl.classList.add('bg-gray');
            
            // Demás áreas (Los 2 nuevos formatos)
            if (model === 'atencion_padre') {
                greetingEl.textContent = 'POR LA PRESENTE SE HACE DE SU CONOCIMIENTO QUE SU CALIDAD DE:';
                introEl.textContent = 'PADRE/MADRE/APODERADO/APODERADA DE';
                actionEl.innerHTML = `DEBERÁ DE APERSONARSE A LA <span id="preview-institution-inline" class="highlight-inline">${institution}</span> A FIN DE BRINDAR LA:`;
                reasonTitleEl.innerHTML = '';
                reasonDetailEl.innerHTML = '<div class="centered-large-text bg-gray blue-text">ATENCIÓN AL PADRE DE FAMILIA</div>';
            } else {
                greetingEl.textContent = 'SEÑOR/SEÑORA/APODERADO';
                introEl.textContent = 'POR LA PRESENTE SE HACE DE SU CONOCIMIENTO QUE SU MENOR HIJO:';
                actionEl.innerHTML = `DEBERÁ DE APERSONARSE A LA <span id="preview-institution-inline" class="highlight-inline">${institution}</span> A FIN DE BRINDAR:`;
                reasonTitleEl.innerHTML = '<div class="bg-cyan" style="text-align: center; padding: 5px;"><span class="green-text title-large">ATENCIÓN AL ESTUDIANTE EN:</span></div>';
                reasonDetailEl.innerHTML = `<div class="centered-large-text bg-gray"><span class="green-text">REFUERZO ESCOLAR</span> &nbsp;&nbsp;&nbsp;&nbsp; <span class="blue-text">${area ? area.toUpperCase() : '____'}</span></div>`;
            }
        }

        updateAllPreviews();
    }

    areaInput.addEventListener('change', updateDynamicTexts);
    citationModelInput.addEventListener('change', updateDynamicTexts);
    shiftInput.addEventListener('change', updateDynamicTexts);

    inputsToWatch.forEach(item => {
        item.input.addEventListener('input', updateAllPreviews);
    });

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
                const div = document.createElement('div');
                div.textContent = '* ' + input.value;
                previewStudentsList.appendChild(div);
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
            previewStudentsList.innerHTML = '<div style="color: #999;">Agregue estudiantes en el formulario...</div>';
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

    function validateForm() {
        if (!form.checkValidity()) {
            alert("Faltan llenar datos. Por favor, complete todos los campos requeridos en el formulario.");
            form.reportValidity();
            return false;
        }
        
        const inputs = studentsContainer.querySelectorAll(".student-input");
        let hasStudents = false;
        inputs.forEach(input => {
            if (input.value.trim() !== "") hasStudents = true;
        });

        if (!hasStudents) {
            alert("Faltan llenar datos. Por favor, ingrese al menos el nombre de un estudiante.");
            return false;
        }
        return true;
    }

    // Descargar PDF usando html2pdf.js
    btnPdf.addEventListener('click', () => {
        if (!validateForm()) return;
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
        if (!validateForm()) return;
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


    // Compartir por WhatsApp
    const btnWhatsApp = document.getElementById("btn-whatsapp");
    if (btnWhatsApp) {
        btnWhatsApp.addEventListener("click", () => {
        if (!validateForm()) return;
            const element = document.getElementById("citation-document");
            
            const originalBoxShadow = element.style.boxShadow;
            element.style.boxShadow = "none";
            element.classList.add("compact-export"); 
            window.scrollTo(0, 0);

            html2canvas(element, {
                scale: 2,
                useCORS: true,
                scrollY: 0,
                backgroundColor: "#ffffff"
            }).then(canvas => {
                element.style.boxShadow = originalBoxShadow;
                element.classList.remove("compact-export");

                canvas.toBlob(async (blob) => {
                    const file = new File([blob], `${getFilename()}.png`, { type: "image/png" });
                    
                    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                        try {
                            await navigator.share({
                                files: [file],
                                title: "Citación",
                                text: "Adjunto citación generada."
                            });
                        } catch (error) {
                            console.error("Error compartiendo:", error);
                        }
                    } else {
                        // Fallback: Copy to clipboard
                        try {
                            const item = new ClipboardItem({ "image/png": blob });
                            await navigator.clipboard.write([item]);
                            alert("¡Imagen copiada al portapapeles! Abre WhatsApp Web y presiona (Ctrl+V o Cmd+V) en el chat para pegarla y enviarla.");
                        } catch (err) {
                            alert("No se pudo copiar la imagen automáticamente. Por favor descarga la imagen primero o usa un dispositivo móvil.");
                            console.error(err);
                        }
                    }
                }, "image/png");
            }).catch(err => {
                element.style.boxShadow = originalBoxShadow;
                element.classList.remove("compact-export");
                console.error(err);
                alert("Ocurrió un error al generar la imagen para WhatsApp.");
            });
        });
    }

    // Llamada inicial para cargar los valores por defecto (ej. Institución)
    btnGenerate.click();
});
