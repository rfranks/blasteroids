const buttons = document.querySelectorAll('.mdc-button');
    for (const button of buttons) {
      mdc.ripple.MDCRipple.attachTo(button);
    }

const textFields = document.querySelectorAll('.mdc-text-field');
for (const textField of textFields) {
  mdc.textField.MDCTextField.attachTo(textField);
}

const tabBar = document.querySelector('.mdc-tab-bar');
mdc.tabBar.MDCTabBar.attachTo(tabBar);

$('.mdc-tab-bar').on('click', '[data-tab-contents]', function (e) {
  var $tabContents = $($(e.srcElement || e.target).closest('[data-tab-contents]').attr('data-tab-contents')),
      src = $tabContents && $tabContents.length && $tabContents.attr('data-tab-src');

  $tabContents
    .addClass('fadeIn')
    .removeClass('fadeOutDown')
    .siblings('.fadeIn')
    .removeClass('fadeIn')
    .addClass('fadeOutDown');

  src && src.length && !$tabContents.find('iframe').length && $tabContents.append('<iframe src="' + src + '"></iframe>')
});
