const buttons = document.querySelectorAll('.mdc-button');
for (const button of buttons) {
    mdc.ripple.MDCRipple.attachTo(button);
}

const textFields = document.querySelectorAll('.mdc-text-field');
for (const textField of textFields) {
    mdc.textField.MDCTextField.attachTo(textField);
}

const tabBars = document.querySelectorAll('.mdc-tab-bar');
for (const tabBar of tabBars) {
    mdc.tabBar.MDCTabBar.attachTo(tabBar);
}

$('.mdc-tab-bar').on('click', '[data-tab-contents]', function (e) {
    var $this = $(this),
        $tabContents = $($.find($this.attr('data-tab-contents'))[0]),
        src = $tabContents && $tabContents.length && $tabContents.attr('data-tab-src'),
        redirect = $this.attr('data-redirect');

    if (redirect && redirect.length) {
        window.location.href = redirect;
    } else {
        $tabContents
            .addClass('fadeIn')
            .removeClass('fadeOutDown')
            .siblings('.fadeIn')
            .removeClass('fadeIn')
            .addClass('fadeOutDown');

        src &&
            src.length &&
            !$tabContents.find('iframe').length &&
            $tabContents.append($('<iframe></iframe>').attr('src', src));
    }
});

