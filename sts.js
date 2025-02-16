
javascript:
var cururl = document.location.href;
var regex_pa = /https:\/\/pal\.as{1,2}embly\.go\.kr/;
var regex_vforkor = /https:\/\/vforkorea\.com\/assem\//;
var isInitial,isLogin,opinionStr,pattern,opinionSelCnt,opinionPerCnt,opinionViewCnt,opinionCurStr,opinionCurCnt,opinionList,isIgnoreChk,selectAssemble;
var assembleDo = function() {
	if (regex_pa.test(cururl)) {
		var regOp = document.querySelectorAll('ul#cnts-tab-list li a')[2];
		if(regOp.className == '') {
			regOp.click();
		} else {
			document.querySelector('#txt_sj').value='반대합니다';
			document.querySelector('#txt_cn').value='입법독재 절대 반대합니다';
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
	} else if (regex_vforkor.test(cururl)) {
		if(!isLogin) {
			isLogin = confirm("국회사이트에 로그인 하시겠습니까?\r\n의견 등록 페이지로 페이지를 열기 때문에 미리 로그인 하셔야 합니다.\r\n확인 시 국회 로그인 사이트로 이동합니다.");
			if(isLogin) {
				window.open('https://member.assembly.go.kr/login/loginPage.do?procUrl=https://pal.assembly.go.kr/napal/checkLogin.do&returnUrl=https%3A%2F%2Fpal.assembly.go.kr%2Fnapal%2Fmain%2Fmain.do','_blank');
			} else {
				isLogin=1;
				assembleDo();
			}
		} else {
			if(!isInitial || isIgnoreChk) {
				if (!selectAssemble) {
					selectAssemble = prompt("어떤 의견을 선택하십니까?\r\n1:위험의견\r\n2:선법의견");
					if (selectAssemble == 1) {
						pattern = /위험의견(\d+)/g;
						opinionStr = "위험의견";
					} else if (selectAssemble == 2) {
						pattern = /선법의견(\d+)/g;
						opinionStr = "선법의견";
					} else {
						return 0;
					};
					opinionSelCnt = prompt(opinionStr+" 중 입력한 개수 이상의 의견만 선택합니다.\r\n*기본 10");
					if (opinionSelCnt == undefined) {return 0;}
					opinionSelCnt = !isNaN(Number(opinionSelCnt)) && opinionSelCnt != 0 ? opinionSelCnt : 10;
					opinionPerCnt = Number(prompt("한번에 열 의견의 개수를 입력하세요\r\n*기본 10"));
					if (opinionPerCnt == undefined) {return 0;}
					opinionPerCnt = !isNaN(opinionPerCnt) && opinionPerCnt != 0  ? opinionPerCnt : 10;
				};
				opinionList=[];
				document.querySelectorAll('tbody#tbody > tr').forEach(tr=>{
					opinionCurStr = tr.querySelector('button').innerHTML;
					var opinionMatches = [...opinionCurStr.matchAll(pattern)];
					if(opinionMatches.length) opinionCurCnt = opinionMatches[0][1];
					opinionCurCnt = opinionMatches.length ? opinionMatches[0][1] : 0;
					var isChk = tr.querySelector('input[type=checkbox]').checked;
					if(opinionCurCnt>opinionSelCnt && (isIgnoreChk || !isChk)) {
						opinionList.push(tr);
					}
				});

				opinionCnt=0;
				opinionViewCnt=0;
				isInitial=1;
				isIgnoreChk =0;
			}
			if(isInitial) {
				var sCnt = opinionViewCnt*opinionPerCnt;
				var eCnt = (opinionViewCnt+1)*opinionPerCnt-1;
				if(opinionList.length==0){
					isIgnoreChk = confirm('선택한 입법안이 없습니다\r\n확인체크 된 입법안도 포함시켜 검색할까요?');
					if (isIgnoreChk) {
						isInitial = 0;
						assembleDo();
					}
				} else {
					if(opinionList.length<eCnt+1){
						eCnt=opinionList.length-1;
					}
					if (opinionList.length <= sCnt){
						alert('확인할 입법이 없습니다');
						return 0;
					}
					var isOpen = confirm('선택한 입법안이 총'+opinionList.length+'개 입니다.\r\n' + (sCnt+1) + ' ~ ' + (eCnt+1) + '의 입법안을 열겠습니다.');
					if (isOpen) {
						opinionViewCnt++;
						while(sCnt <= eCnt) {
							op = opinionList[sCnt];
							opChk = op.querySelector('input[type=checkbox]');
							if (!opChk.checked) {opChk.click();};
							opa = op.querySelector('a');
							opa.href = opa.href.replace("lgsltpaOngoing/view.do","lgsltpaOpn/forInsert.do").replace("lgsltpaOpn/list.do","lgsltpaOpn/forInsert.do");
							opa.click();
							sCnt++;
						}
					}
				}
			}
		}
	} else {
		window.open('https://vforkorea.com/assem/','_blank');
	};
};
assembleDo();