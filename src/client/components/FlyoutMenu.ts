class FlyoutMenu extends HTMLElement {
  constructor() {
    super();

    if (!this.shadowRoot) {
      return;
    }

    const detailsElement = this.shadowRoot.querySelector("details");
    const menuElement = this.shadowRoot.querySelector('[role="menu"]');

    if (!detailsElement || !menuElement) {
      return;
    }

    const itemElements = Array.from(
      menuElement.querySelectorAll<HTMLElement>('[role="menuitem"]')
    );

    detailsElement.addEventListener("toggle", () => {
      if (detailsElement.open) {
        itemElements
          ?.find((element) => element.getAttribute("tabindex") === "0")
          ?.focus();
      }
    });

    menuElement.addEventListener("keydown", (event) => {
      if (!(event instanceof KeyboardEvent)) {
        return;
      }

      if (event.key === "ArrowUp") {
        const currentItemElement = itemElements.find((itemElement) =>
          itemElement.matches('[tabindex="0"]')
        );

        if (!currentItemElement) {
          return;
        }

        const index = itemElements.indexOf(currentItemElement);
        const previousItemElement =
          itemElements[index - 1] || itemElements[itemElements.length - 1];

        if (previousItemElement instanceof HTMLElement) {
          currentItemElement.setAttribute("tabindex", "-1");
          previousItemElement.setAttribute("tabindex", "0");
          previousItemElement.focus();
        }
      }

      if (event.key === "ArrowDown") {
        const itemElements = Array.from(
          menuElement.querySelectorAll('[role="menuitem"]')
        );
        const currentItemElement = itemElements.find((itemElement) =>
          itemElement.matches('[tabindex="0"]')
        );

        if (!currentItemElement) {
          return;
        }

        const index = itemElements.indexOf(currentItemElement);
        const nextItemElement = itemElements[index + 1] || itemElements[0];

        if (nextItemElement instanceof HTMLElement) {
          currentItemElement.setAttribute("tabindex", "-1");
          nextItemElement.setAttribute("tabindex", "0");
          nextItemElement.focus();
        }
      }

      if (event.key === "Escape") {
        detailsElement.querySelector<HTMLElement>("summary")?.focus();
        detailsElement.removeAttribute("open");
      }
    });
  }
}

window.customElements.define("flyout-menu", FlyoutMenu);

declare module JSX {
  interface IntrinsicElements {
    "flyout-menu": FlyoutMenu;
  }
}
