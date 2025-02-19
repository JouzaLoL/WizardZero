$(document).ready(function() {
    setUpStyles();
    getSteps();
    registerEvents();
});


//Global variables
var steps = [];
var currentIndex = 0;
var slider;

/**
 * Setup the Range slider
 */
function setUpStyles() {

    slider = $(".range-slider").jRange({
        from: 0,
        to: 30000,
        step: 1000,
        scale: [0, 5000, 10000, 15000, 20000, 25000, 30000],
        format: "%s Kč",
        width: 250,
        showLabels: true,
        isRange: true,
        theme: "theme-blue",
        snap: true
    });

    //Set to default range
    $(".range-slider").jRange("setValue", "5000,15000");
}

/* =================== BEGIN NAVIGATION/STEPS =================== */

/**
 * Register the events for the navigation
 */
function registerEvents() {
    $("next").click(nextStep);
    $("back").click(previousStep);
    $("select").change(onSelect);
    $("finish").click(finish);
}

/**
 * Triggered whenever the user selects something in the Machine Use slide;
 */
function onSelect() {
    var value = $(this).val();

    if (value === null) { //User didn't select category, prompt him to select one.
        alert("Vyberte prosím kategorii");
        return;
    }

    $("." + value) //Select the selected category
        .removeClass(value) //Remove the temp class, show the element
        .addClass("step"); //Add class step so we are able to cache it

    getSteps(); //Update the steps

    //Make the select box nonclickable.
    $(this).addClass("nonclickable");

    //Show the next button
    if ($("next").hasClass("hidden")) {
        $("back").removeClass("hidden");
        $("next").addClass("visible");
    }
}

/**
 * Slide-specific logic goes here
 */
function onFormChange() {

    //Auto hide Back button
    if (currentIndex === 0) {
        if (!$("back").hasClass("hidden")) {
            $("back").addClass("hidden");
        }
        if ($("back").hasClass("visible")) {
            $("back").removeClass("visible");
        }
    } else {
        if (!$("back").hasClass("visible")) {
            $("back").addClass("visible");
        }
        if ($("back").hasClass("hidden")) {
            $("back").removeClass("hidden");
        }
    }

    // "There's no going back..", hide the Back button after the user has selected Machine Use and went ahead
    if (currentIndex > 1) {
        if ($("back").hasClass("visible")) {
            $("back").removeClass("visible");
            $("back").addClass("hidden");
        }
    }

    //Hide the Next button if selecting Machine Use, will be shown when user has Selected an option - onSelect()
    if (getCurrentStep().attr("id") === "pouziti") {
        if ($("next").hasClass("visible")) {
            $("next").removeClass("visible");
            $("next").addClass("hidden");
        }
    } else {
        if ($("next").hasClass("hidden")) {
            $("next").removeClass("hidden");
            $("next").addClass("visible");
        }
    }

    //Hide the Next button when we get to the end
    if (getCurrentStep().attr("id") === "dokoncit") {
        if ($("next").hasClass("visible")) {
            $("next").removeClass("visible");
            $("next").addClass("hidden");
        }
    }
}

/**
 * Gets and stores all the steps in the @var steps
 * 
 * @returns An array containing all the steps elements
 */
function getSteps() {
    steps = $(".step");
    return steps;
}


/**
 * Gets and returns the current step element
 * 
 * @returns the current step element
 */
function getCurrentStep() {
    return $(".active");
}

function nextStep() {
    if (currentIndex === steps.length - 1) { //End of the line, throw an error
        throw "Final step reached, cannot go forward";
    }

    $(steps[currentIndex]).removeClass("active"); //Need to convert to jQuery element first, in order to use .removeClass();
    $(steps[currentIndex + 1]).addClass("active");
    currentIndex++;
    onFormChange();
}

function previousStep() {
    if (currentIndex === 0) { //End of the line, throw an error
        throw "First step reached, cannot go backwards";
    }

    $(steps[currentIndex]).removeClass("active"); //Need to convert to jQuery element first, in order to use .removeClass();
    $(steps[currentIndex - 1]).addClass("active");
    currentIndex--;
    onFormChange();

}

/* =================== END NAVIGATION/STEPS =================== */

/* =================== BEGIN MAGIC =================== */


//Basic data format
var DataFormat = {
    price: [0, 1],
    use: 1, //0 - basic, 1 - gaming, 2 - workstation
    tags: [] //hdd, vr, fourk, virt, gfx, wifi, silent
};


/**
 * Pull the data from the slides and stored them in an object
 * 
 * @returns A DataFormat object with the data
 */
function parseData() {
    var data = DataFormat;

    var $price = $(".range-slider")[0].value.split(",");
    data.price[0] = $price[0];
    data.price[1] = $price[1];

    var $use = $("select")[0];
    data.use = $use.selectedIndex - 1;

    if (($('input[name="hard_disk"]')[0].value || $('input[name="hard_disk"]')[0].value) === true) {
        data.tags.push("hdd");
    }

    if ($('input[name="silent"]')[0].value === true) {
        data.tags.push("silent");
    }

    if ($('input[name="vr"]')[0].value === true) {
        data.tags.push("vr");
    }

    if ($('input[name="4k"]')[0].value === true) {
        data.tags.push("fourk");
    }

    if ($('input[name="virtualization"]')[0].value === true) {
        data.tags.push("virt");
    }

    if ($('input[name="graphics"]')[0].value === true) {
        data.tags.push("gfx");
    }

    if ($('input[name="wifi"]')[0].value === true) {
        data.tags.push("wifi");
    }

    return JSON.stringify(data);
}


/**
 * Finish the wizard, submit results and redirect user
 */
function finish() {

    var data = parseData();
    $.ajax({
        type: "POST",
        url: "/api/rig/",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data, status) {
            console.log("Status:", status);
            console.log("Result:", data);
            displayResults(JSON.parse(data));
        },
        failure: function(errMsg) {
            alert(errMsg);
        }
    });

    //$(location).attr("href", "url_to_redirect_to"); //redirect the user
    //$("footer").append(JSON.stringify(parseData(), null, 4));

}


function displayResults(data) {

    var form = $(".form");
    //clear the form
    form.empty();

    form.html('<div id="results"></div>');

    var results = $('#results');
    results.append("<table></table>");

    var table = $('table');
    table.append('<tr><th>Cena</th><th>Odkaz</th><th>Tagy</th></tr>');

    for (var i = 0; i < data.length; i++) {

        var tr = "<tr>" + "<td>" + formatNumber(data[i].Price) + " Kč" + "</td>" + "<td>" + '<a href="' + data[i].Url + '"> Odkaz </a>' + "</td>" + "<td>" + data[i].Tags.toString().replace(",", ", ") + "</td>" + "</tr>";
        table.append(tr);
    }

    function formatNumber(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}