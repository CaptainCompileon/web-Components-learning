class Modal extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <style>
                #backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background-color: rgba(0,0,0,0.75);
                    z-index: 10;
                    opacity: 0;
                    pointer-events: none;
                }
                #modal {
                    z-index: 100;
                    position: fixed;
                    top: 10vh;
                    left: 25%;
                    width: 50%;
                    background-color: white;
                    border-radius: 3px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.26);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.3s ease-out;
                }
                
                :host([opened]) #backdrop, :host([opened]) #modal {
                    opacity: 1;
                    pointer-events: all;
                }
                
                :host([opened]) #modal {
                    top: 15vh;
                }
                
                header {
                    padding: 1rem;
                    border-bottom: 1px solid #ccc;
                }
                
                ::slotted(h1) {
                    font-size: 1.25rem;
                    margin: 0;
                }
                
                #main {
                    padding: 1rem;
                }
                
                #actions {
                    border-top: 1px solid #ccc;
                    padding: 1rem;
                    display: flex;
                    justify-content: flex-end;
                }
                
                #actions button {
                    margin: 0 0.25rem;
                }
            </style>
            <div id="backdrop" ></div>
            <div id="modal">
                <header>
                    <slot name="title">
                        <h1>Default Title</h1>
                    </slot>
                </header>
                <section id="main">
                    <slot name="message">
                        <p>Default message</p>
                    </slot>
                </section>
                <section id="actions">
                    <button id="btn-cancel">Cancel</button>
                    <button id="btn-confirm">Confirm</button>
                </section>
            </div>
        `;
    const slots = this.shadowRoot.querySelectorAll("slot");
    slots[1].addEventListener("slotchange", (event) => {
      console.dir(slots[1].assignedNodes());
    });
    const cancelButton = this.shadowRoot.querySelector("#btn-cancel");
    const confirmButton = this.shadowRoot.querySelector("#btn-confirm");
    cancelButton.addEventListener("click", this._cancel.bind(this));
    confirmButton.addEventListener("click", this._confirm.bind(this));
    const backdrop = this.shadowRoot.querySelector("#backdrop");
    backdrop.addEventListener("click", this._cancel.bind(this));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.hasAttribute("opened")) {
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
  }

  // _modalOpen() {
  //     this.shadowRoot.querySelector('#backdrop').style.opacity = '1';
  //     this.shadowRoot.querySelector('#backdrop').style.pointerEvents = 'all';
  //     this.shadowRoot.querySelector('#modal').style.opacity = '1';
  //     this.shadowRoot.querySelector('#modal').style.pointerEvents = 'all';
  // }

  // _modalClose() {
  //     this.shadowRoot.querySelector('#backdrop').style.opacity = '0';
  //     this.shadowRoot.querySelector('#backdrop').style.pointerEvents = 'none';
  //     this.shadowRoot.querySelector('#modal').style.opacity = '0';
  //     this.shadowRoot.querySelector('#modal').style.pointerEvents = 'none';
  // }

  static get observedAttributes() {
    return ["opened"];
  }

  open() {
    this.setAttribute("opened", "");
  }

  close() {
    if (this.hasAttribute("opened")) {
      this.removeAttribute("opened");
    }
    this.isOpen = false;
  }

  _cancel(event) {
    this.close();
    const cancelEvent = new Event('cancel', { bubbles: true, composed: true });
    event.target.dispatchEvent(cancelEvent);
  }

  _confirm(event) {
    this.close();
    const confirmEvent = new Event('confirm');
    this.dispatchEvent(confirmEvent);
  }
}

customElements.define("as-modal", Modal);
