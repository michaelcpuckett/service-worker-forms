import "./components/FlyoutMenu";

window.addEventListener("pageshow", (event) => {
  const url = new URL(window.location.href);

  if (event.persisted) {
    window.location.reload();
  } else {
    const pathname = url.pathname;
    const filter = url.searchParams.get("filter");
    const query = url.searchParams.get("query");
    const nextUrl = new URL(window.location.origin + pathname);
    if (filter) {
      nextUrl.searchParams.set("filter", filter);
    }
    if (query) {
      nextUrl.searchParams.set("query", query);
    }
    window.history.replaceState({}, "", nextUrl.pathname + nextUrl.search);
  }
});

const SCROLL_STORAGE_KEY = "scroll-position-y";
const FOCUS_STORAGE_KEY = "focus-element-id";

const handleScroll = () => {
  window.sessionStorage.setItem(SCROLL_STORAGE_KEY, `${window.scrollY}`);
};

window.addEventListener("scroll", handleScroll);

window.addEventListener("DOMContentLoaded", async () => {
  await new Promise(window.requestAnimationFrame);

  const windowY = sessionStorage.getItem(SCROLL_STORAGE_KEY) || 0;
  window.scrollTo(0, Number(windowY));
});

window.addEventListener("DOMContentLoaded", () => {
  Array.from(
    window.document.querySelectorAll<HTMLInputElement>('[type="search"]')
  ).forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      if (inputElement.value === "") {
        inputElement.form?.submit();
      }
    });
  });

  window.document.body.addEventListener("focusin", () => {
    sessionStorage.setItem(FOCUS_STORAGE_KEY, document.activeElement?.id || "");
  });

  const autofocusElement = window.document.querySelector(
    '[data-auto-focus="true"]'
  );
  const focusElementId = sessionStorage.getItem(FOCUS_STORAGE_KEY) || "";
  const focusElement = window.document.getElementById(focusElementId);

  if (autofocusElement instanceof HTMLElement) {
    autofocusElement.focus({
      preventScroll: true,
    });
  } else {
    if (focusElement) {
      focusElement.focus({
        preventScroll: true,
      });
    }
  }

  [
    focusElement,
    ...Array.from(window.document.querySelectorAll('[data-auto-focus="true"]')),
  ].forEach((inputElement) => {
    if (!(inputElement instanceof HTMLInputElement)) {
      return;
    }

    if (inputElement.value.length === 0) {
      return;
    }

    if (!(inputElement.type === "text" || inputElement.type === "search")) {
      return;
    }

    inputElement.selectionStart = inputElement.selectionEnd =
      inputElement.value.length;
  });

  Array.from(
    window.document.querySelectorAll<HTMLFormElement>("form[data-auto-submit]")
  ).forEach((formElement) => {
    const inputElement = Array.from(formElement.elements).find(
      (formElement) =>
        formElement instanceof HTMLElement &&
        formElement.matches('input:not([type="hidden"])')
    );
    let isSubmitting: number | false = false;

    inputElement?.addEventListener("input", () => {
      const promises = uniqueContenteditableForms.map((contenteditableForm) => {
        const hasDirtyFormElements = Array.from(
          contenteditableForm?.elements || []
        ).find((formElement) => {
          return formElement.matches(".contenteditable.is-dirty");
        });

        if (!hasDirtyFormElements) {
          return;
        }

        if (contenteditableForm === formElement) {
          return;
        }

        if (!contenteditableForm?.checkValidity()) {
          return;
        }

        return fetch(contenteditableForm?.getAttribute("action") ?? "", {
          method: contenteditableForm.getAttribute("method") ?? "",
          body: new FormData(contenteditableForm),
        });
      });

      return new Promise((resolve, reject) => {
        if (formElement.dataset.autoSubmit === "delay") {
          const timestamp = Date.now();
          isSubmitting = timestamp;
          new Promise((r) => setTimeout(r, 400)).then(() => {
            if (isSubmitting !== timestamp) {
              reject();
            } else {
              isSubmitting = false;
              resolve(void 0);
            }
          });
        } else {
          resolve(void 0);
        }
      })
        .then(() => {
          return Promise.all(promises);
        })
        .then(() => {
          if (formElement.checkValidity()) {
            formElement.submit();
          }
        })
        .catch(() => {
          // Do nothing.
        });
    });
  });

  Array.from(window.document.querySelectorAll("dialog")).forEach(
    (dialogElement) => {
      dialogElement.addEventListener("click", (event) => {
        if (event.target === event.currentTarget) {
          dialogElement
            .querySelector<HTMLFormElement>(".close-dialog-form")
            ?.submit();
        }
      });

      dialogElement.addEventListener("keyup", (event) => {
        if (event.key === "Escape") {
          dialogElement
            .querySelector<HTMLFormElement>(".close-dialog-form")
            ?.submit();
        }
      });
    }
  );

  Array.from(
    window.document.querySelectorAll<HTMLInputElement>(
      ".contenteditable[value]"
    )
  ).forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      if (inputElement.value !== (inputElement.getAttribute("value") || "")) {
        inputElement.classList.add("is-dirty");
      } else {
        inputElement.classList.remove("is-dirty");
      }
    });

    if (inputElement.form?.dataset.autoSave === "false") {
      return;
    }

    inputElement.addEventListener("blur", () => {
      if (
        inputElement.classList.contains("is-dirty") &&
        inputElement.form?.checkValidity()
      ) {
        fetch(inputElement.form?.getAttribute("action") ?? "", {
          method: inputElement.form.getAttribute("method") ?? "",
          body: new FormData(inputElement.form),
        }).then(() => {
          inputElement.classList.remove("is-dirty");
        });
      }
    });
  });

  const uniqueContenteditableForms = [
    ...new Set(
      Array.from(
        window.document.querySelectorAll<HTMLInputElement>(".contenteditable")
      )
        .map((inputElement) => inputElement.form)
        .filter((form) => !!form)
    ),
  ];

  for (const form of uniqueContenteditableForms) {
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const promises = uniqueContenteditableForms.map((contenteditableForm) => {
        const hasDirtyFormElements = Array.from(
          contenteditableForm?.elements ?? []
        ).find((formElement) => {
          return formElement.matches(".contenteditable.is-dirty");
        });

        if (!hasDirtyFormElements) {
          return;
        }

        if (contenteditableForm === form) {
          return;
        }

        if (!contenteditableForm?.checkValidity()) {
          return;
        }

        return fetch(contenteditableForm?.getAttribute("action") ?? "", {
          method: contenteditableForm.getAttribute("method") ?? "",
          body: new FormData(contenteditableForm),
        });
      });

      Promise.all(promises).then(() => {
        form.submit();
      });
    });
  }
});
