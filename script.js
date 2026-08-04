/*
   =====================================================
   MENÚ MOBILE
   =====================================================
*/

const menuButton = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");

if (menuButton && nav) {
  function closeMobileMenu() {
    nav.classList.remove("open");
    menuButton.classList.remove("active");

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

    document.body.classList.remove(
      "menu-open"
    );
  }

  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    menuButton.classList.toggle(
      "active",
      isOpen
    );

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    document.body.classList.toggle(
      "menu-open",
      isOpen
    );
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener(
      "click",
      closeMobileMenu
    );
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1050) {
      closeMobileMenu();
    }
  });
}


/*
   =====================================================
   AÑO AUTOMÁTICO
   =====================================================
*/

const year = document.querySelector("#year");

if (year) {
  year.textContent =
    new Date().getFullYear();
}


/*
   =====================================================
   LINK ACTIVO SEGÚN LA SECCIÓN VISIBLE
   =====================================================
*/

const sectionLinks = Array.from(
  document.querySelectorAll(
    '.nav a[href^="#"]'
  )
);

const observedSections = sectionLinks
  .map((link) => {
    const selector =
      link.getAttribute("href");

    if (!selector) {
      return null;
    }

    return document.querySelector(selector);
  })
  .filter(Boolean);

function setActiveLink(sectionId) {
  sectionLinks.forEach((link) => {
    const isActive =
      link.getAttribute("href") ===
      `#${sectionId}`;

    link.classList.toggle(
      "active",
      isActive
    );
  });
}

if ("IntersectionObserver" in window) {
  const sectionObserver =
    new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter(
            (entry) =>
              entry.isIntersecting
          )
          .sort(
            (
              firstEntry,
              secondEntry
            ) =>
              secondEntry.intersectionRatio -
              firstEntry.intersectionRatio
          );

        if (visibleEntries.length > 0) {
          setActiveLink(
            visibleEntries[0].target.id
          );
        }
      },
      {
        rootMargin:
          "-25% 0px -60% 0px",

        threshold: [
          0.05,
          0.15,
          0.3,
          0.5,
        ],
      }
    );

  observedSections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

setActiveLink("inicio");


/*
   =====================================================
   MODAL DEL FORMULARIO PROFESIONAL
   =====================================================
*/

const professionalModal =
  document.querySelector(
    "#professional-modal"
  );

const openModalButton =
  document.querySelector(
    "#open-professional-form"
  );

const closeModalButtons = Array.from(
  document.querySelectorAll(
    "[data-modal-close]"
  )
);

const modalDialog =
  professionalModal?.querySelector(
    ".professional-modal__dialog"
  );

const modalBody =
  professionalModal?.querySelector(
    ".professional-modal__body"
  );

let elementFocusedBeforeModal = null;

function getFocusableElements(container) {
  if (!container) {
    return [];
  }

  return Array.from(
    container.querySelectorAll(
      [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled]):not([type="hidden"])',
        'textarea:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(",")
    )
  ).filter((element) => {
    return element.offsetParent !== null;
  });
}

function isProfessionalModalOpen() {
  return Boolean(
    professionalModal?.classList.contains(
      "is-open"
    )
  );
}

function openProfessionalModal() {
  if (!professionalModal) {
    return;
  }

  elementFocusedBeforeModal =
    document.activeElement;

  professionalModal.classList.add(
    "is-open"
  );

  professionalModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "modal-open"
  );

  if (modalBody) {
    modalBody.scrollTop = 0;
  }

  window.requestAnimationFrame(() => {
    const closeButton =
      professionalModal.querySelector(
        ".professional-modal__close"
      );

    closeButton?.focus();
  });
}

function closeProfessionalModal() {
  if (!professionalModal) {
    return;
  }

  professionalModal.classList.remove(
    "is-open"
  );

  professionalModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "modal-open"
  );

  if (
    elementFocusedBeforeModal instanceof
    HTMLElement
  ) {
    elementFocusedBeforeModal.focus();
  } else {
    openModalButton?.focus();
  }
}

openModalButton?.addEventListener(
  "click",
  openProfessionalModal
);

closeModalButtons.forEach((button) => {
  button.addEventListener(
    "click",
    closeProfessionalModal
  );
});

modalDialog?.addEventListener(
  "click",
  (event) => {
    event.stopPropagation();
  }
);


/*
   =====================================================
   MODAL DE TÉRMINOS Y PRIVACIDAD
   =====================================================
*/

const legalModal =
  document.querySelector("#legal-modal");

const legalDialog =
  legalModal?.querySelector(
    ".legal-modal__dialog"
  );

const legalModalTitle =
  document.querySelector(
    "#legal-modal-title"
  );

const legalModalContent =
  document.querySelector(
    "#legal-modal-content"
  );

const legalOpenButtons = Array.from(
  document.querySelectorAll(
    "[data-legal-open]"
  )
);

const legalCloseButtons = Array.from(
  document.querySelectorAll(
    "[data-legal-close]"
  )
);

let legalTriggerElement = null;

const legalTexts = {
  terms: {
    title: "Términos y condiciones",

    content: `
      <section class="legal-document">

        <p>
          Última actualización:
          <strong>agosto de 2026</strong>.
        </p>

        <h3>1. Finalidad del formulario</h3>

        <p>
          El formulario de postulación profesional de Nura
          permite que profesionales de la salud soliciten
          ser evaluados para una posible incorporación a
          la cartilla de la plataforma.
        </p>

        <p>
          El envío del formulario no implica una aceptación
          automática, relación laboral, contratación ni
          garantía de incorporación.
        </p>

        <h3>2. Veracidad de la información</h3>

        <p>
          La persona postulante declara que los datos,
          documentos, matrículas, títulos y antecedentes
          profesionales proporcionados son verdaderos,
          actuales y completos.
        </p>

        <p>
          Nura podrá solicitar documentación adicional o
          verificar la información con organismos,
          instituciones educativas o colegios profesionales,
          cuando resulte necesario para evaluar la
          postulación.
        </p>

        <h3>3. Uso adecuado del formulario</h3>

        <p>
          El formulario debe utilizarse únicamente para
          enviar información relacionada con la postulación
          profesional.
        </p>

        <p>
          No deben incluirse historias clínicas, diagnósticos,
          imágenes, nombres, datos personales ni cualquier
          otra información perteneciente a pacientes.
        </p>

        <h3>4. Evaluación de la postulación</h3>

        <p>
          Nura podrá aceptar, rechazar o solicitar
          información adicional respecto de una postulación,
          de acuerdo con sus criterios profesionales,
          técnicos, de seguridad y de funcionamiento de la
          plataforma.
        </p>

        <h3>5. Responsabilidad profesional</h3>

        <p>
          En caso de incorporación, cada profesional será
          responsable por la vigencia de su matrícula,
          habilitación, seguros, obligaciones tributarias,
          conducta profesional y calidad de las prestaciones
          brindadas.
        </p>

        <p>
          Nura funciona como una plataforma de conexión y
          organización. No sustituye ni controla el criterio
          clínico independiente de cada profesional.
        </p>

        <h3>6. Modificaciones</h3>

        <p>
          Nura podrá actualizar estos términos para reflejar
          cambios legales, técnicos o funcionales. La versión
          vigente será la que se encuentre disponible dentro
          del formulario al momento de realizar la
          postulación.
        </p>

      </section>
    `,
  },

  privacy: {
    title: "Política de privacidad",

    content: `
      <section class="legal-document">

        <p>
          Última actualización:
          <strong>agosto de 2026</strong>.
        </p>

        <h3>1. Información que recopilamos</h3>

        <p>
          Para evaluar la postulación profesional, Nura
          puede recopilar los siguientes datos:
        </p>

        <ul>
          <li>Nombre, apellido y nacionalidad.</li>
          <li>DNI u otro documento identificatorio.</li>
          <li>Correo electrónico y teléfono.</li>
          <li>Profesión, especialidad y experiencia.</li>
          <li>Número y jurisdicción de la matrícula.</li>
          <li>Ubicación y modalidad de atención.</li>
          <li>Disponibilidad y horarios profesionales.</li>
          <li>Título profesional y currículum vitae.</li>
        </ul>

        <h3>2. Para qué utilizamos la información</h3>

        <p>
          Los datos se utilizarán exclusivamente para:
        </p>

        <ul>
          <li>Recibir y administrar la postulación.</li>
          <li>Verificar identidad y antecedentes profesionales.</li>
          <li>Evaluar una posible incorporación a la cartilla.</li>
          <li>Contactar a la persona postulante.</li>
          <li>Cumplir obligaciones legales y de seguridad.</li>
        </ul>

        <h3>3. Datos sensibles y documentación</h3>

        <p>
          El DNI, título, matrícula y currículum constituyen
          información personal que debe ser tratada con
          especial cuidado.
        </p>

        <p>
          Nura limitará su acceso a las personas que necesiten
          revisarla para evaluar la postulación y aplicará
          medidas razonables de seguridad para evitar accesos
          no autorizados, pérdida, alteración o divulgación
          indebida.
        </p>

        <h3>4. Información de pacientes</h3>

        <p>
          La persona postulante no debe enviar información
          clínica ni personal de pacientes. Nura no solicita
          historias clínicas, diagnósticos, fotografías,
          conversaciones ni documentos de terceros.
        </p>

        <h3>5. Conservación de los datos</h3>

        <p>
          La información podrá conservarse durante el tiempo
          necesario para evaluar la postulación, gestionar
          comunicaciones relacionadas y cumplir obligaciones
          legales o de seguridad.
        </p>

        <p>
          Cuando los datos dejen de ser necesarios, podrán
          eliminarse o anonimizarse de manera segura.
        </p>

        <h3>6. Compartir información</h3>

        <p>
          Nura no venderá los datos de postulantes.
          La información podrá compartirse únicamente con
          proveedores técnicos necesarios para procesar y
          almacenar el formulario, o cuando exista una
          obligación legal.
        </p>

        <h3>7. Derechos de la persona titular</h3>

        <p>
          La persona titular podrá solicitar acceso,
          actualización, rectificación o eliminación de sus
          datos, según corresponda y conforme a la normativa
          aplicable.
        </p>

        <h3>8. Contacto</h3>

        <p>
          Para realizar una consulta relacionada con la
          privacidad o el tratamiento de datos personales,
          la persona interesada podrá comunicarse con Nura a
          través de los canales oficiales publicados en la
          plataforma.
        </p>

      </section>
    `,
  },
};

function isLegalModalOpen() {
  return Boolean(
    legalModal?.classList.contains(
      "is-open"
    )
  );
}

function openLegalModal(type, trigger) {
  const selectedContent =
    legalTexts[type];

  if (
    !legalModal ||
    !selectedContent ||
    !legalModalTitle ||
    !legalModalContent
  ) {
    return;
  }

  legalTriggerElement =
    trigger || document.activeElement;

  legalModalTitle.textContent =
    selectedContent.title;

  legalModalContent.innerHTML =
    selectedContent.content;

  legalModal.classList.add("is-open");

  legalModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "legal-modal-open"
  );

  legalModalContent.scrollTop = 0;

  window.requestAnimationFrame(() => {
    legalModal
      .querySelector(
        ".legal-modal__close"
      )
      ?.focus();
  });
}

function closeLegalModal() {
  if (!legalModal) {
    return;
  }

  legalModal.classList.remove("is-open");

  legalModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "legal-modal-open"
  );

  if (
    legalTriggerElement instanceof
    HTMLElement
  ) {
    legalTriggerElement.focus();
  }

  legalTriggerElement = null;
}

legalOpenButtons.forEach((button) => {
  button.addEventListener(
    "click",
    () => {
      openLegalModal(
        button.dataset.legalOpen,
        button
      );
    }
  );
});

legalCloseButtons.forEach((button) => {
  button.addEventListener(
    "click",
    closeLegalModal
  );
});

legalDialog?.addEventListener(
  "click",
  (event) => {
    event.stopPropagation();
  }
);


/*
   =====================================================
   FOCO Y TECLA ESCAPE EN LOS MODALES
   =====================================================
*/

document.addEventListener(
  "keydown",
  (event) => {
    if (isLegalModalOpen()) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLegalModal();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements =
        getFocusableElements(legalModal);

      if (!focusableElements.length) {
        event.preventDefault();
        return;
      }

      const firstElement =
        focusableElements[0];

      const lastElement =
        focusableElements[
          focusableElements.length - 1
        ];

      if (
        event.shiftKey &&
        document.activeElement ===
          firstElement
      ) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (
        !event.shiftKey &&
        document.activeElement ===
          lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }

      return;
    }

    if (!isProfessionalModalOpen()) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeProfessionalModal();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements =
      getFocusableElements(
        professionalModal
      );

    if (!focusableElements.length) {
      event.preventDefault();
      return;
    }

    const firstElement =
      focusableElements[0];

    const lastElement =
      focusableElements[
        focusableElements.length - 1
      ];

    if (
      event.shiftKey &&
      document.activeElement === firstElement
    ) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (
      !event.shiftKey &&
      document.activeElement === lastElement
    ) {
      event.preventDefault();
      firstElement.focus();
    }
  }
);


/*
   =====================================================
   FORMULARIO DE PROFESIONALES
   =====================================================
*/

const professionalForm =
  document.querySelector(
    "#professional-form"
  );

const formStatus =
  document.querySelector(
    "#form-status"
  );

const submitButton =
  professionalForm?.querySelector(
    ".form-submit"
  );

const modalityOptions =
  professionalForm
    ? Array.from(
        professionalForm.querySelectorAll(
          'input[name="modalidad"]'
        )
      )
    : [];

const modalityGroup =
  document.querySelector(
    "#modality-options"
  );

const modalityError =
  document.querySelector(
    "#modality-error"
  );

const availabilityRows =
  professionalForm
    ? Array.from(
        professionalForm.querySelectorAll(
          ".availability-table tbody > tr[data-day]"
        )
      )
    : [];

const availabilityError =
  document.querySelector(
    "#availability-error"
  );

const consentCheckbox =
  document.querySelector(
    "#consentimiento"
  );

const consentError =
  document.querySelector(
    "#consent-error"
  );

const termsCheckbox =
  document.querySelector(
    "#terminos"
  );

const termsError =
  document.querySelector(
    "#terms-error"
  );

const privacyCheckbox =
  document.querySelector(
    "#privacidad"
  );

const privacyError =
  document.querySelector(
    "#privacy-error"
  );

const titleFileInput =
  document.querySelector(
    "#titulo-profesional"
  );

const cvFileInput =
  document.querySelector("#cv");

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const MAX_TOTAL_FILE_SIZE =
  8 * 1024 * 1024;


/*
   =====================================================
   ERRORES DE CAMPOS
   =====================================================
*/

function getFieldContainer(field) {
  return field.closest(".form-field");
}

function getFieldErrorElement(field) {
  const describedBy =
    field.getAttribute(
      "aria-describedby"
    );

  if (describedBy) {
    const ids = describedBy
      .split(/\s+/)
      .filter(Boolean);

    const describedError = ids
      .map((id) =>
        document.getElementById(id)
      )
      .find((element) =>
        element?.classList.contains(
          "field-error"
        )
      );

    if (describedError) {
      return describedError;
    }
  }

  return getFieldContainer(field)
    ?.querySelector(".field-error");
}

function showFieldError(field, message) {
  const container =
    getFieldContainer(field);

  const errorElement =
    getFieldErrorElement(field);

  field.setAttribute(
    "aria-invalid",
    "true"
  );

  field.classList.add("is-invalid");

  container?.classList.add(
    "has-error"
  );

  if (errorElement) {
    errorElement.textContent = message;

    errorElement.classList.add(
      "visible"
    );
  }
}

function clearFieldError(field) {
  const container =
    getFieldContainer(field);

  const errorElement =
    getFieldErrorElement(field);

  field.setAttribute(
    "aria-invalid",
    "false"
  );

  field.classList.remove(
    "is-invalid"
  );

  container?.classList.remove(
    "has-error"
  );

  if (errorElement) {
    errorElement.textContent = "";

    errorElement.classList.remove(
      "visible"
    );
  }
}

function showGroupError(element, message) {
  if (!element) {
    return;
  }

  element.textContent = message;

  element.classList.add(
    "visible"
  );
}

function clearGroupError(element) {
  if (!element) {
    return;
  }

  element.textContent = "";

  element.classList.remove(
    "visible"
  );
}

function clearFormStatus() {
  if (!formStatus) {
    return;
  }

  formStatus.textContent = "";

  formStatus.className =
    "form-status";
}

function showFormStatus(message, type) {
  if (!formStatus) {
    return;
  }

  formStatus.textContent = message;

  formStatus.className =
    `form-status form-status--${type}`;
}


/*
   =====================================================
   MENSAJES DE VALIDACIÓN
   =====================================================
*/

function getValidationMessage(field) {
  const label =
    field
      .closest(".form-field")
      ?.querySelector("label");

  const fieldName =
    label?.childNodes?.[0]
      ?.textContent?.trim() ||
    label?.textContent
      ?.replace("*", "")
      .trim() ||
    "Este campo";

  if (field.validity.valueMissing) {
    return `${fieldName} es obligatorio.`;
  }

  if (field.validity.typeMismatch) {
    if (field.type === "email") {
      return "Ingresá una dirección de correo electrónico válida.";
    }

    return "El formato ingresado no es válido.";
  }

  if (field.validity.patternMismatch) {
    if (field.id === "dni") {
      return "El DNI debe contener entre 7 y 10 números, sin puntos ni espacios.";
    }

    return "El formato ingresado no es válido.";
  }

  if (field.validity.tooShort) {
    return `Ingresá al menos ${field.minLength} caracteres.`;
  }

  if (field.validity.tooLong) {
    return `Ingresá como máximo ${field.maxLength} caracteres.`;
  }

  if (field.validity.rangeUnderflow) {
    return `El valor mínimo permitido es ${field.min}.`;
  }

  if (field.validity.rangeOverflow) {
    return `El valor máximo permitido es ${field.max}.`;
  }

  if (field.validity.stepMismatch) {
    return "Ingresá un número entero válido.";
  }

  if (field.validity.badInput) {
    return "Ingresá un valor válido.";
  }

  return "Revisá la información ingresada.";
}

function validateRegularField(field) {
  clearFieldError(field);

  if (!field.checkValidity()) {
    showFieldError(
      field,
      getValidationMessage(field)
    );

    return false;
  }

  return true;
}


/*
   =====================================================
   VALIDACIÓN DEL TELÉFONO
   =====================================================
*/

function validatePhone() {
  const phoneInput =
    document.querySelector("#telefono");

  if (!phoneInput) {
    return true;
  }

  clearFieldError(phoneInput);

  const phoneValue =
    phoneInput.value.trim();

  if (!phoneValue) {
    showFieldError(
      phoneInput,
      "El teléfono o celular es obligatorio."
    );

    return false;
  }

  const phoneDigits =
    phoneValue.replace(/\D/g, "");

  if (
    phoneDigits.length < 8 ||
    phoneDigits.length > 15
  ) {
    showFieldError(
      phoneInput,
      "Ingresá un teléfono válido de entre 8 y 15 números."
    );

    return false;
  }

  return true;
}


/*
   =====================================================
   VALIDACIÓN DE MODALIDAD
   =====================================================
*/

function validateModality() {
  clearGroupError(modalityError);

  const hasSelectedModality =
    modalityOptions.some(
      (checkbox) =>
        checkbox.checked
    );

  modalityGroup?.setAttribute(
    "aria-invalid",
    hasSelectedModality
      ? "false"
      : "true"
  );

  modalityOptions.forEach(
    (checkbox) => {
      checkbox.setAttribute(
        "aria-invalid",
        hasSelectedModality
          ? "false"
          : "true"
      );
    }
  );

  if (!hasSelectedModality) {
    showGroupError(
      modalityError,
      "Seleccioná al menos una modalidad de atención."
    );

    return false;
  }

  return true;
}

modalityOptions.forEach(
  (checkbox) => {
    checkbox.addEventListener(
      "change",
      () => {
        const hasSelected =
          modalityOptions.some(
            (option) =>
              option.checked
          );

        if (hasSelected) {
          clearGroupError(
            modalityError
          );

          modalityGroup?.setAttribute(
            "aria-invalid",
            "false"
          );

          modalityOptions.forEach(
            (option) => {
              option.setAttribute(
                "aria-invalid",
                "false"
              );
            }
          );
        }
      }
    );
  }
);


/*
   =====================================================
   HORARIOS EXACTOS Y MÚLTIPLES RANGOS POR DÍA
   =====================================================
*/

const periodLabels = {
  Mañana: "mañana",
  Tarde: "tarde",
};

function normalizeForId(value) {
  return String(value)
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    );
}

function getOrCreateDetailRow(row) {
  let detailRow =
    row.nextElementSibling;

  if (
    detailRow &&
    detailRow.classList.contains(
      "availability-detail-row"
    )
  ) {
    return detailRow;
  }

  detailRow =
    document.createElement("tr");

  detailRow.className =
    "availability-detail-row";

  detailRow.dataset.detailFor =
    row.dataset.day || "";

  const cell =
    document.createElement("td");

  cell.colSpan = 4;

  const container =
    document.createElement("div");

  container.className =
    "availability-detail-fields";

  cell.appendChild(container);
  detailRow.appendChild(cell);

  row.insertAdjacentElement(
    "afterend",
    detailRow
  );

  return detailRow;
}

function createExactTimeInput({
  day,
  period,
  rangeId,
  boundary,
  label,
  defaultValue,
}) {
  const id =
    `${day}-${period}-${rangeId}-${boundary}`;

  const errorId =
    `${id}-error`;

  const field =
    document.createElement("div");

  field.className =
    "form-field exact-time-field";

  const fieldLabel =
    document.createElement("label");

  fieldLabel.htmlFor = id;
  fieldLabel.textContent = label;

  const input =
    document.createElement("input");

  input.id = id;
  input.name = id;
  input.type = "time";
  input.required = true;
  input.value = defaultValue || "";

  input.dataset.timeBoundary =
    boundary;

  input.setAttribute(
    "aria-invalid",
    "false"
  );

  input.setAttribute(
    "aria-describedby",
    errorId
  );

  const error =
    document.createElement("small");

  error.id = errorId;
  error.className = "field-error";

  error.setAttribute(
    "role",
    "alert"
  );

  field.append(
    fieldLabel,
    input,
    error
  );

  return {
    field,
    input,
  };
}

function validateScheduleRange(range) {
  const start =
    range.querySelector(
      'input[data-time-boundary="desde"]'
    );

  const end =
    range.querySelector(
      'input[data-time-boundary="hasta"]'
    );

  if (!start || !end) {
    return true;
  }

  clearFieldError(start);
  clearFieldError(end);

  let isValid = true;

  if (!start.value) {
    showFieldError(
      start,
      "Indicá la hora de inicio."
    );

    isValid = false;
  }

  if (!end.value) {
    showFieldError(
      end,
      "Indicá la hora de finalización."
    );

    isValid = false;
  }

  if (
    start.value &&
    end.value &&
    end.value <= start.value
  ) {
    showFieldError(
      end,
      "La hora final debe ser posterior a la hora de inicio."
    );

    isValid = false;
  }

  return isValid;
}

function updateRemoveButtons(group) {
  const ranges = Array.from(
    group.querySelectorAll(
      ".schedule-range"
    )
  );

  ranges.forEach((range) => {
    const removeButton =
      range.querySelector(
        ".schedule-range__remove"
      );

    if (removeButton) {
      removeButton.hidden =
        ranges.length === 1;
    }
  });
}

function createScheduleRange({
  day,
  period,
  rangeId,
  startValue,
  endValue,
  group,
}) {
  const range =
    document.createElement("div");

  range.className =
    "schedule-range";

  range.dataset.rangeId =
    String(rangeId);

  const startField =
    createExactTimeInput({
      day,
      period,
      rangeId,
      boundary: "desde",
      label: "Desde",
      defaultValue: startValue,
    });

  const endField =
    createExactTimeInput({
      day,
      period,
      rangeId,
      boundary: "hasta",
      label: "Hasta",
      defaultValue: endValue,
    });

  startField.input.addEventListener(
    "change",
    () => {
      validateScheduleRange(range);
    }
  );

  endField.input.addEventListener(
    "change",
    () => {
      validateScheduleRange(range);
    }
  );

  const removeButton =
    document.createElement("button");

  removeButton.type = "button";

  removeButton.className =
    "schedule-range__remove";

  removeButton.textContent =
    "Eliminar";

  removeButton.setAttribute(
    "aria-label",
    "Eliminar este rango horario"
  );

  removeButton.addEventListener(
    "click",
    () => {
      range.remove();
      updateRemoveButtons(group);
    }
  );

  range.append(
    startField.field,
    endField.field,
    removeButton
  );

  return range;
}

function getExistingRanges(existingDetail) {
  const rangesByPeriod = {};

  existingDetail
    ?.querySelectorAll(
      ".exact-time-group"
    )
    .forEach((group) => {
      const period =
        group.dataset.period;

      if (!period) {
        return;
      }

      rangesByPeriod[period] =
        Array.from(
          group.querySelectorAll(
            ".schedule-range"
          )
        ).map((range) => ({
          rangeId:
            range.dataset.rangeId,

          start:
            range.querySelector(
              'input[data-time-boundary="desde"]'
            )?.value || "",

          end:
            range.querySelector(
              'input[data-time-boundary="hasta"]'
            )?.value || "",
        }));
    });

  return rangesByPeriod;
}

function renderDayTimeFields(row) {
  const day =
    row.dataset.day || "dia";

  const selectedAvailable =
    Array.from(
      row.querySelectorAll(
        'input[data-period="available"]:checked'
      )
    );

  const unavailable =
    row.querySelector(
      'input[data-period="unavailable"]'
    );

  const existingDetail =
    row.nextElementSibling;

  if (
    selectedAvailable.length === 0 &&
    !unavailable?.checked
  ) {
    if (
      existingDetail?.classList.contains(
        "availability-detail-row"
      )
    ) {
      existingDetail.remove();
    }

    return;
  }

  const existingRanges =
    getExistingRanges(
      existingDetail
    );

  const detailRow =
    getOrCreateDetailRow(row);

  const container =
    detailRow.querySelector(
      ".availability-detail-fields"
    );

  container.innerHTML = "";

  if (unavailable?.checked) {
    const message =
      document.createElement("p");

    message.className =
      "availability-unavailable-note";

    message.textContent =
      "Marcaste este día como no disponible.";

    container.appendChild(message);

    return;
  }

  selectedAvailable.forEach(
    (checkbox) => {
      const periodValue =
        checkbox.value;

      const period =
        normalizeForId(periodValue);

      const group =
        document.createElement(
          "fieldset"
        );

      group.className =
        "exact-time-group";

      group.dataset.period =
        period;

      const legend =
        document.createElement(
          "legend"
        );

      const readableDay =
        day.charAt(0).toUpperCase() +
        day.slice(1);

      legend.textContent =
        `${readableDay} por la ${periodLabels[periodValue]}`;

      const rangesContainer =
        document.createElement("div");

      rangesContainer.className =
        "schedule-ranges";

      const defaultStart =
        periodValue === "Mañana"
          ? "09:00"
          : "14:00";

      const defaultEnd =
        periodValue === "Mañana"
          ? "13:00"
          : "18:00";

      const savedRanges =
        existingRanges[period];

      const initialRanges =
        savedRanges?.length
          ? savedRanges
          : [
              {
                rangeId: "1",
                start: defaultStart,
                end: defaultEnd,
              },
            ];

      initialRanges.forEach(
        (savedRange, index) => {
          const range =
            createScheduleRange({
              day,
              period,

              rangeId:
                savedRange.rangeId ||
                String(index + 1),

              startValue:
                savedRange.start,

              endValue:
                savedRange.end,

              group,
            });

          rangesContainer.appendChild(
            range
          );
        }
      );

      const addRangeButton =
        document.createElement("button");

      addRangeButton.type = "button";

      addRangeButton.className =
        "schedule-range__add";

      addRangeButton.textContent =
        "+ Agregar otro horario";

      addRangeButton.setAttribute(
        "aria-label",
        `Agregar otro horario para ${readableDay} por la ${periodLabels[periodValue]}`
      );

      addRangeButton.addEventListener(
        "click",
        () => {
          const existingIds =
            Array.from(
              rangesContainer.querySelectorAll(
                ".schedule-range"
              )
            ).map((range) =>
              Number(
                range.dataset.rangeId
              ) || 0
            );

          const nextRangeId =
            String(
              Math.max(
                0,
                ...existingIds
              ) + 1
            );

          const newRange =
            createScheduleRange({
              day,
              period,
              rangeId:
                nextRangeId,
              startValue: "",
              endValue: "",
              group,
            });

          rangesContainer.appendChild(
            newRange
          );

          updateRemoveButtons(group);

          newRange
            .querySelector(
              'input[type="time"]'
            )
            ?.focus();
        }
      );

      group.append(
        legend,
        rangesContainer,
        addRangeButton
      );

      container.appendChild(group);

      updateRemoveButtons(group);
    }
  );
}

function validateExactAvailabilityTimes() {
  const ranges = Array.from(
    professionalForm
      ?.querySelectorAll(
        ".schedule-range"
      ) || []
  );

  let allValid = true;

  ranges.forEach((range) => {
    if (
      !validateScheduleRange(range)
    ) {
      allValid = false;
    }
  });

  return allValid;
}


/*
   =====================================================
   FUNCIONAMIENTO DE DISPONIBILIDAD
   =====================================================
*/

availabilityRows.forEach((row) => {
  const availableOptions =
    Array.from(
      row.querySelectorAll(
        'input[data-period="available"]'
      )
    );

  const unavailableOption =
    row.querySelector(
      'input[data-period="unavailable"]'
    );

  availableOptions.forEach(
    (checkbox) => {
      checkbox.addEventListener(
        "change",
        () => {
          if (
            checkbox.checked &&
            unavailableOption
          ) {
            unavailableOption.checked =
              false;
          }

          const hasSelection =
            row.querySelector(
              'input[type="checkbox"]:checked'
            );

          if (hasSelection) {
            row.classList.remove(
              "has-error"
            );

            row
              .querySelectorAll(
                'input[type="checkbox"]'
              )
              .forEach((input) => {
                input.setAttribute(
                  "aria-invalid",
                  "false"
                );
              });
          }

          clearGroupError(
            availabilityError
          );

          renderDayTimeFields(row);
        }
      );
    }
  );

  unavailableOption?.addEventListener(
    "change",
    () => {
      if (
        unavailableOption.checked
      ) {
        availableOptions.forEach(
          (checkbox) => {
            checkbox.checked = false;
          }
        );
      }

      if (
        row.querySelector(
          'input[type="checkbox"]:checked'
        )
      ) {
        row.classList.remove(
          "has-error"
        );

        row
          .querySelectorAll(
            'input[type="checkbox"]'
          )
          .forEach((input) => {
            input.setAttribute(
              "aria-invalid",
              "false"
            );
          });
      }

      clearGroupError(
        availabilityError
      );

      renderDayTimeFields(row);
    }
  );
});


/*
   =====================================================
   VALIDACIÓN DE DISPONIBILIDAD
   =====================================================
*/

function validateAvailability() {
  clearGroupError(
    availabilityError
  );

  let allDaysCompleted = true;

  let hasAtLeastOneAvailablePeriod =
    false;

  availabilityRows.forEach((row) => {
    const rowCheckboxes =
      Array.from(
        row.querySelectorAll(
          'input[type="checkbox"]'
        )
      );

    const hasSelectedOption =
      rowCheckboxes.some(
        (checkbox) =>
          checkbox.checked
      );

    rowCheckboxes.forEach(
      (checkbox) => {
        checkbox.setAttribute(
          "aria-invalid",
          hasSelectedOption
            ? "false"
            : "true"
        );
      }
    );

    if (!hasSelectedOption) {
      allDaysCompleted = false;

      row.classList.add(
        "has-error"
      );
    } else {
      row.classList.remove(
        "has-error"
      );
    }

    const hasAvailablePeriod =
      rowCheckboxes.some(
        (checkbox) =>
          checkbox.checked &&
          checkbox.dataset.period ===
            "available"
      );

    if (hasAvailablePeriod) {
      hasAtLeastOneAvailablePeriod =
        true;
    }
  });

  if (!allDaysCompleted) {
    showGroupError(
      availabilityError,
      "Indicá tu disponibilidad para todos los días, de lunes a sábado."
    );

    return false;
  }

  if (
    !hasAtLeastOneAvailablePeriod
  ) {
    showGroupError(
      availabilityError,
      "Seleccioná al menos un turno disponible durante la semana."
    );

    return false;
  }

  if (
    !validateExactAvailabilityTimes()
  ) {
    showGroupError(
      availabilityError,
      "Revisá los horarios exactos de inicio y finalización."
    );

    return false;
  }

  return true;
}


/*
   =====================================================
   VALIDACIÓN DE ARCHIVOS
   =====================================================
*/

function validateFile(
  input,
  allowedExtensions,
  fieldLabel
) {
  clearFieldError(input);

  const file =
    input.files?.[0];

  if (!file) {
    showFieldError(
      input,
      `Adjuntá tu ${fieldLabel}.`
    );

    return false;
  }

  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() || "";

  if (
    !allowedExtensions.includes(
      extension
    )
  ) {
    showFieldError(
      input,
      `El formato del ${fieldLabel} no está permitido.`
    );

    return false;
  }

  if (
    file.size > MAX_FILE_SIZE
  ) {
    showFieldError(
      input,
      "El archivo no puede superar los 5 MB."
    );

    return false;
  }

  return true;
}

function validateTotalFileSize() {
  const titleFile =
    titleFileInput?.files?.[0];

  const cvFile =
    cvFileInput?.files?.[0];

  if (!titleFile || !cvFile) {
    return true;
  }

  const totalSize =
    titleFile.size +
    cvFile.size;

  if (
    totalSize >
    MAX_TOTAL_FILE_SIZE
  ) {
    const message =
      "El título y el CV no pueden superar los 8 MB en total.";

    showFieldError(
      titleFileInput,
      message
    );

    showFieldError(
      cvFileInput,
      message
    );

    return false;
  }

  return true;
}

titleFileInput?.addEventListener(
  "change",
  () => {
    validateFile(
      titleFileInput,
      [
        "pdf",
        "jpg",
        "jpeg",
        "png",
      ],
      "título profesional"
    );
  }
);

cvFileInput?.addEventListener(
  "change",
  () => {
    validateFile(
      cvFileInput,
      [
        "pdf",
        "doc",
        "docx",
      ],
      "currículum vitae"
    );
  }
);


/*
   =====================================================
   NOMBRES DE ARCHIVOS
   =====================================================
*/

const customFileInputs =
  Array.from(
    document.querySelectorAll(
      ".custom-file__input"
    )
  );

function updateCustomFileName(input) {
  const nameElement =
    document.querySelector(
      `[data-file-name="${input.id}"]`
    );

  if (!nameElement) {
    return;
  }

  const selectedFile =
    input.files?.[0];

  nameElement.textContent =
    selectedFile
      ? selectedFile.name
      : "Ningún archivo seleccionado";
}

function resetCustomFileNames() {
  customFileInputs.forEach(
    (input) => {
      updateCustomFileName(input);
    }
  );
}

customFileInputs.forEach((input) => {
  input.addEventListener(
    "change",
    () => {
      updateCustomFileName(input);
    }
  );
});


/*
   =====================================================
   CONSENTIMIENTO, TÉRMINOS Y PRIVACIDAD
   =====================================================
*/

function validateConsent() {
  clearGroupError(consentError);
  clearGroupError(termsError);
  clearGroupError(privacyError);

  let isValid = true;

  if (
    !consentCheckbox ||
    !consentCheckbox.checked
  ) {
    showGroupError(
      consentError,
      "Tenés que aceptar la declaración de veracidad."
    );

    consentCheckbox?.setAttribute(
      "aria-invalid",
      "true"
    );

    isValid = false;
  } else {
    consentCheckbox.setAttribute(
      "aria-invalid",
      "false"
    );
  }

  if (
    !termsCheckbox ||
    !termsCheckbox.checked
  ) {
    showGroupError(
      termsError,
      "Tenés que aceptar los Términos y condiciones."
    );

    termsCheckbox?.setAttribute(
      "aria-invalid",
      "true"
    );

    isValid = false;
  } else {
    termsCheckbox.setAttribute(
      "aria-invalid",
      "false"
    );
  }

  if (
    !privacyCheckbox ||
    !privacyCheckbox.checked
  ) {
    showGroupError(
      privacyError,
      "Tenés que aceptar la Política de privacidad."
    );

    privacyCheckbox?.setAttribute(
      "aria-invalid",
      "true"
    );

    isValid = false;
  } else {
    privacyCheckbox.setAttribute(
      "aria-invalid",
      "false"
    );
  }

  return isValid;
}

consentCheckbox?.addEventListener(
  "change",
  () => {
    if (consentCheckbox.checked) {
      clearGroupError(consentError);

      consentCheckbox.setAttribute(
        "aria-invalid",
        "false"
      );
    }
  }
);

termsCheckbox?.addEventListener(
  "change",
  () => {
    if (termsCheckbox.checked) {
      clearGroupError(termsError);

      termsCheckbox.setAttribute(
        "aria-invalid",
        "false"
      );
    }
  }
);

privacyCheckbox?.addEventListener(
  "change",
  () => {
    if (privacyCheckbox.checked) {
      clearGroupError(privacyError);

      privacyCheckbox.setAttribute(
        "aria-invalid",
        "false"
      );
    }
  }
);


/*
   =====================================================
   VALIDACIÓN EN TIEMPO REAL
   =====================================================
*/

if (professionalForm) {
  const regularFields =
    Array.from(
      professionalForm.querySelectorAll(
        [
          'input:not([type="hidden"])',
          "textarea",
          "select",
        ].join(",")
      )
    ).filter(
      (field) =>
        field.type !== "checkbox" &&
        field.type !== "file" &&
        field.type !== "time"
    );

  regularFields.forEach((field) => {
    field.addEventListener(
      "blur",
      () => {
        if (
          field.id === "telefono"
        ) {
          validatePhone();
        } else {
          validateRegularField(
            field
          );
        }
      }
    );

    field.addEventListener(
      "input",
      () => {
        if (
          field.getAttribute(
            "aria-invalid"
          ) === "true"
        ) {
          if (
            field.id ===
            "telefono"
          ) {
            validatePhone();
          } else {
            validateRegularField(
              field
            );
          }
        }
      }
    );
  });
}


/*
   =====================================================
   LIMPIAR ERRORES
   =====================================================
*/

function clearAllFormErrors() {
  if (!professionalForm) {
    return;
  }

  professionalForm
    .querySelectorAll(
      ".has-error"
    )
    .forEach((element) => {
      element.classList.remove(
        "has-error"
      );
    });

  professionalForm
    .querySelectorAll(
      ".is-invalid"
    )
    .forEach((element) => {
      element.classList.remove(
        "is-invalid"
      );
    });

  professionalForm
    .querySelectorAll(
      "[aria-invalid]"
    )
    .forEach((element) => {
      element.setAttribute(
        "aria-invalid",
        "false"
      );
    });

  professionalForm
    .querySelectorAll(
      ".field-error"
    )
    .forEach((element) => {
      element.textContent = "";

      element.classList.remove(
        "visible"
      );
    });

  clearGroupError(
    modalityError
  );

  clearGroupError(
    availabilityError
  );

  clearGroupError(
    consentError
  );

  clearGroupError(
    termsError
  );

  clearGroupError(
    privacyError
  );
}


/*
   =====================================================
   VALIDAR FORMULARIO COMPLETO
   =====================================================
*/

function validateProfessionalForm() {
  if (!professionalForm) {
    return false;
  }

  clearFormStatus();

  const regularFields =
    Array.from(
      professionalForm.querySelectorAll(
        [
          'input:not([type="hidden"])',
          "textarea",
          "select",
        ].join(",")
      )
    ).filter(
      (field) =>
        field.type !== "checkbox" &&
        field.type !== "file" &&
        field.type !== "time" &&
        field.id !== "telefono"
    );

  let isValid = true;

  regularFields.forEach((field) => {
    if (
      !validateRegularField(field)
    ) {
      isValid = false;
    }
  });

  if (!validatePhone()) {
    isValid = false;
  }

  if (!validateModality()) {
    isValid = false;
  }

  if (!validateAvailability()) {
    isValid = false;
  }

  const isTitleValid =
    titleFileInput
      ? validateFile(
          titleFileInput,
          [
            "pdf",
            "jpg",
            "jpeg",
            "png",
          ],
          "título profesional"
        )
      : false;

  if (!isTitleValid) {
    isValid = false;
  }

  const isCvValid =
    cvFileInput
      ? validateFile(
          cvFileInput,
          [
            "pdf",
            "doc",
            "docx",
          ],
          "currículum vitae"
        )
      : false;

  if (!isCvValid) {
    isValid = false;
  }

  if (
    isTitleValid &&
    isCvValid &&
    !validateTotalFileSize()
  ) {
    isValid = false;
  }

  if (!validateConsent()) {
    isValid = false;
  }

  return isValid;
}


/*
   =====================================================
   IR AL PRIMER ERROR
   =====================================================
*/

function focusFirstFormError() {
  if (!professionalForm) {
    return;
  }

  const firstInvalidField =
    professionalForm.querySelector(
      '[aria-invalid="true"], .availability-table tr.has-error input'
    );

  if (firstInvalidField) {
    firstInvalidField.focus({
      preventScroll: true,
    });

    firstInvalidField.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    return;
  }

  const firstVisibleError =
    professionalForm.querySelector(
      ".field-error.visible"
    );

  if (!firstVisibleError) {
    return;
  }

  const formSection =
    firstVisibleError.closest(
      ".form-section"
    );

  const fieldToFocus =
    formSection?.querySelector(
      "input, textarea, select, button"
    );

  fieldToFocus?.focus({
    preventScroll: true,
  });

  firstVisibleError.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}


/*
   =====================================================
   ENVIAR FORMULARIO A NETLIFY
   =====================================================
*/

async function submitProfessionalForm() {
  if (
    !professionalForm ||
    !submitButton
  ) {
    return;
  }

  submitButton.disabled = true;

  submitButton.classList.add(
    "is-loading"
  );

  submitButton.textContent =
    "Enviando...";

  clearFormStatus();

  try {
    const formData =
      new FormData(
        professionalForm
      );

    const response =
      await fetch("/", {
        method: "POST",
        body: formData,
      });

    if (!response.ok) {
      throw new Error(
        `Error de envío: ${response.status}`
      );
    }

    professionalForm.reset();

    professionalForm
      .querySelectorAll(
        ".availability-detail-row"
      )
      .forEach((row) => {
        row.remove();
      });

    resetCustomFileNames();

    clearAllFormErrors();

    showFormStatus(
      "¡Postulación enviada correctamente! Recibimos tus datos y nos vamos a comunicar con vos a la brevedad.",
      "success"
    );

    if (modalBody) {
      modalBody.scrollTop = 0;
    }
  } catch (error) {
    console.error(
      "No se pudo enviar el formulario:",
      error
    );

    showFormStatus(
      "No pudimos enviar la postulación. Revisá tu conexión e intentá nuevamente.",
      "error"
    );

    if (modalBody) {
      modalBody.scrollTop = 0;
    }
  } finally {
    submitButton.disabled = false;

    submitButton.classList.remove(
      "is-loading"
    );

    submitButton.textContent =
      "Enviar postulación";
  }
}


/*
   =====================================================
   EVENTO DE ENVÍO
   =====================================================
*/

professionalForm?.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();

    clearAllFormErrors();

    const isFormValid =
      validateProfessionalForm();

    if (!isFormValid) {
      showFormStatus(
        "Revisá los campos señalados antes de enviar la postulación.",
        "error"
      );

      focusFirstFormError();

      return;
    }

    await submitProfessionalForm();
  }
);


/*
   =====================================================
   CARRUSEL DE PROFESIONALES
   =====================================================
*/

const carousel =
  document.querySelector(".carousel");

const carouselViewport =
  document.querySelector(
    ".carousel-viewport"
  );

const carouselTrack =
  document.querySelector(
    ".carousel-track"
  );

const carouselCards = Array.from(
  document.querySelectorAll(
    ".professional-item"
  )
);

const carouselPreviousButton =
  document.querySelector(
    ".carousel-arrow--prev"
  );

const carouselNextButton =
  document.querySelector(
    ".carousel-arrow--next"
  );

const carouselDotsContainer =
  document.querySelector(
    ".carousel-dots"
  );

if (
  carousel &&
  carouselViewport &&
  carouselTrack &&
  carouselCards.length > 0 &&
  carouselPreviousButton &&
  carouselNextButton &&
  carouselDotsContainer
) {
  let currentCarouselIndex = 0;

  let carouselResizeTimer = null;

  function visibleCarouselCards() {
    if (window.innerWidth <= 820) {
      return 1;
    }

    if (window.innerWidth <= 1100) {
      return 2;
    }

    return 3;
  }

  function maximumCarouselIndex() {
    return Math.max(
      0,
      carouselCards.length -
        visibleCarouselCards()
    );
  }

  function carouselCardStep() {
    const firstCard =
      carouselCards[0];

    if (!firstCard) {
      return 0;
    }

    const cardWidth =
      firstCard.getBoundingClientRect()
        .width;

    const trackStyles =
      window.getComputedStyle(
        carouselTrack
      );

    const gap =
      Number.parseFloat(
        trackStyles.columnGap ||
          trackStyles.gap
      ) || 0;

    return cardWidth + gap;
  }

  function createCarouselDots() {
    carouselDotsContainer.innerHTML = "";

    const totalPositions =
      maximumCarouselIndex() + 1;

    for (
      let index = 0;
      index < totalPositions;
      index += 1
    ) {
      const dot =
        document.createElement(
          "button"
        );

      dot.type = "button";

      dot.className =
        "carousel-dot";

      dot.setAttribute(
        "aria-label",
        `Ir al grupo ${index + 1} de profesionales`
      );

      dot.addEventListener(
        "click",
        () => {
          currentCarouselIndex =
            index;

          updateCarousel();
        }
      );

      carouselDotsContainer.appendChild(
        dot
      );
    }
  }

  function updateCarousel({
    animate = true,
  } = {}) {
    currentCarouselIndex =
      Math.max(
        0,
        Math.min(
          currentCarouselIndex,
          maximumCarouselIndex()
        )
      );

    carouselTrack.classList.toggle(
      "is-dragging",
      !animate
    );

    const position =
      -(
        currentCarouselIndex *
        carouselCardStep()
      );

    carouselTrack.style.transform =
      `translate3d(${position}px, 0, 0)`;

    carouselPreviousButton.disabled =
      currentCarouselIndex === 0;

    carouselNextButton.disabled =
      currentCarouselIndex ===
      maximumCarouselIndex();

    const dots =
      carouselDotsContainer
        .querySelectorAll(
          ".carousel-dot"
        );

    dots.forEach((dot, index) => {
      const isActive =
        index === currentCarouselIndex;

      dot.classList.toggle(
        "active",
        isActive
      );

      dot.setAttribute(
        "aria-current",
        isActive
          ? "true"
          : "false"
      );
    });
  }

  carouselPreviousButton.addEventListener(
    "click",
    () => {
      currentCarouselIndex -= 1;
      updateCarousel();
    }
  );

  carouselNextButton.addEventListener(
    "click",
    () => {
      currentCarouselIndex += 1;
      updateCarousel();
    }
  );

/*
   =====================================================
   ARRASTRE Y SWIPE DEL CARRUSEL
   =====================================================
*/

let dragStartX = 0;
let dragCurrentX = 0;
let dragStartPosition = 0;
let isCarouselDragging = false;
let hasCarouselMoved = false;
let carouselPointerId = null;

function getCarouselPosition() {
  return -(
    currentCarouselIndex *
    carouselCardStep()
  );
}

function startCarouselDrag(event) {
  if (
    event.pointerType === "mouse" &&
    event.button !== 0
  ) {
    return;
  }

  isCarouselDragging = true;
  hasCarouselMoved = false;

  carouselPointerId = event.pointerId;

  dragStartX = event.clientX;
  dragCurrentX = event.clientX;

  dragStartPosition =
    getCarouselPosition();

  carouselViewport.classList.add(
    "is-dragging"
  );

  carouselTrack.classList.add(
    "is-dragging"
  );

  if (
    carouselViewport.setPointerCapture
  ) {
    carouselViewport.setPointerCapture(
      event.pointerId
    );
  }
}

function moveCarouselDrag(event) {
  if (
    !isCarouselDragging ||
    event.pointerId !== carouselPointerId
  ) {
    return;
  }

  dragCurrentX = event.clientX;

  const movement =
    dragCurrentX - dragStartX;

  if (Math.abs(movement) > 4) {
    hasCarouselMoved = true;
  }

  carouselTrack.style.transform =
    `translate3d(${
      dragStartPosition + movement
    }px, 0, 0)`;
}

function finishCarouselDrag(event) {
  if (!isCarouselDragging) {
    return;
  }

  if (
    event.pointerId !== undefined &&
    carouselPointerId !== null &&
    event.pointerId !== carouselPointerId
  ) {
    return;
  }

  const movement =
    dragCurrentX - dragStartX;

  const swipeThreshold = Math.min(
    carouselCardStep() * 0.15,
    55
  );

  if (
    movement <= -swipeThreshold
  ) {
    currentCarouselIndex += 1;
  } else if (
    movement >= swipeThreshold
  ) {
    currentCarouselIndex -= 1;
  }

  isCarouselDragging = false;
  carouselPointerId = null;

  carouselViewport.classList.remove(
    "is-dragging"
  );

  carouselTrack.classList.remove(
    "is-dragging"
  );

  updateCarousel();
}

carouselViewport.addEventListener(
  "pointerdown",
  startCarouselDrag
);

carouselViewport.addEventListener(
  "pointermove",
  moveCarouselDrag
);

carouselViewport.addEventListener(
  "pointerup",
  finishCarouselDrag
);

carouselViewport.addEventListener(
  "pointercancel",
  finishCarouselDrag
);

carouselViewport.addEventListener(
  "lostpointercapture",
  finishCarouselDrag
);

/*
  Evita que, después de arrastrar,
  se interprete el movimiento como un clic.
*/

carouselViewport.addEventListener(
  "click",
  (event) => {
    if (hasCarouselMoved) {
      event.preventDefault();
      event.stopPropagation();

      hasCarouselMoved = false;
    }
  },
  true
);

  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(
        carouselResizeTimer
      );

      carouselResizeTimer =
        window.setTimeout(() => {
          createCarouselDots();

          updateCarousel({
            animate: false,
          });
        }, 150);
    }
  );

  createCarouselDots();

  updateCarousel({
    animate: false,
  });
}