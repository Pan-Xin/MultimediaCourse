// Check if a given symbol is a digit
function isDigit(input) {
    var digits = "0123456789";
    return (input.length == 1 && digits.indexOf(input) >= 0);
}

// Get the next number from the string and return
// the next position following the number
function getNumberFromString(string, index) {
    // Get the number
    var number = "";
    while (index < string.length && isDigit(string[index])) {
        number = number + string[index];
        index++;
    }

    // If there is no number to read, the returned number will be NaN
    return { number: parseInt(number), next: index };
}

// Draw the tree given the settings in the system
function drawTree() {
    // Get the L-system parameters
    var start = $("#lsystem-start").val().trim();
    var iterations = parseInt($("#lsystem-iterations").val());
    var length = parseFloat($("#lsystem-length").val());
    var angle = parseFloat($("#lsystem-angle").val());
    var width = parseFloat($("#lsystem-width").val());
    var lengthRatio = parseFloat($("#length-ratio").val());
    var widthRatio = parseFloat($("#width-ratio").val());

    // Create the rules
    var rules = {};
    for (var i = 1; i <= 5; i++) {
        if ($("#lsystem-rule-symbol-" + i).length > 0) {
            var symbol = $("#lsystem-rule-symbol-" + i).val().trim();
            var replacement = $("#lsystem-rule-replacement-" + i).val().trim();

            if (symbol != "" && replacement != "")
                rules[symbol] = replacement;
        }
    }

    // Create the colours
    var colors = {};
    for (var i = 1; i <= 5; i++) {
        if ($("#lsystem-color-symbol-" + i).length > 0) {
            var symbol = $("#lsystem-color-symbol-" + i).val().trim();
            var color = $("#lsystem-color-color-" + i).val().trim();

            if (symbol != "") colors[symbol] = color;
        }
    }

    // Reset the tree area
    turtle.reset();

    // Go to the starting position
    /**
     * TODO: You may adjust the starting position depending
     *       on the positioning of your grass texture
     **/
    turtle.up();
    turtle.goto(250, 405);
    turtle.left(90);
    turtle.down();

    // Run the L-system
    var string = runLSystem(start, rules, iterations);

    // Put the result string in the right place
    $("#lsystem-result-string").val(string);

    // Draw the final string
    drawLSystem(turtle, string, length, angle, width,
                lengthRatio, widthRatio, colors);
}

// Run the L-system to get the final L-system string
function runLSystem(start, rules, iterations) {
    var string = start;

    // Run the L-system for the specified iterations
    for (var i = 0; i < iterations; i++) {
        var result = "";

        for (var j = 0; j < string.length; j++) {
            // The letter/symbol to be replaced
            var symbol = string[j];

            /**
             * TODO: You need to extract the associated depth number,
             *       if there is one, next to the current symbol
             **/

            // get the depth of the input symbol
            var res = getNumberFromString(string, j + 1);
            var isExist = false; // used to record whether the depth exists or not
            if(!isNaN(res.number)){
                isExist = true;
                j = res.next - 1;
            }

            // Assume the replacement is the letter/symbol itself
            var replacement = symbol;

            /**
             * TODO: The above replacement *may* have a depth value
             **/

            // Update the replacement is the letter/symbol is in the rule
            if (symbol in rules) {
                replacement = rules[symbol];

                /**
                 * TODO: Any increment inside the replacement has to be adjusted
                 *       using the depth number of the current symbol
                 **/

                var cur_str = ""; // used to record current replacement
                for(var t=0; t<replacement.length; t++){
                    // add current symbol in the rule to current replacement
                    cur_str += replacement[t];
                    // get the depth in rule
                    var temp = getNumberFromString(replacement, t + 1);
                    if(isNaN(temp.number) == false){
                        t = temp.next - 1;
                    }
                    // when symbol does not have a depth, then ignore the depth in rule
                    // else add the symbol depth to current depth
                    if(isExist == true && isNaN(temp.number) == false){
                        var num = parseInt(temp.number) + parseInt(res.number);
                        cur_str += num;
                    }
                }
                replacement = cur_str;
            }
            // if current symbol does not has a replacement rule and has a depth, 
            // we should put the depth in the result string
            else if(isExist){
                replacement += res.number;
            }

            // Add the replacement at the end of the result string
            result = result + replacement;
        }
        string = result;
    }

    return string;
}


// Draw the L-system string using the turtle
function drawLSystem(turtle, string, length, angle, width,
                     lengthRatio, widthRatio, colors) {
    /**
     * TODO: You need to prepare a stack data structure
     *       before drawing the L-system image
     **/

    // the stacks for recording the previous positions and headings
    var pos_stack = [];
    var heading_stack = [];

    for (var i = 0; i < string.length; i++) {

        // The letter or symbol to be handled
        var symbol = string[i];

        /**
         * TODO: You need to extract the associated depth number,
         *       if there is one, next to the current symbol
         **/

        // used to represent current length and current width
        var cur_len = length;
        var cur_width = width;

        // check if there has a depth or not
        // if there has a depth, then compute current length and current depth
        if("ABCDEF".indexOf(symbol) >= 0 || "GHIJKL".indexOf(symbol) >= 0){
            var temp = getNumberFromString(string, i + 1);
            // if the depth exists, then change the length and width
            if(isNaN(temp.number) == false){
                cur_len = length * Math.pow(lengthRatio, temp.number);
                cur_width = width * Math.pow(widthRatio, temp.number);
                i = temp.next - 1;
            }
        }

        // Move and draw forward
        if ("ABCDEF".indexOf(symbol) >= 0) {
            /**
             * TODO: The colour, width and length can all be different
             *       depending on the L-system settings
             **/

            var cur_color = "black"; // default color
            if(colors.hasOwnProperty(symbol))
                cur_color = colors[symbol]; // assigned color

            turtle.color(cur_color);
            turtle.width(cur_width);
            turtle.forward(cur_len);
        }
        // Move forward without drawing
        else if ("GHIJKL".indexOf(symbol) >= 0) {
            /**
             * TODO: The length can be different depending
             *       on the L-system settings
             **/

            turtle.up();
            turtle.forward(cur_len);
            turtle.down();
        }
        // Turn left
        else if (symbol == "+") {
            turtle.left(angle);
        }
        // Turn right
        else if (symbol == "-") {
            turtle.right(angle);
        }

        /**
         * TODO: You need to extend the above if statement
         *       to include the stack symbols [ and ]
         **/
         else if (symbol == "["){
            // push current position and heading into the stack
            pos_stack.push(turtle.pos());
            heading_stack.push(turtle.heading());
         }
         else if (symbol == "]"){
            // pop previous position and heading from the stack and return to that position
            var prev_pos = pos_stack.pop();
            var prev_heading = heading_stack.pop();
            turtle.up();
            turtle.goto(prev_pos[0], prev_pos[1]);
            turtle.setHeading(prev_heading);
            turtle.down();
         }
    }
}
