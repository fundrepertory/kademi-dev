function initMyTopic() {
    flog("initMyTopic", $("#postQuestion form"));
    $("#postQuestion form").forms({
        callback: function(resp) {
            log("done post", resp);
            window.location = resp.nextHref;
        }
    });
    jQuery("abbr.timeago").timeago();
}

function initMyQuestion() {

    flog("initMyQuestion");
    $("#postComment form").forms({
        callback: function(resp) {
            log("done post", resp);
            closeModals();
            addReply($("#postComment form textarea").val());
            $("#postComment form textarea").val("");
            $("#postComment form .alert").remove();
        }
    });
    jQuery("abbr.timeago").timeago();
    flog("timeago", jQuery("abbr.timeago"));
    $(".AnswerList").reportAbuse();
}

function addReply(text) {
    flog("addReply", text);
    var answersDiv = $(".AnswerList");
    var replyDiv = $("<div class='Post Answer ClearFix'></div>");
    var currentUser = {
        name: userName,
        href: userUrl,
        photoHref: "/profile/pic"
    }
    var img = profileImg(currentUser);
    var avatarDiv = $("<div class='Avatar'>" + img + "</div>");
    var detailsDiv = $("<div class='Details'></div>");
    replyDiv.append(avatarDiv);
    replyDiv.append(detailsDiv);

    var descDiv = $("<div class='Description'></div>");
    var descP = $("<p>");
    descDiv.append(descP);
    descP.text(text);

    var infoP = $("<p></p>");
    var now = new Date();
    var formattedNow = now.toISOString();
    infoP.append("<abbr title='" + formattedNow + "' class='info timeago'>" + formattedNow + "</abbr>");
    infoP.append("<em><a href='#'>" + userName + "</a></em>");

    detailsDiv.append(descDiv);
    detailsDiv.append(infoP);

    answersDiv.append(replyDiv);
    $("abbr.timeago", infoP).timeago();
}