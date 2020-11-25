$(document).ready(function () {

    // Allow for toggle on comments
    $('body').on('click', '.showComments', function () {
        $(this).siblings().slideToggle()
    });

    // Clear input field on button submit
    $('body').on('click', '.statusUpdateBtn', function () {
        $(".statusUpdate, #autoSuggest").val('')
        $(".updateStatusContainer li").remove()
    });

    // Clear input field on new comment
    $('body').on('click', '.addCommentBtn', function () {
        if ($(".addCommentInput").val().length > 0) {
            $(".addCommentInput").val("")
            $(this).parent().siblings(".allComments").addClass("animate__animated animate__flash")
        }
    });

    // Clear input field on new comment
    $('body').on('click', '.notifications', function () {
        $(".showNotifications").toggle()
        $("body").toggleClass("notificationsMargin")
    });

    // Hide the add new recipe and allow for toggle
    $('body').on('click', '.addRecipeBtn', function () {
        $(".recipeCollapse").slideToggle()
        $(".recipeCollapse").toggleClass("hidden")

        if ($(".recipeCollapse").hasClass("hidden")) {
            $(".addRecipe").css("padding-bottom", "20px")
        } else {
            $(".addRecipe").css("padding-bottom", "60px")
        }
    });
})