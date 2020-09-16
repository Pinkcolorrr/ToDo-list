export const costomConfirm = {
    open(options) {
        options = Object.assign({}, {
            title: '',
            message: '',
            okText: 'OK',
            cancelText: 'Cancel',
            onok: function () {},
            oncancel: function () {}
        }, options);

        const html = `
        <div class="custom-confirm" id="custom-confirm">
            <div class="custom-confirm__body">
                <div class="custom-confirm__title">
                    <div class="custom-confirm__title-text">${options.title}</div>
                    <button class="custom-confirm__cross-button" id="confirm-cross"></button>
                </div>
                <div class="custom-confirm__content">
                    <div class="custom-confirm__text">${options.message}</div>
                    <div class="custom-confirm__buttons">
                        <button class="custom-confirm__buttons-ok" id="confirm-ok" type="button">${options.okText}</button>
                        <button class="custom-confirm__buttons-cancel" id="confirm-cancel" type="button">${options.cancelText}</button>
                    </div>
                </div>
            </div>
        </div>`;

        const template = document.createElement('template');
        template.innerHTML = html;

        const confirmEl = template.content.querySelector('#custom-confirm');
        const buttonCross = template.content.querySelector('#confirm-cross');
        const buttonOk = template.content.querySelector('#confirm-ok');
        const buttonCancel = template.content.querySelector('#confirm-cancel');

        confirmEl.addEventListener('click', () => {
            buttonOk.focus();
        });

        buttonOk.addEventListener('click', () => {
            options.onok();
            this.close(confirmEl);
        });

        [buttonCross, buttonCancel].forEach((item) => {
            item.addEventListener('click', () => {
                this.close(confirmEl);
            });
        });

        confirmEl.addEventListener('keyup', (e) => {
            if (e.key === "Escape") {
                this.close(confirmEl);
            }
        });

        document.body.appendChild(template.content);
        buttonOk.focus();
    },

    close(confirmEl) {
        document.body.removeChild(confirmEl);
    }
};