import { $ } from 'meteor/jquery'
import { Pairity } from '../../../imports/lib/pairity'

import './toast.html'

const showToast = (toasttype, message, timeOut) => {
    $('#toast').html(message);
    $('#toast').addClass(toasttype);
    $('#toast').addClass('show');

    setTimeout(function () {
        $('#toast').removeClass(toasttype);
        $('#toast').removeClass('show');
    }, timeOut || Pairity.ToastTimeOut)
}

const Toast = {}

Toast.showError = (message, timeOut) => {
    showToast('error', message, timeOut)
}

Toast.showWarning = (message, timeOut) => {
    showToast('warning', message, timeOut)
}

Toast.showSuccess = (message, timeOut) => {
    showToast('success', message, timeOut)
}

module.exports = { Toast }
