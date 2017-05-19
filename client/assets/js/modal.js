"use strict";

class Modal {
    constructor() {
        this.class = '';
        this.element = $(`
            <div id="modal" class="modal">
                <div class="header">
                    <div class="header-text">Header</div>
                    <button class="close" onClick="$('.modal').removeClass('show')">
                        <i class="mdi mdi-36px mdi-close"></i>
                    </button>
                </div>
                <div class="body">
                    <div id="chart-container">
                        <div id="y_axis"></div>
                        <div id="chart"></div>
                    </div>
                    <div class="info">
                    </div>
                </div>
            </div>
        `);
        console.log(this.element);
        $('body').append(this.element);
    }

    set_title(title) {
        $(this.element).find('.header-text').text(title);
    }

    show() {
        this.element.addClass('show');
    }

    hide() {
        this.element.removeClass('show');
    }
}
