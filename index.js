'use strict';

class ReusableButton {
    id;
    rootElement;
    modal;
    resultDiv;

    constructor(element, modal) {
        this.rootElement = element;
        this.modal = modal;
        this.__createResultDiv();
        this.__initializeListener();
    }

    __initializeListener() {
        this.rootElement.addEventListener('click', async () => {
            const result = await this.modal.ask();
            this.resultDiv.innerHTML = `You just clicked "${result}"`;
        });
    }

    __createResultDiv() {
        const resultDiv = document.createElement('div');
        this.resultDiv = resultDiv;
        this.rootElement.parentNode.insertBefore(
            resultDiv,
            this.rootElement.nextElementSibling
        );
    }
}

class Modal {
    isOpen = false;
    rootElement;
    yesButton;
    noButton;
    background;
    id;
    initialized = false;

    constructor(id) {
        this.id = id;
        this.__render();
        this.__initializeElements();
        this.initialized = true;
    }

    ask() {
        this.__show();
        return this.__listenForResponse();
    }

    __listenForResponse() {
        return new Promise((resolve) => {
            const onCancel = () => {
                this.__hide();
                this.cancelButton.removeEventListener('click', onCancel);
                resolve('Cancel');
            };

            const onYes = () => {
                console.log('closing');
                this.__hide();
                this.cancelButton.removeEventListener('click', onYes);
                resolve('Yes');
            };

            this.yesButton.addEventListener('click', onYes);
            this.cancelButton.addEventListener('click', onCancel);
            this.background.addEventListener('click', onCancel);
        });
    }

    __show() {
        if (!this.isOpen) {
            this.rootElement.classList.remove('closed');
            this.rootElement.classList.add('open');
            this.isOpen = true;
        }
    }

    __hide() {
        if (this.isOpen) {
            this.rootElement.classList.remove('open');
            this.rootElement.classList.add('closed');
            this.isOpen = false;
        }
    }

    __initializeElements() {
        this.rootElement = document.getElementById(this.id);
        this.yesButton = this.rootElement.querySelector('button.modal-yes');
        this.background = this.rootElement.querySelector('.modal-background');
        this.cancelButton = this.rootElement.querySelector(
            'button.modal-cancel'
        );
    }

    __render() {
        const modalRoot = document.createElement('div');
        modalRoot.id = this.id;
        modalRoot.className = 'modal-root';
        modalRoot.innerHTML = `
        <div class="modal-background"></div>
        <div class="modal-dialog">
            <div class="modal-inner">
                <p>Are you sure to continue?</p>
            </div>
            <div class="modal-footer">
                <button class="modal-yes success">Yes</button>
                <button class="modal-cancel gray">Cancel</button>
            </div>
        </div>
        `;
        document.body.append(modalRoot);
    }
}

class App {
    rootElement;
    modal;

    constructor() {
        this.rootElement = document.getElementById('app');
        this.modal = new Modal();
    }

    createButton(text = 'Click me') {
        const button = document.createElement('Button');
        button.classList = 'reusable-button';
        button.innerHTML = text;
        this.rootElement.appendChild(button);
        new ReusableButton(button, this.modal);
    }
}

const app = new App();
app.createButton();
app.createButton('Another button');
app.createButton();
app.createButton();
