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
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    menuButton.classList.toggle("active", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
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
  year.textContent = new Date().getFullYear();
}


/*
   =====================================================
   LINK ACTIVO SEGÚN LA SECCIÓN VISIBLE
   =====================================================
*/

const sectionLinks = Array.from(
  document.querySelectorAll('.nav a[href^="#"]')
);

const observedSections = sectionLinks
  .map((link) => {
    const selector = link.getAttribute("href");

    if (!selector) {
      return null;
    }

    return document.querySelector(selector);
  })
  .filter(Boolean);

function setActiveLink(sectionId) {
  sectionLinks.forEach((link) => {
    const isActive =
      link.getAttribute("href") === `#${sectionId}`;

    link.classList.toggle("active", isActive);
  });
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (firstEntry, secondEntry) =>
            secondEntry.intersectionRatio -
            firstEntry.intersectionRatio
        );

      if (visibleEntries.length > 0) {
        setActiveLink(visibleEntries[0].target.id);
      }
    },
    {
      rootMargin: "-25% 0px -60% 0px",
      threshold: [0.05, 0.15, 0.3, 0.5],
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

const professionalModal = document.querySelector(
  "#professional-modal"
);

const openModalButton = document.querySelector(
  "#open-professional-form"
);

const closeModalButtons = Array.from(
  document.querySelectorAll("[data-modal-close]")
);

const modalDialog = professionalModal?.querySelector(
  ".professional-modal__dialog"
);

const modalBody = professionalModal?.querySelector(
  ".professional-modal__body"
);

let elementFocusedBeforeModal = null;

function getModalFocusableElements() {
  if (!professionalModal) {
    return [];
  }

  return Array.from(
    professionalModal.querySelectorAll(
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
    professionalModal?.classList.contains("is-open")
  );
}

function openProfessionalModal() {
  if (!professionalModal) {
    return;
  }

  elementFocusedBeforeModal =
    document.activeElement;

  professionalModal.classList.add("is-open");

  professionalModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add("modal-open");

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

  professionalModal.classList.remove("is-open");

  professionalModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove("modal-open");

  if (
    elementFocusedBeforeModal instanceof HTMLElement
  ) {
    elementFocusedBeforeModal.focus();
  } else {
    openModalButton?.focus();
  }
}

if (openModalButton) {
  openModalButton.addEventListener(
    "click",
    openProfessionalModal
  );
}

closeModalButtons.forEach((button) => {
  button.addEventListener(
    "click",
    closeProfessionalModal
  );
});

/*
   Evitar que un clic dentro de la ventana
   cierre el modal.
*/

if (modalDialog) {
  modalDialog.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}

/*
   Cerrar con Escape y mantener el foco
   dentro del modal.
*/

document.addEventListener("keydown", (event) => {
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
    getModalFocusableElements();

  if (focusableElements.length === 0) {
    event.preventDefault();
    return;
  }

  const firstElement = focusableElements[0];

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
});


/*
   =====================================================
   FORMULARIO DE PROFESIONALES
   =====================================================
*/

const professionalForm = document.querySelector(
  "#professional-form"
);

const formStatus = document.querySelector(
  "#form-status"
);

const submitButton = professionalForm?.querySelector(
  ".form-submit"
);

const modalityOptions = professionalForm
  ? Array.from(
      professionalForm.querySelectorAll(
        'input[name="modalidad"]'
      )
    )
  : [];

const modalityError = document.querySelector(
  "#modality-error"
);

const availabilityRows = professionalForm
  ? Array.from(
      professionalForm.querySelectorAll(
        ".availability-table tbody tr"
      )
    )
  : [];

const availabilityError = document.querySelector(
  "#availability-error"
);

const consentCheckbox = document.querySelector(
  "#consentimiento"
);

const consentError = document.querySelector(
  "#consent-error"
);

const titleFileInput = document.querySelector(
  "#titulo-profesional"
);

const cvFileInput = document.querySelector("#cv");

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_TOTAL_FILE_SIZE = 8 * 1024 * 1024;


/*
   =====================================================
   MOSTRAR Y LIMPIAR ERRORES
   =====================================================
*/

function getFieldContainer(field) {
  return field.closest(".form-field");
}

function getFieldErrorElement(field) {
  const container = getFieldContainer(field);

  if (!container) {
    return null;
  }

  return container.querySelector(".field-error");
}

function showFieldError(field, message) {
  const container = getFieldContainer(field);
  const errorElement = getFieldErrorElement(field);

  field.setAttribute("aria-invalid", "true");
  field.classList.add("is-invalid");

  if (container) {
    container.classList.add("has-error");
  }

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add("visible");
  }
}

function clearFieldError(field) {
  const container = getFieldContainer(field);
  const errorElement = getFieldErrorElement(field);

  field.removeAttribute("aria-invalid");
  field.classList.remove("is-invalid");

  if (container) {
    container.classList.remove("has-error");
  }

  if (errorElement) {
    errorElement.textContent = "";
    errorElement.classList.remove("visible");
  }
}

function showGroupError(element, message) {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.classList.add("visible");
}

function clearGroupError(element) {
  if (!element) {
    return;
  }

  element.textContent = "";
  element.classList.remove("visible");
}

function clearFormStatus() {
  if (!formStatus) {
    return;
  }

  formStatus.textContent = "";
  formStatus.className = "form-status";
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
   MENSAJES PERSONALIZADOS
   =====================================================
*/

function getValidationMessage(field) {
  const label =
    field
      .closest(".form-field")
      ?.querySelector("label");

  const fieldName =
    label?.childNodes?.[0]?.textContent?.trim() ||
    label?.textContent
      ?.replace("*", "")
      .replace("Opcional", "")
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


/*
   =====================================================
   VALIDACIÓN DE CAMPOS INDIVIDUALES
   =====================================================
*/

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
  const phoneInput = document.querySelector(
    "#telefono"
  );

  if (!phoneInput) {
    return true;
  }

  clearFieldError(phoneInput);

  const phoneValue = phoneInput.value.trim();

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
      (checkbox) => checkbox.checked
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

modalityOptions.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    if (
      modalityOptions.some(
        (option) => option.checked
      )
    ) {
      clearGroupError(modalityError);
    }
  });
});


/*
   =====================================================
   FUNCIONAMIENTO DE LA DISPONIBILIDAD
   =====================================================
*/

availabilityRows.forEach((row) => {
  const availableOptions = Array.from(
    row.querySelectorAll(
      'input[data-period="available"]'
    )
  );

  const unavailableOption = row.querySelector(
    'input[data-period="unavailable"]'
  );

  availableOptions.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if (
        checkbox.checked &&
        unavailableOption
      ) {
        unavailableOption.checked = false;
      }

      if (
        row.querySelector(
          'input[type="checkbox"]:checked'
        )
      ) {
        row.classList.remove("has-error");
      }

      clearGroupError(availabilityError);
    });
  });

  if (unavailableOption) {
    unavailableOption.addEventListener(
      "change",
      () => {
        if (unavailableOption.checked) {
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
          row.classList.remove("has-error");
        }

        clearGroupError(availabilityError);
      }
    );
  }
});


/*
   =====================================================
   VALIDACIÓN DE DISPONIBILIDAD
   =====================================================
*/

function validateAvailability() {
  clearGroupError(availabilityError);

  let allDaysCompleted = true;
  let hasAtLeastOneAvailablePeriod = false;

  availabilityRows.forEach((row) => {
    const rowCheckboxes = Array.from(
      row.querySelectorAll(
        'input[type="checkbox"]'
      )
    );

    const hasSelectedOption =
      rowCheckboxes.some(
        (checkbox) => checkbox.checked
      );

    if (!hasSelectedOption) {
      allDaysCompleted = false;
      row.classList.add("has-error");
    } else {
      row.classList.remove("has-error");
    }

    const hasAvailablePeriod =
      rowCheckboxes.some(
        (checkbox) =>
          checkbox.checked &&
          checkbox.dataset.period === "available"
      );

    if (hasAvailablePeriod) {
      hasAtLeastOneAvailablePeriod = true;
    }
  });

  if (!allDaysCompleted) {
    showGroupError(
      availabilityError,
      "Indicá tu disponibilidad para todos los días, de lunes a sábado."
    );

    return false;
  }

  if (!hasAtLeastOneAvailablePeriod) {
    showGroupError(
      availabilityError,
      "Seleccioná al menos un turno disponible durante la semana."
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

  const file = input.files?.[0];

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

  if (!allowedExtensions.includes(extension)) {
    showFieldError(
      input,
      `El formato del ${fieldLabel} no está permitido.`
    );

    return false;
  }

  if (file.size > MAX_FILE_SIZE) {
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
    titleFile.size + cvFile.size;

  if (totalSize > MAX_TOTAL_FILE_SIZE) {
    const message =
      "El título y el CV no pueden superar los 8 MB en total.";

    showFieldError(titleFileInput, message);
    showFieldError(cvFileInput, message);

    return false;
  }

  return true;
}

if (titleFileInput) {
  titleFileInput.addEventListener(
    "change",
    () => {
      validateFile(
        titleFileInput,
        ["pdf", "jpg", "jpeg", "png"],
        "título profesional"
      );
    }
  );
}

if (cvFileInput) {
  cvFileInput.addEventListener(
    "change",
    () => {
      validateFile(
        cvFileInput,
        ["pdf", "doc", "docx"],
        "currículum vitae"
      );
    }
  );
}

/*
   =====================================================
   NOMBRES DE ARCHIVOS EN CASTELLANO
   =====================================================
*/

const customFileInputs = Array.from(
  document.querySelectorAll(".custom-file__input")
);

function updateCustomFileName(input) {
  const nameElement = document.querySelector(
    `[data-file-name="${input.id}"]`
  );

  if (!nameElement) {
    return;
  }

  const selectedFile = input.files?.[0];

  nameElement.textContent = selectedFile
    ? selectedFile.name
    : "Ningún archivo seleccionado";
}

function resetCustomFileNames() {
  customFileInputs.forEach((input) => {
    updateCustomFileName(input);
  });
}

customFileInputs.forEach((input) => {
  input.addEventListener("change", () => {
    updateCustomFileName(input);
  });
});

/*
   =====================================================
   VALIDACIÓN DEL CONSENTIMIENTO
   =====================================================
*/

function validateConsent() {
  clearGroupError(consentError);

  if (
    !consentCheckbox ||
    !consentCheckbox.checked
  ) {
    showGroupError(
      consentError,
      "Tenés que aceptar la declaración y autorización para enviar la postulación."
    );

    consentCheckbox?.setAttribute(
      "aria-invalid",
      "true"
    );

    return false;
  }

  consentCheckbox.removeAttribute(
    "aria-invalid"
  );

  return true;
}

if (consentCheckbox) {
  consentCheckbox.addEventListener(
    "change",
    () => {
      if (consentCheckbox.checked) {
        clearGroupError(consentError);

        consentCheckbox.removeAttribute(
          "aria-invalid"
        );
      }
    }
  );
}


/*
   =====================================================
   VALIDACIÓN EN TIEMPO REAL
   =====================================================
*/

if (professionalForm) {
  const regularFields = Array.from(
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
      field.type !== "file"
  );

  regularFields.forEach((field) => {
    field.addEventListener("blur", () => {
      if (field.id === "telefono") {
        validatePhone();
      } else {
        validateRegularField(field);
      }
    });

    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid")) {
        if (field.id === "telefono") {
          validatePhone();
        } else {
          validateRegularField(field);
        }
      }
    });
  });
}


/*
   =====================================================
   LIMPIAR TODOS LOS ERRORES
   =====================================================
*/

function clearAllFormErrors() {
  if (!professionalForm) {
    return;
  }

  professionalForm
    .querySelectorAll(".has-error")
    .forEach((element) => {
      element.classList.remove("has-error");
    });

  professionalForm
    .querySelectorAll(".is-invalid")
    .forEach((element) => {
      element.classList.remove("is-invalid");
      element.removeAttribute("aria-invalid");
    });

  professionalForm
    .querySelectorAll('[aria-invalid="true"]')
    .forEach((element) => {
      element.removeAttribute("aria-invalid");
    });

  professionalForm
    .querySelectorAll(".field-error")
    .forEach((element) => {
      element.textContent = "";
      element.classList.remove("visible");
    });

  clearGroupError(modalityError);
  clearGroupError(availabilityError);
  clearGroupError(consentError);
}


/*
   =====================================================
   VALIDAR EL FORMULARIO COMPLETO
   =====================================================
*/

function validateProfessionalForm() {
  if (!professionalForm) {
    return false;
  }

  clearFormStatus();

  const regularFields = Array.from(
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
      field.id !== "telefono"
  );

  let isValid = true;

  regularFields.forEach((field) => {
    if (!validateRegularField(field)) {
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

  const isTitleValid = titleFileInput
    ? validateFile(
        titleFileInput,
        ["pdf", "jpg", "jpeg", "png"],
        "título profesional"
      )
    : false;

  if (!isTitleValid) {
    isValid = false;
  }

  const isCvValid = cvFileInput
    ? validateFile(
        cvFileInput,
        ["pdf", "doc", "docx"],
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
   IR AL PRIMER CAMPO CON ERROR
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
    firstVisibleError.closest(".form-section");

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
   ENVIAR EL FORMULARIO A NETLIFY
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
  submitButton.classList.add("is-loading");
  submitButton.textContent = "Enviando...";

  clearFormStatus();

  try {
    const formData =
      new FormData(professionalForm);

    const response = await fetch("/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        `Error de envío: ${response.status}`
      );
    }

    professionalForm.reset();
    resetCustomFileNames();
    clearAllFormErrors();

    showFormStatus(
      "¡Postulación enviada correctamente! Recibimos tus datos y nos vamos a comunicar con vos a la brevedad.",
      "success"
    );

    /*
      Volvemos únicamente el contenido interno
      del modal al inicio.

      No usamos scrollIntoView porque puede mover
      todo el cuadro y ocultar el título o la cruz.
    */

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

    /*
      También llevamos el cuerpo interno arriba
      para que se vea el mensaje de error sin
      mover el modal completo.
    */

    if (modalBody) {
      modalBody.scrollTop = 0;
    }
  } finally {
    submitButton.disabled = false;
    submitButton.classList.remove("is-loading");

    submitButton.textContent =
      "Enviar postulación";
  }
}


/*
   =====================================================
   EVENTO DE ENVÍO
   =====================================================
*/

if (professionalForm) {
  professionalForm.addEventListener(
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
}


/*
   =====================================================
   CARRUSEL DE PROFESIONALES: FLECHAS, PUNTOS Y SWIPE
   =====================================================
*/

const carousel = document.querySelector(".carousel");

const carouselViewport = document.querySelector(
  ".carousel-viewport"
);

const carouselTrack = document.querySelector(
  ".carousel-track"
);

const carouselCards = Array.from(
  document.querySelectorAll(".professional-item")
);

const carouselPreviousButton = document.querySelector(
  ".carousel-arrow--prev"
);

const carouselNextButton = document.querySelector(
  ".carousel-arrow--next"
);

const carouselDotsContainer = document.querySelector(
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

  let startX = 0;
  let currentX = 0;

  let isDragging = false;
  let activePointerId = null;

  let carouselResizeTimer = null;

  function visibleCarouselCards() {
    if (window.innerWidth <= 700) {
      return 1;
    }

    if (window.innerWidth <= 1050) {
      return 2;
    }

    return 3;
  }

  function maximumCarouselIndex() {
    return Math.max(
      0,
      carouselCards.length - visibleCarouselCards()
    );
  }

  function carouselCardStep() {
    const firstCard = carouselCards[0];

    if (!firstCard) {
      return 0;
    }

    const cardWidth =
      firstCard.getBoundingClientRect().width;

    const trackStyles =
      window.getComputedStyle(carouselTrack);

    const gap =
      Number.parseFloat(
        trackStyles.columnGap || trackStyles.gap
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
      const dot = document.createElement("button");

      dot.type = "button";
      dot.className = "carousel-dot";

      dot.setAttribute(
        "aria-label",
        `Ir al grupo ${index + 1} de profesionales`
      );

      dot.addEventListener("click", () => {
        currentCarouselIndex = index;
        updateCarousel();
      });

      carouselDotsContainer.appendChild(dot);
    }
  }

  function updateCarousel({ animate = true } = {}) {
    currentCarouselIndex = Math.max(
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
      -(currentCarouselIndex * carouselCardStep());

    carouselTrack.style.transform =
      `translate3d(${position}px, 0, 0)`;

    carouselPreviousButton.disabled =
      currentCarouselIndex === 0;

    carouselNextButton.disabled =
      currentCarouselIndex === maximumCarouselIndex();

    const dots =
      carouselDotsContainer.querySelectorAll(
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
        isActive ? "true" : "false"
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

  carouselViewport.addEventListener(
    "pointerdown",
    (event) => {
      if (
        event.pointerType === "mouse" &&
        event.button !== 0
      ) {
        return;
      }

      isDragging = true;

      activePointerId = event.pointerId;

      startX = event.clientX;
      currentX = event.clientX;

      carouselViewport.classList.add(
        "is-dragging"
      );

      carouselTrack.classList.add(
        "is-dragging"
      );

      carouselViewport.setPointerCapture(
        event.pointerId
      );
    }
  );

  carouselViewport.addEventListener(
    "pointermove",
    (event) => {
      if (
        !isDragging ||
        event.pointerId !== activePointerId
      ) {
        return;
      }

      currentX = event.clientX;

      const dragDistance =
        currentX - startX;

      const basePosition =
        -(currentCarouselIndex * carouselCardStep());

      carouselTrack.style.transform =
        `translate3d(${basePosition + dragDistance}px, 0, 0)`;
    }
  );

  function finishCarouselDrag(event) {
    if (!isDragging) {
      return;
    }

    if (
      event.pointerId !== undefined &&
      activePointerId !== null &&
      event.pointerId !== activePointerId
    ) {
      return;
    }

    const movement =
      currentX - startX;

    const swipeThreshold = Math.min(
      carouselCardStep() * 0.2,
      70
    );

    if (movement < -swipeThreshold) {
      currentCarouselIndex += 1;
    } else if (movement > swipeThreshold) {
      currentCarouselIndex -= 1;
    }

    isDragging = false;
    activePointerId = null;

    carouselViewport.classList.remove(
      "is-dragging"
    );

    carouselTrack.classList.remove(
      "is-dragging"
    );

    updateCarousel();
  }

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

  window.addEventListener("resize", () => {
    window.clearTimeout(carouselResizeTimer);

    carouselResizeTimer =
      window.setTimeout(() => {
        createCarouselDots();

        updateCarousel({
          animate: false
        });
      }, 150);
  });

  createCarouselDots();

  updateCarousel({
    animate: false
  });
}