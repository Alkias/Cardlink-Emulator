var appcontrolUsed = false;
var appcontrolNotUsedMsg = "";
var dn = new String(document.domain).toLowerCase();
if (dn.indexOf("-test.cardlink.gr") > -1 || dn.indexOf("-dev.cardlink.gr") > -1) {
    document.write('<div style="color: red; position: fixed; height: 15px; width: 800px; top: 0px; z-Index:100;">');
    document.write('<b>Notice: This is a test system, do not use real cards or attempt to make real payments on this page!</b>');
    document.write('</div>');
}

function checkIfAppControlUsed() {
    if (!appcontrolUsed) {
        return (appcontrolNotUsedMsg);
    }
    return;
}

function appControlUsed() {
    appcontrolUsed = true;
}

function submitFormWithCmd(button, formid, cmd) {
    var cform = document.getElementById(formid);
    if (cform != null) {
        cform.cmd.value = cmd;
        if (button != null) button.disabled = true;
        appControlUsed();
        cform.submit();
    }
}

function showElement(elId, show) {
    var element = document.getElementById(elId);
    if (element != null) {
        if (show) {
            element.style.visibility = "visible";
            element.style.display = "";
        } else {
            element.style.visibility = "hidden";
            element.style.display = "none";
        }
    }
}

function showErrorPopup(objid, errmsg) {
    var obj = document.getElementById(objid);
    var x = 0;
    var y = 0;
    if (obj != null) {
        objwidth = obj.offsetWidth;
        x = findPosX(obj) + objwidth + 1;
        y = findPosY(obj);
    }
    var errmsgel = document.getElementById("errpopupmsg");
    if (errmsgel != null) {
        errmsgel.innerHTML = errmsg;
    }
    showPopupAtXY("errpopup", x, y);
}

function showErrorPopupOnDoc(objid, errmsg, documentx) {
    var obj = documentx.getElementById(objid);
    var x = 0;
    var y = 0;
    if (obj != null) {
        objwidth = obj.offsetWidth;
        x = findPosX(obj) + objwidth + 1;
        y = findPosY(obj);
    }
    var errmsgel = documentx.getElementById("errpopupmsg");
    if (errmsgel != null) {
        errmsgel.innerHTML = errmsg;
    }
    showPopupAtXYOnDoc("errpopup", x, y, documentx);
}

function closeErrorPopup() {
    hidePopup("errpopup");
}

function showInfoPopup(objid, errmsg) {
    var obj = document.getElementById(objid);
    var x = 0;
    var y = 0;
    if (obj != null) {
        objwidth = obj.offsetWidth;
        x = findPosX(obj) + objwidth + 1;
        y = findPosY(obj);
    }
    var errmsgel = document.getElementById("infopopupmsg");
    if (errmsgel != null) {
        errmsgel.innerHTML = errmsg;
    }
    showPopupAtXY("infopopup", x, y);
}

function showValueHelpPopup(objid, values, targetid, helpmsg) {
    var obj = document.getElementById(objid);
    var x = 0;
    var y = 0;
    if (obj != null) {
        objwidth = obj.offsetWidth;
        x = findPosX(obj) + objwidth + 1;
        y = findPosY(obj);
    }
    var valuesHtml = "";
    if (helpmsg != null) {
        valuesHtml += "<div>" + helpmsg + "<br/><div>";
    }
    for (i = 0; values != null && i < values.length; i++) {
        valuesHtml += "<div><a class=\"nodec\" href=\"javascript:setTargetValue('" + targetid + "', '" + values[i] + "', 'infopopup');\">" + values[i] + "</a></div>";
    }
    var msgel = document.getElementById("infopopupmsg");
    if (msgel != null) {
        msgel.innerHTML = valuesHtml;
    }
    showPopupAtXY("infopopup", x, y);
}

function setTargetValue(targetid, valuex, popupid) {
    var targetObj = document.getElementById(targetid);
    if (targetObj != null) targetObj.value = valuex;
    hidePopup(popupid);
}

function closeInfoPopup() {
    hidePopup("infopopup");
}

function showPopupAtXY(refId, x, y) {
    var popup = document.getElementById(refId);
    if (popup != null) {
        popup.style.display = "block";
        popup.style.position = "absolute";
        popup.style.left = x + "px";
        popup.style.top = y + "px";
        popup.style.zIndex = 2;
        popup.style.visibility = "visible";
        ieppopupbug(popup);
    }
}

function ieppopupbug(popup) {
    var iepbug = document.getElementById("iebug1");
    if (iepbug != null) {
        iepbug.style.width = popup.offsetWidth;
        iepbug.style.height = popup.offsetHeight;
        iepbug.style.top = popup.style.top;
        iepbug.style.left = popup.style.left;
        iepbug.style.zIndex = popup.style.zIndex - 1;
        iepbug.style.display = "block";
        iepbug.style.visibility = "visible";
    }
}

function showPopupAtXYOnDoc(refId, x, y, documentx) {
    var popup = documentx.getElementById(refId);
    if (popup != null) {
        popup.style.display = "block";
        popup.style.position = "absolute";
        popup.style.left = x + "px";
        popup.style.top = y + "px";
        popup.style.zIndex = 2;
        popup.style.visibility = "visible";
        ieppopupbug(popup);
    }
}

function hidePopup(refId) {
    var popup = document.getElementById(refId);
    if (popup != null) {
        popup.style.visibility = "hidden";
        popup.style.display = "none";
        var iebug1 = document.getElementById("iebug1");
        if (iebug1 != null) {
            iebug1.style.visibility = "hidden";
            iebug1.style.display = "none";
        }
        return true;
    }
    return false;
}

function findPosX(obj) {
    var curleft = 0;
    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curleft += obj.offsetLeft
            obj = obj.offsetParent;
        }
    } else if (obj.x)
        curleft += obj.x;
    return curleft;
}

function findPosY(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curtop += obj.offsetTop
            obj = obj.offsetParent;
        }
    } else if (obj.y)
        curtop += obj.y;
    return curtop;
}

function showPopup(refId, x, y) {
    var popup = document.getElementById(refId);
    if (popup != null) {
        popup.style.display = "block";
        popup.style.position = "absolute";
        popup.style.left = x + "px";
        popup.style.top = y + "px";
        popup.style.zIndex = 2;
        popup.style.visibility = "visible";
        ieppopupbug(popup)
    }
}

function hidePopup(refId) {
    var popup = document.getElementById(refId);
    if (popup != null) {
        popup.style.visibility = "hidden";
        popup.style.display = "none";
        var popupiebug1 = document.getElementById("iebug1");
        if (popupiebug1 != null) {
            popupiebug1.style.visibility = "hidden";
            popupiebug1.style.display = "none";
        }
    }
}
var timerCleanUpDisable = null;

function enableContinue() {
    disableContinueButton(false, document, "");
    if (timerCleanUpDisable != null) {
        clearTimeout(timerCleanUpDisable);
        timerCleanUpDisable = null;
    }
}

function disableContinueButton(disable, doc, msg) {
    var btnEl = doc.getElementById("gvf_continue");
    if (btnEl != null) {
        btnEl.disabled = disable;
        if (disable) {
            btnEl.style.color = "gray";
            window.status = msg;
            doc.body.style.cursor = "wait";
            timerCleanUpDisable = setTimeout("enableContinue();", 30000);
        } else {
            btnEl.style.color = "";
            window.status = "";
            doc.body.style.cursor = "auto";
        }
    }
}

function helpFieldBlur(e, mycheckField) {
    if (window.event) {
        keynum = e.keyCode
    } else if (e.which) {
        keynum = e.which
    }
    keychar = String.fromCharCode(keynum)
    if (!(keynum == 37 || keynum == 39 || keynum == 36)) {
        if (mycheckField != null) {
            mycheckField.blur();
            mycheckField.focus();
        }
    }
}

function FieldObj(_id, _value) {
    this.id = _id;
    this.value = _value;
}

function showSubWindow(srcUrl) {
    window.open(srcUrl, "", "width=640,height=460,resizable,menubar=no, scrollbars=yes");
}

function showSubWindowSize(srcUrl, w, h) {
    window.open(srcUrl, "", "width=" + w + ",height=" + h + ",resizable,menubar=no, scrollbars=yes");
}

function disableButton(disable, id) {
    var btnEl = document.getElementById(id);
    if (btnEl != null) {
        btnEl.disabled = disable;
        if (disable) {
            btnEl.style.color = "gray";
            window.status = "";
            document.body.style.cursor = "wait";
            timerCleanUpDisable = setTimeout("enableButton('" + id + "');", 60000);
        } else {
            btnEl.style.color = "";
            window.status = "";
            document.body.style.cursor = "auto";
        }
    }
}

function enableButton(id) {
    disableButton(false, id);
    if (timerCleanUpDisable != null) {
        clearTimeout(timerCleanUpDisable);
        timerCleanUpDisable = null;
    }
}

function autoCompleteOff() {
    var inputElements = document.getElementsByTagName("input");
    for (i = 0; inputElements[i] != null && i < inputElements.length; i++) {
        inputElements[i].setAttribute("autocomplete", "off");
    }
}

function clearInput(input, event) {
    if (event.keyCode == 8 || event.keyCode == 46 || (event.keyCode >= 48 && event.keyCode <= 57)) {
        if (input.value != null && input.value.indexOf("#") > -1) {
            input.value = "";
        }
    }
}

function startWalletSession(walletId, payformId) {
    var cform = document.getElementById(payformId);
    if (cform != null) {
        cform.walletId.value = walletId;
        displayElement('walletStartOverlay');
    }
    submitFormWithCmd(null, payformId, 'startWalletSession');
}

function displayElement(id) {
    var btnEl = document.getElementById(id);
    if (btnEl != null) {
        if (btnEl.style.display == "none") {
            btnEl.style.display = "block";
        } else {
            btnEl.style.display = "none";
        }
    }
}

function masterPassSuccess(data) {
    if (data != null) {
        var el = document.getElementById("masterPass_oauthToken");
        if (el != null && data.hasOwnProperty('oauth_token') && data.oauth_token != null) {
            el.value = data.oauth_token;
        }
        var el2 = document.getElementById("masterPass_oauthVerifer");
        if (el2 != null && data.hasOwnProperty('oauth_verifier') && data.oauth_verifier != null) {
            el2.value = data.oauth_verifier;
        }
        var el3 = document.getElementById("masterPass_checkoutUrl");
        if (el3 != null && data.hasOwnProperty('checkout_resource_url') && data.checkout_resource_url != null) {
            el3.value = data.checkout_resource_url;
        }
        var el4 = document.getElementById("masterPass_mpstatus");
        if (el4 != null && data.hasOwnProperty('mpstatus') && data.mpstatus != null) {
            el4.value = data.mpstatus;
        }
    }
    displayElement('walletEndOverlay');
    submitFormWithCmd(null, 'payform1', 'endWalletSession');
}

function masterPassFail(data) {
    if (data != null) {
        var el = document.getElementById("masterPass_oauthToken");
        if (el != null && data.hasOwnProperty('oauth_token') && data.oauth_token != null) {
            el.value = data.oauth_token;
        }
        var el2 = document.getElementById("masterPass_oauthVerifer");
        if (el2 != null && data.hasOwnProperty('oauth_verifier') && data.oauth_verifier != null) {
            el2.value = data.oauth_verifier;
        }
        var el3 = document.getElementById("masterPass_checkoutUrl");
        if (el3 != null && data.hasOwnProperty('checkout_resource_url') && data.checkout_resource_url != null) {
            el3.value = data.checkout_resource_url;
        }
        var el4 = document.getElementById("masterPass_mpstatus");
        if (el4 != null && data.hasOwnProperty('mpstatus') && data.mpstatus != null) {
            el4.value = data.mpstatus;
        }
    }
    submitFormWithCmd(null, 'payform1', 'endWalletSession');
}

function masterPassCancel(data) {
    if (data != null) {
        var el = document.getElementById("masterPass_oauthToken");
        if (el != null && data.hasOwnProperty('oauth_token') && data.oauth_token != null) {
            el.value = data.oauth_token;
        }
        var el2 = document.getElementById("masterPass_oauthVerifer");
        if (el2 != null && data.hasOwnProperty('oauth_verifier') && data.oauth_verifier != null) {
            el2.value = data.oauth_verifier;
        }
        var el3 = document.getElementById("masterPass_checkoutUrl");
        if (el3 != null && data.hasOwnProperty('checkout_resource_url') && data.checkout_resource_url != null) {
            el3.value = data.checkout_resource_url;
        }
        var el4 = document.getElementById("masterPass_mpstatus");
        if (el4 != null && data.hasOwnProperty('mpstatus') && data.mpstatus != null) {
            el4.value = data.mpstatus;
        }
    }
    submitFormWithCmd(null, 'payform1', 'endWalletSession');
}

function isNumericVP(num1) {
    if (num1 != null) {
        for (i = 0; i < num1.length; i++) {
            var c = num1.charCodeAt(i);
            
            if (c == 30)
                continue;
            if (c < 48 || c > 57) {
                return false;
            }           
        }
        return true;
    }
    return false;
}

function isDecimal(num1) {
    num1 = num1.replace(",", ".");
    return Number(num1).toString() == num1;
}

function checkIfCard() {
    var panEl = document.getElementById("card.pan");
    var pmtEl = document.getElementById("paymentMethodType");
    var pf = document.getElementById("payform1");
    if (panEl != null && pmtEl != null && pf != null) {
        if (isNumericVP(panEl.value) && pf.paymentMethod != null && pf.paymentMethod.value.trim().length < 1) {
            pmtEl.value = "card";
        } else {
            pmtEl.value = "";
        }
    }
    return true;
}

function endsWith(a, b) {
    if (a != null && b != null) {
        var ix = a.lastIndexOf(b);
        if (ix > -1 && ix + b.length == a.length)
            return true;
    }
    return false;
}

function toggleStateInputSelect(options, selectedIndex, targetId) {
    var states = "";
    var targetSelect = document.getElementById(targetId + ".select");
    var targetInput = document.getElementById(targetId);
    var targetLine = document.getElementById(targetId + "Line");
    if (options.length > selectedIndex && selectedIndex > -1) {
        states = options[selectedIndex].id;
    }
    states = states.substring(states.indexOf(".") + 1);
    if (states.length > 0 && targetSelect != null) {
        while (targetSelect.options.length > 0) {
            targetSelect.remove(0);
        }
        var pairs = states.split("|");
        for (i = 0; i < pairs.length; i++) {
            var keyvalue = pairs[i].split(":");
            var option = document.createElement("option");
            option.value = keyvalue[0];
            option.text = keyvalue[1];
            targetSelect.add(option);
            if (targetInput != null && targetInput.value == option.value) {
                targetSelect.selectedIndex = i;
            }
        }
        targetSelect.disabled = false;
        targetSelect.style.display = "initial";
        if (targetLine != null) {
            targetLine.style.display = "initial";
        }
        if (targetInput != null) {
            targetInput.style.display = "none";
            targetInput.disabled = true;
        }
    } else {
        if (targetSelect != null) {
            targetSelect.style.display = "none";
            targetSelect.disabled = true;
            if (targetLine != null) {
                targetLine.style.display = "none";
            }
        }
        if (targetInput != null) {
            targetInput.disabled = false;
            targetInput.style.display = "initial";
        }
    }
}

function breakOutMPIIframe() {
    if (window.name == "threeDS") {
        appControlUsed();
        window.parent.location = window.location;
    }
}

function switchDisplayed3DS() {
    var div1 = document.getElementById("threeDSStart");
    var ifr1 = document.getElementById("threeDS");
    if (div1 != null && ifr1 != null) {
        div1.style.display = "none";
        ifr1.style.display = "block";
        var payform = document.getElementById("payform1");
        if (payform != null) {
            payform.style.pointerEvents = "none";
        }
    }
}

function mpiReturn() {}