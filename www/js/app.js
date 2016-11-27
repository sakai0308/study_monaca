// Save memo and return to top page
function addSaveBtnTapped() {

    var place = $("#place").val();
    var impression = $("#impression").val();
    var now = new Date();

    var saveObj = {
        "id": now.getTime(),
        "place": place,
        "impression": impression,
        "datetime": now.toLocaleString()
    };

    if (place != '') {
        // Save to local storage
        window.localStorage.setItem(now.getTime(), JSON.stringify(saveObj));

        alert('思い出の保存が完了しました。');

        // Clear form
        $("#place").val("");
        $("#impression").val("");

        $.mobile.changePage("#topPage", { transition: "slideup", reverse: true });

        //保存した後に画面をリフレッシュする
        updateTopPage();
    } else {
        alert("場所の入力は必須です。");
    }
}

// refresh top page
function updateTopPage() {
    $("#memoryListView").empty();

    for(var i = 0; i < window.localStorage.length; i++) {
        if($.isNumeric(window.localStorage.key(i))) {
            var data = window.localStorage.getItem(window.localStorage.key(i));
            var item = JSON.parse(data);

            var li = $("<li><a href='#' class='show'><h3></h3><p></p></a><a href='#' class='delete'>Delete</a></li>");
            li.data("id", item.id);
            li.find("h3").text(item.place);
            li.find("p").text(item.datetime);
            $("#memoryListView").prepend(li);
        }
    }
    $("#memoryListView").listview("refresh");  // Call refresh after manipulating list
}

// Move to detail page
function toDetailLinkTapped(id) {
    var data = window.localStorage.getItem(id);
    var item = JSON.parse(data);

    $("#showPage h1").text(item.place);
    $("#showPage p#showDatetime").text(item.datetime);
    $("#showPage p#showImpression").html(item.impression.replace(/\n/g, "<br>"));

    $.mobile.changePage("#showPage", { transition: "slide" });
}

// Delete memo
function deleteBtnTapped() {
    var li = $(this).parents("li");
    var id = li.data("id");

    if (!confirm("この思い出を本当に削除してもよろしいですか？")) {
      return;
    }
    var li = $(this).parent();
    var id = li.data("id");

    window.localStorage.removeItem(id);

    updateTopPage();
}

// on document loaded
function beforeStart() {
    updateTopPage();
    $("#addSave").click(addSaveBtnTapped);
    $("#memoryListView").on("click", "a.show", function() {
        var li = $(this).parents("li");
        var id = li.data("id");
        toDetailLinkTapped(id);
    });
    $("#memoryListView").on("click", "a.delete", deleteBtnTapped);
}

// on application ready
$(document).ready(function() {
    beforeStart();
});