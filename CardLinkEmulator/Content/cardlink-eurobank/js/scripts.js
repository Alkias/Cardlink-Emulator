var oldPan = null;
let statusRadioVal;

// const radios = document.querySelectorAll('input[name="status"]');
// radios.forEach(radio => {
//     radio.addEventListener('click', function () {
//             statusRadioVal = radio.value;
//             console.log(statusRadioVal);
//         });
// });

function checkCardFormatting() {
    var field = document.getElementById('card.pan'),
        position = field.selectionEnd,
        length = field.value.length;
    field.value = field.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
    field.selectionEnd = position += ((field.value.charAt(position - 1) === ' ' && field.value.charAt(length - 1) === ' ') ? 1 : 0);
}

function CheckPanAndSubmitCard(pan, button, formid, cmd) {
    if(statusRadioVal=="canceled"){
        toggle();
        submitForm();
        //setTimeout(submitForm, 6000);
        return true;
    }

    if (pan.indexOf("#") > 0) {} else {
        pan = pan.replace(/ /g, "");
        document.getElementById("card.pan").value = document.getElementById("card.pan").value.replace(/ /g, "");
    }
    if (pan.length < 13 || pan.length > 19 || isNaN(pan)) {
        document.getElementById('card.pan').style.border = '1px solid rgb(229, 38, 0)';
        document.getElementById('card.pan').style.color = 'rgb(229, 38, 0)';
    } else {
        document.getElementById('card.pan').style.border = '1px solid';
        document.getElementById('card.pan').style.color = 'rgb(101, 101, 110)';
        submitCard(button, formid, cmd, pan);
    }
}

function CheckFields(isMoto) {
    if(statusRadioVal=="canceled"){
        toggle();
        submitForm();
        //setTimeout(submitForm, 6000);
        return true;
    }

    if (document.getElementById("card.pan").value.indexOf("#") > 0) {} else {
        document.getElementById("card.pan").value = document.getElementById("card.pan").value.replace(/ /g, "");
    }
    var pan = document.getElementById("card.pan").value;
    var name = document.getElementById("card.holderName").value;
    var cvv = document.getElementById("card.cvv").value;
    var month = document.getElementById("card.expiryMonth").value;
    var year = document.getElementById("card.expiryYear").value;

    var panOK = false;
    var dateOK = false;
    var cvvOK = false;

    var today = new Date();
    var mm = (today.getMonth() + 1).toString();
    if (mm.length == 1) {
        mm = '0' + mm;
    }

    if (month.length == 1) {
        month = '0' + month;
    }

    var yyyy = today.getFullYear();
    var currentDate = yyyy + '-' + mm + '-01';
    if (month == "00" || year == "0") {
        month = "01";
        year = "2000";
    }

    var selectedDate = year + '-' + month + '-01';

    if (pan.length < 13 || pan.length > 19) {
        document.getElementById('card.pan').style.border = '1px solid rgb(229, 38, 0)';
        document.getElementById('card.pan').style.color = 'rgb(229, 38, 0)';
    } else {
        document.getElementById('card.pan').style.border = '1px solid';
        document.getElementById('card.pan').style.color = 'rgb(101, 101, 110)';
        panOK = true;
    }

    if (selectedDate < currentDate) {
        document.getElementById('card.expiryMonth').style.border = '1px solid rgb(229, 38, 0)';
        document.getElementById('card.expiryYear').style.border = '1px solid rgb(229, 38, 0)';
        document.getElementById('card.expiryMonth').style.color = 'rgb(229, 38, 0)';
        document.getElementById('card.expiryYear').style.color = 'rgb(229, 38, 0)';
    } else {
        document.getElementById('card.expiryMonth').style.border = '1px solid';
        document.getElementById('card.expiryYear').style.border = '1px solid';
        document.getElementById('card.expiryMonth').style.color = 'rgb(101, 101, 110)';
        document.getElementById('card.expiryYear').style.color = 'rgb(101, 101, 110)';
        dateOK = true;
    }

    if ((cvv.length < 3 || isNaN(cvv)) && !isMoto) {
        document.getElementById('card.cvv').style.border = '1px solid rgb(229, 38, 0)';
        document.getElementById('card.cvv').style.color = 'rgb(229, 38, 0)';
    } else {
        document.getElementById('card.cvv').style.border = '1px solid';
        document.getElementById('card.cvv').style.color = 'rgb(101, 101, 110)';
        cvvOK = true;
    }

    if (panOK && dateOK && cvvOK) {

        toggle();
        submitForm();
        //setTimeout(submitForm, 6000);

        //return true;
    } else {
        var card_pan = document.getElementById('card.pan');
        if (card_pan.value.indexOf("#") > 0) {} else {
            card_pan.value = card_pan.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ');
        }
        return false;
    }
}

function CanselPayment(){
    radiobtn = document.getElementById("status2");
    radiobtn.checked = true;    

    toggle();
    submitForm();
    //setTimeout(submitForm, 6000);
}

function submitForm() {
    var form = document.getElementById("payform1");
    form.submit();
}

window.onload = function (event) {

    const radios = document.querySelectorAll('input[name="status"]');
    radios.forEach(radio => {
        radio.addEventListener('click', function () {
                statusRadioVal = radio.value;
                console.log(statusRadioVal);
            });
    });

    document.getElementById('card.pan').addEventListener('input', function (e) {
        var field = e.target,
            position = field.selectionEnd,
            length = field.value.length;
        field.value = field.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
        field.selectionEnd = position += ((field.value.charAt(position - 1) === ' ' && field.value.charAt(length - 1) === ' ') ? 1 : 0);
    });
    var card_pan = document.getElementById('card.pan');
    if (card_pan != null) {
        if (card_pan.value != "") {
            var ifrm = document.getElementById('cardForm');
            if (ifrm != null) {
                ifrm.scrollIntoView(true);
            }
        }
    } else {}
    if (card_pan.value.indexOf("#") > 0) {} else {
        card_pan.value = card_pan.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim();
        if (document.getElementById('card.pan').value.length > 0) {
            if (document.getElementById('card.pan').style.background != null) {
                if (document.getElementById('card.pan').style.background == "") {
                    document.getElementById('card.pan').style.border = '1px solid rgb(229, 38, 0)';
                    document.getElementById('card.pan').style.color = 'rgb(229, 38, 0)';
                }
            }
        }
    }
    var input1 = document.querySelector('#card\\.holderName');
    var item1 = document.querySelector('#cardholder_placeholder');

    change_color(input1, item1);
    input1.addEventListener('input', function () {
        change_color(input1, item1);
    });

    var input2 = document.querySelector('#card\\.pan');
    var item2 = document.querySelector('#cardpan_placeholder');

    change_color(input2, item2);
    input2.addEventListener('input', function () {
        change_color(input2, item2);
    });

    var input3 = document.querySelector('#card\\.cvv');
    var item3 = document.querySelector('#cardcvv_placeholder');

    change_color(input3, item3);
    input3.addEventListener('input', function () {
        change_color(input3, item3);
    });

    var input4 = document.querySelector('#card\\.expiryMonth');
    var item4 = document.querySelector('#monthsel_placeholder');

    change_color(input4, item4);
    input4.addEventListener('input', function () {
        change_color(input4, item4);
    });

    var input5 = document.querySelector('#card\\.expiryYear');
    var item5 = document.querySelector('#yearsel_placeholder');

    change_color(input5, item5);
    input5.addEventListener('input', function () {
        change_color(input5, item5);
    });

    function change_color(input, item) {
        if (input.value === '') {
            item.style.color = "#fff";
        } else {
            item.style.color = "#aaa";
        }
    }
}

function setOldPan(oldpanv) {
    oldPan = oldpanv.replace(/ /g, "");
}

function submitCard(button, formid, cmd, newpanv) {
    var cardNumElm = document.getElementById("cardNum");
    cardNumElm.value = newpanv;
    return true;
    //if (oldPan != null && newpanv != null && oldPan != newpanv) {
    //    submitFormWithCmd(button, formid, cmd)
    //}
}

// Show an element
var show = function (elem) {
    elem.style.display = 'block';
};

// Hide an element
var hide = function (elem) {
    elem.style.display = 'none';
};

// Toggle element visibility
var toggle = function () {
    let elem = document.querySelector(".overlay");
    // If the element is visible, hide it
    if (window.getComputedStyle(elem).display === 'block') {
        hide(elem);
        return;
    }

    // Otherwise, show it
    show(elem);

};

function toggleOverlay() {
    let overlayDiv = document.querySelector(".overlay");
    console.log(overlayDiv.style.opacity);

    if (overlayDiv.style.opacity === '0') {
        overlayDiv.style.opacity = 0.5;
    } else {
         overlayDiv.style.opacity = 0;
    }
}