class Tooltip extends HTMLElement {
  constructor() {
    super();
    this._tooltipIcon;
    this._tooltipText = "Default tooltip text";
    this._tooltipVisible;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
        <style>
          :host {
              position: relative;
          }
          :host(.important) {
              background: var(--color-primary, #ccc);
              padding: 0.5rem;
          }
          
          :host-context(p) {
              font-weight: bold;
          }
          
          div {
              background-color: black;
              color: white;
              position: absolute;
              top: 1.5rem;
              left: 0.75rem;
              z-index: 10;
              padding: 0.15rem;
              border-radius: 3px;
              box-shadow: 1px 1px 6px rgba(0,0,0,0.26);
          }
          
          .highlight {
            background-color: red;
          }
                
          ::slotted(.highlight) {
            border-bottom: 1px dotted red;
          }
          
          .icon {
            background: black;
            color: white;
            padding: 0.15rem 0.5rem;
            text-align: center;
            border-radius: 50%;
          }
        </style>
        <slot>Some default</slot>
        <span class="icon"> (?)</span>
    `;
  }

  connectedCallback() {
    this._tooltipText = this.getAttribute("text") ?? this._tooltipText;
    this._tooltipIcon = this.shadowRoot.querySelector("span");
    this._tooltipIcon.textContent = " ?";
    this._tooltipIcon.addEventListener("mouseenter", this._showTooltip.bind(this));
    this._tooltipIcon.addEventListener("mouseleave", this._hideTooltip.bind(this));
    this._render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    if (name === "text") {
      this._tooltipText = newValue;
    }
  }

  disconnectedCallback() {
    this._tooltipIcon.removeEventListener("mouseenter", this._showTooltip);
    this._tooltipIcon.removeEventListener("mouseleave", this._hideTooltip);
  }

  static get observedAttributes() {
    return ["text"];
  }

  _render() {
    let tooltipContainer = this.shadowRoot.querySelector("div");
    if (this._tooltipVisible) {
      tooltipContainer = document.createElement("div");
      tooltipContainer.textContent = this._tooltipText;
      this.shadowRoot.appendChild(tooltipContainer);
    } else {
      if (tooltipContainer) {
        this.shadowRoot.removeChild(tooltipContainer);
      }
    }
  }
  _showTooltip() {
    this._tooltipVisible = true;
    this._render();
  }

  _hideTooltip() {
    this._tooltipVisible = false;
    this._render();
  }
}

customElements.define("as-tooltip", Tooltip);
