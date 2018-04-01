import { $ } from 'meteor/jquery'
import { Pairity } from '../../../imports/lib/pairity'

import './toast.html'

const showToast = (toasttype, message) => {
    $('#toast').html(message);
    $('#toast').addClass(toasttype);
    $('#toast').addClass('show');

    setTimeout(function () {
        $('#toast').removeClass(toasttype);
        $('#toast').removeClass('show');
    }, Pairity.ToastTimeOut)
}

const Toast = {}

Toast.showError = (message) => {
    showToast('error', message)
}

Toast.showWarning = (message) => {
    showToast('warning', message)
}

Toast.showSuccess = (message) => {
    showToast('success', message)
}

module.exports = { Toast }
