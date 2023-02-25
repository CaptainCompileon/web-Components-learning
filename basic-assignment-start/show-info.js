class ShowInfo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <style>
                 #info-box {
                    display: none;
                  }
            
            </style>
            <button>Show</button>
            <p id="info-box">
                <slot>Default info!</slot>
            </p>
        `;
  }
  connectedCallback() {
    const button = this.shadowRoot.querySelector("button");
    const infoEl = this.shadowRoot.querySelector("p");

    let isHidden = true;

    button.addEventListener("click", () => {
      if (isHidden) {
        infoEl.style.display = "block";
        button.textContent = "Hide";
        isHidden = false;
      } else {
        infoEl.style.display = "none";
        button.textContent = "Show";
        isHidden = true;
      }
    });
  }
}

customElements.define("as-show-info", ShowInfo);
