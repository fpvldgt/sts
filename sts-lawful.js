javascript:
var regOp = document.querySelectorAll('ul#cnts-tab-list li a')[2];
if(regOp.className == '') {
	regOp.click();
} else {
	document.querySelector('#txt_sj').value='찬성합니다';
	document.querySelector('#txt_cn').value='선한 법률은 절대 찬성합니다.';
	document.querySelector('#catpchaAnswer').focus();
	const inputField = document.querySelector("#catpchaAnswer");
	inputField.addEventListener("input", () => {
		const value = inputField.value;
		if (/^\d+$/.test(value) && value.length === 5) {
			trimAllInputText();
			if (!validate()) {return 0;}
			$(".loading_bar").show();
			checkWebFilter($("#frm"));
		}
	});
};