import { Template } from 'meteor/templating'
import { $ } from 'meteor/jquery'

class PairityModal {
    static show(title, body, okText, callback, cbValue, headerClass = 'modal-header-default') {
        $('.modal').addClass('modal-animation')

        $('.modal-header').addClass(headerClass)

        $('#modalTitle').text(title)

        $('#modalBody').html(body)

        if (okText) {
            $('a#modalPrimaryButton').text(okText)
            $('a#modalPrimaryButton').removeClass('modal-display-none')
            if (callback) {
                $('a#modalPrimaryButton').bind('click', () => {
                    callback(cbValue)
                    this.close()
                })
            }
        } else {
            $('a#modalPrimaryButton').addClass('modal-display-none')
        }

        $('a#modalCancelButton').text('Close')
        $('.modal-overlay').addClass('overlay-visible')
    }

    static close() {
        $('.modal-overlay').removeClass('overlay-visible')
        $('.modal').removeClass('modal-animation')
        $('a#modalPrimaryButton').unbind('click')
    }
}

module.exports = { PairityModal }
