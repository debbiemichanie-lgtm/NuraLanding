/*
   MENÚ MOBILE
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
   AÑO AUTOMÁTICO
*/

const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}


/*
   LINK ACTIVE SEGÚN LA SECCIÓN VISIBLE
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

/* Marcar Inicio al cargar la página */

setActiveLink("inicio");


/*
   CARRUSEL DE PROFESIONALES
*/

const carouselTrack = document.querySelector(
  ".carousel-track"
);

const carouselItems = Array.from(
  document.querySelectorAll(".professional-item")
);

const previousButton = document.querySelector(
  ".carousel-arrow--prev"
);

const nextButton = document.querySelector(
  ".carousel-arrow--next"
);

const dotsContainer = document.querySelector(
  ".carousel-dots"
);

let carouselIndex = 0;

function visibleProfessionalCards() {
  if (window.innerWidth <= 760) {
    return 1;
  }

  if (window.innerWidth <= 980) {
    return 2;
  }

  return 3;
}

function maxCarouselIndex() {
  return Math.max(
    0,
    carouselItems.length - visibleProfessionalCards()
  );
}

function createCarouselDots() {
  if (!dotsContainer) {
    return;
  }

  dotsContainer.innerHTML = "";

  const totalPositions = maxCarouselIndex() + 1;

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
      `Mostrar grupo ${index + 1} de profesionales`
    );

    dot.addEventListener("click", () => {
      carouselIndex = index;
      updateCarousel();
    });

    dotsContainer.appendChild(dot);
  }
}

function updateCarousel() {
  if (
    !carouselTrack ||
    carouselItems.length === 0
  ) {
    return;
  }

  carouselIndex = Math.min(
    carouselIndex,
    maxCarouselIndex()
  );

  const firstCard = carouselItems[0];

  const cardWidth =
    firstCard.getBoundingClientRect().width;

  const trackStyles =
    window.getComputedStyle(carouselTrack);

  const gap =
    Number.parseFloat(
      trackStyles.columnGap || trackStyles.gap
    ) || 0;

  const movement =
    carouselIndex * (cardWidth + gap);

  carouselTrack.style.transform =
    `translateX(-${movement}px)`;

  if (previousButton) {
    previousButton.disabled =
      carouselIndex === 0;
  }

  if (nextButton) {
    nextButton.disabled =
      carouselIndex >= maxCarouselIndex();
  }

  document
    .querySelectorAll(".carousel-dot")
    .forEach((dot, index) => {
      dot.classList.toggle(
        "active",
        index === carouselIndex
      );
    });
}

if (previousButton) {
  previousButton.addEventListener("click", () => {
    carouselIndex = Math.max(
      0,
      carouselIndex - 1
    );

    updateCarousel();
  });
}

if (nextButton) {
  nextButton.addEventListener("click", () => {
    carouselIndex = Math.min(
      maxCarouselIndex(),
      carouselIndex + 1
    );

    updateCarousel();
  });
}


/*
   RECALCULAR CARRUSEL RESPONSIVE
*/

let resizeTimer;

window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);

  resizeTimer = window.setTimeout(() => {
    createCarouselDots();
    updateCarousel();
  }, 150);
});


/*
   FORMULARIO DE PROFESIONALES
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
   FUNCIONES PARA MOSTRAR Y LIMPIAR ERRORES
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
   MENSAJES PERSONALIZADOS DE VALIDACIÓN
*/

function getValidationMessage(field) {
  const fieldName =
    field.previousElementSibling?.textContent
      ?.replace("*", "")
      .replace("Opcional", "")
      .trim() || "Este campo";

  if (field.validity.valueMissing) {
    return `${fieldName} es obligatorio.`;
  }

  if (field.validity.typeMismatch) {
    if (field.type === "email") {
      return "Ingresá una dirección de correo electrónico válida.";
    }

    if (field.type === "url") {
      return "Ingresá una dirección web válida.";
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
   VALIDACIÓN DE CAMPOS INDIVIDUALES
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
   VALIDACIÓN ESPECÍFICA DEL TELÉFONO
*/

function validatePhone() {
  const phoneInput = document.querySelector("#telefono");

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
   VALIDACIÓN DE MODALIDAD
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
   FUNCIONAMIENTO DE LA DISPONIBILIDAD
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

        clearGroupError(availabilityError);
      }
    );
  }
});


/*
   VALIDACIÓN DE DISPONIBILIDAD
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
   VALIDACIÓN DE ARCHIVOS
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
      `El archivo no puede superar los 5 MB.`
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
   VALIDACIÓN DEL CONSENTIMIENTO
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
   VALIDACIÓN EN TIEMPO REAL
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
   LIMPIAR TODOS LOS ERRORES
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
   VALIDAR EL FORMULARIO COMPLETO
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
   IR AL PRIMER CAMPO CON ERROR
*/

function focusFirstFormError() {
  if (!professionalForm) {
    return;
  }

  const firstInvalidField =
    professionalForm.querySelector(
      [
        '[aria-invalid="true"]',
        ".availability-table tr.has-error input",
        ".field-error.visible",
      ].join(",")
    );

  if (!firstInvalidField) {
    return;
  }

  const fieldToFocus =
    firstInvalidField.matches(
      "input, textarea, select, button"
    )
      ? firstInvalidField
      : firstInvalidField
          .closest(".form-section")
          ?.querySelector(
            "input, textarea, select, button"
          );

  fieldToFocus?.focus({
    preventScroll: true,
  });

  firstInvalidField.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}


/*
   ENVIAR FORMULARIO A NETLIFY
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
    clearAllFormErrors();

    showFormStatus(
      "¡Gracias por postularte! Recibimos tus datos correctamente y nos vamos a comunicar con vos a la brevedad.",
      "success"
    );

    formStatus?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  } catch (error) {
    console.error(
      "No se pudo enviar el formulario:",
      error
    );

    showFormStatus(
      "No pudimos enviar la postulación. Revisá tu conexión e intentá nuevamente.",
      "error"
    );
  } finally {
    submitButton.disabled = false;
    submitButton.classList.remove("is-loading");
    submitButton.textContent =
      "Enviar postulación";
  }
}


/*
   EVENTO DE ENVÍO
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
   INICIALIZACIÓN
*/

createCarouselDots();
updateCarousel();