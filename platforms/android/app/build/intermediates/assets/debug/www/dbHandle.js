var db = null;
var var_no = null;
var position = null;
var index;

// 데이터베이스 생성 및 오픈
function openDB() {
	db = window.openDatabase('restaurantDB', '1.0', '식당DB', 1024 * 1024);
	console.log('1_DB 생성...');
}
// 테이블 생성 트랜잭션 실행
function createTable() {
	db.transaction(function (tr) {
		var createSQL = 'create table if not exists restaurants(type text, name text, time text, address text, memo text, lat double, lon double)';
		tr.executeSql(createSQL, [], function () {
			console.log('2_1_테이블생성_sql 실행 성공...');
		}, function () {
			console.log('2_1_테이블생성_sql 실행 실패...');
		});
	}, function () {
		console.log('2_2_테이블 생성 트랜잭션 실패...롤백은 자동');
	}, function () {
		console.log('2_2_테이블 생성 트랜잭션 성공...');
	});
}
// 데이터 입력 트랜잭션 실행
function insertRestaurant() {
	db.transaction(function (tr) {
		var type = $('#restaurantType1').val();
		var name = $('#restaurantName1').val();
		var time = $('#restaurantTime1').val();
		var address = $('#restaurantAddress1').val();
		var memo = $('#restaurantMemo1').val();
		var lat = $('#lat').attr('value');
		var lon = $('#lon').attr('value');
		var insertSQL = 'insert into restaurants(type, name, time, address, memo, lat, lon) values(?, ?, ?, ?, ?, ?, ?)';
		tr.executeSql(insertSQL, [type, name, time, address, memo, lat, lon], function (tr, rs) {
			console.log('3_ 분실물 등록...no: ' + rs.insertId);
			alert('분실물 ' + $('#restaurantName1').val() + ' 이 입력되었습니다');
			$('#restaurantName1').val('');
			$('#restaurantType1').val('장소').attr('selected', 'selected');
			$('#restaurantType1').selectmenu('refresh');
			$('#restaurantAddress1').val('');
			$('#restaurantMemo1').val('');
			$('#box1').html('위도 : <br/> 경도 :');
		}, function (tr, err) {
			alert('DB오류 ' + err.message + err.code);
		});
	});
}
// 전체 데이터 검색 트랜잭션 실행
function listRestaurant() {
	db.transaction(function (tr) {
		var selectSQL = 'select * from restaurants';
		tr.executeSql(selectSQL, [], function (tr, rs) {
			console.log(' 분실물 조회... ' + rs.rows.length + '건.');
			if (position == 'first') {
				if (index == 0)
					alert('더 이상의 분실물이 없습니다');
				else
					index = 0;
			} else if (position == 'prev') {
				if (index == 0)
					alert('더 이상의 분실물이 없습니다');
				else
					index = --index;
			} else if (position == 'next') {
				if (index == rs.rows.length - 1)
					alert('더 이상의 분실물이 없습니다');
				else
					index = ++index;
			} else {
				if (index == rs.rows.length - 1)
					alert('더 이상의 분실물이 없습니다');
				else
					index = rs.rows.length - 1;
			}
			$('#restaurantType4').val(rs.rows.item(index).type);
			$('#restaurantName4').val(rs.rows.item(index).name);
		});
	});
}
// 데이터 수정 트랜잭션 실행
function updateRestaurant() {
	db.transaction(function (tr) {
		var type = $('#restaurantkType2').val();
		var new_name = $('#restaurantName2').val();
		var old_name = $('#sRestaurantName2').val();
		var updateSQL = 'update restaurants set type = ?, name = ? where name = ?';
		tr.executeSql(updateSQL, [type, new_name, old_name], function (tr, rs) {
			console.log('5_분실물 수정.... ');
			alert('분실물이름 ' + $('#sRestaurantName2').val() + ' 이 분실물되었습니다');
			$('#restaurantName2').val('');
			$('#sRestaurantName2').val('');
			$('#restaurantType2').val('장소').attr('selected', 'selected');
			$('#restaurantType2').selectmenu('refresh');
			$('#restaurantTime2').val('');
			$('#restaurantAddress2').val('');
			$('#restaurantMemo2').val('');
		}, function (tr, err) {
			alert('DB오류 ' + err.message + err.code);
		});
	});
}
// 데이터 삭제 트랜잭션 실행
function deleteRestaurant() {
	db.transaction(function (tr) {
		var name = $('#sRestaurantName3').val();
		var deleteSQL = 'delete from restaurants where name = ?';
		tr.executeSql(deleteSQL, [name], function (tr, rs) {
			console.log('6_분실물 삭제... ');
			alert('분실물 ' + $('#restaurantName3').val() + ' 이 삭제되었습니다');
			$('#restaurantType3').val('');
			$('#restaurantName3').val('');
			$('#sRestaurantName3').val('');
		}, function (tr, err) {
			alert('DB오류 ' + err.message + err.code);
		});
	});
}
// 데이터 수정 위한 데이터 검색 트랜잭션 실행
function selectRestaurant2(name) {
	db.transaction(function (tr) {
		var selectSQL = 'select * from restaurants where name=?';
		tr.executeSql(selectSQL, [name], function (tr, rs) {
			$('#restaurantName2').val(rs.rows.item(0).name);
			$('#restaurantTime2').val(rs.rows.item(0).time);
			$('#restaurantAddress2').val(rs.rows.item(0).address);
			$('#restaurantMemo2').val(rs.rows.item(0).memo);
			$('#restaurantType2').val(rs.rows.item(0).type).attr('selected', 'selected');
			$('#restaurantType2').selectmenu('refresh');
			console.log(rs.rows.item(0).lat);
			$('#box2').html("<div id='lat' value='" + rs.rows.item(0).lat + "'>위도 : " +
				rs.rows.item(0).lat + "</div><br/><div id='lon' value='" + rs.rows.item(0).lon + "'>경도 : " + rs.rows.item(0).lon + "</div>")

		});
	});
}
// 데이터 삭제 위한 데이터 검색 트랜잭션 실행
function selectRestaurant3(name) {
	db.transaction(function (tr) {
		var selectSQL = 'select type, name from restaurants where name=?';
		tr.executeSql(selectSQL, [name], function (tr, rs) {
			$('#restaurantType3').val(rs.rows.item(0).type);
			$('#restaurantName3').val(rs.rows.item(0).name);
		}, function (tr, err) {
			alert('DB오류 ' + err.message + err.code);
		});
	});
}
// 데이터 조건 검색 트랜잭션 실행
function selectRestaurant4(name) {
	db.transaction(function (tr) {
		var selectSQL = 'select type, name from restaurants where name=?';
		tr.executeSql(selectSQL, [name], function (tr, rs) {
			$('#restaurantType4').val(rs.rows.item(0).type);
			$('#restaurantName4').val(rs.rows.item(0).name);
		}, function (tr, err) {
			alert('DB오류 ' + err.message + err.code);
		});
	});
};

function selectAllRestaurant() {
	db.transaction(function (tr) {
		var selectSQL = 'select * from restaurants'
		tr.executeSql(selectSQL, [], function (tr, rs) {
			var tagList = "";
			$.each(rs.rows, function () {
				tagList += "<li><a href='#detail' class='toDetail' id='test' value='" + this.name + "'>" + this.name + "</a></li>";
			});
			$("#restaurantList").empty();
			$("#restaurantList").append(tagList);
			$("#restaurantList").listview('refresh');
		});
	});
}

function selectedDeatil(name) {
	db.transaction(function (tr) {
		var selectSQL = 'select * from restaurants where name=?'
		tr.executeSql(selectSQL, [name], function (tr, rs) {
			var tagList = "";
			tagList += "<center><h1>" + rs.rows.item(0).name + "</h1><p>" + rs.rows.item(0).type + "</p><p>" + rs.rows.item(0).time + "</p><p>" + rs.rows.item(0).address + "</p><p>" + rs.rows.item(0).memo + "</p><div id='mapArea'></div></center>"
			$("#detailcontent").empty();
			$("#detailcontent").append(tagList);
			loadGoogleMap(parseFloat(rs.rows.item(0).lat), parseFloat(rs.rows.item(0).lon));
		});
	});
}

function getMyLocation() {
	var posOption = {
		maximumAge: 3000,
		timeout: 50000,
		enableHighAccuracy: true
	};
	navigator.geolocation.getCurrentPosition(onSuccess, onError, posOption);
}

function onSuccess(position) {
	$('#box1').html("<div id='lat' value='" + position.coords.latitude + "'>위도 : " +
		position.coords.latitude + "</div><br/><div id='lon' value='" + position.coords.longitude + "'>경도 : " + position.coords.longitude + "</div>");
	var geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

	//위도와 경도를 구글 맵스의 geocoder에서 사용할 형식으로 변환합니다.
	geocoder.geocode({
		'latLng': latlng
	}, function (results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			/*

			좌표를 주소로 변환 시키는 geocoder를 실행합니다.

			만약 성공적으로 변환이 되었다면, status라는 상태변수가 참이 되어 아래의 코드들이 실행됩니다.

			*/
			if (results[1]) {

				$('#restaurantAddress1').val(results[3].formatted_address);
			}
		} else {
			alert("Geocoder failed due to: " + status);
			//만약 geocoder가 실패시 알림창을 출력합니다.
		}
	});
}


function onError(posError) {
	alert('Error Code : ' + posError.code + ' / Error Message : ' + posError.message);
}

function loadGoogleMap(lat, lng) {
	var latlng = new google.maps.LatLng(lat, lng);
	$('#mapArea').gmap('destroy');
	$('#mapArea').gmap({
		'center': latlng,
		'zoom': 15
	});
	$('#mapArea').gmap('addMarker', {
		'position': latlng
	}).click(function () {
		$('#mapArea').gmap('openInfoWindow', {
			'content': '현재 위치'
		}, this);
	});
}

function addList() {
	if ($('#place1').is(":checked")) {
		type = "50주년 기념관"
	} else if ($('#place2').is(":checked")) {
		type = "인문사회관"
	} else if ($('#place3').is(":checked")) {
		type = "조형예술관"
	} else if ($('#place4').is(":checked")) {
		type = "제1과학관"
	} else {
		type = "제2과학관"
	}
	console.log(type)
	db.transaction(function (tr) {
		var selectSQL = 'select * from restaurants where type=?';
		tr.executeSql(selectSQL, [type], function (tr, rs) {
			console.log(rs.rows)
			var tagList = ""
			$.each(rs.rows, function () {
				tagList += "<li><a href='#detail' class='toDetail' id='test' value='" + this.name + "'>" + this.name + "</a></li>";
			});
			$("#lostList").empty();
			$("#lostList").append(tagList);
		});
	});
}
