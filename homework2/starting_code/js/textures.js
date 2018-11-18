// Convert hexidecimal to floating point RGB
function hexToRGB(hex){
    hex = parseInt(hex.substring(1), 16);
    var r = hex >> 16;
    var g = hex >> 8 & 0xFF;
    var b = hex & 0xFF;
    return [r / 255, g / 255, b / 255];
}

// Refresh the texture of the environment
function refreshTextures() {
    // Cloud parameters
    var cloudColor = hexToRGB($("#cloud-color").val());
    var cloudAmount = parseFloat($("#cloud-amount").val());
    var cloudFrequency = parseFloat($("#cloud-frequency").val());

    // Grass parameters
    var grassColor1 = hexToRGB($("#grass-color-1").val());
    var grassColor2 = hexToRGB($("#grass-color-2").val());
    var grassFrequency = parseFloat($("#grass-frequency").val());

    /**
     * TODO: Add your code here to adjust the cloud texture and grass texture
     **/

    // ****** here is the cloud part ******
    // get the html elements by their ids
    var cloud_perlin = document.getElementById("cloud_perlin");
    var cloud_color_r = document.getElementById("cloud_color_r");
    var cloud_color_g = document.getElementById("cloud_color_g");
    var cloud_color_b = document.getElementById("cloud_color_b");
    var cloud_color_matrix = document.getElementById("cloud_color_matrix");

    // set the attribute values
    cloud_perlin.setAttribute("baseFrequency", cloudFrequency); // cloud frequency
    cloud_color_r.setAttribute("exponent", cloudAmount); // cloud amount
    // cloud_color_g.setAttribute("exponent", cloudAmount);
    // cloud_color_b.setAttribute("exponent", cloudAmount);
    var cloud_matrix = new Array(); // cloud color
    for(var i=0; i<3; i++){
        cloud_matrix[i] = new Array();
        for(var j=0; j<5; j++){
            if(j == 0) cloud_matrix[i][j] = 1 - cloudColor[i]; // the first item of current row
            else if(j == 4) cloud_matrix[i][j] = cloudColor[i]; // the last item of current row 
            else cloud_matrix[i][j] = 0;
        }
    }
    cloud_matrix[3] = [0, 0, 0, 1, 0]; // the last row of the color matrix
    cloud_color_matrix.setAttribute("values", cloud_matrix);

    // ****** here is the grass part ******
    // get the html elements by their ids
    var grass_perlin = document.getElementById("grass_perlin");
    var grass_color_matrix = document.getElementById("grass_color_matrix");

    // set the attribute values
    grass_perlin.setAttribute("baseFrequency", grassFrequency); // grass frequency
    var grass_matrix = new Array(); // grass color
    for(var i=0; i<3; i++){
        grass_matrix[i] = new Array();
        for(var j=0; j<5; j++){
            if(j == 0) grass_matrix[i][j] = grassColor1[i] - grassColor2[i]; // the first item of current row
            else if(j == 4) grass_matrix[i][j] = grassColor2[i]; // the last item of current row
            else grass_matrix[i][j] = 0;
        }
    }
    grass_matrix[3] = [0, 0, 0, 0, 1]; // the last row of the color matrix
    grass_color_matrix.setAttribute("values", grass_matrix);
}
