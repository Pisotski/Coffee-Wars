Advanced Pre-Work Assignment for Code The Dream
by @Pisotski

to start the project open file index.html

git clone https://github.com/Pisotski/Coffee-Wars/
open Coffee-Wars/index.html

<!-- STRUCTURE:
A public GitHub repository containing your project -->
https://github.com/Pisotski/Coffee-Wars/

<!-- An HTML document for the page -->
Coffee-Wars/index.html

<!-- A CSS document to style the HTML page -->
Coffee-Wars/css/main.css

<!-- A JavaScript file that retrieves data from one of several public API sources to display the data on your HTML page -->
Coffee-Wars/js/index.js

<!-- A README file that includes the instructions for running the webpage -->
Coffee-Wars/README.md

<!-- CONTENT:
Display the data for at least 2 of the models in the API -->
<!-- Examples: If you choose the use the Weather API, use temperature and condition (rainy/sunny/etc) models. For the Star Wars API, use characters and film title models. -->
model 1 
https://www.swapi.tech/api/people
model 2
https://www.swapi.tech/api/planets

<!-- Include navigation from each model’s page to the other models that are displayed -->
navigation is made with a dropdown menu using form-select html element

<!-- Example: If you choose to use the Weather API, be able to click between a page that shows temperatures and a page that shows conditions. For the Star Wars API, have a page that shows character information and a page that shows film information. -->
Star Wars API shows selected character information and their planet of origin

<!-- Issue new GET requests for the linked data to display in the linked pages. -->
two GET requests are linked after user is clicking on the character

<!-- FUNCTIONALITY:
Be sure that we can get the code to run without issues by following the instructions in the README file -->

<!-- Be sure navigation between the different models behaves properly and is not slowed down by requesting more data than needs to be displayed -->
requesting only the characters' information followed by a single planet information

<!-- Be sure your code is readable and well structured -->
create functions are designed to create elements, assign ids, use data from api request
handle functions are event listeners
all others are helper functions for better readability and consistency

DOM:
all nodes are related accordingly
all nodes have individual wrappers for ease of styling
all nodes are named in the same format

Example:
<div id="character-planet-wrapper">
    <div id="r2-d2-bio-wrapper">
        <ul id="r2-d2">
            <li id="r2-d2-height"></li>
        </ul>
    </div>
    <div id="naboo-planet-wrapper">
        <ul id="naboo">
            <li id="naboo-diameter"></li>
        </ul>
    <div>
</div>

<!-- If including a user-interactive feature like a search field, be sure that you appropriately handle error cases -->
used standard form-select-option for user-interaction. 

<!-- Be thoughtful about what type of styling is used (example: font-sizes are not too small or large, colors are not too dark/light to be easily seen, etc.) -->
used standard flex-box to ensure responsive design
used standard Star Wars branded colors